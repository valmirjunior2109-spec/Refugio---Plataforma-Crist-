-- ════════════════════════════════════════════════════════════
-- Refúgio · 0003 · Dados pessoais (privados por padrão)
-- Regra geral: cada linha pertence a um usuário e SÓ ele a acessa.
-- Não há política para administradores nestas tabelas: o diário de
-- oração e o progresso pessoal não são visíveis à equipe pelo app.
-- ════════════════════════════════════════════════════════════

-- ── prayer_entries: diário de oração ──────────────────────────
create table if not exists public.prayer_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  content text not null check (char_length(content) between 1 and 10000),
  category text not null default 'outros'
    check (category in ('agradecimento', 'pedido', 'reflexao', 'familia', 'vida-pessoal', 'fe', 'outros')),
  tags text[] not null default '{}' check (cardinality(tags) <= 8),
  entry_date date not null default public.app_today(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists prayer_entries_user_date_idx on public.prayer_entries (user_id, entry_date desc);

-- ── Planos: inscrição e progresso individuais (sem rankings) ──
create table if not exists public.reading_plan_enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  plan_id uuid not null references public.reading_plans (id) on delete cascade,
  started_at timestamptz not null default now(),
  unique (user_id, plan_id)
);

create table if not exists public.reading_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  plan_id uuid not null references public.reading_plans (id) on delete cascade,
  plan_day_id uuid not null references public.reading_plan_days (id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (user_id, plan_day_id)
);
create index if not exists reading_progress_user_plan_idx on public.reading_progress (user_id, plan_id);

-- ── Versículos salvos ──────────────────────────────────────────
create table if not exists public.saved_verses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  book text not null,
  chapter int not null,
  verse_start int not null,
  verse_end int,
  text_snapshot text not null check (char_length(text_snapshot) <= 4000),
  translation text not null default 'BLIVRE',
  note text check (note is null or char_length(note) <= 1000),
  created_at timestamptz not null default now(),
  constraint saved_verses_ref check (public.is_valid_ref(book, chapter, verse_start, verse_end))
);
create unique index if not exists saved_verses_unique
  on public.saved_verses (user_id, book, chapter, verse_start, coalesce(verse_end, verse_start));

-- ── Reflexões favoritas (Palavra do dia ou "Preciso de uma palavra") ──
create table if not exists public.favorite_reflections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  devotional_id uuid references public.daily_devotionals (id) on delete cascade,
  reflection_id uuid references public.reflections (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint favorite_one_target check (num_nonnulls(devotional_id, reflection_id) = 1)
);
create unique index if not exists favorite_devotional_unique
  on public.favorite_reflections (user_id, devotional_id) where devotional_id is not null;
create unique index if not exists favorite_reflection_unique
  on public.favorite_reflections (user_id, reflection_id) where reflection_id is not null;

-- ── Objetivos espirituais pessoais ─────────────────────────────
create table if not exists public.spiritual_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null check (char_length(title) between 2 and 120),
  description text check (description is null or char_length(description) <= 1000),
  is_done boolean not null default false,
  done_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Notificações (criadas pelo sistema; o usuário lê e marca como lidas) ──
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('system', 'plan', 'community', 'moderation')),
  title text not null check (char_length(title) <= 120),
  body text check (body is null or char_length(body) <= 1000),
  link text check (link is null or link ~ '^/[a-z0-9/_?=&#%-]*$'),
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_idx on public.notifications (user_id, created_at desc);

create trigger prayer_entries_updated_at before update on public.prayer_entries
  for each row execute function public.set_updated_at();
create trigger spiritual_goals_updated_at before update on public.spiritual_goals
  for each row execute function public.set_updated_at();

-- ── RLS ──────────────────────────────────────────────────────
alter table public.prayer_entries enable row level security;
alter table public.reading_plan_enrollments enable row level security;
alter table public.reading_progress enable row level security;
alter table public.saved_verses enable row level security;
alter table public.favorite_reflections enable row level security;
alter table public.spiritual_goals enable row level security;
alter table public.notifications enable row level security;

-- Política única "somente o dono" para cada tabela pessoal.
create policy "prayer_entries: somente o dono"
  on public.prayer_entries for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy "reading_plan_enrollments: somente o dono"
  on public.reading_plan_enrollments for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy "reading_progress: somente o dono"
  on public.reading_progress for all to authenticated
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    -- o dia precisa pertencer ao plano informado
    and exists (select 1 from public.reading_plan_days d where d.id = plan_day_id and d.plan_id = reading_progress.plan_id)
  );

create policy "saved_verses: somente o dono"
  on public.saved_verses for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy "favorite_reflections: somente o dono"
  on public.favorite_reflections for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy "spiritual_goals: somente o dono"
  on public.spiritual_goals for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy "notifications: o dono lê"
  on public.notifications for select to authenticated
  using (user_id = (select auth.uid()));
create policy "notifications: o dono marca como lida"
  on public.notifications for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "notifications: o dono apaga"
  on public.notifications for delete to authenticated
  using (user_id = (select auth.uid()));
-- INSERT em notifications: somente via funções do servidor (sem política para usuários).
