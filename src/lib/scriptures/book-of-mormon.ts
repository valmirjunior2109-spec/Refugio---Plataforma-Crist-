/**
 * Livro de Mórmon: índice de livros e capítulos.
 *
 * O texto em português é protegido por direitos autorais (Intellectual Reserve, Inc.)
 * e NÃO é copiado para o Refúgio. Cada capítulo abre no site oficial, gratuito.
 * Se um dia houver licença para exibir o texto aqui, basta trocar `chapterUrl`
 * por uma rota interna.
 */
export interface BomBook {
  slug: string; // identificador do site oficial
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

export function chapterUrl(bookSlug: string, chapter: number): string {
  return `https://www.churchofjesuschrist.org/study/scriptures/bofm/${bookSlug}/${chapter}?lang=por`;
}
