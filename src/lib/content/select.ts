import type { Devotional } from "@/types/content";
import { addDays } from "@/lib/utils/dates";
import type { DevotionalSeed } from "@/content/devotionals";

/**
 * Palavra do dia para uma data: a publicada exatamente nessa data ou, se não houver,
 * a mais recente publicada antes dela. Nunca mostra conteúdo com data futura.
 */
export function pickDevotionalForDate(list: Devotional[], today: string): Devotional | null {
  let best: Devotional | null = null;
  for (const d of list) {
    if (d.status !== "published" || d.publishDate > today) continue;
    if (!best || d.publishDate > best.publishDate) best = d;
  }
  return best;
}

/** Histórico: publicadas até hoje, da mais recente para a mais antiga. */
export function devotionalHistory(list: Devotional[], today: string): Devotional[] {
  return list
    .filter((d) => d.status === "published" && d.publishDate <= today)
    .sort((a, b) => (a.publishDate < b.publishDate ? 1 : a.publishDate > b.publishDate ? -1 : 0));
}

/** Conteúdo demonstrativo: o 1º item é "hoje", o 2º "ontem", e assim por diante. */
export function demoDevotionals(seeds: DevotionalSeed[], today: string): Devotional[] {
  return seeds.map((s, i) => ({
    id: `demo-${s.slug}`,
    slug: s.slug,
    title: s.title,
    reference: s.reference,
    reflection: s.reflection,
    application: s.application,
    prayer: s.prayer,
    publishDate: addDays(today, -i),
    status: "published",
  }));
}
