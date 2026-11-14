import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHeader } from "@/components/layout/page";
import { LegalSection } from "@/components/layout/legal";
import { TRANSLATION } from "@/lib/bible/books";

export const metadata: Metadata = {
  title: "Termos de uso",
  description: "Condições de uso do Refúgio, uma plataforma cristã gratuita e solidária.",
  alternates: { canonical: "/termos" },
};

export default function TermsPage() {
  return (
    <Container className="max-w-3xl">
      <PageHeader eyebrow="Termos" title="Termos de uso" description="Última atualização: 14 de novembro de 2026." />
      <div className="space-y-10 leading-relaxed text-ink-soft">
        <LegalSection title="1. O que é o Refúgio">
          <p>
            O Refúgio é uma plataforma web cristã, gratuita e sem fins comerciais, que oferece conteúdo bíblico,
            reflexões, planos de leitura e ferramentas pessoais de oração. Ao usar o site, você concorda com estes termos.
          </p>
        </LegalSection>

        <LegalSection title="2. Gratuidade">
          <p>
            Todas as funcionalidades são gratuitas. Não há assinaturas, compras internas nem conteúdos bloqueados por
            pagamento.
          </p>
        </LegalSection>

        <LegalSection title="3. Acolhimento espiritual, não atendimento profissional">
          <p>
            O conteúdo do Refúgio tem caráter de acolhimento espiritual. Ele não substitui acompanhamento psicológico,
            médico, jurídico ou pastoral, nem serviços de emergência. As orações sugeridas não são promessa de resultados
            específicos.{" "}
            <Link href="/ajuda" className="text-brand-ink underline">
              Veja canais de ajuda
            </Link>
            .
          </p>
        </LegalSection>

        <LegalSection title="4. Sua conta">
          <ul>
            <li>Você é responsável por manter sua senha em segurança.</li>
            <li>A conta é pessoal; os registros do diário são privados.</li>
            <li>Você pode excluir sua conta a qualquer momento, em “Configurações”.</li>
          </ul>
        </LegalSection>

        <LegalSection title="5. Uso respeitoso">
          <p>
            Não é permitido usar o Refúgio para assédio, discurso de ódio, spam, tentativa de acesso indevido a dados de
            outras pessoas ou para se apresentar falsamente como representante de igreja ou organização. Quando houver
            espaços comunitários, o conteúdo compartilhado passará por moderação e poderá ser removido.
          </p>
        </LegalSection>

        <LegalSection title="6. Conteúdo">
          <p>
            Textos bíblicos: {TRANSLATION.credit} Reflexões e demais textos do Refúgio podem ser compartilhados para fins
            não comerciais, com indicação da fonte. O código-fonte é distribuído sob a licença MIT.
          </p>
        </LegalSection>

        <LegalSection title="7. Disponibilidade">
          <p>
            Por ser um projeto solidário, o Refúgio é oferecido “como está”. Faremos o possível para mantê-lo disponível e
            seguro, mas podem ocorrer interrupções.
          </p>
        </LegalSection>

        <LegalSection title="8. Privacidade">
          <p>
            O tratamento de dados pessoais está descrito na{" "}
            <Link href="/privacidade" className="text-brand-ink underline">
              Política de privacidade
            </Link>
            .
          </p>
        </LegalSection>

        <LegalSection title="9. Legislação">
          <p>Estes termos são regidos pelas leis da República Federativa do Brasil.</p>
        </LegalSection>
      </div>
    </Container>
  );
}
