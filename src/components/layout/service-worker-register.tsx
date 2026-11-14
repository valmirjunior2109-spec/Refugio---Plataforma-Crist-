"use client";

import { useEffect } from "react";

/** Registra o service worker em produção (instalação opcional como PWA e página offline). */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
      // Sem service worker o site continua funcionando normalmente.
    });
  }, []);
  return null;
}
