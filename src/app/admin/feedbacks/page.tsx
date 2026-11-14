import Link from "next/link";
import { Star } from "lucide-react";
import { Badge, SectionTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/feedback-states";
import { FeedbackStatusSelect } from "@/components/admin/feedback-status-select";
import { adminListFeedbacks } from "@/services/admin";
import { FEEDBACK_KINDS, FEEDBACK_STATUSES } from "@/lib/validations/feedback";
import { formatDateTime } from "@/lib/utils/dates";
import { cn } from "@/lib/utils/cn";

export const metadata = { title: "Feedbacks" };

export default async function AdminFeedbacks({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const valid = FEEDBACK_STATUSES.some(([v]) => v === status) ? status : undefined;
  const list = await adminListFeedbacks(valid);
  const kindLabel = (k: string) => FEEDBACK_KINDS.find((x) => x.value === k)?.label ?? k;

  return (
    <div className="space-y-6">
      <SectionTitle as="h1" title="Feedbacks" description="Mensagens enviadas em “Ajude o Refúgio a crescer”. Nunca são publicadas." />
      <nav aria-label="Filtrar por status" className="flex flex-wrap gap-2">
        {[["", "Todos"], ...FEEDBACK_STATUSES].map(([v, l]) => (
          <Link
            key={v}
            href={v ? `/admin/feedbacks?status=${v}` : "/admin/feedbacks"}
            aria-current={(valid ?? "") === v ? "page" : undefined}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm",
              (valid ?? "") === v ? "bg-brand-soft font-medium text-brand-ink" : "bg-surface-2 text-ink-soft hover:text-ink",
            )}
          >
            {l}
          </Link>
        ))}
      </nav>
      {list.length === 0 ? (
        <EmptyState title="Nenhum feedback aqui" />
      ) : (
        <ul className="space-y-3">
          {list.map((f) => (
            <li key={f.id} className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <Badge tone="brand">{kindLabel(f.kind)}</Badge>
                  <span className="text-muted">{formatDateTime(f.createdAt)}</span>
                  {f.rating && (
                    <span className="inline-flex items-center gap-0.5 text-brand" aria-label={`Avaliação ${f.rating} de 5`}>
                      {Array.from({ length: f.rating }, (_, i) => (
                        <Star key={i} className="size-3.5 fill-current" aria-hidden />
                      ))}
                    </span>
                  )}
                </div>
                <FeedbackStatusSelect id={f.id} status={f.status} />
              </div>
              <p className="mt-3 whitespace-pre-line text-ink-soft">{f.message}</p>
              {f.contactEmail && (
                <p className="mt-2 text-sm text-muted">
                  Resposta para: <a href={`mailto:${f.contactEmail}`} className="text-brand-ink underline">{f.contactEmail}</a>
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
