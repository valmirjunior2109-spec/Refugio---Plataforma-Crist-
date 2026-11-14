import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHeader } from "@/components/layout/page";
import { LegalSection } from "@/components/layout/legal";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: "Como o Refúgio trata seus dados pessoais, em conformidade com a LGPD.",
  alternates: { canonical: "/privacidade" },
};

const UPDATED = "14 de novembro de 2026";

export default function PrivacyPage() {
  const contact = SITE.contactEmail ? (
    <a href={`mailto:${SITE.contactEmail}`} className="text-brand-ink underline">
      {SITE.contactEmail}
    </a>
  ) : (
    <Link href="/ajude-a-crescer" className="text-brand-ink underline">
      formulário de contato
    </Link>
  );

  return (
    <Container className="max-w-3xl">
      <PageHeader eyebrow="Privacidade" title="Política de privacidade" description={`Última atualização: ${UPDATED}.`} />
      <div className="space-y-10 leading-relaxed text-ink-soft">
        <p className="rounded-2xl bg-brand-soft p-5 text-ink">
          Em resumo: coletamos o mínimo necessário, seu diário de oração é privado, não vendemos dados, não exibimos
          anúncios e você pode apagar tudo quando quiser.
        </p>

        <LegalSection title="1. Quem somos">
          <p>
            O Refúgio é um projeto solidário e sem fins comerciais. Os responsáveis pelo projeto atuam como controladores
            dos dados pessoais tratados na plataforma, nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018,
            LGPD).
          </p>
        </LegalSection>

        <LegalSection title="2. O que você pode fazer sem conta">
          <p>
            Ler a Palavra do dia, a Bíblia, as reflexões e os planos de leitura, além de enviar feedback, sem criar conta.
            Nesses casos, não pedimos nenhum dado pessoal.
          </p>
        </LegalSection>

        <LegalSection title="3. Dados que tratamos">
          <ul>
            <li>
              <strong>Conta:</strong> e-mail, senha (armazenada de forma criptografada pelo provedor de autenticação) e o
              nome que você escolher.
            </li>
            <li>
              <strong>Conteúdo pessoal:</strong> registros do diário de oração, versículos salvos, reflexões favoritas,
              progresso nos planos e objetivos pessoais.
            </li>
            <li>
              <strong>Feedback:</strong> a mensagem enviada, a avaliação e, se você quiser, um e-mail para resposta.
            </li>
            <li>
              <strong>Segurança:</strong> para limitar envios abusivos, guardamos um código derivado do endereço de rede
              (hash criptográfico não reversível). O endereço IP em si não é armazenado.
            </li>
          </ul>
          <p>
            Conteúdos do diário podem revelar convicções religiosas, que a LGPD considera dados sensíveis. Por isso, eles
            são tratados apenas para prestar o serviço que você pediu (guardar seus registros), com seu consentimento, e
            ficam protegidos por regras de acesso no banco de dados que impedem a leitura por outras pessoas.
          </p>
        </LegalSection>

        <LegalSection title="4. O que nunca fazemos">
          <ul>
            <li>Não vendemos, alugamos nem compartilhamos dados pessoais com terceiros para fins comerciais.</li>
            <li>Não exibimos anúncios e não usamos seus dados para publicidade.</li>
            <li>Não publicamos nem compartilhamos automaticamente nenhum conteúdo seu.</li>
            <li>Não usamos ferramentas de rastreamento de terceiros.</li>
          </ul>
        </LegalSection>

        <LegalSection title="5. Onde os dados ficam">
          <p>
            Os dados são armazenados no Supabase (banco de dados e autenticação) e o site é hospedado na Vercel. Esses
            provedores atuam como operadores e podem armazenar dados fora do Brasil, com salvaguardas contratuais
            adequadas. O acesso administrativo ao diário de oração não está disponível na plataforma e só ocorreria em
            caso de necessidade técnica legítima, com a devida autorização.
          </p>
        </LegalSection>

        <LegalSection title="6. Por quanto tempo">
          <p>
            Mantemos seus dados enquanto sua conta existir. Ao excluir a conta, todos os dados pessoais vinculados a ela
            são apagados imediatamente. Feedbacks enviados permanecem, sem vínculo com a conta excluída.
          </p>
        </LegalSection>

        <LegalSection title="7. Seus direitos">
          <p>Você pode, a qualquer momento:</p>
          <ul>
            <li>acessar e corrigir seus dados em “Meu espaço”;</li>
            <li>apagar o diário de oração ou excluir a conta em “Configurações”;</li>
            <li>revogar o consentimento, solicitar informações ou portabilidade pelo {contact}.</li>
          </ul>
        </LegalSection>

        <LegalSection title="8. Armazenamento no seu aparelho">
          <p>
            Usamos cookies estritamente necessários para manter sua sessão. A preferência de tema (claro ou escuro) fica
            apenas no seu navegador. O modo offline guarda somente páginas públicas; seus dados pessoais nunca são
            armazenados nesse cache.
          </p>
        </LegalSection>

        <LegalSection title="9. Crianças e adolescentes">
          <p>
            A criação de conta é destinada a maiores de 13 anos. Menores de 18 anos devem usar o Refúgio com o
            conhecimento de seus responsáveis.
          </p>
        </LegalSection>

        <LegalSection title="10. Alterações">
          <p>Se esta política mudar de forma relevante, avisaremos na plataforma antes de a mudança entrar em vigor.</p>
        </LegalSection>
      </div>
    </Container>
  );
}
