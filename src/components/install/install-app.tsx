"use client";

import { useState } from "react";
import { CheckCircle2, Download, MoreVertical, PlusSquare, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInstallPrompt, type Platform } from "@/lib/pwa/install-prompt";
import { cn } from "@/lib/utils/cn";

const steps: Record<Platform, { title: string; items: React.ReactNode[] }> = {
  ios: {
    title: "No iPhone ou iPad (Safari)",
    items: [
      <>Abra este site no <strong>Safari</strong>.</>,
      <>Toque em <strong>Compartilhar</strong> <Share className="inline size-4 align-[-2px]" aria-label="ícone de compartilhar" />, na barra do navegador.</>,
      <>Escolha <strong>Adicionar à Tela de Início</strong> <PlusSquare className="inline size-4 align-[-2px]" aria-hidden />.</>,
      <>Toque em <strong>Adicionar</strong>. O ícone do Refúgio aparecerá na sua tela.</>,
    ],
  },
  android: {
    title: "No Android (Chrome)",
    items: [
      <>Abra este site no <strong>Chrome</strong>.</>,
      <>Toque no menu <MoreVertical className="inline size-4 align-[-2px]" aria-label="três pontinhos" />, no canto superior.</>,
      <>Escolha <strong>Instalar app</strong> ou <strong>Adicionar à tela inicial</strong>.</>,
      <>Confirme. O Refúgio abrirá como um aplicativo, em tela cheia.</>,
    ],
  },
  desktop: {
    title: "No computador (Chrome ou Edge)",
    items: [
      <>Abra este site no <strong>Chrome</strong> ou no <strong>Edge</strong>.</>,
      <>Clique no ícone de instalar <Download className="inline size-4 align-[-2px]" aria-hidden />, à direita da barra de endereço.</>,
      <>Confirme em <strong>Instalar</strong>.</>,
    ],
  },
};

const order: Platform[] = ["ios", "android", "desktop"];

export function InstallApp() {
  const { ready, platform, canPrompt, installed, install } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);

  const sorted = [platform, ...order.filter((p) => p !== platform)];

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-line bg-surface p-6" aria-live="polite">
        {installed ? (
          <p className="flex items-center gap-3 text-ink">
            <CheckCircle2 className="size-6 shrink-0 text-brand" aria-hidden />
            O Refúgio já está instalado neste aparelho. Que bom ter você por aqui!
          </p>
        ) : canPrompt ? (
          <div className="space-y-3">
            <p className="text-ink-soft">Seu navegador permite instalar o Refúgio com um toque.</p>
            <Button
              size="lg"
              icon={<Download className="size-5" aria-hidden />}
              onClick={async () => setDismissed((await install()) === "dismissed")}
            >
              Instalar o Refúgio
            </Button>
            {dismissed && <p className="text-sm text-muted">Tudo bem. Você pode instalar quando quiser.</p>}
          </div>
        ) : (
          <p className="text-ink-soft">
            {ready && platform === "ios"
              ? "No iPhone, a instalação é feita pelo Safari, em poucos passos:"
              : "Siga os passos abaixo para o seu aparelho. Leva menos de um minuto."}
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {sorted.map((p) => (
          <section
            key={p}
            className={cn(
              "rounded-2xl p-5",
              ready && p === platform ? "border border-brand/40 bg-brand-soft/50" : "bg-surface-2",
            )}
          >
            <h2 className="font-medium text-ink">{steps[p].title}</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-ink-soft">
              {steps[p].items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
