import { cn } from "@/lib/utils/cn";

/**
 * Texto em parágrafos, a partir de texto simples (separado por linhas em branco).
 * Nunca interpreta HTML: o conteúdo é sempre exibido como texto (proteção contra XSS).
 */
export function Prose({ text, className }: { text: string; className?: string }) {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  return (
    <div className={cn("prose-refugio text-[1.05rem] leading-[1.75] text-ink-soft", className)}>
      {paragraphs.map((p, i) => (
        <p key={i} className="whitespace-pre-line">
          {p}
        </p>
      ))}
    </div>
  );
}
