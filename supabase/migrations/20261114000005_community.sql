-- ════════════════════════════════════════════════════════════
-- Refúgio · 0005 · Comunidade e igrejas (arquitetura preparada)
-- Ainda sem interface pública. Princípios já garantidos no banco:
--  • Igrejas só aparecem depois de verificadas pela equipe.
--  • Pedidos de oração e testemunhos compartilhados exigem
--    consentimento explícito e passam por moderação.
--  • Denúncia e bloqueio entre usuários.
-- ════════════════════════════════════════════════════════════

-- ── churches ──────────────────────────────────────────────────
create table if not exists public.churches (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80),
  name text not null check (char_length(name) between 3 and 120),
  description text check (description is null or char_length(description) <= 2000),
  denomination text check (denomination is null or char_length(denomination) <= 80),
  -- Localização aproximada: apenas cidade/UF, nunca endereço residencial de pessoas.
  city text check (city is null or char_length(city) <= 80),
  state text check (state is null or state ~ '^[A-Z]{2}$'),
  public_email text check (public_email is null or char_length(public_email) <= 254),
  public_phone text check (public_phone is null or char_length(public_phone) <= 30),
  website text check (website is null or website ~* '^https://'),
  status text not null default 'pending' check (status in ('pending', 'verified', 'suspended')),
  verified_at timestamptz,
  verified_by uuid references auth.users (id) on delete set null,
  created_by uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.church_members (
  church_id uuid not null references public.churches (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'member' check (role in ('member', 'leader', 'admin')),
  status text not null default 'pending' check (status in ('pending', 'active', 'removed')),
  created_at timestamptz not null default now(),
  primary key (church_id, user_id)
);

create or replace function public.is_church_admin(p_church uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.church_members m
    join public.churches c on c.id = m.church_id
    where m.church_id = p_church and m.user_id = (select auth.uid())
      and m.role = 'admin' and m.status = 'active' and c.status = 'verified'
  )
$$;

create or replace function public.is_church_member(p_church uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.church_members m
    where m.church_id = p_church and m.user_id = (select auth.uid()) and m.status = 'active'
  )
$$;

-- Somente a equipe altera status de verificação de uma igreja.
create or replace function public.protect_church_verification()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (new.status, new.verified_at, new.verified_by) is distinct from (old.status, old.verified_at, old.verified_by)
     and not public.is_admin() then
    raise exception 'Somente a equipe do Refúgio verifica igrejas.' using errcode = '42501';
  end if;
  return new;
end $$;

create trigger churches_protect_verification before update on public.churches
  for each row execute function public.protect_church_verification();
create trigger churches_updated_at before update on public.churches
  for each row execute function public.set_updated_at();

alter table public.churches enable row level security;
alter table public.church_members enable row level security;

create policy "churches: verificadas são públicas"
  on public.churches for select to anon, authenticated
  using (status = 'verified' or created_by = (select auth.uid()) or public.is_admin());
create policy "churches: solicitar cadastro (pendente)"
  on public.churches for insert to authenticated
  with check (created_by = (select auth.uid()) and status = 'pending' and verified_at is null and verified_by is null);
create policy "churches: responsáveis editam"
  on public.churches for update to authenticated
  using (public.is_church_admin(id) or public.is_admin())
  with check (public.is_church_admin(id) or public.is_admin());
create policy "churches: admin remove"
  on public.churches for delete to authenticated
  using (public.is_admin());

create policy "church_members: ver a própria participação e a da igreja que administra"
  on public.church_members for select to authenticated
  using (user_id = (select auth.uid()) or public.is_church_admin(church_id) or public.is_admin());
create policy "church_members: pedir para participar"
  on public.church_members for insert to authenticated
  with check (user_id = (select auth.uid()) and role = 'member' and status = 'pending');
create policy "church_members: responsáveis gerenciam"
  on public.church_members for update to authenticated
  using (public.is_church_admin(church_id) or public.is_admin())
  with check (public.is_church_admin(church_id) or public.is_admin());
create policy "church_members: sair ou remover"
  on public.church_members for delete to authenticated
  using (user_id = (select auth.uid()) or public.is_church_admin(church_id) or public.is_admin());

-- ── Bloqueios entre usuários ─────────────────────────────────
create table if not exists public.user_blocks (
  blocker_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  blocked_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);
alter table public.user_blocks enable row level security;
create policy "user_blocks: somente o dono"
  on public.user_blocks for all to authenticated
  using (blocker_id = (select auth.uid())) with check (blocker_id = (select auth.uid()));

create or replace function public.is_blocked_by_me(p_author uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.user_blocks where blocker_id = (select auth.uid()) and blocked_id = p_author)
$$;

-- ── Pedidos de oração compartilhados e testemunhos ───────────
-- Distintos do diário (prayer_entries), que nunca é compartilhado.
create table if not exists public.prayer_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  church_id uuid references public.churches (id) on delete cascade,
  title text not null check (char_length(title) between 3 and 120),
  content text not null check (char_length(content) between 10 and 2000),
  visibility text not null default 'private' check (visibility in ('private', 'church', 'public')),
  is_anonymous boolean not null default true,
  consent_at timestamptz, -- consentimento explícito para compartilhar
  moderation_status text not null default 'pending' check (moderation_status in ('pending', 'approved', 'hidden', 'removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint prayer_requests_consent check (visibility = 'private' or consent_at is not null),
  constraint prayer_requests_church check (visibility <> 'church' or church_id is not null)
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  church_id uuid references public.churches (id) on delete cascade,
  title text not null check (char_length(title) between 3 and 120),
  content text not null check (char_length(content) between 20 and 5000),
  visibility text not null default 'public' check (visibility in ('church', 'public')),
  is_anonymous boolean not null default false,
  consent_at timestamptz not null, -- testemunho sempre é compartilhado: consentimento obrigatório
  moderation_status text not null default 'pending' check (moderation_status in ('pending', 'approved', 'hidden', 'removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint testimonials_church check (visibility <> 'church' or church_id is not null)
);

-- Autores não aprovam o próprio conteúdo: moderação é da equipe ou dos responsáveis da igreja.
create or replace function public.protect_moderation_status()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    if not public.is_admin() then new.moderation_status := 'pending'; end if;
  elsif new.moderation_status is distinct from old.moderation_status
     and not (public.is_admin() or (new.church_id is not null and public.is_church_admin(new.church_id))) then
    raise exception 'Somente moderadores alteram o status de moderação.' using errcode = '42501';
  elsif new.user_id = (select auth.uid())
     and (new.title, new.content) is distinct from (old.title, old.content) then
    -- Edição pelo autor volta para a fila de moderação.
    new.moderation_status := 'pending';
  end if;
  return new;
end $$;

create trigger prayer_requests_moderation before insert or update on public.prayer_requests
  for each row execute function public.protect_moderation_status();
create trigger testimonials_moderation before insert or update on public.testimonials
  for each row execute function public.protect_moderation_status();
create trigger prayer_requests_updated_at before update on public.prayer_requests
  for each row execute function public.set_updated_at();
create trigger testimonials_updated_at before update on public.testimonials
  for each row execute function public.set_updated_at();

alter table public.prayer_requests enable row level security;
alter table public.testimonials enable row level security;

create policy "prayer_requests: leitura conforme visibilidade"
  on public.prayer_requests for select to authenticated
  using (
    user_id = (select auth.uid())
    or public.is_admin()
    or (church_id is not null and public.is_church_admin(church_id))
    or (
      moderation_status = 'approved'
      and not public.is_blocked_by_me(user_id)
      and (
        visibility = 'public'
        or (visibility = 'church' and public.is_church_member(church_id))
      )
    )
  );
create policy "prayer_requests: autor cria"
  on public.prayer_requests for insert to authenticated
  with check (user_id = (select auth.uid()) and (church_id is null or public.is_church_member(church_id)));
create policy "prayer_requests: autor ou moderador edita"
  on public.prayer_requests for update to authenticated
  using (user_id = (select auth.uid()) or public.is_admin() or (church_id is not null and public.is_church_admin(church_id)))
  with check (user_id = (select auth.uid()) or public.is_admin() or (church_id is not null and public.is_church_admin(church_id)));
create policy "prayer_requests: autor ou admin remove"
  on public.prayer_requests for delete to authenticated
  using (user_id = (select auth.uid()) or public.is_admin());

create policy "testimonials: leitura conforme visibilidade"
  on public.testimonials for select to anon, authenticated
  using (
    user_id = (select auth.uid())
    or public.is_admin()
    or (church_id is not null and public.is_church_admin(church_id))
    or (
      moderation_status = 'approved'
      and not public.is_blocked_by_me(user_id)
      and (visibility = 'public' or (visibility = 'church' and public.is_church_member(church_id)))
    )
  );
create policy "testimonials: autor cria"
  on public.testimonials for insert to authenticated
  with check (user_id = (select auth.uid()) and (church_id is null or public.is_church_member(church_id)));
create policy "testimonials: autor ou moderador edita"
  on public.testimonials for update to authenticated
  using (user_id = (select auth.uid()) or public.is_admin() or (church_id is not null and public.is_church_admin(church_id)))
  with check (user_id = (select auth.uid()) or public.is_admin() or (church_id is not null and public.is_church_admin(church_id)));
create policy "testimonials: autor ou admin remove"
  on public.testimonials for delete to authenticated
  using (user_id = (select auth.uid()) or public.is_admin());

-- ── Denúncias ────────────────────────────────────────────────
create table if not exists public.content_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  target_type text not null check (target_type in ('prayer_request', 'testimonial', 'church', 'user')),
  target_id uuid not null,
  reason text not null check (reason in ('assedio', 'odio', 'spam', 'falsa-identidade', 'conteudo-improprio', 'risco', 'outro')),
  details text check (details is null or char_length(details) <= 2000),
  status text not null default 'aberta' check (status in ('aberta', 'em-analise', 'resolvida', 'descartada')),
  resolved_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (reporter_id, target_type, target_id)
);
alter table public.content_reports enable row level security;
create policy "content_reports: quem denunciou vê"
  on public.content_reports for select to authenticated
  using (reporter_id = (select auth.uid()) or public.is_admin());
create policy "content_reports: denunciar"
  on public.content_reports for insert to authenticated
  with check (reporter_id = (select auth.uid()) and status = 'aberta' and resolved_by is null);
create policy "content_reports: equipe trata"
  on public.content_reports for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
