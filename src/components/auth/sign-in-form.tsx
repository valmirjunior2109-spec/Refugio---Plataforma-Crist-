"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { signIn } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Alert } from "@/components/ui/feedback-states";
import { applyServerErrors } from "@/hooks/use-server-errors";
import { signInSchema } from "@/lib/validations/auth";

type Values = z.input<typeof signInSchema>;

export function SignInForm({ next, disabled }: { next?: string; disabled?: boolean }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<Values>({ resolver: zodResolver(signInSchema), defaultValues: { email: "", password: "" } });
  const { register, handleSubmit, formState } = form;

  const onSubmit = handleSubmit((values) =>
    start(async () => {
      setError(null);
      const res = await signIn(values, next);
      if (res && !res.ok) {
        setError(res.error);
        applyServerErrors(res, form.setError);
      }
    }),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {error && <Alert tone="danger">{error}</Alert>}
      <Field label="E-mail" error={formState.errors.email?.message}>
        {(p) => <Input {...p} type="email" autoComplete="email" inputMode="email" {...register("email")} />}
      </Field>
      <Field label="Senha" error={formState.errors.password?.message}>
        {(p) => <Input {...p} type="password" autoComplete="current-password" {...register("password")} />}
      </Field>
      <div className="flex justify-end">
        <Link href="/recuperar-senha" className="text-sm text-brand-ink hover:underline">
          Esqueci minha senha
        </Link>
      </div>
      <Button type="submit" className="w-full" loading={pending} disabled={disabled}>
        Entrar
      </Button>
    </form>
  );
}
