import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";
import { Container, PageHeader } from "@/components/layout/page";
import { PlanCard } from "@/components/reading-plans/plan-card";
import { EmptyState } from "@/components/ui/feedback-states";
import { listPlans } from "@/services/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Planos de leitura",
  description:
    "Jornadas pela Bíblia para ler no seu ritmo: esperança, Salmos, Provérbios, a vida de Jesus, o Novo Testamento e mais.",
  alternates: { canonical: "/planos" },
};

export default async function PlansPage() {
  const plans = await listPlans();
  return (
    <Container>
      <PageHeader
        eyebrow="Planos de leitura"
        title="Jornadas pelas Escrituras"
        description="Escolha um caminho e leia no seu ritmo. Sem pressa, sem comparação e sem cobranças: se pausar, é só continuar de onde parou."
      />
      {plans.length ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((p) => (
            <li key={p.id}>
              <PlanCard plan={p} className="h-full" />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={<CalendarDays className="size-5" aria-hidden />}
          title="Nenhum plano publicado ainda"
          description="Em breve, novas jornadas de leitura estarão disponíveis."
        />
      )}
    </Container>
  );
}
