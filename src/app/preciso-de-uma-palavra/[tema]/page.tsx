import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, HandHeart, Sunrise } from "lucide-react";
import { Container, PageHeader } from "@/components/layout/page";
import { PassageBlock } from "@/components/bible/passage-block";
import { CareNotice } from "@/components/layout/care-notice";
import { FavoriteButton } from "@/components/devotionals/favorite-button";
import { NEED_ICONS } from "@/components/devotionals/need-chips";
import { Prose } from "@/components/ui/prose";
import { getNeed, listNeeds } from "@/services/content";
import { formatReference, referenceHref } from "@/lib/bible/reference";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const revalidate = 300;

type Props = { params: Promise<{ tema: string }> };

export async function generateStaticParams() {
  return (await listNeeds()).map((n) => ({ tema: n.topic }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tema } = await params;
  const need = await getNeed(tema);
  if (!need) return { title: "Palavra não encontrada" };
  return {
    title: `${need.label}: ${need.title}`,
    description: `${formatReference(need.reference)}. ${need.hope.slice(0, 140)}`,
    alternates: { canonical: `/preciso-de-uma-palavra/${need.topic}` },
  };
}

export default async function NeedPage({ params }: Props) {
  const { tema } = await params;
  const [need, all] = await Promise.all([getNeed(tema), listNeeds()]);
  if (!need) notFound();
  const Icon = NEED_ICONS[need.topic];
  const path = `/preciso-de-uma-palavra/${need.topic}`;
  const others = all.filter((n) => n.topic !== need.topic).slice(0, 4);

  return (
    <Container className="max-w-3xl">
      <PageHeader
        back={{ href: "/preciso-de-uma-palavra", label: "Escolher outro sentimento" }}
        eyebrow={need.label}
        title={need.title}
      />

      <article className="space-y-10">
        <section className="relative rounded-3xl border border-line bg-surface p-6 sm:p-10">
          {Icon && <Icon className="absolute top-6 right-6 size-6 text-brand/40" aria-hidden />}
          <PassageBlock reference={need.reference} path={path} />
        </section>

        {need.context && (
          <section aria-labelledby="contexto">
            <h2 id="contexto" className="mb-2 text-xs font-semibold tracking-[0.14em] text-brand uppercase">
              Sobre esta passagem
            </h2>
            <p className="text-ink-soft">{need.context}</p>
          </section>
        )}

        <section aria-labelledby="reflexao">
          <h2 id="reflexao" className="mb-3 font-serif text-2xl text-ink">
            Uma reflexão para você
          </h2>
          <Prose text={need.reflection} />
        </section>

        {need.hope && (
          <section aria-labelledby="esperanca" className="rounded-2xl bg-brand-soft p-6">
            <h2 id="esperanca" className="flex items-center gap-2 font-medium text-brand-ink">
              <Sunrise className="size-5" aria-hidden /> Uma palavra de esperança
            </h2>
            <p className="mt-2 text-ink-soft">{need.hope}</p>
          </section>
        )}

        {need.prayer && (
          <section aria-labelledby="oracao" className="rounded-2xl border border-line bg-surface p-6">
            <h2 id="oracao" className="flex items-center gap-2 font-medium text-brand-ink">
              <HandHeart className="size-5" aria-hidden /> Se quiser, ore assim
            </h2>
            <p className="mt-2 font-serif text-[1.1rem] leading-relaxed text-ink-soft italic">{need.prayer}</p>
          </section>
        )}

        {need.furtherReadings.length > 0 && (
          <section aria-labelledby="leituras">
            <h2 id="leituras" className="mb-3 font-serif text-xl text-ink">
              Para continuar lendo
            </h2>
            <ul className="flex flex-wrap gap-2">
              {need.furtherReadings.map((r) => (
                <li key={formatReference(r)}>
                  <Link
                    href={referenceHref(r)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2 text-sm text-ink-soft hover:border-brand/50 hover:text-brand-ink"
                  >
                    <BookOpen className="size-4 text-brand" aria-hidden />
                    {formatReference(r)}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {!need.id.startsWith("demo-") && (
          <FavoriteButton kind="need" targetId={need.id} path={path} authEnabled={isSupabaseConfigured()} />
        )}

        <CareNotice />

        {others.length > 0 && (
          <nav aria-label="Outros sentimentos" className="border-t border-line pt-6">
            <p className="mb-3 text-sm text-muted">Talvez você também precise de:</p>
            <ul className="flex flex-wrap gap-2">
              {others.map((n) => (
                <li key={n.topic}>
                  <Link
                    href={`/preciso-de-uma-palavra/${n.topic}`}
                    className="inline-block rounded-full bg-surface-2 px-4 py-2 text-sm text-ink-soft hover:bg-brand-soft hover:text-brand-ink"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </article>
    </Container>
  );
}
