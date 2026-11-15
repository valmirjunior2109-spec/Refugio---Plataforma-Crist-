import { describe, expect, it } from "vitest";
import { BOOK_OF_MORMON, getAdjacentBomChapter, getBomBook, readerHref } from "@/lib/scriptures/book-of-mormon";

describe("Livro de Mórmon", () => {
  it("tem 15 livros e 239 capítulos", () => {
    expect(BOOK_OF_MORMON).toHaveLength(15);
    expect(BOOK_OF_MORMON.reduce((n, b) => n + b.chapters, 0)).toBe(239);
  });

  it("abre os capítulos dentro do app", () => {
    expect(readerHref("alma", 32)).toBe("/livro-de-mormon/alma/32");
  });

  it("navega entre capítulos atravessando livros", () => {
    const ne1 = getBomBook("1-ne")!;
    expect(getAdjacentBomChapter(ne1, 1, -1)).toBeNull();
    expect(getAdjacentBomChapter(ne1, 22, 1)).toEqual({ book: getBomBook("2-ne"), chapter: 1 });
    expect(getAdjacentBomChapter(getBomBook("2-ne")!, 1, -1)).toEqual({ book: ne1, chapter: 22 });
    expect(getAdjacentBomChapter(getBomBook("moro")!, 10, 1)).toBeNull();
  });
});
