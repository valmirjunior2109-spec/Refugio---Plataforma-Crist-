import type { Metadata } from "next";
import { requirePageUser } from "@/lib/supabase/require-page-user";
import Link from "next/link";
import { Container, PageHeader } from "@/components/layout/page";
import { DeleteAccountForm, DeleteDiaryButton, ThemeChooser } from "@/components/journey/account-forms";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Configurações", robots: { index: false } };

export default async function SettingsPage() {
  await requirePageUser("/meu-espaco/configuracoes");
  return (
    <Container className="max-w-2xl">
      <PageHeader back={{ href: "/meu-espaco", label: "Meu espaço" }} eyebrow="Meu espaço" title="Configurações" />
      <div className="space-y-6">
        <Card>
          <ThemeChooser />
          <p className="mt-2 text-xs text-muted">Guardado apenas neste aparelho.</p>
        </Card>

        <Card>
          <h2 className="font-medium text-ink">Senha</h2>
          <p className="mt-1 text-sm text-muted">
            Para trocar sua senha,{" "}
            <Link href="/recuperar-senha" className="text-brand-ink underline">
              solicite um link por e-mail
            </Link>
            .
          </p>
        </Card>

        <Card>
          <h2 className="font-medium text-ink">Seus dados</h2>
          <p className="mt-1 mb-4 text-sm text-muted">
            Você é dono dos seus dados. Pode apagar o diário a qualquer momento, sem excluir a conta. Saiba mais na{" "}
            <Link href="/privacidade" className="text-brand-ink underline">
              Política de privacidade
            </Link>
            .
          </p>
          <DeleteDiaryButton />
        </Card>

        <Card className="border-danger/30">
          <h2 className="font-medium text-danger">Excluir conta</h2>
          <p className="mt-1 mb-4 text-sm text-muted">
            A exclusão é imediata e definitiva. Feedbacks enviados anteriormente permanecem, sem vínculo com você.
          </p>
          <DeleteAccountForm />
        </Card>
      </div>
    </Container>
  );
}
