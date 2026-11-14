import Link from "next/link";
import { Plus } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Badge, SectionTitle } from "@/components/ui/card";
import { Alert, EmptyState } from "@/components/ui/feedback-states";
import { adminListPlans } from "@/services/admin";

export const metadata = { title: "Planos de leitura" };

export default async function AdminPlans({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const list = await adminListPlans();
  return (
    <div className="space-y-6">
      <SectionTitle
        as="h1"
        title="Planos de leitura"
        action={
          <ButtonLink href="/admin/planos/novo" size="sm" icon={<Plus className="size-4" aria-hidden />}>
            Novo plano
          </ButtonLink>
        }
      />
      {sp.salvo && <Alert tone="success">Plano salvo.</Alert>}
      {sp.excluido && <Alert>Plano excluído.</Alert>}
      {list.length === 0 ? (
        <EmptyState title="Nenhum plano cadastrado" />
      ) : (
        <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
          {list.map((p) => (
            <li key={p.id}>
              <Link href={`/admin/planos/${p.id}`} className="flex items-center justify-between gap-2 px-4 py-3 hover:bg-surface-2">
                <span>
                  <span className="block font-medium text-ink">{p.title}</span>
                  <span className="block text-sm text-muted">{p.durationDays} dias</span>
                </span>
                <Badge tone={p.status === "published" ? "success" : "neutral"}>
                  {p.status === "published" ? "Publicado" : "Rascunho"}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
