import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, HandHeart, Lightbulb, MessageCircleHeart } from "lucide-react";
import { Container, PageHeader } from "@/components/layout/page";
import { PassageBlock } from "@/components/bible/passage-block";
import { FavoriteButton } from "@/components/devotionals/favorite-button";
import { Prose } from "@/components/ui/prose";
import { getDevotionalBySlug, listDevotionalHistory } from "@/services/content";
import { formatReference } from "@/lib/bible/reference";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { formatLongDate } from "@/lib/utils/dates";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const d = await getDevotionalBySlug(slug);
  if (!d) return { title: "Palavra não encontrada" };
  const description = `${formatReference(d.reference)}: ${d.reflection.split("\n")[0]!.slice(0, 150)}`;
  return {
    title: d.title,
    description,
    alternates: { canonical: `/palavra-do-dia/${d.slug}` },
    openGraph: { type: "article", title: d.title, description, publishedTime: d.publishDate },
  };
}

export default async function DevotionalPage({ params }: Props) {
  const { slug } = await params;
  const [devotional, history] = await Promise.all([getDevotionalBySlug(slug), listDevotionalHistory()]);
  if (!devotional) notFound();

  const idx = history.findIndex((d) => d.id === devotional.id);
  const newer = idx > 0 ? history[idx - 1] : null;
  const older = idx >= 0 && idx < history.length - 1 ? history[idx + 1] : null;
  const path = `/palavra-do-dia/${devotional.slug}`;

  return (
    <Container className="max-w-3xl">
      <PageHeader
        back={{ href: "/palavra-do-dia", label: "Palavra do dia" }}
        eyebrow={formatLongDate(devotional.publishDate)}
        title={devotional.title}
      />

      <article className="space-y-10">
        <section className="rounded-3xl border border-line bg-surface p-6 sm:p-10">
          <PassageBlock reference={devotional.reference} path={path} />
        </section>

        <section aria-labelledby="reflexao">
          <h2 id="reflexao" className="mb-3 font-serif text-2xl text-ink">
            Reflexão
          </h2>
          <Prose text={devotional.reflection} />
        </section>

        <div className="grid gap-4 sm:grid-cols-2">
          <section aria-labelledby="aplicacao" className="rounded-2xl bg-brand-soft p-6">
            <h2 id="aplicacao" className="flex items-center gap-2 font-medium text-brand-ink">
              <Lightbulb className="size-5" aria-hidden />
              Para viver hoje
            </h2>
            <p className="mt-2 text-ink-soft">{devotional.application}</p>
          </section>
          <section aria-labelledby="oracao" className="rounded-2xl border border-line bg-surface p-6">
            <h2 id="oracao" className="flex items-center gap-2 font-medium text-brand-ink">
              <HandHeart className="size-5" aria-hidden />
              Uma oração
            </h2>
            <p className="mt-2 font-serif text-[1.1rem] leading-relaxed text-ink-soft italic">{devotional.prayer}</p>
          </section>
        </div>

        <div className="flex flex-wrap items-start gap-3">
          {!devotional.id.startsWith("demo-") && (
            <FavoriteButton kind="devotional" targetId={devotional.id} path={path} authEnabled={isSupabaseConfigured()} />
          )}
          <Link
            href="/oracoes/nova"
            className="inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium text-ink-soft hover:bg-surface-2"
          >
            <MessageCircleHeart className="size-4" aria-hidden />
            Escrever no meu diário
          </Link>
        </div>

        <nav aria-label="Outras palavras" className="grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
          {older ? (
            <Link href={`/palavra-do-dia/${older.slug}`} className="group rounded-2xl p-3 hover:bg-surface-2">
              <span className="flex items-center gap-1 text-xs text-muted">
                <ChevronLeft className="size-3.5" aria-hidden /> Anterior
              </span>
              <span className="mt-1 block font-serif text-ink group-hover:text-brand-ink">{older.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {newer && (
            <Link href={`/palavra-do-dia/${newer.slug}`} className="group rounded-2xl p-3 text-right hover:bg-surface-2">
              <span className="flex items-center justify-end gap-1 text-xs text-muted">
                Seguinte <ChevronRight className="size-3.5" aria-hidden />
              </span>
              <span className="mt-1 block font-serif text-ink group-hover:text-brand-ink">{newer.title}</span>
            </Link>
          )}
        </nav>
      </article>
    </Container>
  );
}
