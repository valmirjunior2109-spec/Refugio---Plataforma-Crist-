/**
 * Gera supabase/seed.sql a partir do conteúdo em src/content.
 * Assim, o banco e o modo demonstração usam exatamente o mesmo conteúdo.
 *
 * Uso: npm run seed:build
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { DEVOTIONAL_SEEDS } from "../src/content/devotionals";
import { NEED_SEEDS } from "../src/content/needs";
import { PLAN_SEEDS } from "../src/content/reading-plans";
import { isValidReference, type BibleReference } from "../src/lib/bible/reference";

const q = (s: string) => `'${s.replace(/'/g, "''")}'`;
const n = (v: number | null | undefined) => (v == null ? "null" : String(v));
const json = (v: unknown) => `${q(JSON.stringify(v))}::jsonb`;

function check(ref: BibleReference, where: string) {
  if (!isValidReference(ref)) throw new Error(`Referência inválida em ${where}: ${JSON.stringify(ref)}`);
}

const out: string[] = [
  "-- ════════════════════════════════════════════════════════════",
  "-- Refúgio · seed.sql · GERADO por scripts/build-seed.ts",
  "-- Não edite à mão: altere src/content e rode `npm run seed:build`.",
  "-- Idempotente: pode ser executado mais de uma vez.",
  "-- ════════════════════════════════════════════════════════════",
  "",
  "begin;",
  "",
  "-- Palavras do dia: a 1ª é publicada hoje, as demais nos dias anteriores.",
];

DEVOTIONAL_SEEDS.forEach((d, i) => {
  check(d.reference, d.slug);
  out.push(
    `insert into public.daily_devotionals (slug, title, book, chapter, verse_start, verse_end, reflection, application, prayer, publish_date, status)
values (${q(d.slug)}, ${q(d.title)}, ${q(d.reference.book)}, ${d.reference.chapter}, ${n(d.reference.verseStart)}, ${n(d.reference.verseEnd)}, ${q(d.reflection)}, ${q(d.application)}, ${q(d.prayer)}, public.app_today() - ${i}, 'published')
on conflict (slug) do nothing;`,
  );
});

out.push("", "-- Preciso de uma palavra");
NEED_SEEDS.forEach((s, i) => {
  check(s.reference, s.topic);
  s.furtherReadings.forEach((r) => check(r, `${s.topic} (leituras)`));
  out.push(
    `insert into public.reflections (kind, topic, label, title, book, chapter, verse_start, verse_end, context, body, hope, prayer, further_readings, sort_order, status)
values ('need', ${q(s.topic)}, ${q(s.label)}, ${q(s.title)}, ${q(s.reference.book)}, ${s.reference.chapter}, ${n(s.reference.verseStart)}, ${n(s.reference.verseEnd)}, ${q(s.context)}, ${q(s.reflection)}, ${q(s.hope)}, ${q(s.prayer)}, ${json(s.furtherReadings)}, ${i}, 'published')
on conflict (kind, topic) do nothing;`,
  );
});

out.push("", "-- Planos de leitura");
PLAN_SEEDS.forEach((p, i) => {
  out.push(
    `insert into public.reading_plans (slug, title, description, goal, cover_tone, cover_motif, sort_order, status)
values (${q(p.slug)}, ${q(p.title)}, ${q(p.description)}, ${q(p.goal)}, ${q(p.cover.tone)}, ${q(p.cover.motif)}, ${i}, 'published')
on conflict (slug) do nothing;`,
  );
  const rows = p.days.map((d, idx) => {
    d.readings.forEach((r) => check(r, `${p.slug} dia ${idx + 1}`));
    return `  (${idx + 1}, ${q(d.title)}, ${json(d.readings)}, ${d.note ? q(d.note) : "null"})`;
  });
  out.push(
    `insert into public.reading_plan_days (plan_id, day_number, title, readings, note)
select p.id, v.day_number, v.title, v.readings, v.note
from public.reading_plans p,
(values
${rows.join(",\n")}
) as v(day_number, title, readings, note)
where p.slug = ${q(p.slug)}
on conflict (plan_id, day_number) do nothing;`,
  );
});

out.push("", "commit;", "");

const target = resolve("supabase/seed.sql");
writeFileSync(target, out.join("\n"));
console.log(
  `seed.sql gerado: ${DEVOTIONAL_SEEDS.length} palavras do dia, ${NEED_SEEDS.length} temas, ${PLAN_SEEDS.length} planos.`,
);
