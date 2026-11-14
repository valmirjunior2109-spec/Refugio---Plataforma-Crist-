"use client";

import { useEffect } from "react";
import { CloudOff } from "lucide-react";
import { Container } from "@/components/layout/page";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/feedback-states";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="max-w-xl py-16">
      <EmptyState
        icon={<CloudOff className="size-5" aria-hidden />}
        title="Algo não saiu como esperado"
        description="Não conseguimos carregar esta parte agora. Tente novamente em instantes."
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <Button onClick={reset}>Tentar novamente</Button>
            <ButtonLink href="/" variant="secondary">
              Ir para o início
            </ButtonLink>
          </div>
        }
      />
    </Container>
  );
}
