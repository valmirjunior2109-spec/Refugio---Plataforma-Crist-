import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/layout/page";
import { InstallApp } from "@/components/install/install-app";

export const metadata: Metadata = {
  title: "Instale o app",
  description: "Tenha o Refúgio na tela inicial do seu celular ou computador, como um aplicativo. Gratuito e sem loja de apps.",
  alternates: { canonical: "/instalar" },
};

export default function InstallPage() {
  return (
    <Container className="max-w-4xl">
      <PageHeader
        eyebrow="Aplicativo"
        title="Leve o Refúgio com você"
        description="Instale o Refúgio na tela inicial do celular ou do computador. Ele abre como um aplicativo, ocupa pouco espaço e não precisa de loja de apps."
      />
      <InstallApp />
    </Container>
  );
}
