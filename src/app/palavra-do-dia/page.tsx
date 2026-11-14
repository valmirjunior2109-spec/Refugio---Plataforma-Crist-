import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Container, PageHeader } from "@/components/layout/page";
import { EmptyState } from "@/components/ui/feedback-states";
import { ButtonLink } from "@/components/ui/button";
import { listDevotionalHistory } from "@/services/content";
import { formatReference } from "@/lib/bible/reference";
import { formatLongDate } from "@/lib/utils/dates";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Palavra do dia",
  description: "Uma passagem bíblica e uma reflexão para cada dia. Consulte também as palavras anteriores.",
  alternates: { canonical: "/palavra-do-dia" },
};

const PAGE_SIZE = 20;

export default async function DevotionalHistoryPage({ searchParams }: { searchParams: Promise<{ pagina?: string }> }) {
  const { pagina } = await searchParams;
  const page = Math.max(1, Number.parseInt(pagina ?? "1", 10) || 1);
  const all = await listDevotionalHistory();
  const items = all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasMore = all.length > page * PAGE_SIZE;
  const [today, ...rest] = page === 1 ? items : [null, ...items];

  return (
    <Container className="max-w-3xl">
      <PageHeader
        eyebrow="Palavra do dia"
        title="Uma palavra para cada dia"
        description="Uma passagem das Escrituras, uma reflexão e uma oração. Leia com calma; volte quando quiser."
      />

      {all.length === 0 ? (
        <EmptyState
          icon={<CalendarDays className="size-5" aria-hidden />}
          title="Ainda não há palavras publicadas"
          description="Em breve, a primeira Palavra do dia estará aqui."
          action={<ButtonLink href="/biblia">Ler a Bíblia</ButtonLink>}
        />
      ) : (
        <div className="space-y-8">
          {today && (
            <Link
              href={`/palavra-do-dia/${today.slug}`}
              className="group block rounded-3xl bg-[#34463B] p-6 text-[#F7F5EF] transition-transform hover:-translate-y-0.5 sm:p-8"
            >
              <p className="text-xs font-semibold tracking-[0.14em] text-[#A9C0B0] uppercase">Mais recente</p>
              <h2 className="mt-2 font-serif text-2xl sm:text-3xl">{today.title}</h2>
              <p className="mt-1 text-sm text-[#E9E4D7]/80">
                {formatReference(today.reference)} · {formatLongDate(today.publishDate)}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium">
                Ler agora <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </span>
            </Link>
          )}

          {rest.length > 0 && (
            <section aria-labelledby="anteriores">
              <h2 id="anteriores" className="mb-3 font-serif text-xl text-ink">
                Palavras anteriores
              </h2>
              <ol className="divide-y divide-line rounded-2xl border border-line bg-surface">
                {rest.map((d) =>
                  d ? (
                    <li key={d.id}>
                      <Link
                        href={`/palavra-do-dia/${d.slug}`}
                        className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-surface-2"
                      >
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-ink">{d.title}</span>
                          <span className="block text-sm text-muted">
                            {formatReference(d.reference)} · {formatLongDate(d.publishDate)}
                          </span>
                        </span>
                        <ArrowRight className="size-4 shrink-0 text-subtle" aria-hidden />
                      </Link>
                    </li>
                  ) : null,
                )}
              </ol>
            </section>
          )}

          {(page > 1 || hasMore) && (
            <nav aria-label="Paginação" className="flex justify-between">
              {page > 1 ? (
                <ButtonLink href={`/palavra-do-dia?pagina=${page - 1}`} variant="secondary" size="sm">
                  Mais recentes
                </ButtonLink>
              ) : (
                <span />
              )}
              {hasMore && (
                <ButtonLink href={`/palavra-do-dia?pagina=${page + 1}`} variant="secondary" size="sm">
                  Mais antigas
                </ButtonLink>
              )}
            </nav>
          )}
        </div>
      )}
    </Container>
  );
}
