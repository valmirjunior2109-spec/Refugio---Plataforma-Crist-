import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { getCurrentUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Criar conta", robots: { index: false } };

export default async function SignUpPage() {
  if (await getCurrentUser()) redirect("/meu-espaco");
  return (
    <AuthShell
      title="Crie seu espaço"
      description="Gratuito, para sempre. A conta serve apenas para guardar seus registros pessoais com segurança."
    >
      <SignUpForm disabled={!isSupabaseConfigured()} />
      <p className="mt-6 text-center text-sm text-muted">
        Já tem conta?{" "}
        <Link href="/entrar" className="font-medium text-brand-ink hover:underline">
          Entrar
        </Link>
      </p>
    </AuthShell>
  );
}
