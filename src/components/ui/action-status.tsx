"use client";

import { cn } from "@/lib/utils/cn";

/** Mensagem curta de retorno de uma ação, anunciada por leitores de tela. */
export function ActionStatus({ message, tone, className }: { message: string | null; tone: "ok" | "error"; className?: string }) {
  return (
    <p
      aria-live="polite"
      className={cn(
        "min-h-5 text-sm transition-opacity",
        message ? "opacity-100" : "opacity-0",
        tone === "error" ? "text-danger" : "text-success",
        className,
      )}
    >
      {message}
    </p>
  );
}
