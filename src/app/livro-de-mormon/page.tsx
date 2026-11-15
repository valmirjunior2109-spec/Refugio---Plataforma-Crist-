import type { Metadata } from "next";
import { ExternalLink, Info } from "lucide-react";
import { Container, PageHeader } from "@/components/layout/page";
import Link from "next/link";
import { BOM_SOURCE, BOOK_OF_MORMON, readerHref } from "@/lib/scriptures/book-of-mormon";

export const metadata: Metadata = {
  title: "Livro de Mórmon",
  description: "Índice dos livros e capítulos do Livro de Mórmon, com leitura do texto oficial.",
  robots: { index: false },
};

export default function BookOfMormonPage() {
  return (
    <Container className="max-w-4xl">
      <PageHeader
        back={{ href: "/biblia", label: "Bíblia" }}
        eyebrow="Escrituras"
        title="Livro de Mórmon"
        description="Escolha um livro e um capítulo para ler."
      />

      <aside className="mb-10 flex gap-3 rounded-2xl bg-brand-soft p-4 text-sm text-ink-soft">
        <Info className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
        <p>
          O texto em português do Livro de Mórmon pertence a {BOM_SOURCE.name} e é protegido por direitos autorais. Por
          isso, cada capítulo é lido aqui mesmo, mas exibido diretamente do site oficial ({BOM_SOURCE.site}). O Refúgio
          não copia nem altera o texto.
        </p>
      </aside>

      <div className="space-y-8">
        {BOOK_OF_MORMON.map((book) => (
          <section key={book.slug} aria-labelledby={`livro-${book.slug}`}>
            <h2 id={`livro-${book.slug}`} className="mb-3 flex items-baseline justify-between font-serif text-xl text-ink">
              {book.name}
              <span className="font-sans text-xs text-muted">
                {book.chapters} {book.chapters === 1 ? "capítulo" : "capítulos"}
              </span>
            </h2>
            <ul className="grid grid-cols-5 gap-2 sm:grid-cols-8 lg:grid-cols-10">
              {Array.from({ length: book.chapters }, (_, i) => i + 1).map((c) => (
                <li key={c}>
                  <Link
                    href={readerHref(book.slug, c)}
                    aria-label={`${book.name}, capítulo ${c}`}
                    className="grid aspect-square place-items-center rounded-xl border border-line bg-surface font-medium text-ink-soft tabular-nums hover:border-brand hover:bg-brand-soft hover:text-brand-ink"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-10 flex items-center gap-1.5 text-sm text-muted">
        <ExternalLink className="size-4" aria-hidden />
        <a href={BOM_SOURCE.indexUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-ink">
          Abrir o índice completo no site oficial
        </a>
      </p>
    </Container>
  );
}
