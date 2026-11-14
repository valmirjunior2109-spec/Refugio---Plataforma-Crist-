import "server-only";
import { getBookBySlug, TRANSLATION, type BibleBook } from "./books";
import { formatReference, resolveBook, type BibleReference } from "./reference";

interface BookData {
  code: string;
  chapters: string[][];
}

export interface Verse {
  number: number;
  text: string;
}

export interface Passage {
  reference: BibleReference;
  label: string;
  book: BibleBook;
  verses: Verse[];
  translation: typeof TRANSLATION.abbrev;
}

const cache = new Map<string, Promise<BookData>>();

/**
 * Carrega o texto de um livro da Bíblia Livre.
 * O import dinâmico com prefixo fixo faz o bundler incluir os 66 arquivos,
 * que ficam disponíveis em qualquer ambiente (inclusive serverless).
 */
function loadBook(code: string): Promise<BookData> {
  let p = cache.get(code);
  if (!p) {
    p = import(`../../../data/bible/blivre/${code}.json`).then((m) => (m.default ?? m) as BookData);
    cache.set(code, p);
  }
  return p;
}

export async function getChapter(bookSlug: string, chapter: number): Promise<Verse[] | null> {
  const book = getBookBySlug(bookSlug);
  if (!book || chapter < 1 || chapter > book.chapters) return null;
  const data = await loadBook(book.code);
  const verses = data.chapters[chapter - 1];
  if (!verses) return null;
  return verses.map((text, i) => ({ number: i + 1, text }));
}

/**
 * Retorna exatamente os versículos de uma referência, vindos da fonte.
 * Nunca completa nem inventa texto: se a referência não existir, retorna null.
 */
export async function getPassage(ref: BibleReference): Promise<Passage | null> {
  const book = resolveBook(ref.book);
  if (!book) return null;
  const verses = await getChapter(book.slug, ref.chapter);
  if (!verses) return null;
  const start = ref.verseStart ?? 1;
  const end = ref.verseStart ? (ref.verseEnd ?? ref.verseStart) : verses.length;
  if (start > verses.length || end > verses.length) return null;
  return {
    reference: ref,
    label: formatReference(ref),
    book,
    verses: verses.slice(start - 1, end),
    translation: TRANSLATION.abbrev,
  };
}

export function passageText(p: Passage): string {
  return p.verses.map((v) => v.text).join(" ");
}

export async function getVerseCount(bookSlug: string, chapter: number): Promise<number | null> {
  const verses = await getChapter(bookSlug, chapter);
  return verses ? verses.length : null;
}
