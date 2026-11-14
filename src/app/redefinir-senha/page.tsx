import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/password-forms";
import { EmptyState } from "@/components/ui/feedback-states";
import { buttonClasses } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Nova senha", robots: { index: false } };

export default async function ResetPasswordPage() {
  const user = await getCurrentUser();
  return (
    <AuthShell title="Crie uma nova senha">
      {user ? (
        <ResetPasswordForm />
      ) : (
        <EmptyState
          className="border-0 py-2"
          title="Link inválido ou expirado"
          description="Para criar uma nova senha, abra o link enviado ao seu e-mail ou peça um novo."
          action={
            <Link href="/recuperar-senha" className={buttonClasses()}>
              Pedir novo link
            </Link>
          }
        />
      )}
    </AuthShell>
  );
}
