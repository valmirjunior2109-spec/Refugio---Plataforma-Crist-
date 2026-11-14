import Link from "next/link";
import { CalendarDays } from "lucide-react";
import type { ReadingPlanSummary } from "@/types/content";
import { cn } from "@/lib/utils/cn";
import { PlanCover } from "./plan-cover";

export function PlanCard({ plan, className, progress }: { plan: ReadingPlanSummary; className?: string; progress?: number }) {
  return (
    <Link
      href={`/planos/${plan.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-[box-shadow,transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-soft",
        className,
      )}
    >
      <div className="aspect-[16/9] overflow-hidden">
        <PlanCover cover={plan.cover} className="transition-transform duration-700 group-hover:scale-[1.03]" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-serif text-lg leading-snug text-ink">{plan.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{plan.description}</p>
        <p className="mt-auto flex items-center gap-1.5 pt-3 text-xs font-medium text-ink-soft">
          <CalendarDays className="size-3.5 text-brand" aria-hidden />
          {plan.durationDays} {plan.durationDays === 1 ? "dia" : "dias"}
          {progress != null && <span className="ml-auto text-brand-ink">{progress}% lido</span>}
        </p>
        {progress != null && (
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-2" aria-hidden>
            <div className="h-full rounded-full bg-brand" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
    </Link>
  );
}
