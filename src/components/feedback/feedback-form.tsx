"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HeartHandshake, Star } from "lucide-react";
import { submitFeedback } from "@/actions/feedback";
import { Button } from "@/components/ui/button";
import { Field, Honeypot, Input, Select, Textarea } from "@/components/ui/form";
import { Alert, EmptyState } from "@/components/ui/feedback-states";
import { applyServerErrors } from "@/hooks/use-server-errors";
import { FEEDBACK_KINDS, feedbackSchema, type FeedbackInput } from "@/lib/validations/feedback";
import { cn } from "@/lib/utils/cn";

export function FeedbackForm({ disabled }: { disabled?: boolean }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<string | null>(null);
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const form = useForm<FeedbackInput>({
    resolver: zodResolver(feedbackSchema) as never,
    defaultValues: { kind: "sugestao", message: "", rating: "" as unknown as null, contactEmail: "", website: "" },
  });
  const rating = form.watch("rating");

  if (sent) {
    return (
      <EmptyState
        className="border-0"
        icon={<HeartHandshake className="size-5" aria-hidden />}
        title="Mensagem recebida"
        description={sent}
        action={
          <Button
            variant="secondary"
            onClick={() => {
              form.reset();
              startedAt.current = Date.now();
              setSent(null);
            }}
          >
            Enviar outra mensagem
          </Button>
        }
      />
    );
  }

  const onSubmit = form.handleSubmit(() =>
    start(async () => {
      setError(null);
      const values = form.getValues();
      const res = await submitFeedback({ ...values, page: "/ajude-a-crescer", startedAt: startedAt.current });
      if (res.ok) setSent(res.message ?? "Obrigado!");
      else {
        setError(res.error);
        applyServerErrors(res, form.setError);
      }
    }),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-5">
      {error && <Alert tone="danger">{error}</Alert>}
      <Field label="Sobre o que você quer falar?" error={form.formState.errors.kind?.message}>
        {(p) => (
          <Select {...p} {...form.register("kind")}>
            {FEEDBACK_KINDS.map((k) => (
              <option key={k.value} value={k.value}>
                {k.label}
              </option>
            ))}
          </Select>
        )}
      </Field>

      <Field label="Sua mensagem" error={form.formState.errors.message?.message}>
        {(p) => <Textarea {...p} rows={6} maxLength={3000} placeholder="Conte com suas palavras…" {...form.register("message")} />}
      </Field>

      <fieldset>
        <legend className="mb-2 flex w-full items-baseline justify-between text-sm font-medium text-ink">
          Como está sua experiência no Refúgio?
          <span className="text-xs font-normal text-muted">opcional</span>
        </legend>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => {
            const active = Number(rating) >= n;
            return (
              <label key={n} className="cursor-pointer rounded-full p-1.5 hover:bg-surface-2">
                <input type="radio" value={n} className="sr-only" {...form.register("rating")} />
                <span className="sr-only">
                  {n} de 5
                </span>
                <Star className={cn("size-6 transition-colors", active ? "fill-brand text-brand" : "text-line-strong")} aria-hidden />
              </label>
            );
          })}
        </div>
      </fieldset>

      <Field
        label="Seu e-mail"
        optional
        hint="Só se quiser receber uma resposta. Não usaremos para nenhum outro fim."
        error={form.formState.errors.contactEmail?.message}
      >
        {(p) => <Input {...p} type="email" autoComplete="email" {...form.register("contactEmail")} />}
      </Field>

      <Honeypot {...form.register("website")} />

      <Button type="submit" loading={pending} disabled={disabled}>
        Enviar mensagem
      </Button>
      <p className="text-xs text-muted">As mensagens são lidas pela equipe e nunca são publicadas automaticamente.</p>
    </form>
  );
}
