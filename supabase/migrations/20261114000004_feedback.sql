-- ════════════════════════════════════════════════════════════
-- Refúgio · 0004 · "Ajude o Refúgio a crescer" (feedback)
-- Envio permitido sem conta, sempre pela função submit_feedback,
-- que valida e limita a frequência. Nada é publicado.
-- ════════════════════════════════════════════════════════════

create table if not exists public.feedbacks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  kind text not null check (kind in ('sugestao', 'critica', 'problema', 'ideia', 'avaliacao')),
  message text not null check (char_length(message) between 10 and 3000),
  rating int check (rating is null or rating between 1 and 5),
  contact_email text check (contact_email is null or (char_length(contact_email) <= 254 and contact_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')),
  page text check (page is null or char_length(page) <= 200),
  -- Hash não reversível (SHA-256 com segredo do servidor) usado só para limitar envios.
  client_hash text check (client_hash is null or client_hash ~ '^[a-f0-9]{64}$'),
  status text not null default 'novo' check (status in ('novo', 'lido', 'em-andamento', 'resolvido', 'arquivado')),
  admin_note text check (admin_note is null or char_length(admin_note) <= 2000),
  created_at timestamptz not null default now()
);
create index if not exists feedbacks_created_idx on public.feedbacks (created_at desc);
create index if not exists feedbacks_client_idx on public.feedbacks (client_hash, created_at desc);

alter table public.feedbacks enable row level security;

-- Sem política de INSERT: o envio passa obrigatoriamente pela função abaixo.
create policy "feedbacks: equipe lê"
  on public.feedbacks for select to authenticated
  using (public.is_staff());
create policy "feedbacks: equipe atualiza status"
  on public.feedbacks for update to authenticated
  using (public.is_staff()) with check (public.is_staff());
create policy "feedbacks: admin remove"
  on public.feedbacks for delete to authenticated
  using (public.is_admin());

create or replace function public.submit_feedback(
  p_kind text,
  p_message text,
  p_rating int default null,
  p_contact_email text default null,
  p_page text default null,
  p_client_hash text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := (select auth.uid());
  new_id uuid;
begin
  -- Limites: por pessoa/dispositivo e global (protege contra abuso automatizado).
  if p_client_hash is not null and (
    select count(*) from public.feedbacks
    where client_hash = p_client_hash and created_at > now() - interval '10 minutes'
  ) >= 3 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;

  if uid is not null and (
    select count(*) from public.feedbacks
    where user_id = uid and created_at > now() - interval '10 minutes'
  ) >= 3 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;

  if (select count(*) from public.feedbacks where created_at > now() - interval '1 minute') >= 30 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;

  insert into public.feedbacks (user_id, kind, message, rating, contact_email, page, client_hash)
  values (
    uid,
    p_kind,
    trim(p_message),
    p_rating,
    nullif(trim(coalesce(p_contact_email, '')), ''),
    nullif(left(coalesce(p_page, ''), 200), ''),
    p_client_hash
  )
  returning id into new_id;

  return new_id;
end $$;

revoke all on function public.submit_feedback(text, text, int, text, text, text) from public;
grant execute on function public.submit_feedback(text, text, int, text, text, text) to anon, authenticated;
