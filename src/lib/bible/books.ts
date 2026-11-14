/**
 * Catálogo dos 66 livros do cânon protestante, na ordem da Bíblia Livre.
 * `code` é o identificador usado nos arquivos de data/bible/blivre.
 * `slug` é o identificador amigável usado nas URLs (/biblia/joao/3).
 */
export type Testament = "AT" | "NT";

export interface BibleBook {
  code: string;
  slug: string;
  name: string;
  abbrev: string;
  chapters: number;
  testament: Testament;
}

type BookSeed = Omit<BibleBook, "testament">;

const AT: BookSeed[] = [
  { code: "GEN", slug: "genesis", name: "Gênesis", abbrev: "Gn", chapters: 50 },
  { code: "EXO", slug: "exodo", name: "Êxodo", abbrev: "Êx", chapters: 40 },
  { code: "LEV", slug: "levitico", name: "Levítico", abbrev: "Lv", chapters: 27 },
  { code: "NUM", slug: "numeros", name: "Números", abbrev: "Nm", chapters: 36 },
  { code: "DEU", slug: "deuteronomio", name: "Deuteronômio", abbrev: "Dt", chapters: 34 },
  { code: "JOS", slug: "josue", name: "Josué", abbrev: "Js", chapters: 24 },
  { code: "JDG", slug: "juizes", name: "Juízes", abbrev: "Jz", chapters: 21 },
  { code: "RUT", slug: "rute", name: "Rute", abbrev: "Rt", chapters: 4 },
  { code: "1SA", slug: "1-samuel", name: "1 Samuel", abbrev: "1Sm", chapters: 31 },
  { code: "2SA", slug: "2-samuel", name: "2 Samuel", abbrev: "2Sm", chapters: 24 },
  { code: "1KI", slug: "1-reis", name: "1 Reis", abbrev: "1Rs", chapters: 22 },
  { code: "2KI", slug: "2-reis", name: "2 Reis", abbrev: "2Rs", chapters: 25 },
  { code: "1CH", slug: "1-cronicas", name: "1 Crônicas", abbrev: "1Cr", chapters: 29 },
  { code: "2CH", slug: "2-cronicas", name: "2 Crônicas", abbrev: "2Cr", chapters: 36 },
  { code: "EZR", slug: "esdras", name: "Esdras", abbrev: "Ed", chapters: 10 },
  { code: "NEH", slug: "neemias", name: "Neemias", abbrev: "Ne", chapters: 13 },
  { code: "EST", slug: "ester", name: "Ester", abbrev: "Et", chapters: 10 },
  { code: "JOB", slug: "jo", name: "Jó", abbrev: "Jó", chapters: 42 },
  { code: "PSA", slug: "salmos", name: "Salmos", abbrev: "Sl", chapters: 150 },
  { code: "PRO", slug: "proverbios", name: "Provérbios", abbrev: "Pv", chapters: 31 },
  { code: "ECC", slug: "eclesiastes", name: "Eclesiastes", abbrev: "Ec", chapters: 12 },
  { code: "SOL", slug: "canticos", name: "Cânticos", abbrev: "Ct", chapters: 8 },
  { code: "ISA", slug: "isaias", name: "Isaías", abbrev: "Is", chapters: 66 },
  { code: "JER", slug: "jeremias", name: "Jeremias", abbrev: "Jr", chapters: 52 },
  { code: "LAM", slug: "lamentacoes", name: "Lamentações", abbrev: "Lm", chapters: 5 },
  { code: "EZE", slug: "ezequiel", name: "Ezequiel", abbrev: "Ez", chapters: 48 },
  { code: "DAN", slug: "daniel", name: "Daniel", abbrev: "Dn", chapters: 12 },
  { code: "HOS", slug: "oseias", name: "Oseias", abbrev: "Os", chapters: 14 },
  { code: "JOE", slug: "joel", name: "Joel", abbrev: "Jl", chapters: 3 },
  { code: "AMO", slug: "amos", name: "Amós", abbrev: "Am", chapters: 9 },
  { code: "OBA", slug: "obadias", name: "Obadias", abbrev: "Ob", chapters: 1 },
  { code: "JON", slug: "jonas", name: "Jonas", abbrev: "Jn", chapters: 4 },
  { code: "MIC", slug: "miqueias", name: "Miqueias", abbrev: "Mq", chapters: 7 },
  { code: "NAH", slug: "naum", name: "Naum", abbrev: "Na", chapters: 3 },
  { code: "HAB", slug: "habacuque", name: "Habacuque", abbrev: "Hc", chapters: 3 },
  { code: "ZEP", slug: "sofonias", name: "Sofonias", abbrev: "Sf", chapters: 3 },
  { code: "HAG", slug: "ageu", name: "Ageu", abbrev: "Ag", chapters: 2 },
  { code: "ZEC", slug: "zacarias", name: "Zacarias", abbrev: "Zc", chapters: 14 },
  { code: "MAL", slug: "malaquias", name: "Malaquias", abbrev: "Ml", chapters: 4 },
];

const NT: BookSeed[] = [
  { code: "MAT", slug: "mateus", name: "Mateus", abbrev: "Mt", chapters: 28 },
  { code: "MAR", slug: "marcos", name: "Marcos", abbrev: "Mc", chapters: 16 },
  { code: "LUK", slug: "lucas", name: "Lucas", abbrev: "Lc", chapters: 24 },
  { code: "JOH", slug: "joao", name: "João", abbrev: "Jo", chapters: 21 },
  { code: "ACT", slug: "atos", name: "Atos", abbrev: "At", chapters: 28 },
  { code: "ROM", slug: "romanos", name: "Romanos", abbrev: "Rm", chapters: 16 },
  { code: "1CO", slug: "1-corintios", name: "1 Coríntios", abbrev: "1Co", chapters: 16 },
  { code: "2CO", slug: "2-corintios", name: "2 Coríntios", abbrev: "2Co", chapters: 13 },
  { code: "GAL", slug: "galatas", name: "Gálatas", abbrev: "Gl", chapters: 6 },
  { code: "EPH", slug: "efesios", name: "Efésios", abbrev: "Ef", chapters: 6 },
  { code: "PHI", slug: "filipenses", name: "Filipenses", abbrev: "Fp", chapters: 4 },
  { code: "COL", slug: "colossenses", name: "Colossenses", abbrev: "Cl", chapters: 4 },
  { code: "1TH", slug: "1-tessalonicenses", name: "1 Tessalonicenses", abbrev: "1Ts", chapters: 5 },
  { code: "2TH", slug: "2-tessalonicenses", name: "2 Tessalonicenses", abbrev: "2Ts", chapters: 3 },
  { code: "1TI", slug: "1-timoteo", name: "1 Timóteo", abbrev: "1Tm", chapters: 6 },
  { code: "2TI", slug: "2-timoteo", name: "2 Timóteo", abbrev: "2Tm", chapters: 4 },
  { code: "TIT", slug: "tito", name: "Tito", abbrev: "Tt", chapters: 3 },
  { code: "PHM", slug: "filemom", name: "Filemom", abbrev: "Fm", chapters: 1 },
  { code: "HEB", slug: "hebreus", name: "Hebreus", abbrev: "Hb", chapters: 13 },
  { code: "JAM", slug: "tiago", name: "Tiago", abbrev: "Tg", chapters: 5 },
  { code: "1PE", slug: "1-pedro", name: "1 Pedro", abbrev: "1Pe", chapters: 5 },
  { code: "2PE", slug: "2-pedro", name: "2 Pedro", abbrev: "2Pe", chapters: 3 },
  { code: "1JO", slug: "1-joao", name: "1 João", abbrev: "1Jo", chapters: 5 },
  { code: "2JO", slug: "2-joao", name: "2 João", abbrev: "2Jo", chapters: 1 },
  { code: "3JO", slug: "3-joao", name: "3 João", abbrev: "3Jo", chapters: 1 },
  { code: "JUD", slug: "judas", name: "Judas", abbrev: "Jd", chapters: 1 },
  { code: "REV", slug: "apocalipse", name: "Apocalipse", abbrev: "Ap", chapters: 22 },
];

export const BIBLE_BOOKS: readonly BibleBook[] = [
  ...AT.map((b) => ({ ...b, testament: "AT" as const })),
  ...NT.map((b) => ({ ...b, testament: "NT" as const })),
];

const bySlug = new Map(BIBLE_BOOKS.map((b) => [b.slug, b]));
const byCode = new Map(BIBLE_BOOKS.map((b) => [b.code, b]));

export function getBookBySlug(slug: string): BibleBook | undefined {
  return bySlug.get(slug);
}

export function getBookByCode(code: string): BibleBook | undefined {
  return byCode.get(code);
}

/** Capítulo anterior/seguinte, atravessando a fronteira entre livros. */
export function getAdjacentChapter(
  book: BibleBook,
  chapter: number,
  direction: 1 | -1,
): { book: BibleBook; chapter: number } | null {
  const next = chapter + direction;
  if (next >= 1 && next <= book.chapters) return { book, chapter: next };
  const other = BIBLE_BOOKS[BIBLE_BOOKS.indexOf(book) + direction];
  if (!other) return null;
  return { book: other, chapter: direction === 1 ? 1 : other.chapters };
}

export const TRANSLATION = {
  id: "blivre",
  name: "Bíblia Livre",
  abbrev: "BLIVRE",
  credit:
    "Bíblia Livre (BLIVRE), © Diego Santos, Mario Sérgio e Marco Teles, 2018. Licença Creative Commons Atribuição 4.0 Brasil.",
  licenseUrl: "https://creativecommons.org/licenses/by/4.0/deed.pt-br",
  sourceUrl: "https://ebible.org/porbr2018/",
} as const;
