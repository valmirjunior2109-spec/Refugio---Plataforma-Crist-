import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { TRANSLATION } from "@/lib/bible/books";
import { SITE } from "@/lib/site";

const links = [
  { href: "/sobre", label: "Sobre o Refúgio" },
  { href: "/ajuda", label: "Precisa de ajuda agora?" },
  { href: "/ajude-a-crescer", label: "Ajude o Refúgio a crescer" },
  { href: "/privacidade", label: "Privacidade" },
  { href: "/termos", label: "Termos de uso" },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_1fr]">
        <div className="space-y-3">
          <Logo compact />
          <p className="max-w-sm text-sm text-muted">{SITE.slogan}</p>
          <p className="max-w-sm text-xs text-muted">
            Um projeto solidário: gratuito, sem anúncios e sem venda de dados. Sempre.
          </p>
        </div>
        <nav aria-label="Links institucionais">
          <ul className="grid gap-2 text-sm sm:grid-cols-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-ink-soft hover:text-brand-ink hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-xs leading-relaxed text-muted md:col-span-2">
          Textos bíblicos: {TRANSLATION.credit}{" "}
          <a href={TRANSLATION.licenseUrl} className="underline hover:text-ink" rel="license noopener" target="_blank">
            Ver licença
          </a>
          . Palavras em itálico foram acrescentadas pelos tradutores para dar sentido ao texto.
        </p>
      </div>
    </footer>
  );
}
