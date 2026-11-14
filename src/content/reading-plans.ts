/**
 * Planos de leitura iniciais do Refúgio.
 * Cada dia tem apenas referências. O texto vem sempre da Bíblia Livre.
 */
import { BIBLE_BOOKS } from "@/lib/bible/books";
import { formatReference, type BibleReference } from "@/lib/bible/reference";
import type { PlanCover } from "@/types/content";

export interface PlanDaySeed {
  title: string;
  readings: BibleReference[];
  note?: string;
}

export interface PlanSeed {
  slug: string;
  title: string;
  description: string;
  goal: string;
  cover: PlanCover;
  days: PlanDaySeed[];
}

/** "salmos 23" | "salmos 23:1-6" → BibleReference */
function ref(spec: string): BibleReference {
  const m = /^([a-z0-9-]+) (\d+)(?::(\d+)(?:-(\d+))?)?$/.exec(spec);
  if (!m) throw new Error(`Referência inválida no conteúdo: ${spec}`);
  return {
    book: m[1]!,
    chapter: Number(m[2]),
    verseStart: m[3] ? Number(m[3]) : null,
    verseEnd: m[4] ? Number(m[4]) : null,
  };
}

function day(title: string, ...specs: string[]): PlanDaySeed {
  return { title, readings: specs.map(ref) };
}

/** Um dia por capítulo, com o próprio capítulo como título. */
function chapterByChapter(bookSlug: string): PlanDaySeed[] {
  const book = BIBLE_BOOKS.find((b) => b.slug === bookSlug);
  if (!book) throw new Error(`Livro desconhecido: ${bookSlug}`);
  return Array.from({ length: book.chapters }, (_, i) => {
    const reading: BibleReference = { book: book.slug, chapter: i + 1 };
    return { title: formatReference(reading), readings: [reading] };
  });
}

/** Percorre os livros em ordem, `perDay` capítulos por dia. */
function sequential(bookSlugs: string[], perDay: number): PlanDaySeed[] {
  const chapters: BibleReference[] = bookSlugs.flatMap((slug) => {
    const book = BIBLE_BOOKS.find((b) => b.slug === slug)!;
    return Array.from({ length: book.chapters }, (_, i) => ({ book: slug, chapter: i + 1 }));
  });
  const days: PlanDaySeed[] = [];
  for (let i = 0; i < chapters.length; i += perDay) {
    const readings = chapters.slice(i, i + perDay);
    const first = readings[0]!;
    const last = readings[readings.length - 1]!;
    const title =
      first.book === last.book
        ? first.chapter === last.chapter
          ? formatReference(first)
          : `${formatReference(first)}–${last.chapter}`
        : `${formatReference(first)} a ${formatReference(last)}`;
    days.push({ title, readings });
  }
  return days;
}

const NT_SLUGS = BIBLE_BOOKS.filter((b) => b.testament === "NT").map((b) => b.slug);

export const PLAN_SEEDS: PlanSeed[] = [
  {
    slug: "conhecendo-a-biblia",
    title: "Conhecendo a Bíblia",
    description:
      "Uma primeira caminhada pelos grandes momentos da Bíblia, da criação à nova criação. Ideal para quem está começando.",
    goal: "Ter uma visão geral da história bíblica e de como ela aponta para o amor de Deus.",
    cover: { tone: "sage", motif: "path" },
    days: [
      day("No princípio", "genesis 1"),
      day("Um chamado e uma promessa", "genesis 12:1-9"),
      day("Deus ouve o clamor do seu povo", "exodo 3:1-15"),
      day("Um caminho para viver bem", "exodo 20:1-17"),
      day("Dois caminhos", "salmos 1"),
      day("O servo que carrega nossas dores", "isaias 53"),
      day("O nascimento de Jesus", "lucas 2:1-20"),
      day("O Verbo se fez carne", "joao 1:1-18"),
      day("Uma comunidade nasce", "atos 2:37-47"),
      day("Todas as coisas novas", "apocalipse 21:1-7"),
    ],
  },
  {
    slug: "7-dias-de-esperanca",
    title: "7 dias de esperança",
    description:
      "Uma semana de leituras para quem atravessa um tempo difícil e precisa lembrar que a esperança continua viva.",
    goal: "Encontrar nas Escrituras motivos para seguir confiando, um dia de cada vez.",
    cover: { tone: "sand", motif: "sun" },
    days: [
      day("Quando a alma está abatida", "salmos 42"),
      day("Misericórdias a cada manhã", "lamentacoes 3:19-26"),
      day("Força para o cansado", "isaias 40:27-31"),
      day("A esperança não frustra", "romanos 5:1-5"),
      day("Tudo coopera para o bem", "romanos 8:18-28"),
      day("Tesouro em vasos de barro", "2-corintios 4:7-18"),
      day("Um novo céu e uma nova terra", "apocalipse 21:1-5"),
    ],
  },
  {
    slug: "30-dias-de-aproximacao-com-deus",
    title: "30 dias de aproximação com Deus",
    description:
      "Um mês de leituras curtas, entre salmos e evangelhos, para cultivar um tempo diário de conversa com Deus.",
    goal: "Criar um hábito tranquilo de leitura e oração e conhecer mais o coração de Deus.",
    cover: { tone: "deep", motif: "arch" },
    days: [
      day("Tu me examinas e me conheces", "salmos 139:1-12"),
      day("O Pai que corre ao encontro", "lucas 15:11-24"),
      day("A luz que veio ao mundo", "joao 1:1-14"),
      day("O Senhor é minha luz", "salmos 27"),
      day("Benditos os que choram", "mateus 5:1-12"),
      day("Aprendendo a orar", "mateus 6:5-15"),
      day("O Bom Pastor", "salmos 23"),
      day("Nascer de novo", "joao 3:1-17"),
      day("A água viva", "joao 4:1-26"),
      day("Um coração renovado", "salmos 51:1-12"),
      day("A oração humilde", "lucas 18:9-14"),
      day("Pedi, buscai, batei", "mateus 7:7-12"),
      day("A minha alma se aquieta em Deus", "salmos 62"),
      day("Conhecido pelo Pastor", "joao 10:1-18"),
      day("Permanecer nele", "joao 15:1-17"),
      day("Nada nos separará", "romanos 8:31-39"),
      day("Saudade da casa de Deus", "salmos 84"),
      day("Enraizados no amor", "efesios 3:14-21"),
      day("A paz que guarda", "filipenses 4:4-9"),
      day("À sombra do Altíssimo", "salmos 91"),
      day("A parte boa", "lucas 10:38-42"),
      day("Sobre as águas", "mateus 14:22-33"),
      day("Bendize, ó minha alma", "salmos 103"),
      day("Revestidos de bondade", "colossenses 3:1-17"),
      day("Deus é amor", "1-joao 4:7-21"),
      day("A minha alma tem sede de ti", "salmos 63:1-8"),
      day("Acheguemo-nos com confiança", "hebreus 4:14-16"),
      day("Aproximai-vos de Deus", "tiago 4:6-10"),
      day("Eis que estou à porta", "apocalipse 3:20-22"),
      day("Fartura de alegrias", "salmos 16"),
    ],
  },
  {
    slug: "conhecendo-jesus",
    title: "Conhecendo Jesus",
    description:
      "A leitura completa do Evangelho de Marcos, o mais curto dos evangelhos, um capítulo por dia.",
    goal: "Acompanhar a vida, os ensinamentos, a morte e a ressurreição de Jesus.",
    cover: { tone: "ivory", motif: "leaf" },
    days: chapterByChapter("marcos"),
  },
  {
    slug: "proverbios-sabedoria-para-a-vida",
    title: "Provérbios: sabedoria para a vida",
    description:
      "Um capítulo de Provérbios por dia, durante 31 dias. Conselhos práticos sobre palavras, trabalho, amizade e decisões.",
    goal: "Buscar sabedoria para o dia a dia à luz das Escrituras.",
    cover: { tone: "sand", motif: "stars" },
    days: chapterByChapter("proverbios"),
  },
  {
    slug: "salmos-encontrando-conforto",
    title: "Salmos: encontrando conforto",
    description:
      "Quatorze salmos escolhidos para dias de cansaço, medo ou saudade. Orações antigas que continuam dando voz ao coração.",
    goal: "Aprender a orar com os salmos e encontrar consolo na presença de Deus.",
    cover: { tone: "sage", motif: "waves" },
    days: [
      day("Deitar e dormir em paz", "salmos 4"),
      day("Na tua presença", "salmos 16"),
      day("O Senhor é meu pastor", "salmos 23"),
      day("A quem temerei?", "salmos 27"),
      day("Nas tuas mãos", "salmos 31"),
      day("Experimentai e vede", "salmos 34"),
      day("Esperei com esperança", "salmos 40"),
      day("Como a corça", "salmos 42"),
      day("Deus é nosso refúgio", "salmos 46"),
      day("A alma que se aquieta", "salmos 62"),
      day("À sombra do Altíssimo", "salmos 91"),
      day("Bendize, ó minha alma", "salmos 103"),
      day("De onde virá o meu socorro?", "salmos 121"),
      day("Tu me examinas e me conheces", "salmos 139"),
    ],
  },
  {
    slug: "jornada-pelo-novo-testamento",
    title: "Jornada pelo Novo Testamento",
    description:
      "Os 27 livros do Novo Testamento, de Mateus a Apocalipse, em cerca de três capítulos por dia. No seu ritmo, sem pressa.",
    goal: "Ler todo o Novo Testamento e conhecer a história de Jesus e da igreja primitiva.",
    cover: { tone: "deep", motif: "path" },
    days: sequential(NT_SLUGS, 3),
  },
  {
    slug: "uma-jornada-de-gratidao",
    title: "Uma jornada de gratidão",
    description:
      "Dez dias de leituras sobre gratidão: para aprender a enxergar os cuidados de Deus nos detalhes da vida.",
    goal: "Cultivar um coração agradecido, mesmo nos dias comuns.",
    cover: { tone: "ivory", motif: "sun" },
    days: [
      day("Entrai com agradecimento", "salmos 100"),
      day("Não te esqueças dos benefícios", "salmos 103:1-14"),
      day("O que voltou para agradecer", "lucas 17:11-19"),
      day("Em tudo dai graças", "1-tessalonicenses 5:12-24"),
      day("Aprendi a contentar-me", "filipenses 4:10-20"),
      day("Sua bondade dura para sempre", "salmos 136:1-9"),
      day("Sede gratos", "colossenses 3:12-17"),
      day("O Senhor é grande", "salmos 145:1-13"),
      day("Todas as bênçãos espirituais", "efesios 1:3-14"),
      day("Tudo quanto tem fôlego", "salmos 150"),
    ],
  },
];
