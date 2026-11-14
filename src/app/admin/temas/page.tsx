import Link from "next/link";
import { Plus } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Badge, SectionTitle } from "@/components/ui/card";
import { Alert, EmptyState } from "@/components/ui/feedback-states";
import { adminListNeeds } from "@/services/admin";
import { formatReference } from "@/lib/bible/reference";

export const metadata = { title: "Preciso de uma palavra" };

export default async function AdminNeeds({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const list = await adminListNeeds();
  return (
    <div className="space-y-6">
      <SectionTitle
        as="h1"
        title="Preciso de uma palavra"
        action={
          <ButtonLink href="/admin/temas/novo" size="sm" icon={<Plus className="size-4" aria-hidden />}>
            Novo tema
          </ButtonLink>
        }
      />
      {sp.salvo && <Alert tone="success">Tema salvo.</Alert>}
      {sp.excluido && <Alert>Tema excluído.</Alert>}
      {list.length === 0 ? (
        <EmptyState title="Nenhum tema cadastrado" />
      ) : (
        <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
          {list.map((n) => (
            <li key={n.id}>
              <Link href={`/admin/temas/${n.id}`} className="flex items-center justify-between gap-2 px-4 py-3 hover:bg-surface-2">
                <span>
                  <span className="block font-medium text-ink">{n.label}</span>
                  <span className="block text-sm text-muted">
                    {n.title} · {formatReference(n.reference)}
                  </span>
                </span>
                <Badge tone={n.status === "published" ? "success" : "neutral"}>
                  {n.status === "published" ? "Publicado" : "Rascunho"}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
