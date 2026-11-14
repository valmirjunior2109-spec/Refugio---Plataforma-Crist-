-- ════════════════════════════════════════════════════════════
-- Refúgio · 0001 · Núcleo: perfis, papéis e funções auxiliares
-- ════════════════════════════════════════════════════════════

create extension if not exists pgcrypto;

-- Papéis da plataforma. "editor" publica conteúdo; "admin" também gerencia papéis e moderação.
do $$ begin
  create type public.app_role as enum ('user', 'editor', 'admin');
exception when duplicate_object then null; end $$;

-- Data de "hoje" no fuso do Refúgio (Palavra do dia e publicações).
create or replace function public.app_today()
returns date
language sql
stable
set search_path = ''
as $$ select (now() at time zone 'America/Sao_Paulo')::date $$;

-- Atualiza updated_at automaticamente.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ── profiles ────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (display_name is null or char_length(display_name) between 1 and 60),
  role public.app_role not null default 'user',
  accepted_terms_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Perfil público mínimo de cada conta. Sem dados sensíveis.';

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Funções de autorização: SECURITY DEFINER para não depender do RLS de profiles
-- (evita recursão) e search_path vazio para impedir sequestro de funções.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  )
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role in ('admin', 'editor')
  )
$$;

revoke all on function public.is_admin() from public;
revoke all on function public.is_staff() from public;
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.is_staff() to anon, authenticated;

-- Cria o perfil quando uma conta é criada no Supabase Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, accepted_terms_at)
  values (
    new.id,
    nullif(left(trim(coalesce(new.raw_user_meta_data ->> 'display_name', '')), 60), ''),
    case when (new.raw_user_meta_data ->> 'accepted_terms') = 'true' then now() end
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Impede que um usuário eleve o próprio papel. Só administradores mudam papéis.
-- (Em sessões sem usuário, como o SQL Editor do Supabase, a troca é permitida
--  para que o primeiro administrador possa ser definido.)
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role is distinct from old.role
     and (select auth.uid()) is not null
     and not public.is_admin() then
    raise exception 'Somente administradores podem alterar papéis.' using errcode = '42501';
  end if;
  return new;
end $$;

create trigger profiles_protect_role
  before update on public.profiles
  for each row execute function public.protect_profile_role();

alter table public.profiles enable row level security;

create policy "profiles: ler o próprio perfil"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()) or public.is_admin());

create policy "profiles: editar o próprio perfil"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()) or public.is_admin())
  with check (id = (select auth.uid()) or public.is_admin());

-- Sem política de INSERT/DELETE: o perfil nasce pelo gatilho e morre com a conta.

-- ── Exclusão de conta (LGPD) ─────────────────────────────────
-- Remove a conta do próprio usuário. Todas as tabelas pessoais usam
-- ON DELETE CASCADE, portanto todos os dados pessoais são apagados juntos.
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := (select auth.uid());
begin
  if uid is null then
    raise exception 'É preciso estar autenticado.' using errcode = '42501';
  end if;
  delete from auth.users where id = uid;
end $$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
