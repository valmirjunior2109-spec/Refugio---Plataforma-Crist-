import type { ReactNode } from "react";
import { LogoMark } from "@/components/brand/logo";
import { Alert } from "@/components/ui/feedback-states";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export function AuthShell({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-10 sm:py-16">
      <div className="mb-8 text-center">
        <LogoMark className="mx-auto size-12 text-brand" />
        <h1 className="mt-4 font-serif text-3xl text-ink">{title}</h1>
        {description && <p className="mt-2 text-muted">{description}</p>}
      </div>
      {!isSupabaseConfigured() && (
        <Alert tone="warning" title="Contas indisponíveis no modo demonstração" className="mb-6">
          Configure o Supabase (veja o README) para ativar cadastro e login. Todo o conteúdo público continua disponível sem
          conta.
        </Alert>
      )}
      <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8">{children}</div>
    </div>
  );
}
