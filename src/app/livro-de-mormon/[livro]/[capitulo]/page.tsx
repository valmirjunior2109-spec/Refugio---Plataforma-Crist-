import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, ExternalLink, LayoutGrid } from "lucide-react";
import {
  BOM_SOURCE,
  chapterUrl,
  getAdjacentBomChapter,
  getBomBook,
  readerHref,
} from "@/lib/scriptures/book-of-mormon";

type Props = { params: Promise<{ livro: string; capitulo: string }> };

async function load(params: Props["params"]) {
  const { livro, capitulo } = await params;
  const book = getBomBook(livro);
  const chapter = Number(capitulo);
  if (!book || !/^\d+$/.test(capitulo) || chapter < 1 || chapter > book.chapters) return null;
  return { book, chapter };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await load(params);
  if (!data) return { title: "Capítulo não encontrado" };
  return { title: `${data.book.name} ${data.chapter} · Livro de Mórmon`, robots: { index: false } };
}

const navLink =
  "inline-flex items-center gap-1 rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-ink-soft hover:border-brand hover:text-brand-ink";

export default async function BomChapterPage({ params }: Props) {
  const data = await load(params);
  if (!data) notFound();
  const { book, chapter } = data;
  const prev = getAdjacentBomChapter(book, chapter, -1);
  const next = getAdjacentBomChapter(book, chapter, 1);
  const label = `${book.name} ${chapter}`;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col px-4 pt-4 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-2 pb-3">
        <Link
          href="/livro-de-mormon"
          className="inline-flex items-center gap-1.5 rounded-full px-2 py-1.5 text-sm text-muted hover:bg-surface-2 hover:text-ink"
        >
          <LayoutGrid className="size-4" aria-hidden />
          Livros
        </Link>
        <h1 className="font-serif text-xl text-ink sm:text-2xl">
          {book.name} <span className="text-brand">{chapter}</span>
        </h1>
        <nav aria-label="Capítulos" className="flex gap-2">
          {prev ? (
            <Link href={readerHref(prev.book.slug, prev.chapter)} className={navLink} aria-label={`Anterior: ${prev.book.name} ${prev.chapter}`}>
              <ChevronLeft className="size-4" aria-hidden />
              <span className="hidden sm:inline">Anterior</span>
            </Link>
          ) : null}
          {next ? (
            <Link href={readerHref(next.book.slug, next.chapter)} className={navLink} aria-label={`Próximo: ${next.book.name} ${next.chapter}`}>
              <span className="hidden sm:inline">Próximo</span>
              <ChevronRight className="size-4" aria-hidden />
            </Link>
          ) : null}
        </nav>
      </header>

      <iframe
        key={`${book.slug}-${chapter}`}
        src={chapterUrl(book.slug, chapter)}
        title={`Livro de Mórmon: ${label} (texto oficial)`}
        className="h-[calc(100dvh-13rem)] min-h-[28rem] w-full rounded-2xl border border-line bg-white"
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />

      <p className="flex flex-wrap items-center justify-between gap-2 py-3 text-xs text-muted">
        <span>Texto oficial exibido de {BOM_SOURCE.site}, © {BOM_SOURCE.name}.</span>
        <a
          href={chapterUrl(book.slug, chapter)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 underline hover:text-ink"
        >
          <ExternalLink className="size-3.5" aria-hidden />
          Não carregou? Abrir no site oficial
        </a>
      </p>
    </div>
  );
}
