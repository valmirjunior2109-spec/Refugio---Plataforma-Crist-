"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { deleteAccount, updateProfile } from "@/actions/auth";
import { deleteAllPrayerEntries } from "@/actions/prayer";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { Alert } from "@/components/ui/feedback-states";
import { applyServerErrors } from "@/hooks/use-server-errors";
import { deleteAccountSchema, profileSchema } from "@/lib/validations/auth";

export function ProfileForm({ displayName }: { displayName: string }) {
  const [pending, start] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const form = useForm<z.input<typeof profileSchema>>({ resolver: zodResolver(profileSchema), defaultValues: { displayName } });

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit((values) =>
        start(async () => {
          const res = await updateProfile(values);
          setResult(res.ok ? { ok: true, message: res.message ?? "" } : { ok: false, message: res.error });
          applyServerErrors(res, form.setError);
        }),
      )}
      className="space-y-5"
    >
      {result && <Alert tone={result.ok ? "success" : "danger"}>{result.message}</Alert>}
      <Field label="Como gostaria de ser chamado?" error={form.formState.errors.displayName?.message}>
        {(p) => <Input {...p} maxLength={60} {...form.register("displayName")} />}
      </Field>
      <Button type="submit" loading={pending}>
        Salvar
      </Button>
    </form>
  );
}

export function ThemeChooser() {
  const [theme, setTheme] = useState<string>("system");
  useEffect(() => {
    try {
      setTheme(localStorage.getItem("refugio-theme") ?? "system");
    } catch {
      // armazenamento indisponível: mantém o tema automático
    }
  }, []);

  function choose(value: string) {
    setTheme(value);
    try {
      if (value === "system") {
        localStorage.removeItem("refugio-theme");
        delete document.documentElement.dataset.theme;
      } else {
        localStorage.setItem("refugio-theme", value);
        document.documentElement.dataset.theme = value;
      }
    } catch {
      if (value !== "system") document.documentElement.dataset.theme = value;
    }
  }

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-ink">Aparência</legend>
      <div className="flex flex-wrap gap-2">
        {[
          ["system", "Automática"],
          ["light", "Clara"],
          ["dark", "Escura"],
        ].map(([value, label]) => (
          <label
            key={value}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-sm has-[:checked]:border-brand has-[:checked]:bg-brand-soft has-[:checked]:text-brand-ink"
          >
            <input type="radio" name="theme" value={value} checked={theme === value} onChange={() => choose(value!)} className="sr-only" />
            {label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function DeleteDiaryButton() {
  const [pending, start] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  return (
    <div className="space-y-3">
      {result && <Alert tone={result.ok ? "success" : "danger"}>{result.message}</Alert>}
      <Button
        variant="secondary"
        loading={pending}
        onClick={() => {
          if (!confirm("Apagar TODOS os registros do seu diário? Essa ação não pode ser desfeita.")) return;
          start(async () => {
            const res = await deleteAllPrayerEntries();
            setResult(res.ok ? { ok: true, message: res.message ?? "" } : { ok: false, message: res.error });
          });
        }}
      >
        Apagar todo o diário
      </Button>
    </div>
  );
}

export function DeleteAccountForm() {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.input<typeof deleteAccountSchema>>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { confirmation: "" },
  });
  return (
    <form
      noValidate
      onSubmit={form.handleSubmit((values) =>
        start(async () => {
          const res = await deleteAccount(values);
          if (res && !res.ok) setError(res.error);
        }),
      )}
      className="space-y-4"
    >
      {error && <Alert tone="danger">{error}</Alert>}
      <Field
        label="Para confirmar, digite EXCLUIR"
        error={form.formState.errors.confirmation?.message}
        hint="Sua conta, seu diário, seus planos, versículos e objetivos serão apagados de forma definitiva."
      >
        {(p) => <Input {...p} autoComplete="off" {...form.register("confirmation")} />}
      </Field>
      <Button type="submit" variant="danger" loading={pending}>
        Excluir minha conta definitivamente
      </Button>
    </form>
  );
}
