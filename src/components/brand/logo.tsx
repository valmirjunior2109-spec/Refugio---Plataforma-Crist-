import { cn } from "@/lib/utils/cn";

/**
 * Símbolo do Refúgio: um abrigo (telhado) sobre uma luz amparada por mãos em concha.
 * Usa currentColor para o traço, adaptando-se a fundos claros e escuros.
 */
export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("shrink-0", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path
        d="M9 22.5 24 10l15 12.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="29.2" r="3.7" className="fill-brand-ink" />
      <path
        d="M14 30.2c1.1 5.9 4.9 9.6 10 9.6s8.9-3.7 10-9.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Logotipo completo: símbolo + nome "refúgio." */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-brand", className)}>
      <LogoMark className={compact ? "size-7" : "size-8"} />
      <span
        className={cn(
          "font-serif font-medium tracking-tight text-brand-ink",
          compact ? "text-[1.35rem]" : "text-[1.6rem]",
        )}
      >
        refúgio<span className="text-brand">.</span>
      </span>
    </span>
  );
}
