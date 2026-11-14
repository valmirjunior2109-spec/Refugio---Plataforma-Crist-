import { BIBLE_BOOKS, getBookByCode, getBookBySlug, type BibleBook } from "./books";

/**
 * Uma referência bíblica verificável.
 * Sem `verseStart`, a referência aponta para o capítulo inteiro (ex.: "Salmos 23").
 */
export interface BibleReference {
  /** slug do livro (ex.: "salmos") */
  book: string;
  chapter: number;
  verseStart?: number | null;
  verseEnd?: number | null;
}

export function resolveBook(book: string): BibleBook | undefined {
  return getBookBySlug(book) ?? getBookByCode(book);
}

/** "Salmos 23:1-4" (long) ou "Sl 23:1-4" (short). */
export function formatReference(ref: BibleReference, style: "long" | "short" = "long"): string {
  const book = resolveBook(ref.book);
  const name = book ? (style === "long" ? book.name : book.abbrev) : ref.book;
  if (!ref.verseStart) return `${name} ${ref.chapter}`;
  const end = ref.verseEnd && ref.verseEnd !== ref.verseStart ? `-${ref.verseEnd}` : "";
  return `${name} ${ref.chapter}:${ref.verseStart}${end}`;
}

/** Link para o capítulo no leitor, com âncora no versículo inicial. */
export function referenceHref(ref: BibleReference): string {
  const slug = resolveBook(ref.book)?.slug ?? ref.book;
  return `/biblia/${slug}/${ref.chapter}${ref.verseStart ? `#v${ref.verseStart}` : ""}`;
}

/** Livro e capítulo existem, versículos são inteiros positivos e o intervalo é crescente. */
export function isValidReference(ref: BibleReference): boolean {
  const book = resolveBook(ref.book);
  if (!book) return false;
  if (!Number.isInteger(ref.chapter) || ref.chapter < 1 || ref.chapter > book.chapters) return false;
  if (ref.verseStart == null) return ref.verseEnd == null;
  if (!Number.isInteger(ref.verseStart) || ref.verseStart < 1) return false;
  if (ref.verseEnd != null && (!Number.isInteger(ref.verseEnd) || ref.verseEnd < ref.verseStart)) {
    return false;
  }
  return true;
}

const stripAccents = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// 1º: correspondência exata, preservando acentos ("jó" ≠ "jo" de João).
const exact = new Map<string, BibleBook>();
for (const b of BIBLE_BOOKS) {
  exact.set(b.name.toLowerCase().replace(/\s+/g, ""), b);
  exact.set(b.abbrev.toLowerCase(), b);
}
// 2º: sem acentos; nomes completos têm prioridade sobre abreviações.
const loose = new Map<string, BibleBook>();
for (const b of BIBLE_BOOKS) {
  loose.set(b.slug.replace(/-/g, ""), b);
  loose.set(stripAccents(b.name).replace(/\s+/g, ""), b);
}
for (const b of BIBLE_BOOKS) {
  const key = stripAccents(b.abbrev);
  if (!loose.has(key)) loose.set(key, b);
}

function findBook(raw: string): BibleBook | undefined {
  const compact = raw.toLowerCase().replace(/[\s-]+/g, "");
  return exact.get(compact) ?? loose.get(stripAccents(compact));
}

/**
 * Interpreta textos como "Salmos 23:1-4", "Sl 23:1", "1 João 4:18" ou "João 3".
 * Retorna null quando o texto não corresponde a uma referência válida.
 */
export function parseReference(input: string): BibleReference | null {
  const m = /^\s*([1-3]?\s?\p{L}+(?:\s\p{L}+)*)\s+(\d+)(?::(\d+)(?:\s*-\s*(\d+))?)?\s*$/u.exec(input);
  if (!m) return null;
  const [, rawBook, ch, vs, ve] = m;
  const book = findBook(rawBook!);
  if (!book) return null;
  const ref: BibleReference = {
    book: book.slug,
    chapter: Number(ch),
    verseStart: vs ? Number(vs) : null,
    verseEnd: ve ? Number(ve) : null,
  };
  return isValidReference(ref) ? ref : null;
}
