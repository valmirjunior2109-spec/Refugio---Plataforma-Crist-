import Link from "next/link";
import { Plus } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Badge, SectionTitle } from "@/components/ui/card";
import { Alert, EmptyState } from "@/components/ui/feedback-states";
import { adminListDevotionals } from "@/services/admin";
import { formatReference } from "@/lib/bible/reference";
import { formatLongDate, isoDate } from "@/lib/utils/dates";

export const metadata = { title: "Palavras do dia" };

export default async function AdminDevotionals({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const list = await adminListDevotionals();
  const today = isoDate();
  return (
    <div className="space-y-6">
      <SectionTitle
        as="h1"
        title="Palavras do dia"
        action={
          <ButtonLink href="/admin/palavras/nova" size="sm" icon={<Plus className="size-4" aria-hidden />}>
            Nova
          </ButtonLink>
        }
      />
      {sp.salvo && <Alert tone="success">Palavra salva.</Alert>}
      {sp.excluido && <Alert>Palavra excluída.</Alert>}
      {list.length === 0 ? (
        <EmptyState title="Nenhuma palavra cadastrada" action={<ButtonLink href="/admin/palavras/nova">Criar a primeira</ButtonLink>} />
      ) : (
        <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
          {list.map((d) => (
            <li key={d.id}>
              <Link href={`/admin/palavras/${d.id}`} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 hover:bg-surface-2">
                <span className="min-w-0">
                  <span className="block font-medium text-ink">{d.title}</span>
                  <span className="block text-sm text-muted">
                    {formatReference(d.reference)} · {formatLongDate(d.publishDate)}
                  </span>
                </span>
                {d.status === "draft" ? (
                  <Badge>Rascunho</Badge>
                ) : d.publishDate > today ? (
                  <Badge tone="warning">Agendada</Badge>
                ) : (
                  <Badge tone="success">Publicada</Badge>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
