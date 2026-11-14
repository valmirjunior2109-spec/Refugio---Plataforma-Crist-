-- ════════════════════════════════════════════════════════════
-- Refúgio · Testes de Row Level Security (pgTAP)
-- Executar com:  supabase test db
-- Cada teste simula um papel (anon/authenticated) e um usuário (JWT "sub").
-- ════════════════════════════════════════════════════════════
begin;
create extension if not exists pgtap with schema extensions;

select plan(27);

-- ── Usuários de teste ────────────────────────────────────────
insert into auth.users (id, email, raw_user_meta_data) values
  ('11111111-1111-1111-1111-111111111111', 'ana@teste.local', '{"display_name":"Ana"}'),
  ('22222222-2222-2222-2222-222222222222', 'bruno@teste.local', '{"display_name":"Bruno"}'),
  ('33333333-3333-3333-3333-333333333333', 'equipe@teste.local', '{"display_name":"Equipe"}');

update public.profiles set role = 'admin' where id = '33333333-3333-3333-3333-333333333333';

select is((select count(*)::int from public.profiles where id in (
  '11111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222')), 2,
  'perfis são criados automaticamente pelo gatilho');

-- Conteúdo institucional (publicado, rascunho e agendado)
insert into public.daily_devotionals (slug, title, book, chapter, verse_start, reflection, application, prayer, publish_date, status) values
  ('publicada', 'Publicada', 'salmos', 23, 1, repeat('r', 30), 'aplicar', 'orar', public.app_today(), 'published'),
  ('rascunho', 'Rascunho', 'salmos', 23, 1, repeat('r', 30), 'aplicar', 'orar', public.app_today(), 'draft'),
  ('agendada', 'Agendada', 'salmos', 23, 1, repeat('r', 30), 'aplicar', 'orar', public.app_today() + 3, 'published');

-- Helper para trocar de usuário
create or replace function pg_temp.login(uid uuid) returns void language sql as $$
  select set_config('request.jwt.claims', json_build_object('sub', uid, 'role', 'authenticated')::text, true);
$$;

-- ── Visitante (anon) ─────────────────────────────────────────
set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);

select is((select count(*)::int from public.daily_devotionals), 1,
  'visitante vê apenas a palavra publicada até hoje (sem rascunho nem agendada)');
select is((select count(*)::int from public.prayer_entries), 0, 'visitante não vê diários');
select throws_ok(
  $$ insert into public.daily_devotionals (slug, title, book, chapter, verse_start, reflection, application, prayer, publish_date)
     values ('x', 'Teste', 'salmos', 1, 1, repeat('r', 30), 'a a a', 'b b b', current_date) $$,
  '42501', null, 'visitante não cria conteúdo institucional');
select throws_ok($$ insert into public.feedbacks (kind, message) values ('ideia', 'mensagem direta') $$,
  '42501', null, 'feedback não pode ser inserido diretamente, só pela função');
select lives_ok($$ select public.submit_feedback('ideia', 'Mensagem enviada sem conta.', 5, null, '/teste', null) $$,
  'visitante envia feedback pela função');
select is((select count(*)::int from public.feedbacks), 0, 'visitante não lê feedbacks');
select throws_ok($$ select public.delete_my_account() $$, '42501', null, 'visitante não pode chamar exclusão de conta');

-- ── Ana (usuária comum) ──────────────────────────────────────
set local role authenticated;
select pg_temp.login('11111111-1111-1111-1111-111111111111');

select lives_ok($$ insert into public.prayer_entries (title, content, category) values ('Oração da Ana', 'Texto privado', 'fe') $$,
  'Ana cria um registro no diário');
select lives_ok($$ insert into public.saved_verses (book, chapter, verse_start, text_snapshot) values ('salmos', 23, 1, 'texto') $$,
  'Ana salva um versículo');
select throws_ok(
  $$ insert into public.prayer_entries (user_id, title, content) values ('22222222-2222-2222-2222-222222222222', 'Falso', 'x') $$,
  '42501', null, 'Ana não cria registro em nome de outra pessoa');
select throws_ok($$ update public.profiles set role = 'admin' where id = '11111111-1111-1111-1111-111111111111' $$,
  '42501', null, 'Ana não consegue se promover a administradora');
select is((select count(*)::int from public.daily_devotionals), 1, 'Ana também não vê rascunhos nem agendadas');
select is((select count(*)::int from public.feedbacks), 0, 'Ana não lê feedbacks');
select lives_ok($$ insert into public.churches (slug, name) values ('igreja-teste', 'Igreja Teste') $$,
  'Ana solicita o cadastro de uma igreja (pendente)');
update public.churches set status = 'verified' where slug = 'igreja-teste';
select is((select status from public.churches where slug = 'igreja-teste'), 'pending',
  'Ana não verifica a própria igreja (continua pendente)');
select throws_ok(
  $$ insert into public.prayer_requests (title, content, visibility) values ('Pedido', 'Conteúdo do pedido', 'public') $$,
  '23514', null, 'pedido público sem consentimento explícito é rejeitado');
select lives_ok(
  $$ insert into public.prayer_requests (title, content, visibility, consent_at, moderation_status)
     values ('Pedido', 'Conteúdo do pedido', 'public', now(), 'approved') $$,
  'pedido com consentimento é aceito');
select is((select moderation_status from public.prayer_requests limit 1), 'pending',
  'autor não aprova o próprio pedido: entra como pendente');

-- ── Bruno (outro usuário) ────────────────────────────────────
select pg_temp.login('22222222-2222-2222-2222-222222222222');

select is((select count(*)::int from public.prayer_entries), 0, 'Bruno não vê o diário da Ana');
select is((select count(*)::int from public.saved_verses), 0, 'Bruno não vê versículos salvos da Ana');
update public.prayer_entries set title = 'invadido';
delete from public.prayer_entries;
select is((select count(*)::int from public.profiles), 1, 'Bruno vê somente o próprio perfil');
select is((select count(*)::int from public.prayer_requests), 0, 'Bruno não vê pedido ainda não moderado');

-- ── Equipe (admin) ───────────────────────────────────────────
select pg_temp.login('33333333-3333-3333-3333-333333333333');

select is((select count(*)::int from public.daily_devotionals), 3, 'equipe vê rascunhos e agendadas');
select is((select count(*)::int from public.feedbacks), 1, 'equipe lê feedbacks');
select is((select count(*)::int from public.prayer_entries), 0, 'nem a administração lê diários de oração');

-- ── Conferência como superusuário ────────────────────────────
reset role;
select is((select title from public.prayer_entries limit 1), 'Oração da Ana', 'tentativa do Bruno não alterou o registro da Ana');

select * from finish();
rollback;
