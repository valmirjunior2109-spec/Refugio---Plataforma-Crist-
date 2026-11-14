import { FlaskConical } from "lucide-react";

/** Aviso exibido quando o Supabase não está configurado. */
export function DemoBanner() {
  return (
    <div className="border-b border-warning/25 bg-warning-soft text-warning">
      <p className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2 text-xs sm:px-6 sm:text-sm">
        <FlaskConical className="size-4 shrink-0" aria-hidden />
        <span>
          <strong className="font-semibold">Modo demonstração.</strong> O conteúdo é de exemplo e nenhum dado pessoal é
          salvo. Configure o Supabase para ativar contas e registros.
        </span>
      </p>
    </div>
  );
}
