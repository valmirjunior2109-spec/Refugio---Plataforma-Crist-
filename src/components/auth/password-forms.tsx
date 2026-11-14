"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { requestPasswordReset, updatePassword } from "@/actions/auth";
import { Button, buttonClasses } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Alert } from "@/components/ui/feedback-states";
import { applyServerErrors } from "@/hooks/use-server-errors";
import { forgotPasswordSchema, resetPasswordSchema } from "@/lib/validations/auth";

export function ForgotPasswordForm({ disabled }: { disabled?: boolean }) {
  const [pending, start] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const form = useForm<z.input<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = form.handleSubmit((values) =>
    start(async () => {
      const res = await requestPasswordReset(values);
      setResult(res.ok ? { ok: true, message: res.message ?? "" } : { ok: false, message: res.error });
      applyServerErrors(res, form.setError);
    }),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {result && <Alert tone={result.ok ? "success" : "danger"}>{result.message}</Alert>}
      <Field label="E-mail da sua conta" error={form.formState.errors.email?.message}>
        {(p) => <Input {...p} type="email" autoComplete="email" {...form.register("email")} />}
      </Field>
      <Button type="submit" className="w-full" loading={pending} disabled={disabled}>
        Enviar link de recuperação
      </Button>
    </form>
  );
}

export function ResetPasswordForm() {
  const [pending, start] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const form = useForm<z.input<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirm: "" },
  });

  if (result?.ok) {
    return (
      <div className="space-y-5">
        <Alert tone="success">{result.message}</Alert>
        <Link href="/meu-espaco" className={buttonClasses("primary", "md", "w-full")}>
          Ir para o meu espaço
        </Link>
      </div>
    );
  }

  const onSubmit = form.handleSubmit((values) =>
    start(async () => {
      const res = await updatePassword(values);
      setResult(res.ok ? { ok: true, message: res.message ?? "" } : { ok: false, message: res.error });
      applyServerErrors(res, form.setError);
    }),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {result && <Alert tone="danger">{result.message}</Alert>}
      <Field label="Nova senha" hint="Pelo menos 8 caracteres." error={form.formState.errors.password?.message}>
        {(p) => <Input {...p} type="password" autoComplete="new-password" {...form.register("password")} />}
      </Field>
      <Field label="Repita a nova senha" error={form.formState.errors.confirm?.message}>
        {(p) => <Input {...p} type="password" autoComplete="new-password" {...form.register("confirm")} />}
      </Field>
      <Button type="submit" className="w-full" loading={pending}>
        Salvar nova senha
      </Button>
    </form>
  );
}
