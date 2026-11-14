/**
 * Garante que todo conteúdo inicial aponta para passagens que realmente existem
 * na Bíblia Livre: nenhuma referência inventada ou fora do capítulo.
 */
import { describe, expect, it } from "vitest";
import { DEVOTIONAL_SEEDS } from "@/content/devotionals";
import { NEED_SEEDS } from "@/content/needs";
import { PLAN_SEEDS } from "@/content/reading-plans";
import { formatReference, isValidReference, type BibleReference } from "@/lib/bible/reference";
import { getPassage } from "@/lib/bible/text";

async function assertExists(ref: BibleReference, where: string) {
  expect(isValidReference(ref), `${where}: ${JSON.stringify(ref)}`).toBe(true);
  const passage = await getPassage(ref);
  expect(passage, `${where}: ${formatReference(ref)} não existe na fonte`).not.toBeNull();
}

describe("integridade do conteúdo", () => {
  it("palavras do dia", async () => {
    const slugs = new Set<string>();
    for (const d of DEVOTIONAL_SEEDS) {
      expect(slugs.has(d.slug), `slug repetido: ${d.slug}`).toBe(false);
      slugs.add(d.slug);
      expect(d.reference.verseStart, `${d.slug} precisa de versículo`).toBeTruthy();
      await assertExists(d.reference, d.slug);
      expect(d.reflection.length).toBeGreaterThan(80);
    }
  });

  it("preciso de uma palavra: 10 temas com passagem e leituras válidas", async () => {
    expect(NEED_SEEDS).toHaveLength(10);
    for (const n of NEED_SEEDS) {
      await assertExists(n.reference, n.topic);
      expect(n.furtherReadings.length).toBeGreaterThan(0);
      for (const r of n.furtherReadings) await assertExists(r, `${n.topic} (leituras)`);
    }
  });

  it("planos de leitura", async () => {
    expect(PLAN_SEEDS).toHaveLength(8);
    for (const p of PLAN_SEEDS) {
      expect(p.days.length, p.slug).toBeGreaterThan(0);
      for (const [i, d] of p.days.entries()) {
        for (const r of d.readings) await assertExists(r, `${p.slug} dia ${i + 1}`);
      }
    }
  });

  it("Jornada pelo Novo Testamento cobre os 260 capítulos sem repetir", () => {
    const plan = PLAN_SEEDS.find((p) => p.slug === "jornada-pelo-novo-testamento")!;
    const all = plan.days.flatMap((d) => d.readings.map((r) => `${r.book}-${r.chapter}`));
    expect(all).toHaveLength(260);
    expect(new Set(all).size).toBe(260);
  });
});
