import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, HeartHandshake, LifeBuoy, MessageSquareHeart, Sparkles, UsersRound } from "lucide-react";
import { Container, PageHeader } from "@/components/layout/page";
import { NeedChips } from "@/components/devotionals/need-chips";
import { listNeeds } from "@/services/content";
import { SITE } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Refúgio",
  description: SITE.description,
  alternates: { canonical: "/refugio" },
};

export default async function RefugeHubPage() {
  const needs = await listNeeds();
  const cards = [
    {
      href: "/ajuda",
      icon: LifeBuoy,
      title: "Precisa de ajuda agora?",
      text: "Canais gratuitos de apoio emocional e emergência, disponíveis 24 horas.",
    },
    {
      href: "/ajude-a-crescer",
      icon: MessageSquareHeart,
      title: "Ajude o Refúgio a crescer",
      text: "Envie sugestões, ideias ou problemas encontrados. Sua opinião faz diferença.",
    },
    {
      href: "/sobre",
      icon: Sparkles,
      title: "Sobre o Refúgio",
      text: "Por que este espaço existe, como é mantido e o que nunca faremos.",
    },
  ];

  return (
    <Container>
      <PageHeader eyebrow="Refúgio" title="Um espaço de fé, esperança e acolhimento" description={SITE.description} />

      <section aria-labelledby="palavra" className="mb-14">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 id="palavra" className="font-serif text-2xl text-ink">
            Preciso de uma palavra
          </h2>
          <Link href="/preciso-de-uma-palavra" className="hidden items-center gap-1 text-sm font-medium text-brand-ink hover:underline sm:inline-flex">
            Ver todos <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <NeedChips needs={needs} />
      </section>

      <section aria-label="Mais do Refúgio" className="mb-14 grid gap-4 md:grid-cols-3">
        {cards.map(({ href, icon: Icon, title, text }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-brand/40"
          >
            <Icon className="size-6 text-brand" aria-hidden />
            <h2 className="mt-4 font-serif text-xl text-ink">{title}</h2>
            <p className="mt-1 text-sm text-muted">{text}</p>
            <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-brand-ink">
              Abrir <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </span>
          </Link>
        ))}
      </section>

      <section aria-labelledby="comunidade" className="rounded-3xl border border-dashed border-line-strong p-6 sm:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
            <UsersRound className="size-6" aria-hidden />
          </span>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.14em] text-brand uppercase">Em preparação</p>
            <h2 id="comunidade" className="mt-1 font-serif text-2xl text-ink">
              Comunidade e igrejas
            </h2>
            <p className="mt-2 text-ink-soft">
              Estamos preparando, com cuidado, um espaço para igrejas e grupos de oração: pedidos de oração compartilhados
              (sempre com seu consentimento), testemunhos, estudos e ações solidárias.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-ink-soft">
              <li className="flex gap-2">
                <HeartHandshake className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                Igrejas só serão publicadas após verificação pela equipe.
              </li>
              <li className="flex gap-2">
                <HeartHandshake className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                Todo conteúdo compartilhado terá moderação, denúncia e bloqueio.
              </li>
              <li className="flex gap-2">
                <HeartHandshake className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                Seu diário de oração continuará sempre privado.
              </li>
            </ul>
            <p className="mt-4 text-sm text-muted">
              Quer contribuir com ideias para essa etapa?{" "}
              <Link href="/ajude-a-crescer" className="font-medium text-brand-ink underline">
                Conte para nós
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </Container>
  );
}
