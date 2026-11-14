"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookMarked, CalendarDays, HandHeart, LayoutDashboard, MessageSquareText, Sun } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const items = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard, exact: true },
  { href: "/admin/palavras", label: "Palavras do dia", icon: Sun },
  { href: "/admin/temas", label: "Preciso de uma palavra", icon: HandHeart },
  { href: "/admin/planos", label: "Planos de leitura", icon: CalendarDays },
  { href: "/admin/versiculos", label: "Versículos", icon: BookMarked },
  { href: "/admin/feedbacks", label: "Feedbacks", icon: MessageSquareText },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Painel">
      <ul className="-mx-1 flex gap-1 overflow-x-auto pb-1 lg:mx-0 lg:flex-col lg:overflow-visible">
        {items.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <li key={href} className="shrink-0">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm whitespace-nowrap transition-colors",
                  active ? "bg-brand-soft font-medium text-brand-ink" : "text-ink-soft hover:bg-surface-2",
                )}
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
