import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/password-forms";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Recuperar senha", robots: { index: false } };

export default function ForgotPasswordPage() {
  return (
    <AuthShell title="Recuperar senha" description="Enviaremos um link para você criar uma nova senha.">
      <ForgotPasswordForm disabled={!isSupabaseConfigured()} />
      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/entrar" className="font-medium text-brand-ink hover:underline">
          Voltar para o login
        </Link>
      </p>
    </AuthShell>
  );
}
