import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, CalendarDays, HandHeart, LifeBuoy, NotebookPen, Smartphone, Sun } from "lucide-react";
import { Container } from "@/components/layout/page";
import { LogoMark } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${SITE.name}: ${SITE.slogan}` },
  description: SITE.description,
  alternates: { canonical: "/boas-vindas" },
};

const features = [
  { icon: Sun, title: "Palavra do dia", text: "Uma passagem, uma reflexão e uma oração para cada dia." },
  { icon: HandHeart, title: "Preciso de uma palavra", text: "Conforto nas Escrituras para o que você está sentindo." },
  { icon: BookOpen, title: "Bíblia completa", text: "Leia, salve e compartilhe passagens, no seu ritmo." },
  { icon: CalendarDays, title: "Planos de leitura", text: "Jornadas pelas Escrituras, sem pressa e sem cobrança." },
  { icon: NotebookPen, title: "Diário de oração", text: "Um espaço privado para conversar com Deus." },
];

export default function WelcomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_24rem_at_50%_-4rem,var(--brand-soft),transparent_70%)]"
        />
        <Container className="relative max-w-3xl pt-12 pb-10 text-center sm:pt-20">
          <LogoMark className="mx-auto size-14 animate-fade-up text-brand" />
          <h1 className="mt-6 animate-fade-up font-serif text-[2.5rem] leading-[1.08] tracking-tight text-ink sm:text-6xl">
            {SITE.slogan}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted">{SITE.description}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/cadastro" size="lg">
              Criar minha conta gratuita
            </ButtonLink>
            <ButtonLink href="/entrar" variant="secondary" size="lg">
              Já tenho conta
            </ButtonLink>
          </div>
          <p className="mt-4 text-sm text-muted">Gratuito para sempre. Sem anúncios e sem venda de dados.</p>
          <Link
            href="/instalar"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-ink underline-offset-4 hover:underline"
          >
            <Smartphone className="size-4" aria-hidden />
            Instale o app no seu celular
          </Link>
        </Container>
      </section>

      <Container className="max-w-5xl">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {features.map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-2xl border border-line bg-surface p-5">
              <Icon className="size-5 text-brand" aria-hidden />
              <p className="mt-3 font-medium text-ink">{title}</p>
              <p className="mt-1 text-sm text-muted">{text}</p>
            </li>
          ))}
        </ul>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Link href="/sobre" className="rounded-2xl bg-surface-2 p-5 text-sm text-ink-soft hover:bg-sand">
            <span className="block font-medium text-ink">Por que o Refúgio existe</span>
            Conheça o propósito do projeto e os princípios que o guiam.
          </Link>
          <Link href="/ajuda" className="flex gap-3 rounded-2xl border border-line bg-surface p-5 text-sm text-ink-soft hover:border-brand/40">
            <LifeBuoy className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
            <span>
              <span className="block font-medium text-ink">Precisa de ajuda agora?</span>
              Canais gratuitos de apoio, 24 horas, sem precisar de cadastro. CVV: 188.
            </span>
          </Link>
        </div>
      </Container>
    </>
  );
}
