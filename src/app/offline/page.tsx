import type { Metadata } from "next";
import { WifiOff } from "lucide-react";
import { Container } from "@/components/layout/page";
import { EmptyState } from "@/components/ui/feedback-states";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "Sem conexão", robots: { index: false } };

export default function OfflinePage() {
  return (
    <Container className="max-w-xl py-16">
      <EmptyState
        icon={<WifiOff className="size-5" aria-hidden />}
        title="Você está sem conexão"
        description={
          <>
            <p>Algumas páginas que você já visitou continuam disponíveis. Quando a internet voltar, é só tentar de novo.</p>
            <p className="mt-4 font-serif text-base text-ink italic">
              “Ficai quietos, e sabei que eu sou Deus.” Salmos 46:10 (BLIVRE)
            </p>
          </>
        }
        action={<ButtonLink href="/">Tentar novamente</ButtonLink>}
      />
    </Container>
  );
}
