import { BookOpen, CircleUserRound, HandHeart, House } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";

export interface NavItem {
  href: string;
  label: string;
  icon: (props: { className?: string }) => React.ReactNode;
  /** Prefixos de rota que marcam o item como ativo. */
  match: string[];
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Início", icon: (p) => <House {...p} aria-hidden />, match: ["/", "/palavra-do-dia"] },
  { href: "/biblia", label: "Bíblia", icon: (p) => <BookOpen {...p} aria-hidden />, match: ["/biblia", "/planos"] },
  { href: "/oracoes", label: "Orações", icon: (p) => <HandHeart {...p} aria-hidden />, match: ["/oracoes"] },
  {
    href: "/refugio",
    label: "Refúgio",
    icon: (p) => <LogoMark {...p} />,
    match: ["/refugio", "/preciso-de-uma-palavra", "/ajuda", "/ajude-a-crescer", "/sobre"],
  },
  {
    href: "/meu-espaco",
    label: "Meu espaço",
    icon: (p) => <CircleUserRound {...p} aria-hidden />,
    match: ["/meu-espaco", "/entrar", "/cadastro"],
  },
];

export function isActive(item: NavItem, pathname: string): boolean {
  return item.match.some((m) => (m === "/" ? pathname === "/" : pathname === m || pathname.startsWith(`${m}/`)));
}
