"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Check, Plus, Trash2 } from "lucide-react";
import { createGoal, deleteGoal, toggleGoal } from "@/actions/goals";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { ActionStatus } from "@/components/ui/action-status";
import { EmptyState } from "@/components/ui/feedback-states";
import { goalSchema } from "@/lib/validations/prayer";
import { cn } from "@/lib/utils/cn";
import type { SpiritualGoal } from "@/types/user";

export function GoalsManager({ goals }: { goals: SpiritualGoal[] }) {
  const [pending, start] = useTransition();
  const [status, setStatus] = useState<{ message: string | null; tone: "ok" | "error" }>({ message: null, tone: "ok" });
  const form = useForm<z.input<typeof goalSchema>>({ resolver: zodResolver(goalSchema), defaultValues: { title: "", description: "" } });

  const run = (fn: () => Promise<{ ok: boolean; message?: string; error?: string }>) =>
    start(async () => {
      const res = await fn();
      setStatus(res.ok ? { message: res.message ?? null, tone: "ok" } : { message: res.error ?? "Erro.", tone: "error" });
    });

  return (
    <div className="space-y-8">
      <form
        noValidate
        onSubmit={form.handleSubmit((values) =>
          run(async () => {
            const res = await createGoal(values);
            if (res.ok) form.reset();
            return res;
          }),
        )}
        className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5 sm:flex-row sm:items-start"
      >
        <Field label="Novo objetivo" className="flex-1" error={form.formState.errors.title?.message}>
          {(p) => <Input {...p} placeholder="Ex.: Ler um salmo antes de dormir" maxLength={120} {...form.register("title")} />}
        </Field>
        <Button type="submit" className="sm:mt-7" loading={pending} icon={<Plus className="size-4" aria-hidden />}>
          Adicionar
        </Button>
      </form>
      <ActionStatus message={status.message} tone={status.tone} />

      {goals.length === 0 ? (
        <EmptyState
          title="Nenhum objetivo por enquanto"
          description="Objetivos são opcionais. Use-os como lembretes gentis, nunca como cobrança."
        />
      ) : (
        <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
          {goals.map((g) => (
            <li key={g.id} className="flex items-center gap-3 px-4 py-3">
              <button
                type="button"
                aria-pressed={g.isDone}
                aria-label={g.isDone ? `Reabrir: ${g.title}` : `Marcar como alcançado: ${g.title}`}
                onClick={() => run(() => toggleGoal(g.id, !g.isDone))}
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full border transition-colors",
                  g.isDone ? "border-brand bg-brand text-white" : "border-line-strong hover:border-brand",
                )}
              >
                {g.isDone && <Check className="size-4" aria-hidden />}
              </button>
              <span className={cn("flex-1", g.isDone ? "text-muted line-through" : "text-ink")}>{g.title}</span>
              <Button
                variant="ghost"
                size="sm"
                aria-label={`Excluir objetivo: ${g.title}`}
                onClick={() => confirm("Excluir este objetivo?") && run(() => deleteGoal(g.id))}
              >
                <Trash2 className="size-4" aria-hidden />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
