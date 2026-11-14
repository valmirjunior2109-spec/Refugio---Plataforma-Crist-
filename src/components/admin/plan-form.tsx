"use client";

import { useState, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import { deletePlan, savePlan } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Alert } from "@/components/ui/feedback-states";
import { PlanCover } from "@/components/reading-plans/plan-cover";
import { applyServerErrors } from "@/hooks/use-server-errors";
import { formatReference } from "@/lib/bible/reference";
import { planSchema, type PlanFormInput } from "@/lib/validations/admin";
import type { CoverMotif, CoverTone, ReadingPlan } from "@/types/content";
import { FormFooter } from "./form-footer";

const TONES: [CoverTone, string][] = [
  ["sage", "Sálvia"],
  ["sand", "Areia"],
  ["deep", "Verde profundo"],
  ["ivory", "Marfim"],
];
const MOTIFS: [CoverMotif, string][] = [
  ["arch", "Arco"],
  ["sun", "Sol nascente"],
  ["waves", "Águas"],
  ["leaf", "Folha"],
  ["path", "Caminho"],
  ["stars", "Estrelas"],
];

export function PlanForm({ plan }: { plan?: ReadingPlan & { sortOrder: number } }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<PlanFormInput>({
    resolver: zodResolver(planSchema) as never,
    defaultValues: plan
      ? {
          slug: plan.slug,
          title: plan.title,
          description: plan.description,
          goal: plan.goal,
          coverTone: plan.cover.tone,
          coverMotif: plan.cover.motif,
          sortOrder: plan.sortOrder,
          status: plan.status,
          days: plan.days.map((d) => ({
            title: d.title,
            readings: d.readings.map((r) => formatReference(r)).join("; "),
            note: d.note ?? "",
          })),
        }
      : {
          slug: "",
          title: "",
          description: "",
          goal: "",
          coverTone: "sage",
          coverMotif: "arch",
          sortOrder: 0,
          status: "draft",
          days: [{ title: "", readings: "", note: "" }],
        },
  });
  const { fields, append, remove, move } = useFieldArray({ control: form.control, name: "days" });
  const e = form.formState.errors;
  const tone = form.watch("coverTone") as CoverTone;
  const motif = form.watch("coverMotif") as CoverMotif;

  return (
    <form
      noValidate
      className="space-y-6"
      onSubmit={form.handleSubmit(() =>
        start(async () => {
          setError(null);
          const res = await savePlan(plan?.id ?? null, form.getValues());
          if (res && !res.ok) {
            setError(res.error);
            applyServerErrors(res, form.setError);
          }
        }),
      )}
    >
      {error && <Alert tone="danger">{error}</Alert>}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome do plano" error={e.title?.message}>
          {(p) => <Input {...p} {...form.register("title")} />}
        </Field>
        <Field label="Endereço (slug)" error={e.slug?.message}>
          {(p) => <Input {...p} {...form.register("slug")} />}
        </Field>
      </div>
      <Field label="Descrição" error={e.description?.message}>
        {(p) => <Textarea {...p} rows={3} {...form.register("description")} />}
      </Field>
      <Field label="Objetivo" error={e.goal?.message}>
        {(p) => <Textarea {...p} rows={2} {...form.register("goal")} />}
      </Field>

      <div className="grid gap-4 sm:grid-cols-[1fr_1fr_160px]">
        <div className="space-y-4">
          <Field label="Cor da capa">
            {(p) => (
              <Select {...p} {...form.register("coverTone")}>
                {TONES.map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <Field label="Ilustração">
            {(p) => (
              <Select {...p} {...form.register("coverMotif")}>
                {MOTIFS.map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </Select>
            )}
          </Field>
        </div>
        <div className="space-y-4">
          <Field label="Ordem de exibição" error={e.sortOrder?.message}>
            {(p) => <Input {...p} type="number" min={0} {...form.register("sortOrder")} />}
          </Field>
          <Field label="Status">
            {(p) => (
              <Select {...p} {...form.register("status")}>
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
              </Select>
            )}
          </Field>
        </div>
        <div className="aspect-[16/9] self-end overflow-hidden rounded-xl border border-line">
          <PlanCover cover={{ tone, motif }} />
        </div>
      </div>

      <fieldset className="space-y-3">
        <legend className="mb-2 font-medium text-ink">Leituras diárias ({fields.length})</legend>
        {typeof e.days?.message === "string" && <p className="text-sm text-danger">{e.days.message}</p>}
        <ol className="space-y-3">
          {fields.map((f, i) => {
            const de = e.days?.[i];
            return (
              <li key={f.id} className="rounded-2xl border border-line p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-brand-ink">Dia {i + 1}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" aria-label={`Mover dia ${i + 1} para cima`} disabled={i === 0} onClick={() => move(i, i - 1)}>
                      <ArrowUp className="size-4" aria-hidden />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label={`Mover dia ${i + 1} para baixo`}
                      disabled={i === fields.length - 1}
                      onClick={() => move(i, i + 1)}
                    >
                      <ArrowDown className="size-4" aria-hidden />
                    </Button>
                    <Button variant="ghost" size="sm" aria-label={`Remover dia ${i + 1}`} disabled={fields.length === 1} onClick={() => remove(i)}>
                      <X className="size-4" aria-hidden />
                    </Button>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Título do dia" error={de?.title?.message}>
                    {(p) => <Input {...p} {...form.register(`days.${i}.title` as const)} />}
                  </Field>
                  <Field label="Leituras" hint="Ex.: Salmos 23; João 10:1-18" error={de?.readings?.message}>
                    {(p) => <Input {...p} {...form.register(`days.${i}.readings` as const)} />}
                  </Field>
                </div>
              </li>
            );
          })}
        </ol>
        <Button variant="secondary" size="sm" icon={<Plus className="size-4" aria-hidden />} onClick={() => append({ title: "", readings: "", note: "" })}>
          Adicionar dia
        </Button>
        {plan && (
          <p className="text-xs text-muted">
            Atenção: o progresso das pessoas é guardado por número do dia. Reordenar dias de um plano publicado altera
            quais leituras aparecem como concluídas.
          </p>
        )}
      </fieldset>

      <FormFooter pending={pending} onDelete={plan ? () => deletePlan(plan.id) : undefined} onDeleteError={setError} />
    </form>
  );
}
