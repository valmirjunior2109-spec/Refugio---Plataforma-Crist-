import Link from "next/link";
import { Lock } from "lucide-react";
import { SectionTitle } from "@/components/ui/card";
import { adminCounts } from "@/services/admin";

export default async function AdminHome() {
  const c = await adminCounts();
  const stats = [
    { label: "Palavras do dia", value: c.devotionals, href: "/admin/palavras" },
    { label: "Temas", value: c.needs, href: "/admin/temas" },
    { label: "Planos", value: c.plans, href: "/admin/planos" },
    { label: "Versículos", value: c.verses, href: "/admin/versiculos" },
    { label: "Feedbacks novos", value: c.feedbackNew, href: "/admin/feedbacks?status=novo" },
  ];
  return (
    <div className="space-y-8">
      <SectionTitle as="h1" title="Visão geral" description="Gerencie o conteúdo público do Refúgio." />
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {stats.map((s) => (
          <li key={s.label}>
            <Link href={s.href} className="block rounded-2xl border border-line bg-surface p-4 hover:border-brand/40">
              <span className="block font-serif text-3xl text-ink tabular-nums">{s.value}</span>
              <span className="text-sm text-muted">{s.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="flex items-start gap-2 rounded-2xl bg-surface-2 p-4 text-sm text-ink-soft">
        <Lock className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
        Diários de oração, versículos salvos e progresso pessoal não são acessíveis pelo painel: as regras de segurança
        do banco permitem a leitura apenas pelo próprio usuário.
      </p>
    </div>
  );
}
