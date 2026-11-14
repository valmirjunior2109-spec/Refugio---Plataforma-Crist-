import type { Metadata } from "next";
import { ExternalLink, Phone } from "lucide-react";
import { Container, PageHeader } from "@/components/layout/page";
import { HELP_LINES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Precisa de ajuda agora?",
  description: "Canais gratuitos de apoio emocional e de emergência no Brasil, disponíveis 24 horas.",
  alternates: { canonical: "/ajuda" },
};

export default function HelpPage() {
  return (
    <Container className="max-w-3xl">
      <PageHeader
        eyebrow="Você não está sozinho"
        title="Precisa de ajuda agora?"
        description="Se você está em sofrimento intenso, pensando em se machucar ou em perigo, procure uma pessoa agora. Pedir ajuda é um ato de coragem."
      />

      <ul className="space-y-3">
        {HELP_LINES.map((h) => (
          <li key={h.phone} className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-ink">{h.name}</p>
              <p className="text-sm text-muted">{h.description}</p>
              {h.url && (
                <a href={h.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-sm text-brand-ink underline">
                  {h.url.replace("https://", "")} <ExternalLink className="size-3.5" aria-hidden />
                </a>
              )}
            </div>
            <a
              href={`tel:${h.phone}`}
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 text-lg font-semibold text-on-primary"
              aria-label={`Ligar para ${h.name}: ${h.phone}`}
            >
              <Phone className="size-5" aria-hidden />
              {h.phone}
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-10 space-y-4 text-ink-soft">
        <h2 className="font-serif text-2xl text-ink">Outras formas de cuidado</h2>
        <p>
          Converse com alguém de confiança: um familiar, um amigo, um líder da sua igreja. Se possível, procure também um
          profissional de saúde mental. Unidades Básicas de Saúde (UBS) e Centros de Atenção Psicossocial (CAPS) oferecem
          atendimento gratuito pelo SUS.
        </p>
        <p>
          O Refúgio é um espaço de acolhimento espiritual. Ele não substitui acompanhamento psicológico, médico ou pastoral,
          nem serviços de emergência.
        </p>
        <p className="font-serif text-lg text-ink italic">Deus se importa com você, e há pessoas prontas para ajudar.</p>
      </div>
    </Container>
  );
}
