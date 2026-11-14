import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Container, PageHeader } from "@/components/layout/page";
import { BookPicker } from "@/components/bible/book-picker";
import { BIBLE_BOOKS, TRANSLATION } from "@/lib/bible/books";

export const metadata: Metadata = {
  title: "Bíblia",
  description: "Leia a Bíblia Sagrada completa em português (Bíblia Livre), livro por livro, capítulo por capítulo.",
  alternates: { canonical: "/biblia" },
};

const starters = [
  { href: "/biblia/salmos/23", label: "Salmos 23", note: "O Senhor é meu pastor" },
  { href: "/biblia/joao/1", label: "João 1", note: "O começo do evangelho de João" },
  { href: "/biblia/mateus/5", label: "Mateus 5", note: "O Sermão do Monte" },
  { href: "/biblia/romanos/8", label: "Romanos 8", note: "Nada nos separará do amor de Deus" },
];

export default function BiblePage() {
  return (
    <Container>
      <PageHeader
        eyebrow="Bíblia"
        title="As Escrituras, para ler com calma"
        description={
          <>
            Texto completo da {TRANSLATION.name}, uma tradução em português de uso livre.{" "}
            <Link href="/sobre#biblia" className="text-brand-ink underline">
              Sobre a tradução
            </Link>
          </>
        }
      />

      <section aria-labelledby="comecar" className="mb-12">
        <h2 id="comecar" className="mb-3 text-sm font-semibold text-ink-soft">
          Não sabe por onde começar?
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {starters.map((s) => (
            <li key={s.href}>
              <Link
                href={s.href}
                className="group flex h-full items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4 hover:border-brand/40"
              >
                <span>
                  <span className="block font-serif text-lg text-ink">{s.label}</span>
                  <span className="block text-sm text-muted">{s.note}</span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-subtle transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/planos"
          className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-brand-ink hover:underline"
        >
          <CalendarDays className="size-4" aria-hidden />
          Ou siga um plano de leitura
        </Link>
      </section>

      <BookPicker books={BIBLE_BOOKS.map(({ slug, name, testament, chapters }) => ({ slug, name, testament, chapters }))} />
    </Container>
  );
}
