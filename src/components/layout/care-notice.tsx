import Link from "next/link";
import { LifeBuoy } from "lucide-react";

/** Lembrete gentil de que acolhimento espiritual não substitui ajuda humana. */
export function CareNotice() {
  return (
    <aside className="flex gap-3 rounded-2xl border border-line bg-surface-2/60 p-4 text-sm text-ink-soft">
      <LifeBuoy className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
      <p>
        O Refúgio oferece acolhimento espiritual e não substitui acompanhamento psicológico, médico ou pastoral. Se você
        está em sofrimento intenso ou pensando em se machucar, procure ajuda agora: ligue <strong>188</strong> (CVV, 24h,
        gratuito) ou <strong>192</strong> (SAMU).{" "}
        <Link href="/ajuda" className="font-medium text-brand-ink underline">
          Ver canais de ajuda
        </Link>
      </p>
    </aside>
  );
}
