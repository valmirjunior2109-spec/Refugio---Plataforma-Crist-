import { Compass } from "lucide-react";
import { Container } from "@/components/layout/page";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/feedback-states";

export default function NotFound() {
  return (
    <Container className="max-w-xl py-16">
      <EmptyState
        icon={<Compass className="size-5" aria-hidden />}
        title="Não encontramos esta página"
        description="O endereço pode ter mudado ou o conteúdo não está mais disponível. Que tal recomeçar pelo início?"
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <ButtonLink href="/">Ir para o início</ButtonLink>
            <ButtonLink href="/biblia" variant="secondary">
              Abrir a Bíblia
            </ButtonLink>
          </div>
        }
      />
    </Container>
  );
}
