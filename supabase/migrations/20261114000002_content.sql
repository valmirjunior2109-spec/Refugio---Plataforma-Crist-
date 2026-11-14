-- ════════════════════════════════════════════════════════════
-- Refúgio · 0002 · Conteúdo institucional (público quando publicado)
-- O texto bíblico NÃO é armazenado: guardamos apenas referências
-- verificáveis (livro, capítulo, versículos) e o app lê o texto da
-- tradução licenciada (Bíblia Livre, CC BY 4.0).
-- ════════════════════════════════════════════════════════════

do $$ begin
  create type public.publish_status as enum ('draft', 'published');
exception when duplicate_object then null; end $$;

-- Validação básica de referência: slug do livro e números positivos.
create or replace function public.is_valid_ref(book text, chapter int, verse_start int, verse_end int)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select book ~ '^[0-9a-z-]{2,30}$'
     and chapter between 1 and 150
     and (verse_start is null or verse_start between 1 and 176)
     and (verse_end is null or (verse_start is not null and verse_end between verse_start and 176))
$$;

-- ── bible_verses: versículos de referência curados pela equipe ──
create table if not exists public.bible_verses (
  id uuid primary key default gen_random_uuid(),
  book text not null,
  chapter int not null,
  verse_start int not null,
  verse_end int,
  theme text check (theme is null or char_length(theme) <= 60),
  is_featured boolean not null default false,
  status public.publish_status not null default 'draft',
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bible_verses_ref check (public.is_valid_ref(book, chapter, verse_start, verse_end))
);

-- ── daily_devotionals: Palavra do dia ─────────────────────────
create table if not exists public.daily_devotionals (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80),
  title text not null check (char_length(title) between 3 and 120),
  book text not null,
  chapter int not null,
  verse_start int not null,
  verse_end int,
  reflection text not null check (char_length(reflection) between 20 and 6000),
  application text not null check (char_length(application) between 5 and 2000),
  prayer text not null check (char_length(prayer) between 5 and 2000),
  publish_date date not null,
  status public.publish_status not null default 'draft',
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint daily_devotionals_ref check (public.is_valid_ref(book, chapter, verse_start, verse_end))
);
create index if not exists daily_devotionals_publish_idx on public.daily_devotionals (status, publish_date desc);

-- ── reflections: "Preciso de uma palavra" (kind = need) e reflexões gerais ──
create table if not exists public.reflections (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'need' check (kind in ('need', 'reflection')),
  topic text not null check (topic ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  label text not null check (char_length(label) between 2 and 60),
  title text not null check (char_length(title) between 3 and 120),
  book text not null,
  chapter int not null,
  verse_start int,
  verse_end int,
  context text not null default '' check (char_length(context) <= 3000),
  body text not null check (char_length(body) between 20 and 6000),
  hope text not null default '' check (char_length(hope) <= 2000),
  prayer text not null default '' check (char_length(prayer) <= 2000),
  further_readings jsonb not null default '[]'::jsonb check (jsonb_typeof(further_readings) = 'array'),
  sort_order int not null default 0,
  status public.publish_status not null default 'draft',
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reflections_ref check (public.is_valid_ref(book, chapter, verse_start, verse_end)),
  constraint reflections_kind_topic unique (kind, topic)
);

-- ── reading_plans e reading_plan_days ─────────────────────────
create table if not exists public.reading_plans (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80),
  title text not null check (char_length(title) between 3 and 120),
  description text not null check (char_length(description) between 10 and 1000),
  goal text not null check (char_length(goal) between 5 and 500),
  cover_tone text not null default 'sage' check (cover_tone in ('sage', 'sand', 'deep', 'ivory')),
  cover_motif text not null default 'arch' check (cover_motif in ('arch', 'sun', 'waves', 'leaf', 'path', 'stars')),
  cover_image_path text, -- opcional: imagem no Supabase Storage (bucket "plan-covers")
  sort_order int not null default 0,
  status public.publish_status not null default 'draft',
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reading_plan_days (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.reading_plans (id) on delete cascade,
  day_number int not null check (day_number between 1 and 400),
  title text not null check (char_length(title) between 1 and 120),
  readings jsonb not null check (jsonb_typeof(readings) = 'array' and jsonb_array_length(readings) between 1 and 10),
  note text check (note is null or char_length(note) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (plan_id, day_number)
);
create index if not exists reading_plan_days_plan_idx on public.reading_plan_days (plan_id, day_number);

-- View com a duração calculada. security_invoker = true: respeita o RLS de quem consulta.
create or replace view public.reading_plans_with_duration
with (security_invoker = true) as
  select p.*, (select count(*) from public.reading_plan_days d where d.plan_id = p.id)::int as duration_days
  from public.reading_plans p;

-- Gatilhos de updated_at
create trigger bible_verses_updated_at before update on public.bible_verses
  for each row execute function public.set_updated_at();
create trigger daily_devotionals_updated_at before update on public.daily_devotionals
  for each row execute function public.set_updated_at();
create trigger reflections_updated_at before update on public.reflections
  for each row execute function public.set_updated_at();
create trigger reading_plans_updated_at before update on public.reading_plans
  for each row execute function public.set_updated_at();
create trigger reading_plan_days_updated_at before update on public.reading_plan_days
  for each row execute function public.set_updated_at();

-- ── RLS: leitura pública do que está publicado; escrita só pela equipe ──
alter table public.bible_verses enable row level security;
alter table public.daily_devotionals enable row level security;
alter table public.reflections enable row level security;
alter table public.reading_plans enable row level security;
alter table public.reading_plan_days enable row level security;

create policy "bible_verses: leitura pública"
  on public.bible_verses for select to anon, authenticated
  using (status = 'published' or public.is_staff());
create policy "bible_verses: equipe gerencia"
  on public.bible_verses for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

-- Conteúdo agendado (data futura) não vaza antes do dia.
create policy "daily_devotionals: leitura pública"
  on public.daily_devotionals for select to anon, authenticated
  using ((status = 'published' and publish_date <= public.app_today()) or public.is_staff());
create policy "daily_devotionals: equipe gerencia"
  on public.daily_devotionals for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

create policy "reflections: leitura pública"
  on public.reflections for select to anon, authenticated
  using (status = 'published' or public.is_staff());
create policy "reflections: equipe gerencia"
  on public.reflections for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

create policy "reading_plans: leitura pública"
  on public.reading_plans for select to anon, authenticated
  using (status = 'published' or public.is_staff());
create policy "reading_plans: equipe gerencia"
  on public.reading_plans for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

create policy "reading_plan_days: leitura pública"
  on public.reading_plan_days for select to anon, authenticated
  using (
    exists (
      select 1 from public.reading_plans p
      where p.id = plan_id and (p.status = 'published' or public.is_staff())
    )
  );
create policy "reading_plan_days: equipe gerencia"
  on public.reading_plan_days for all to authenticated
  using (public.is_staff()) with check (public.is_staff());
