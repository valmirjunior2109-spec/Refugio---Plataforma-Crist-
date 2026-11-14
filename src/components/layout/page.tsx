import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  // Largura padrão 6xl, a menos que a página defina a sua (max-w-*).
  const width = className?.includes("max-w-") ? null : "max-w-6xl";
  return <div className={cn("mx-auto w-full px-4 sm:px-6", width, className)}>{children}</div>;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  back,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  back?: { href: string; label: string };
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("animate-fade-up pt-6 pb-6 sm:pt-10 sm:pb-8", className)}>
      {back && (
        <Link
          href={back.href}
          className="mb-4 -ml-1 inline-flex items-center gap-1 rounded-md text-sm text-muted hover:text-ink"
        >
          <ChevronLeft className="size-4" aria-hidden />
          {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 max-w-2xl">
          {eyebrow && <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-brand uppercase">{eyebrow}</p>}
          <h1 className="font-serif text-[2rem] leading-[1.15] text-ink sm:text-[2.6rem]">{title}</h1>
          {description && <div className="mt-3 text-[1.05rem] text-muted">{description}</div>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </header>
  );
}
