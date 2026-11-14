"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Trash2 } from "lucide-react";
import { createVerse, deleteVerse } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { Checkbox, Field, Input, Select } from "@/components/ui/form";
import { ActionStatus } from "@/components/ui/action-status";
import { EmptyState } from "@/components/ui/feedback-states";
import { applyServerErrors } from "@/hooks/use-server-errors";
import { formatReference } from "@/lib/bible/reference";
import { verseSchema } from "@/lib/validations/admin";
import type { BibleReference } from "@/lib/bible/reference";
import { ReferenceFields } from "./reference-fields";

interface VerseRow {
  id: string;
  reference: BibleReference;
  theme: string | null;
  isFeatured: boolean;
  status: string;
}

export function VerseManager({ verses }: { verses: VerseRow[] }) {
  const [pending, start] = useTransition();
  const [status, setStatus] = useState<{ message: string | null; tone: "ok" | "error" }>({ message: null, tone: "ok" });
  const form = useForm<z.input<typeof verseSchema>>({
    resolver: zodResolver(verseSchema) as never,
    defaultValues: { book: "", chapter: "", verseStart: "", verseEnd: "", theme: "", isFeatured: false, status: "published" } as never,
  });

  const run = (fn: () => Promise<{ ok: boolean; message?: string; error?: string }>) =>
    start(async () => {
      const res = await fn();
      setStatus(res.ok ? { message: res.message ?? null, tone: "ok" } : { message: res.error ?? "Erro.", tone: "error" });
    });

  return (
    <div className="space-y-8">
      <form
        noValidate
        className="space-y-4 rounded-2xl border border-line bg-surface p-5"
        onSubmit={form.handleSubmit(() =>
          run(async () => {
            const res = await createVerse(form.getValues());
            applyServerErrors(res, form.setError);
            if (res.ok) form.reset();
            return res;
          }),
        )}
      >
        <h2 className="font-medium text-ink">Adicionar versículo de referência</h2>
        <ReferenceFields register={form.register} errors={form.formState.errors} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tema" optional hint="Ex.: esperança, paz, gratidão">
            {(p) => <Input {...p} maxLength={60} {...form.register("theme")} />}
          </Field>
          <Field label="Status">
            {(p) => (
              <Select {...p} {...form.register("status")}>
                <option value="published">Publicado</option>
                <option value="draft">Rascunho</option>
              </Select>
            )}
          </Field>
        </div>
        <Checkbox label="Destacar este versículo" {...form.register("isFeatured")} />
        <Button type="submit" loading={pending}>
          Adicionar
        </Button>
        <ActionStatus message={status.message} tone={status.tone} />
      </form>

      {verses.length === 0 ? (
        <EmptyState title="Nenhum versículo cadastrado" description="Versículos de referência ajudam a organizar conteúdos por tema." />
      ) : (
        <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
          {verses.map((v) => (
            <li key={v.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
              <span>
                <span className="font-medium text-ink">{formatReference(v.reference)}</span>
                {v.theme && <span className="text-sm text-muted"> · {v.theme}</span>}
              </span>
              <span className="flex items-center gap-2">
                {v.isFeatured && <Badge tone="brand">Destaque</Badge>}
                <Badge tone={v.status === "published" ? "success" : "neutral"}>{v.status === "published" ? "Publicado" : "Rascunho"}</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label={`Remover ${formatReference(v.reference)}`}
                  onClick={() => confirm("Remover este versículo?") && run(() => deleteVerse(v.id))}
                >
                  <Trash2 className="size-4" aria-hidden />
                </Button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
