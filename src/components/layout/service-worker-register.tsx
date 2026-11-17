"use client";

import { useEffect } from "react";
import { captureInstallPrompt } from "@/lib/pwa/install-prompt";

/** Registra o service worker em produção (instalação opcional como PWA e página offline). */
export function ServiceWorkerRegister() {
  // O convite de instalação é guardado para o botão da página /instalar.
  useEffect(() => captureInstallPrompt(), []);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
      // Sem service worker o site continua funcionando normalmente.
    });
  }, []);
  return null;
}
