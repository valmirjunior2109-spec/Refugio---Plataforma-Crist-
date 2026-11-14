"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { deleteDevotional, saveDevotional } from "@/actions/admin";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Alert } from "@/components/ui/feedback-states";
import { applyServerErrors } from "@/hooks/use-server-errors";
import { devotionalSchema, type DevotionalFormInput } from "@/lib/validations/admin";
import type { Devotional } from "@/types/content";
import { FormFooter } from "./form-footer";
import { ReferenceFields } from "./reference-fields";

export function DevotionalForm({ devotional, today }: { devotional?: Devotional; today: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<DevotionalFormInput>({
    resolver: zodResolver(devotionalSchema) as never,
    defaultValues: (devotional
      ? {
          slug: devotional.slug,
          title: devotional.title,
          book: devotional.reference.book,
          chapter: devotional.reference.chapter,
          verseStart: devotional.reference.verseStart ?? 1,
          verseEnd: devotional.reference.verseEnd ?? "",
          reflection: devotional.reflection,
          application: devotional.application,
          prayer: devotional.prayer,
          publishDate: devotional.publishDate,
          status: devotional.status,
        }
      : { slug: "", title: "", book: "", chapter: "", verseStart: "", verseEnd: "", reflection: "", application: "", prayer: "", publishDate: today, status: "draft" }) as unknown as DevotionalFormInput,
  });
  const e = form.formState.errors;

  return (
    <form
      noValidate
      className="space-y-5"
      onSubmit={form.handleSubmit(() =>
        start(async () => {
          setError(null);
          const res = await saveDevotional(devotional?.id ?? null, form.getValues());
          if (res && !res.ok) {
            setError(res.error);
            applyServerErrors(res, form.setError);
          }
        }),
      )}
    >
      {error && <Alert tone="danger">{error}</Alert>}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Título" error={e.title?.message}>
          {(p) => <Input {...p} {...form.register("title")} />}
        </Field>
        <Field label="Endereço (slug)" hint="Ex.: paz-em-meio-a-tempestade" error={e.slug?.message}>
          {(p) => <Input {...p} {...form.register("slug")} />}
        </Field>
      </div>
      <ReferenceFields register={form.register} errors={e} />
      <p className="-mt-2 text-xs text-muted">
        O texto bíblico é obtido automaticamente da Bíblia Livre pela referência. Não é preciso digitá-lo.
      </p>
      <Field label="Reflexão" hint="Separe parágrafos com uma linha em branco." error={e.reflection?.message}>
        {(p) => <Textarea {...p} rows={8} {...form.register("reflection")} />}
      </Field>
      <Field label="Aplicação prática" error={e.application?.message}>
        {(p) => <Textarea {...p} rows={3} {...form.register("application")} />}
      </Field>
      <Field label="Sugestão de oração" error={e.prayer?.message}>
        {(p) => <Textarea {...p} rows={3} {...form.register("prayer")} />}
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Data de publicação" error={e.publishDate?.message}>
          {(p) => <Input {...p} type="date" {...form.register("publishDate")} />}
        </Field>
        <Field label="Status" error={e.status?.message}>
          {(p) => (
            <Select {...p} {...form.register("status")}>
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
            </Select>
          )}
        </Field>
      </div>
      <FormFooter
        pending={pending}
        onDelete={devotional ? () => deleteDevotional(devotional.id) : undefined}
        onDeleteError={setError}
      />
    </form>
  );
}
