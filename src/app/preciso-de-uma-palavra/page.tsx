import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/layout/page";
import { NeedChips } from "@/components/devotionals/need-chips";
import { CareNotice } from "@/components/layout/care-notice";
import { EmptyState } from "@/components/ui/feedback-states";
import { listNeeds } from "@/services/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Preciso de uma palavra",
  description:
    "Está triste, ansioso, com medo ou querendo agradecer? Escolha o que sente e receba uma passagem bíblica, uma reflexão e uma oração.",
  alternates: { canonical: "/preciso-de-uma-palavra" },
};

export default async function NeedsPage() {
  const needs = await listNeeds();
  return (
    <Container className="max-w-4xl">
      <PageHeader
        eyebrow="Preciso de uma palavra"
        title="Como está o seu coração hoje?"
        description="Escolha o que mais se aproxima do que você sente. Não há resposta certa: este é um espaço seguro."
      />
      {needs.length ? (
        <NeedChips needs={needs} className="sm:grid-cols-2 lg:grid-cols-2" />
      ) : (
        <EmptyState title="Conteúdo em preparação" description="Em breve, palavras para cada momento estarão aqui." />
      )}
      <div className="mt-10">
        <CareNotice />
      </div>
    </Container>
  );
}
