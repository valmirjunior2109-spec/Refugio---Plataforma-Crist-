"use client";

import { useEffect, useState } from "react";

/** Evento não padronizado do Chrome/Edge/Android que permite abrir o diálogo de instalação. */
export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let deferred: BeforeInstallPromptEvent | null = null;
let installed = false;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

/**
 * Captura o convite de instalação assim que o navegador o oferece. Precisa rodar
 * cedo (no layout), porque o evento dispara uma vez só, logo ao abrir o site.
 */
export function captureInstallPrompt(): () => void {
  const onPrompt = (e: Event) => {
    e.preventDefault();
    deferred = e as BeforeInstallPromptEvent;
    notify();
  };
  const onInstalled = () => {
    deferred = null;
    installed = true;
    notify();
  };
  window.addEventListener("beforeinstallprompt", onPrompt);
  window.addEventListener("appinstalled", onInstalled);
  return () => {
    window.removeEventListener("beforeinstallprompt", onPrompt);
    window.removeEventListener("appinstalled", onInstalled);
  };
}

export type Platform = "ios" | "android" | "desktop";

export function detectPlatform(ua: string): Platform {
  if (/iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && /mobile/i.test(ua))) return "ios";
  if (/android/i.test(ua)) return "android";
  return "desktop";
}

function isStandalone(): boolean {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export interface InstallState {
  ready: boolean;
  platform: Platform;
  canPrompt: boolean;
  installed: boolean;
  install: () => Promise<"accepted" | "dismissed" | "unavailable">;
}

export function useInstallPrompt(): InstallState {
  const [, force] = useState(0);
  const [env, setEnv] = useState<{ ready: boolean; platform: Platform; standalone: boolean }>({
    ready: false,
    platform: "desktop",
    standalone: false,
  });

  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    setEnv({ ready: true, platform: detectPlatform(navigator.userAgent), standalone: isStandalone() });
    return () => {
      listeners.delete(l);
    };
  }, []);

  return {
    ready: env.ready,
    platform: env.platform,
    canPrompt: deferred !== null,
    installed: installed || env.standalone,
    install: async () => {
      if (!deferred) return "unavailable";
      const event = deferred;
      await event.prompt();
      const { outcome } = await event.userChoice;
      deferred = null;
      notify();
      return outcome;
    },
  };
}
