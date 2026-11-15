"use client";

import Link from "next/link";
import { useOptimistic, useState, useTransition } from "react";
import { BookOpen, Check, Play } from "lucide-react";
import { leavePlan, setDayDone, startPlan } from "@/actions/plans";
import { Button, buttonClasses } from "@/components/ui/button";
import { ActionStatus } from "@/components/ui/action-status";
import { Alert } from "@/components/ui/feedback-states";
import { cn } from "@/lib/utils/cn";

interface DayView {
  id: string;
  dayNumber: number;
  title: string;
  readings: { label: string; href: string }[];
}

/**
 * Lista de leituras do plano, com marcação individual de leituras concluídas.
 * mode: "user" (logado), "guest" (contas ativas, sem login) ou "demo" (sem backend).
 */
export function PlanProgressPanel({
  plan,
  days,
  completedIds,
  enrolled,
  percent,
  mode,
}: {
  plan: { id: string; slug: string };
  days: DayView[];
  completedIds: string[];
  enrolled: boolean;
  percent: number;
  mode: "user" | "guest" | "demo";
}) {
  const [pending, start] = useTransition();
  const [status, setStatus] = useState<{ message: string | null; tone: "ok" | "error" }>({ message: null, tone: "ok" });
  const [optimistic, toggle] = useOptimistic(new Set(completedIds), (state, { id, done }: { id: string; done: boolean }) => {
    const next = new Set(state);
    if (done) next.add(id);
    else next.delete(id);
    return next;
  });

  const nextDay = days.find((d) => !optimistic.has(d.id));
  const shownPercent = days.length ? Math.round((optimistic.size / days.length) * 100) : percent;

  function mark(day: DayView, done: boolean) {
    start(async () => {
      toggle({ id: day.id, done });
      const res = await setDayDone({ planId: plan.id, slug: plan.slug, dayId: day.id, done });
      if (!res.ok) setStatus({ message: res.error, tone: "error" });
    });
  }

  return (
    <section aria-labelledby="leituras" className="mt-8">
      {mode === "user" && (
        <div className="mb-6 rounded-2xl border border-line bg-surface p-5">
          {enrolled || optimistic.size > 0 ? (
            <>
              <div className="flex items-baseline justify-between text-sm">
                <span className="font-medium text-ink">Seu progresso</span>
                <span className="text-muted">
                  {optimistic.size} de {days.length} leituras
                </span>
              </div>
              <div
                className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2"
                role="progressbar"
                aria-valuenow={shownPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Progresso no plano"
              >
                <div className="h-full rounded-full bg-brand transition-[width] duration-500" style={{ width: `${shownPercent}%` }} />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {nextDay ? (
                  <a href={`#dia-${nextDay.dayNumber}`} className={buttonClasses("primary", "sm")}>
                    Continuar no dia {nextDay.dayNumber}
                  </a>
                ) : (
                  <p className="text-sm text-success">Você concluiu todas as leituras deste plano.</p>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={pending}
                  onClick={() => {
                    if (!confirm("Sair do plano? O seu progresso neste plano será apagado.")) return;
                    start(async () => {
                      const res = await leavePlan({ planId: plan.id, slug: plan.slug });
                      setStatus(res.ok ? { message: res.message ?? null, tone: "ok" } : { message: res.error, tone: "error" });
                    });
                  }}
                >
                  Sair do plano
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-ink-soft">Quer acompanhar seu progresso? Ele fica salvo só para você.</p>
              <Button
                loading={pending}
                icon={<Play className="size-4" aria-hidden />}
                onClick={() =>
                  start(async () => {
                    const res = await startPlan({ planId: plan.id, slug: plan.slug });
                    setStatus(res.ok ? { message: res.message ?? null, tone: "ok" } : { message: res.error, tone: "error" });
                  })
                }
              >
                Começar plano
              </Button>
            </div>
          )}
          <ActionStatus message={status.message} tone={status.tone} className="mt-2" />
        </div>
      )}

      {mode === "guest" && (
        <Alert className="mb-6" title="Acompanhe seu progresso">
          <Link href={`/entrar?next=/planos/${plan.slug}`}>Entre na sua conta</Link> para marcar leituras concluídas.
        </Alert>
      )}

      {mode === "demo" && (
        <Alert tone="warning" className="mb-6" title="Modo demonstração">
          As leituras podem ser lidas normalmente; marcar progresso fica disponível quando o Supabase estiver configurado.
        </Alert>
      )}

      <h2 id="leituras" className="mb-3 font-serif text-2xl text-ink">
        Leituras
      </h2>
      <ol className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
        {days.map((day) => {
          const done = optimistic.has(day.id);
          return (
            <li key={day.id} id={`dia-${day.dayNumber}`} className="flex scroll-mt-24 items-start gap-4 p-4 sm:px-5">
              {mode === "user" ? (
                <button
                  type="button"
                  onClick={() => mark(day, !done)}
                  aria-pressed={done}
                  aria-label={done ? `Desmarcar dia ${day.dayNumber}` : `Marcar dia ${day.dayNumber} como lido`}
                  className={cn(
                    "mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border text-sm font-medium transition-colors",
                    done ? "border-brand bg-brand text-white" : "border-line-strong text-muted hover:border-brand hover:text-brand",
                  )}
                >
                  {done ? <Check className="size-4" aria-hidden /> : day.dayNumber}
                </button>
              ) : (
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-surface-2 text-sm font-medium text-muted">
                  {day.dayNumber}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className={cn("font-medium", done ? "text-muted" : "text-ink")}>
                  <span className="sr-only">Dia {day.dayNumber}: </span>
                  {day.title}
                </p>
                <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                  {day.readings.map((r) => (
                    <li key={r.label}>
                      <Link href={r.href} className="inline-flex items-center gap-1 text-sm text-brand-ink hover:underline">
                        <BookOpen className="size-3.5" aria-hidden />
                        {r.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
