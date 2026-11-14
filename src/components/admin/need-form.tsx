"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { deleteNeed, saveNeed } from "@/actions/admin";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Alert } from "@/components/ui/feedback-states";
import { applyServerErrors } from "@/hooks/use-server-errors";
import { formatReference } from "@/lib/bible/reference";
import { needSchema, type NeedFormInput } from "@/lib/validations/admin";
import type { NeedReflection } from "@/types/content";
import { FormFooter } from "./form-footer";
import { ReferenceFields } from "./reference-fields";

export function NeedForm({ need }: { need?: NeedReflection & { sortOrder: number } }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<NeedFormInput>({
    resolver: zodResolver(needSchema) as never,
    defaultValues: (need
      ? {
          topic: need.topic,
          label: need.label,
          title: need.title,
          book: need.reference.book,
          chapter: need.reference.chapter,
          verseStart: need.reference.verseStart ?? "",
          verseEnd: need.reference.verseEnd ?? "",
          context: need.context,
          reflection: need.reflection,
          hope: need.hope,
          prayer: need.prayer,
          furtherReadings: need.furtherReadings.map((r) => formatReference(r)).join("; "),
          sortOrder: need.sortOrder,
          status: need.status,
        }
      : { topic: "", label: "", title: "", book: "", chapter: "", verseStart: "", verseEnd: "", context: "", reflection: "", hope: "", prayer: "", furtherReadings: "", sortOrder: 0, status: "draft" }) as unknown as NeedFormInput,
  });
  const e = form.formState.errors;

  return (
    <form
      noValidate
      className="space-y-5"
      onSubmit={form.handleSubmit(() =>
        start(async () => {
          setError(null);
          const res = await saveNeed(need?.id ?? null, form.getValues());
          if (res && !res.ok) {
            setError(res.error);
            applyServerErrors(res, form.setError);
          }
        }),
      )}
    >
      {error && <Alert tone="danger">{error}</Alert>}
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Rótulo" hint="Ex.: Estou triste" error={e.label?.message}>
          {(p) => <Input {...p} {...form.register("label")} />}
        </Field>
        <Field label="Identificador" hint="Ex.: triste" error={e.topic?.message}>
          {(p) => <Input {...p} {...form.register("topic")} />}
        </Field>
        <Field label="Ordem" error={e.sortOrder?.message}>
          {(p) => <Input {...p} type="number" min={0} {...form.register("sortOrder")} />}
        </Field>
      </div>
      <Field label="Título" error={e.title?.message}>
        {(p) => <Input {...p} {...form.register("title")} />}
      </Field>
      <ReferenceFields register={form.register} errors={e} verseRequired={false} />
      <Field label="Contextualização da passagem" optional error={e.context?.message}>
        {(p) => <Textarea {...p} rows={3} {...form.register("context")} />}
      </Field>
      <Field label="Reflexão acolhedora" error={e.reflection?.message}>
        {(p) => <Textarea {...p} rows={7} {...form.register("reflection")} />}
      </Field>
      <Field label="Mensagem de esperança" optional error={e.hope?.message}>
        {(p) => <Textarea {...p} rows={3} {...form.register("hope")} />}
      </Field>
      <Field label="Sugestão de oração" optional error={e.prayer?.message}>
        {(p) => <Textarea {...p} rows={3} {...form.register("prayer")} />}
      </Field>
      <Field
        label="Leituras complementares"
        optional
        hint="Separe com ponto e vírgula. Ex.: Salmos 23; João 14:1-3"
        error={e.furtherReadings?.message}
      >
        {(p) => <Input {...p} {...form.register("furtherReadings")} />}
      </Field>
      <Field label="Status" error={e.status?.message}>
        {(p) => (
          <Select {...p} {...form.register("status")} className="sm:w-60">
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
          </Select>
        )}
      </Field>
      <FormFooter pending={pending} onDelete={need ? () => deleteNeed(need.id) : undefined} onDeleteError={setError} />
    </form>
  );
}
