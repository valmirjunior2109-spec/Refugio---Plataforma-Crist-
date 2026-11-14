"use client";

import { useEffect, useState } from "react";
import { greeting } from "@/lib/utils/dates";

/**
 * Saudação conforme o horário de quem está lendo.
 * Calculada no navegador, para que a página possa ser cacheada.
 */
export function Greeting() {
  const [text, setText] = useState<string | null>(null);
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setText(greeting(new Date(), tz));
  }, []);
  return (
    <p className="text-sm font-medium tracking-wide text-brand" aria-live="off">
      {text ?? "Olá"}, que bom ter você aqui.
    </p>
  );
}
