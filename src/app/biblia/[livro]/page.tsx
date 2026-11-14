import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, PageHeader } from "@/components/layout/page";
import { BIBLE_BOOKS, getBookBySlug } from "@/lib/bible/books";

type Props = { params: Promise<{ livro: string }> };

export function generateStaticParams() {
  return BIBLE_BOOKS.map((b) => ({ livro: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const book = getBookBySlug((await params).livro);
  if (!book) return { title: "Livro não encontrado" };
  return {
    title: `${book.name}: capítulos`,
    description: `Leia o livro de ${book.name} (${book.chapters} capítulos) na Bíblia Livre.`,
    alternates: { canonical: `/biblia/${book.slug}` },
  };
}

export default async function BookPage({ params }: Props) {
  const book = getBookBySlug((await params).livro);
  if (!book) notFound();
  return (
    <Container className="max-w-4xl">
      <PageHeader
        back={{ href: "/biblia", label: "Todos os livros" }}
        eyebrow={book.testament === "AT" ? "Antigo Testamento" : "Novo Testamento"}
        title={book.name}
        description={`${book.chapters} ${book.chapters === 1 ? "capítulo" : "capítulos"}. Escolha por onde começar.`}
      />
      <nav aria-label={`Capítulos de ${book.name}`}>
        <ul className="grid grid-cols-5 gap-2 sm:grid-cols-8 lg:grid-cols-10">
          {Array.from({ length: book.chapters }, (_, i) => i + 1).map((c) => (
            <li key={c}>
              <Link
                href={`/biblia/${book.slug}/${c}`}
                className="grid aspect-square place-items-center rounded-xl border border-line bg-surface font-medium text-ink-soft tabular-nums hover:border-brand hover:bg-brand-soft hover:text-brand-ink"
                aria-label={`${book.name}, capítulo ${c}`}
              >
                {c}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Container>
  );
}
