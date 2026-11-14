import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/layout/page";
import { FeedbackForm } from "@/components/feedback/feedback-form";
import { Alert } from "@/components/ui/feedback-states";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Ajude o Refúgio a crescer",
  description: "Envie sugestões, críticas construtivas, problemas encontrados e ideias. Não é preciso ter conta.",
  alternates: { canonical: "/ajude-a-crescer" },
};

export default function FeedbackPage() {
  const configured = isSupabaseConfigured();
  return (
    <Container className="max-w-2xl">
      <PageHeader
        eyebrow="Participe"
        title="Ajude o Refúgio a crescer"
        description="O Refúgio está sendo construído com carinho e dedicação. Sua opinião pode ajudar este espaço a acolher ainda mais pessoas."
      />
      {!configured && (
        <Alert tone="warning" title="Modo demonstração" className="mb-6">
          O envio fica disponível quando o Supabase estiver configurado. Nada do que for escrito aqui seria enviado.
        </Alert>
      )}
      <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
        <FeedbackForm disabled={!configured} />
      </div>
    </Container>
  );
}
