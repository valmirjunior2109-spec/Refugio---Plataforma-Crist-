import { describe, expect, it } from "vitest";
import { BIBLE_BOOKS, getAdjacentChapter, getBookBySlug } from "@/lib/bible/books";
import { formatReference, isValidReference, parseReference, referenceHref } from "@/lib/bible/reference";
import { getChapter, getPassage, passageText } from "@/lib/bible/text";
import { plainScripture, scriptureParts } from "@/lib/bible/format";

describe("catálogo de livros", () => {
  it("tem os 66 livros com 1189 capítulos e slugs únicos", () => {
    expect(BIBLE_BOOKS).toHaveLength(66);
    expect(BIBLE_BOOKS.reduce((n, b) => n + b.chapters, 0)).toBe(1189);
    expect(new Set(BIBLE_BOOKS.map((b) => b.slug)).size).toBe(66);
  });

  it("navega entre capítulos atravessando livros", () => {
    const malaquias = getBookBySlug("malaquias")!;
    expect(getAdjacentChapter(malaquias, 4, 1)).toMatchObject({ book: { slug: "mateus" }, chapter: 1 });
    expect(getAdjacentChapter(getBookBySlug("genesis")!, 1, -1)).toBeNull();
    expect(getAdjacentChapter(getBookBySlug("apocalipse")!, 22, 1)).toBeNull();
  });
});

describe("referências", () => {
  it("interpreta formatos comuns", () => {
    expect(parseReference("Salmos 23:1-4")).toEqual({ book: "salmos", chapter: 23, verseStart: 1, verseEnd: 4 });
    expect(parseReference("1 João 4:18")).toMatchObject({ book: "1-joao", chapter: 4, verseStart: 18 });
    expect(parseReference("Sl 23")).toMatchObject({ book: "salmos", chapter: 23, verseStart: null });
    expect(parseReference("joao 3:16")).toMatchObject({ book: "joao" });
  });

  it("distingue Jó de João (Jo)", () => {
    expect(parseReference("Jó 1:1")?.book).toBe("jo");
    expect(parseReference("Jo 3:16")?.book).toBe("joao");
  });

  it("rejeita referências inexistentes", () => {
    expect(parseReference("Salmos 151")).toBeNull();
    expect(parseReference("Livro 1:1")).toBeNull();
    expect(isValidReference({ book: "salmos", chapter: 23, verseStart: 5, verseEnd: 2 })).toBe(false);
  });

  it("formata e gera links", () => {
    const ref = { book: "joao", chapter: 3, verseStart: 16, verseEnd: 17 };
    expect(formatReference(ref)).toBe("João 3:16-17");
    expect(formatReference(ref, "short")).toBe("Jo 3:16-17");
    expect(formatReference({ book: "salmos", chapter: 23 })).toBe("Salmos 23");
    expect(referenceHref(ref)).toBe("/biblia/joao/3#v16");
  });
});

describe("texto bíblico (Bíblia Livre)", () => {
  it("lê exatamente os versículos pedidos", async () => {
    const p = await getPassage({ book: "isaias", chapter: 41, verseStart: 10 });
    expect(p?.verses).toHaveLength(1);
    expect(p?.verses[0]?.text.startsWith("Não temas, porque eu estou contigo")).toBe(true);

    const range = await getPassage({ book: "filipenses", chapter: 4, verseStart: 6, verseEnd: 7 });
    expect(range?.verses.map((v) => v.number)).toEqual([6, 7]);
    expect(passageText(range!)).toContain("a paz de Deus");
  });

  it("não inventa: retorna null para versículo inexistente", async () => {
    expect(await getPassage({ book: "salmos", chapter: 23, verseStart: 50 })).toBeNull();
    expect(await getChapter("salmos", 151)).toBeNull();
  });

  it("todos os capítulos do catálogo existem na fonte", async () => {
    for (const book of BIBLE_BOOKS) {
      const last = await getChapter(book.slug, book.chapters);
      expect(last?.length, `${book.name} ${book.chapters}`).toBeGreaterThan(0);
    }
  });

  it("trata palavras acrescentadas pelos tradutores", () => {
    const raw = "Deus [é] nosso refúgio; vou dá- [la] a vós, lá tu [estás] ;";
    expect(plainScripture(raw)).toBe("Deus é nosso refúgio; vou dá-la a vós, lá tu estás;");
    expect(scriptureParts("A [b] c")).toEqual(["A ", "b", " c"]);
  });
});
