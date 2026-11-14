"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Trash2 } from "lucide-react";
import { createPrayerEntry, deletePrayerEntry, updatePrayerEntry } from "@/actions/prayer";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Alert } from "@/components/ui/feedback-states";
import { applyServerErrors } from "@/hooks/use-server-errors";
import { prayerEntrySchema, type PrayerEntryData, type PrayerEntryInput } from "@/lib/validations/prayer";
import { PRAYER_CATEGORIES, type PrayerEntry } from "@/types/user";

export function PrayerForm({ entry, today }: { entry?: PrayerEntry; today: string }) {
  const [pending, start] = useTransition();
  const [deleting, startDelete] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  // O servidor revalida o texto bruto; o resolver só valida no navegador.
  const form = useForm<PrayerEntryInput, unknown, PrayerEntryData>({
    resolver: zodResolver(prayerEntrySchema),
    defaultValues: {
      title: entry?.title ?? "",
      content: entry?.content ?? "",
      category: entry?.category ?? "reflexao",
      tags: entry?.tags.join(", ") ?? "",
      entryDate: entry?.entryDate ?? today,
    },
  });
  const { register, handleSubmit, formState } = form;
  const e = formState.errors;

  const onSubmit = handleSubmit(() =>
    start(async () => {
      const values = form.getValues();
      setResult(null);
      const res = entry ? await updatePrayerEntry(entry.id, values) : await createPrayerEntry(values);
      if (!res) return;
      setResult(res.ok ? { ok: true, message: res.message ?? "Salvo." } : { ok: false, message: res.error });
      applyServerErrors(res, form.setError);
      if (res.ok) form.reset(values);
    }),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {result && <Alert tone={result.ok ? "success" : "danger"}>{result.message}</Alert>}

      <Field label="Título" error={e.title?.message}>
        {(p) => <Input {...p} placeholder="Ex.: Obrigado por hoje" maxLength={120} {...register("title")} />}
      </Field>

      <Field label="O que está no seu coração?" error={e.content?.message}>
        {(p) => (
          <Textarea
            {...p}
            rows={10}
            placeholder="Escreva sua oração, seus pensamentos, agradecimentos ou pedidos. Não há forma certa."
            className="font-serif text-[1.08rem]"
            {...register("content")}
          />
        )}
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Categoria" error={e.category?.message}>
          {(p) => (
            <Select {...p} {...register("category")}>
              {PRAYER_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field label="Data" error={e.entryDate?.message}>
          {(p) => <Input {...p} type="date" max="2100-12-31" {...register("entryDate")} />}
        </Field>
      </div>

      <Field label="Marcadores" optional hint="Separe por vírgulas. Ex.: família, trabalho" error={e.tags?.message}>
        {(p) => <Input {...p} {...register("tags")} />}
      </Field>

      <p className="flex items-center gap-2 text-sm text-muted">
        <Lock className="size-4 text-brand" aria-hidden />
        Privado: só você pode ver este registro.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
        <Button type="submit" loading={pending}>
          {entry ? "Salvar alterações" : "Salvar no diário"}
        </Button>
        {entry && (
          <Button
            variant="ghost"
            className="text-danger hover:bg-danger-soft hover:text-danger"
            loading={deleting}
            icon={<Trash2 className="size-4" aria-hidden />}
            onClick={() => {
              if (!confirm("Excluir este registro? Essa ação não pode ser desfeita.")) return;
              startDelete(async () => {
                const res = await deletePrayerEntry(entry.id);
                if (res && !res.ok) setResult({ ok: false, message: res.error });
              });
            }}
          >
            Excluir
          </Button>
        )}
      </div>
    </form>
  );
}
