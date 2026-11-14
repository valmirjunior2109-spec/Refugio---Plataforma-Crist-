"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { MailCheck } from "lucide-react";
import { signUp } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input } from "@/components/ui/form";
import { Alert, EmptyState } from "@/components/ui/feedback-states";
import { applyServerErrors } from "@/hooks/use-server-errors";
import { signUpSchema } from "@/lib/validations/auth";

type Values = z.input<typeof signUpSchema>;

export function SignUpForm({ disabled }: { disabled?: boolean }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const form = useForm<Values>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { displayName: "", email: "", password: "", acceptTerms: false as unknown as true },
  });
  const { register, handleSubmit, formState } = form;

  if (done) {
    return (
      <EmptyState
        className="border-0 py-4"
        icon={<MailCheck className="size-5" aria-hidden />}
        title="Confira seu e-mail"
        description={done}
      />
    );
  }

  const onSubmit = handleSubmit((values) =>
    start(async () => {
      setError(null);
      const res = await signUp(values);
      if (!res) return;
      if (res.ok) setDone(res.message ?? "Conta criada.");
      else {
        setError(res.error);
        applyServerErrors(res, form.setError);
      }
    }),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {error && <Alert tone="danger">{error}</Alert>}
      <Field label="Como gostaria de ser chamado?" error={formState.errors.displayName?.message}>
        {(p) => <Input {...p} autoComplete="given-name" {...register("displayName")} />}
      </Field>
      <Field label="E-mail" error={formState.errors.email?.message}>
        {(p) => <Input {...p} type="email" autoComplete="email" inputMode="email" {...register("email")} />}
      </Field>
      <Field label="Senha" hint="Pelo menos 8 caracteres." error={formState.errors.password?.message}>
        {(p) => <Input {...p} type="password" autoComplete="new-password" {...register("password")} />}
      </Field>
      <Checkbox
        {...register("acceptTerms")}
        error={formState.errors.acceptTerms?.message}
        label={
          <>
            Li e concordo com os{" "}
            <Link href="/termos" className="text-brand-ink underline" target="_blank">
              Termos de uso
            </Link>{" "}
            e a{" "}
            <Link href="/privacidade" className="text-brand-ink underline" target="_blank">
              Política de privacidade
            </Link>
            . Meus registros pessoais ficam privados e posso excluir minha conta quando quiser.
          </>
        }
      />
      <Button type="submit" className="w-full" loading={pending} disabled={disabled}>
        Criar minha conta
      </Button>
    </form>
  );
}
