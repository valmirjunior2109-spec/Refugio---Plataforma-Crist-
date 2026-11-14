import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import { Container } from "@/components/layout/page";
import { ScriptureText } from "@/components/bible/scripture-text";
import { ChapterVerseTools } from "@/components/bible/chapter-verse-tools";
import { getAdjacentChapter, getBookBySlug, TRANSLATION } from "@/lib/bible/books";
import { getChapter } from "@/lib/bible/text";
import { plainScripture } from "@/lib/bible/format";
import { isSupabaseConfigured } from "@/lib/supabase/env";

// Capítulos são gerados sob demanda e mantidos em cache (o texto não muda).
export const dynamicParams = true;
export const revalidate = false;
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ livro: string; capitulo: string }> };

async function load(params: Props["params"]) {
  const { livro, capitulo } = await params;
  const book = getBookBySlug(livro);
  const chapter = Number(capitulo);
  if (!book || !/^\d+$/.test(capitulo) || chapter < 1 || chapter > book.chapters) return null;
  const verses = await getChapter(book.slug, chapter);
  return verses ? { book, chapter, verses } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await load(params);
  if (!data) return { title: "Capítulo não encontrado" };
  const title = `${data.book.name} ${data.chapter}`;
  return {
    title,
    description: plainScripture(data.verses.slice(0, 2).map((v) => v.text).join(" ")).slice(0, 160),
    alternates: { canonical: `/biblia/${data.book.slug}/${data.chapter}` },
  };
}

export default async function ChapterPage({ params }: Props) {
  const data = await load(params);
  if (!data) notFound();
  const { book, chapter, verses } = data;
  const prev = getAdjacentChapter(book, chapter, -1);
  const next = getAdjacentChapter(book, chapter, 1);
  const path = `/biblia/${book.slug}/${chapter}`;

  return (
    <Container className="max-w-2xl">
      <header className="flex items-center justify-between gap-3 pt-6 pb-8 sm:pt-10">
        <Link
          href={`/biblia/${book.slug}`}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted hover:bg-surface-2 hover:text-ink"
        >
          <LayoutGrid className="size-4" aria-hidden />
          Capítulos
        </Link>
        <span className="text-xs text-muted">{TRANSLATION.name}</span>
      </header>

      <article>
        <h1 className="mb-8 text-center font-serif text-[2.2rem] leading-tight text-ink sm:text-5xl">
          {book.name} <span className="text-brand">{chapter}</span>
        </h1>

        <div className="scripture font-serif text-[1.2rem] leading-[1.9] text-ink sm:text-[1.28rem]">
          {verses.map((v) => (
            <span key={v.number} id={`v${v.number}`} className="verse scroll-mt-24">
              <sup className="mr-1 ml-0.5 font-sans text-[0.6em] font-semibold text-brand select-none">{v.number}</sup>
              <ScriptureText text={v.text} />{" "}
            </span>
          ))}
        </div>

        <ChapterVerseTools
          bookSlug={book.slug}
          bookName={book.name}
          chapter={chapter}
          verses={verses.map((v) => ({ number: v.number, text: plainScripture(v.text) }))}
          path={path}
          authEnabled={isSupabaseConfigured()}
        />
      </article>

      <nav aria-label="Navegação entre capítulos" className="mt-12 grid grid-cols-2 gap-3 border-t border-line pt-6">
        {prev ? (
          <Link
            href={`/biblia/${prev.book.slug}/${prev.chapter}`}
            rel="prev"
            className="flex items-center gap-2 rounded-2xl p-3 text-sm text-ink-soft hover:bg-surface-2"
          >
            <ChevronLeft className="size-4 shrink-0" aria-hidden />
            <span>
              <span className="block text-xs text-muted">Anterior</span>
              {prev.book.name} {prev.chapter}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={`/biblia/${next.book.slug}/${next.chapter}`}
            rel="next"
            className="flex items-center justify-end gap-2 rounded-2xl p-3 text-right text-sm text-ink-soft hover:bg-surface-2"
          >
            <span>
              <span className="block text-xs text-muted">Próximo</span>
              {next.book.name} {next.chapter}
            </span>
            <ChevronRight className="size-4 shrink-0" aria-hidden />
          </Link>
        )}
      </nav>
    </Container>
  );
}
