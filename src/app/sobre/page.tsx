import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHeader } from "@/components/layout/page";
import { LogoMark } from "@/components/brand/logo";
import { TRANSLATION } from "@/lib/bible/books";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sobre o Refúgio",
  description: "Por que o Refúgio existe, como é mantido e quais princípios guiam o projeto.",
  alternates: { canonical: "/sobre" },
};

const never = ["Assinaturas ou planos pagos", "Anúncios", "Venda ou uso de dados para publicidade", "Rankings ou competição espiritual"];

export default function AboutPage() {
  return (
    <Container className="max-w-3xl">
      <PageHeader eyebrow="Sobre" title="Por que o Refúgio existe" />
      <div className="space-y-12 text-[1.05rem] leading-relaxed text-ink-soft">
        <section className="space-y-4">
          <LogoMark className="size-14 text-brand" />
          <p className="font-serif text-2xl leading-snug text-ink">{SITE.slogan}</p>
          <p>{SITE.description}</p>
          <p>
            O Refúgio acolhe pessoas de diferentes tradições cristãs, sem privilegiar uma denominação. Você não precisa
            ser membro de uma igreja, nem conhecer bem a Bíblia, para se sentir em casa aqui.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl text-ink">Um projeto solidário</h2>
          <p>Todas as funcionalidades são gratuitas, para todas as pessoas. E continuarão assim. O Refúgio não terá:</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {never.map((n) => (
              <li key={n} className="rounded-xl bg-surface-2 px-4 py-2.5 text-sm">
                {n}
              </li>
            ))}
          </ul>
          <p>
            O código é aberto (licença MIT), para que qualquer pessoa possa conferir como seus dados são tratados e
            contribuir com o projeto.
          </p>
        </section>

        <section id="biblia" className="scroll-mt-24 space-y-3">
          <h2 className="font-serif text-2xl text-ink">Sobre o texto bíblico</h2>
          <p>
            Usamos a <strong>{TRANSLATION.name}</strong> (BLIVRE), uma tradução em português do Brasil feita a partir da
            tradução de João Ferreira de Almeida e disponibilizada sob licença aberta. Isso nos permite oferecer a Bíblia
            completa, gratuitamente, respeitando os direitos autorais.
          </p>
          <p className="text-sm">
            {TRANSLATION.credit}{" "}
            <a href={TRANSLATION.licenseUrl} target="_blank" rel="license noopener" className="text-brand-ink underline">
              Licença CC BY 4.0
            </a>{" "}
            ·{" "}
            <a href={TRANSLATION.sourceUrl} target="_blank" rel="noopener" className="text-brand-ink underline">
              Fonte
            </a>
          </p>
          <p>
            Palavras em <em>itálico</em> foram acrescentadas pelos tradutores para dar sentido ao texto em português. As
            reflexões e orações são escritas pela equipe do Refúgio e sempre indicam a passagem de referência, para que
            você possa ler e conferir no contexto.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl text-ink">Construído com as pessoas</h2>
          <p>
            O Refúgio está sendo construído com carinho e dedicação. Se algo pode ser melhor,{" "}
            <Link href="/ajude-a-crescer" className="text-brand-ink underline">
              conte para nós
            </Link>
            .
          </p>
        </section>
      </div>
    </Container>
  );
}
