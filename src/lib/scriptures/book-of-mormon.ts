/**
 * Livro de Mórmon: índice de livros e capítulos.
 *
 * O texto em português é protegido por direitos autorais (Intellectual Reserve, Inc.)
 * e NÃO é copiado para o Refúgio. Cada capítulo é lido dentro do app, mas a página
 * exibida é a oficial, incorporada (iframe) e servida pelo próprio site da Igreja.
 */
export interface BomBook {
  slug: string; // identificador do site oficial (também usado na URL do Refúgio)
  name: string;
  chapters: number;
}

export const BOOK_OF_MORMON: readonly BomBook[] = [
  { slug: "1-ne", name: "1 Néfi", chapters: 22 },
  { slug: "2-ne", name: "2 Néfi", chapters: 33 },
  { slug: "jacob", name: "Jacó", chapters: 7 },
  { slug: "enos", name: "Enos", chapters: 1 },
  { slug: "jarom", name: "Jarom", chapters: 1 },
  { slug: "omni", name: "Ômni", chapters: 1 },
  { slug: "w-of-m", name: "Palavras de Mórmon", chapters: 1 },
  { slug: "mosiah", name: "Mosias", chapters: 29 },
  { slug: "alma", name: "Alma", chapters: 63 },
  { slug: "hel", name: "Helamã", chapters: 16 },
  { slug: "3-ne", name: "3 Néfi", chapters: 30 },
  { slug: "4-ne", name: "4 Néfi", chapters: 1 },
  { slug: "morm", name: "Mórmon", chapters: 9 },
  { slug: "ether", name: "Éter", chapters: 15 },
  { slug: "moro", name: "Morôni", chapters: 10 },
];

export const BOM_SOURCE = {
  name: "A Igreja de Jesus Cristo dos Santos dos Últimos Dias",
  site: "churchofjesuschrist.org",
  indexUrl: "https://www.churchofjesuschrist.org/study/scriptures/bofm?lang=por",
} as const;

/** Endereço oficial do capítulo (exibido incorporado no leitor). */
export function chapterUrl(bookSlug: string, chapter: number): string {
  return `https://www.churchofjesuschrist.org/study/scriptures/bofm/${bookSlug}/${chapter}?lang=por`;
}

/** Rota interna do leitor no Refúgio. */
export function readerHref(bookSlug: string, chapter: number): string {
  return `/livro-de-mormon/${bookSlug}/${chapter}`;
}

export function getBomBook(slug: string): BomBook | undefined {
  return BOOK_OF_MORMON.find((b) => b.slug === slug);
}

/** Capítulo anterior/seguinte, atravessando livros. Retorna null nas pontas. */
export function getAdjacentBomChapter(
  book: BomBook,
  chapter: number,
  dir: -1 | 1,
): { book: BomBook; chapter: number } | null {
  const target = chapter + dir;
  if (target >= 1 && target <= book.chapters) return { book, chapter: target };
  const idx = BOOK_OF_MORMON.indexOf(book);
  const other = BOOK_OF_MORMON[idx + dir];
  if (!other) return null;
  return { book: other, chapter: dir === 1 ? 1 : other.chapters };
}
