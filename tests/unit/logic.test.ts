import { beforeEach, describe, expect, it } from "vitest";
import { demoDevotionals, devotionalHistory, pickDevotionalForDate } from "@/lib/content/select";
import { DEVOTIONAL_SEEDS } from "@/content/devotionals";
import { addDays, daysBetween, greeting, isIsoDate, isoDate } from "@/lib/utils/dates";
import { checkRateLimit, resetRateLimits } from "@/lib/utils/rate-limit";
import { cn } from "@/lib/utils/cn";
import { messageForDate, WELCOME_MESSAGES } from "@/content/messages";
import type { Devotional } from "@/types/content";

const dev = (id: string, publishDate: string, status: "draft" | "published" = "published"): Devotional => ({
  id,
  slug: id,
  title: id,
  reference: { book: "salmos", chapter: 23, verseStart: 1 },
  reflection: "",
  application: "",
  prayer: "",
  publishDate,
  status,
});

describe("Palavra do dia", () => {
  const list = [dev("a", "2026-11-10"), dev("b", "2026-11-14"), dev("c", "2026-11-20"), dev("d", "2026-11-13", "draft")];

  it("escolhe a publicação do dia", () => {
    expect(pickDevotionalForDate(list, "2026-11-14")?.id).toBe("b");
  });

  it("sem publicação no dia, usa a mais recente anterior; nunca a futura nem rascunho", () => {
    expect(pickDevotionalForDate(list, "2026-11-13")?.id).toBe("a");
    expect(pickDevotionalForDate(list, "2026-11-19")?.id).toBe("b");
    expect(pickDevotionalForDate(list, "2026-11-01")).toBeNull();
  });

  it("histórico em ordem decrescente, sem futuras nem rascunhos", () => {
    expect(devotionalHistory(list, "2026-11-15").map((d) => d.id)).toEqual(["b", "a"]);
  });

  it("modo demonstração: 1º conteúdo é hoje, os demais em dias anteriores", () => {
    const demo = demoDevotionals(DEVOTIONAL_SEEDS, "2026-11-14");
    expect(demo[0]?.publishDate).toBe("2026-11-14");
    expect(demo[1]?.publishDate).toBe("2026-11-13");
    expect(pickDevotionalForDate(demo, "2026-11-14")?.slug).toBe(DEVOTIONAL_SEEDS[0]?.slug);
  });
});

describe("datas", () => {
  it("calcula datas sem depender do fuso da máquina", () => {
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
    expect(daysBetween("2026-11-01", "2026-11-14")).toBe(13);
  });

  it("usa o fuso de São Paulo para definir 'hoje'", () => {
    // 02:30 UTC de 15/11 ainda é 14/11 em São Paulo (UTC-3)
    expect(isoDate(new Date("2026-11-15T02:30:00Z"))).toBe("2026-11-14");
  });

  it("valida datas reais", () => {
    expect(isIsoDate("2026-02-29")).toBe(false);
    expect(isIsoDate("2028-02-29")).toBe(true);
    expect(isIsoDate("14/11/2026")).toBe(false);
  });

  it("saudação conforme o horário", () => {
    expect(greeting(new Date("2026-11-14T12:00:00Z"), "America/Sao_Paulo")).toBe("Bom dia");
    expect(greeting(new Date("2026-11-14T18:00:00Z"), "America/Sao_Paulo")).toBe("Boa tarde");
    expect(greeting(new Date("2026-11-14T23:30:00Z"), "America/Sao_Paulo")).toBe("Boa noite");
  });

  it("mensagem de acolhimento é estável para a mesma data", () => {
    expect(messageForDate("2026-11-14")).toBe(messageForDate("2026-11-14"));
    expect(WELCOME_MESSAGES).toContain(messageForDate("2026-11-15"));
  });
});

describe("limite de requisições", () => {
  beforeEach(() => resetRateLimits());

  it("bloqueia após o limite e libera depois da janela", () => {
    const opts = { limit: 3, windowMs: 1000 };
    expect(checkRateLimit("k", opts, 0)).toBe(true);
    expect(checkRateLimit("k", opts, 10)).toBe(true);
    expect(checkRateLimit("k", opts, 20)).toBe(true);
    expect(checkRateLimit("k", opts, 30)).toBe(false);
    expect(checkRateLimit("outra", opts, 30)).toBe(true);
    expect(checkRateLimit("k", opts, 1500)).toBe(true);
  });
});

describe("cn", () => {
  it("resolve conflitos de classes", () => {
    expect(cn("h-11 px-4", false, "h-10")).toBe("px-4 h-10");
    expect(cn("text-sm text-ink")).toBe("text-sm text-ink");
  });
});
