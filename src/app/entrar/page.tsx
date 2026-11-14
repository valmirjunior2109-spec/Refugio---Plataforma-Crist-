import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";
import { Alert } from "@/components/ui/feedback-states";
import { getCurrentUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { safeNextPath } from "@/lib/validations/auth";

export const metadata: Metadata = { title: "Entrar", robots: { index: false } };

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string; erro?: string }> }) {
  const { next, erro } = await searchParams;
  const nextPath = safeNextPath(next);
  if (await getCurrentUser()) redirect(nextPath);

  return (
    <AuthShell title="Que bom ter você de volta" description="Entre para acessar seu diário, seus planos e versículos salvos.">
      {erro && (
        <Alert tone="danger" className="mb-5">
          Não foi possível confirmar o link. Ele pode ter expirado. Tente novamente.
        </Alert>
      )}
      <SignInForm next={nextPath} disabled={!isSupabaseConfigured()} />
      <p className="mt-6 text-center text-sm text-muted">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-medium text-brand-ink hover:underline">
          Criar conta gratuita
        </Link>
      </p>
    </AuthShell>
  );
}
