import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, Target } from "lucide-react";
import { Container } from "@/components/layout/page";
import { PlanCover } from "@/components/reading-plans/plan-cover";
import { PlanProgressPanel } from "@/components/reading-plans/plan-progress";
import { getPlanBySlug, listPlans } from "@/services/content";
import { getPlanProgress } from "@/services/personal";
import { getCurrentUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { formatReference, referenceHref } from "@/lib/bible/reference";
import { formatLongDate } from "@/lib/utils/dates";
import Link from "next/link";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await listPlans()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const plan = await getPlanBySlug((await params).slug);
  if (!plan) return { title: "Plano não encontrado" };
  return {
    title: plan.title,
    description: plan.description,
    alternates: { canonical: `/planos/${plan.slug}` },
  };
}

export default async function PlanPage({ params }: Props) {
  const { slug } = await params;
  const plan = await getPlanBySlug(slug);
  if (!plan) notFound();

  const authEnabled = isSupabaseConfigured();
  const user = authEnabled ? await getCurrentUser() : null;
  const progress = user ? await getPlanProgress(plan.id) : null;
  const doneCount = progress ? plan.days.filter((d) => progress.completed.has(d.id)).length : 0;
  const percent = plan.days.length ? Math.round((doneCount / plan.days.length) * 100) : 0;

  return (
    <Container className="max-w-4xl">
      <div className="mt-6 overflow-hidden rounded-3xl border border-line sm:mt-10">
        <div className="aspect-[16/7] sm:aspect-[16/5]">
          <PlanCover cover={plan.cover} title={`Capa do plano ${plan.title}`} />
        </div>
        <div className="bg-surface p-6 sm:p-8">
          <p className="text-xs font-semibold tracking-[0.14em] text-brand uppercase">Plano de leitura</p>
          <h1 className="mt-2 font-serif text-3xl leading-tight text-ink sm:text-4xl">{plan.title}</h1>
          <p className="mt-3 max-w-2xl text-ink-soft">{plan.description}</p>
          <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <div className="flex items-center gap-2">
              <CalendarDays className="size-4 text-brand" aria-hidden />
              <dt className="sr-only">Duração</dt>
              <dd>
                {plan.durationDays} {plan.durationDays === 1 ? "dia" : "dias"}
              </dd>
            </div>
            <div className="flex items-start gap-2">
              <Target className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
              <dt className="sr-only">Objetivo</dt>
              <dd className="max-w-md text-ink-soft">{plan.goal}</dd>
            </div>
            {progress?.startedAt && (
              <div className="text-muted">
                <dt className="inline">Iniciado em </dt>
                <dd className="inline">{formatLongDate(progress.startedAt)}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <PlanProgressPanel
        plan={{ id: plan.id, slug: plan.slug }}
        days={plan.days.map((d) => ({
          id: d.id,
          dayNumber: d.dayNumber,
          title: d.title,
          readings: d.readings.map((r) => ({ label: formatReference(r), href: referenceHref(r) })),
        }))}
        completedIds={progress ? [...progress.completed] : []}
        enrolled={progress?.enrolled ?? false}
        percent={percent}
        mode={!authEnabled || plan.id.startsWith("demo-") ? "demo" : user ? "user" : "guest"}
      />

      <p className="mt-8 text-center text-sm text-muted">
        Leia no seu tempo. Se ficar alguns dias sem ler, está tudo bem:{" "}
        <Link href="/biblia" className="underline hover:text-ink">
          a Palavra continua aqui
        </Link>
        .
      </p>
    </Container>
  );
}
