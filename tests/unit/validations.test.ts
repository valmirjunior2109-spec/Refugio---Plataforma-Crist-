import { describe, expect, it } from "vitest";
import { prayerEntrySchema, prayerFilterSchema } from "@/lib/validations/prayer";
import { feedbackSchema } from "@/lib/validations/feedback";
import { deleteAccountSchema, resetPasswordSchema, safeNextPath, signUpSchema } from "@/lib/validations/auth";
import { devotionalSchema, planSchema, referenceListSchema } from "@/lib/validations/admin";
import { cleanText } from "@/lib/validations/common";

describe("diário de oração", () => {
  const valid = { title: "Obrigado", content: "Pelo dia de hoje.", category: "agradecimento", tags: "família, #Paz, família", entryDate: "2026-11-14" };

  it("aceita um registro válido e normaliza marcadores", () => {
    const r = prayerEntrySchema.parse(valid);
    expect(r.tags).toEqual(["família", "paz"]);
  });

  it("rejeita título vazio, categoria inválida e data impossível", () => {
    const r = prayerEntrySchema.safeParse({ ...valid, title: "   ", category: "x", entryDate: "2026-02-30" });
    expect(r.success).toBe(false);
    const errors = r.error!.flatten().fieldErrors;
    expect(errors.title).toBeDefined();
    expect(errors.category).toBeDefined();
    expect(errors.entryDate).toBeDefined();
  });

  it("limita a quantidade de marcadores", () => {
    expect(prayerEntrySchema.safeParse({ ...valid, tags: "a,b,c,d,e,f,g,h,i" }).success).toBe(false);
  });

  it("filtros inválidos são ignorados em vez de quebrar a página", () => {
    expect(prayerFilterSchema.parse({ from: "ontem", categoria: "x", q: "paz" })).toEqual({ q: "paz" });
  });

  it("remove caracteres de controle", () => {
    expect(cleanText(" a\u0000b\r\nc ")).toBe("ab\nc");
  });
});

describe("feedback", () => {
  it("aceita envio sem e-mail e sem avaliação", () => {
    const r = feedbackSchema.parse({ kind: "ideia", message: "Seria ótimo ter áudio.", rating: "", contactEmail: "" });
    expect(r.rating).toBeNull();
    expect(r.contactEmail).toBe("");
  });

  it("rejeita mensagem curta, e-mail inválido e avaliação fora da escala", () => {
    const r = feedbackSchema.safeParse({ kind: "ideia", message: "oi", rating: 9, contactEmail: "x@" });
    expect(r.success).toBe(false);
  });

  it("campo-isca preenchido é inválido", () => {
    expect(feedbackSchema.safeParse({ kind: "ideia", message: "Mensagem válida aqui", rating: "", website: "spam" }).success).toBe(false);
  });
});

describe("autenticação", () => {
  it("exige aceite dos termos e senha mínima", () => {
    expect(signUpSchema.safeParse({ displayName: "Ana", email: "ana@exemplo.com", password: "1234567", acceptTerms: true }).success).toBe(false);
    expect(signUpSchema.safeParse({ displayName: "Ana", email: "ana@exemplo.com", password: "12345678", acceptTerms: false }).success).toBe(false);
    expect(signUpSchema.safeParse({ displayName: "Ana", email: "ANA@exemplo.com ", password: "12345678", acceptTerms: true }).success).toBe(true);
  });

  it("confirma senhas iguais", () => {
    expect(resetPasswordSchema.safeParse({ password: "12345678", confirm: "12345679" }).success).toBe(false);
  });

  it("exclusão de conta exige a palavra EXCLUIR", () => {
    expect(deleteAccountSchema.safeParse({ confirmation: "excluir" }).success).toBe(true);
    expect(deleteAccountSchema.safeParse({ confirmation: "sim" }).success).toBe(false);
  });

  it("redirecionamento após login nunca sai do site", () => {
    expect(safeNextPath("/oracoes")).toBe("/oracoes");
    expect(safeNextPath("//evil.com")).toBe("/meu-espaco");
    expect(safeNextPath("https://evil.com")).toBe("/meu-espaco");
    expect(safeNextPath("/\\evil.com")).toBe("/meu-espaco");
    expect(safeNextPath(undefined)).toBe("/meu-espaco");
  });
});

describe("painel", () => {
  const devotional = {
    slug: "paz-na-tempestade",
    title: "Paz na tempestade",
    book: "salmos",
    chapter: "46",
    verseStart: "1",
    verseEnd: "",
    reflection: "Uma reflexão com tamanho suficiente.",
    application: "Ore hoje.",
    prayer: "Senhor, amém.",
    publishDate: "2026-11-14",
    status: "published",
  };

  it("palavra do dia: aceita referência existente", () => {
    const r = devotionalSchema.parse(devotional);
    expect(r.chapter).toBe(46);
    expect(r.verseEnd).toBeNull();
  });

  it("palavra do dia: rejeita referência inexistente e slug inválido", () => {
    expect(devotionalSchema.safeParse({ ...devotional, chapter: "151" }).success).toBe(false);
    expect(devotionalSchema.safeParse({ ...devotional, slug: "Paz Na Tempestade" }).success).toBe(false);
  });

  it("lista de leituras em texto", () => {
    expect(referenceListSchema.parse("Salmos 23; João 3:16-17")).toHaveLength(2);
    expect(referenceListSchema.safeParse("Salmos 23; Livro Inventado 1").success).toBe(false);
  });

  it("plano exige ao menos um dia com leitura", () => {
    const base = { slug: "plano-teste", title: "Plano teste", description: "Descrição do plano.", goal: "Objetivo.", coverTone: "sage", coverMotif: "arch", sortOrder: 0, status: "draft" };
    expect(planSchema.safeParse({ ...base, days: [] }).success).toBe(false);
    expect(planSchema.safeParse({ ...base, days: [{ title: "Dia 1", readings: "", note: "" }] }).success).toBe(false);
    expect(planSchema.safeParse({ ...base, days: [{ title: "Dia 1", readings: "Salmos 1", note: "" }] }).success).toBe(true);
  });
});
