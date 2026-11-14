"use client";

import type { FieldErrors, FieldValues, Path, UseFormRegister } from "react-hook-form";
import { Field, Input, Select } from "@/components/ui/form";
import { BIBLE_BOOKS } from "@/lib/bible/books";

/** Campos de referência bíblica (livro, capítulo, versículos) para formulários do painel. */
export function ReferenceFields<T extends FieldValues>({
  register,
  errors,
  verseRequired = true,
}: {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  verseRequired?: boolean;
}) {
  const msg = (k: string) => (errors as Record<string, { message?: string } | undefined>)[k]?.message;
  return (
    <div className="grid gap-4 sm:grid-cols-[1.6fr_0.8fr_0.8fr_0.8fr]">
      <Field label="Livro" error={msg("book")}>
        {(p) => (
          <Select {...p} {...register("book" as Path<T>)}>
            <option value="">Escolha…</option>
            {BIBLE_BOOKS.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.name}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Field label="Capítulo" error={msg("chapter")}>
        {(p) => <Input {...p} type="number" min={1} inputMode="numeric" {...register("chapter" as Path<T>)} />}
      </Field>
      <Field label="Versículo inicial" optional={!verseRequired} error={msg("verseStart")}>
        {(p) => <Input {...p} type="number" min={1} inputMode="numeric" {...register("verseStart" as Path<T>)} />}
      </Field>
      <Field label="Versículo final" optional error={msg("verseEnd")}>
        {(p) => <Input {...p} type="number" min={1} inputMode="numeric" {...register("verseEnd" as Path<T>)} />}
      </Field>
    </div>
  );
}
