import type { Metadata } from "next";
import { requirePageUser } from "@/lib/supabase/require-page-user";
import { Container, PageHeader } from "@/components/layout/page";
import { GoalsManager } from "@/components/journey/goals-manager";
import { listGoals } from "@/services/personal";

export const metadata: Metadata = { title: "Objetivos pessoais", robots: { index: false } };

export default async function GoalsPage() {
  await requirePageUser("/meu-espaco/objetivos");
  const goals = await listGoals();
  return (
    <Container className="max-w-2xl">
      <PageHeader
        back={{ href: "/meu-espaco", label: "Meu espaço" }}
        eyebrow="Meu espaço"
        title="Objetivos espirituais"
        description="Pequenos passos que você deseja dar. Sem prazos, sem pressão: só lembretes para a sua caminhada."
      />
      <GoalsManager goals={goals} />
    </Container>
  );
}
