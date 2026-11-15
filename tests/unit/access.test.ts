import { describe, expect, it } from "vitest";
import { guestRedirect, isGuestOnlyPath, isPublicPath } from "@/lib/supabase/access";
import { BOOK_OF_MORMON, chapterUrl } from "@/lib/scriptures/book-of-mormon";

describe("acesso por rota (conteúdo exige conta)", () => {
  it("páginas públicas abertas a visitantes", () => {
    for (const p of ["/boas-vindas", "/entrar", "/cadastro", "/recuperar-senha", "/ajuda", "/sobre", "/termos", "/privacidade", "/ajude-a-crescer", "/auth/confirmar", "/entrar/"]) {
      expect(isPublicPath(p), p).toBe(true);
    }
  });

  it("conteúdo e áreas pessoais exigem login", () => {
    for (const p of ["/", "/biblia", "/biblia/salmos/23", "/palavra-do-dia", "/preciso-de-uma-palavra/medo", "/planos", "/livro-de-mormon", "/oracoes", "/meu-espaco", "/admin", "/refugio", "/entrarx", "/ajuda-falsa"]) {
      expect(isPublicPath(p), p).toBe(false);
    }
  });

  it("a ajuda emergencial nunca exige cadastro", () => {
    expect(isPublicPath("/ajuda")).toBe(true);
  });

  it("visitante no início vai para as boas-vindas; nas demais, para o login de volta à página", () => {
    expect(guestRedirect("/")).toBe("/boas-vindas");
    expect(guestRedirect("/biblia/joao/3", "?x=1")).toBe("/entrar?next=%2Fbiblia%2Fjoao%2F3%3Fx%3D1");
  });

  it("boas-vindas é só para visitantes", () => {
    expect(isGuestOnlyPath("/boas-vindas")).toBe(true);
    expect(isGuestOnlyPath("/entrar")).toBe(false);
  });
});

describe("Livro de Mórmon", () => {
  it("tem 15 livros e 239 capítulos, com links para o site oficial", () => {
    expect(BOOK_OF_MORMON).toHaveLength(15);
    expect(BOOK_OF_MORMON.reduce((n, b) => n + b.chapters, 0)).toBe(239);
    expect(chapterUrl("alma", 32)).toBe("https://www.churchofjesuschrist.org/study/scriptures/bofm/alma/32?lang=por");
  });
});
