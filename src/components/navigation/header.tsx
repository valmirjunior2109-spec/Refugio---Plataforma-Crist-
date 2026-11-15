"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleUserRound } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { buttonClasses } from "@/components/ui/button";
import { useSessionUser } from "@/hooks/use-session-user";
import { cn } from "@/lib/utils/cn";
import { NAV_ITEMS, isActive } from "./nav-items";

export function Header({ authEnabled }: { authEnabled: boolean }) {
  const pathname = usePathname();
  const { user, ready } = useSessionUser();

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/88 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link href="/" aria-label="Refúgio: página inicial" className="rounded-lg">
          <Logo compact />
        </Link>

        <nav
          aria-label="Navegação principal"
          className={cn("hidden lg:block", authEnabled && (!ready || !user) && "invisible")}
        >
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item, pathname);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-full px-4 py-2 text-[0.95rem] transition-colors",
                      active ? "bg-brand-soft font-medium text-brand-ink" : "text-ink-soft hover:bg-surface-2 hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex min-w-[6.5rem] justify-end">
          {authEnabled && ready && !user && (
            <Link href="/entrar" className={buttonClasses("secondary", "sm")}>
              Entrar
            </Link>
          )}
          {authEnabled && ready && user && (
            <Link
              href="/meu-espaco"
              className="flex items-center gap-2 rounded-full py-1.5 pr-1 pl-3 text-sm text-ink-soft hover:bg-surface-2"
            >
              <span className="hidden max-w-[10rem] truncate sm:inline">
                {(user.user_metadata?.display_name as string | undefined) ?? "Meu espaço"}
              </span>
              <CircleUserRound className="size-7 text-brand" aria-hidden />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
