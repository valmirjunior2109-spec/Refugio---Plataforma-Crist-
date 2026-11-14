import { z } from "zod";
import { isValidReference } from "@/lib/bible/reference";
import { isIsoDate } from "@/lib/utils/dates";

/** Remove caracteres de controle (exceto quebras de linha) e espaços nas pontas. */
export function cleanText(value: string): string {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").replace(/\r\n?/g, "\n").trim();
}

export const text = (min: number, max: number, label: string) =>
  z
    .string({ required_error: `Informe ${label}.` })
    .transform(cleanText)
    .pipe(
      z
        .string()
        .min(min, min <= 1 ? `Informe ${label}.` : `${capitalize(label)} precisa ter pelo menos ${min} caracteres.`)
        .max(max, `${capitalize(label)} pode ter no máximo ${max} caracteres.`),
    );

export const optionalText = (max: number, label: string) =>
  z
    .string()
    .optional()
    .transform((v) => (v == null ? "" : cleanText(v)))
    .pipe(z.string().max(max, `${capitalize(label)} pode ter no máximo ${max} caracteres.`));

export const isoDateSchema = z
  .string()
  .refine((v) => isIsoDate(v), "Informe uma data válida.");

export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "O endereço precisa ter pelo menos 3 caracteres.")
  .max(80, "O endereço pode ter no máximo 80 caracteres.")
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use apenas letras minúsculas, números e hífens (ex.: paz-em-meio-a-tempestade).");

export const referenceSchema = z
  .object({
    book: z.string().min(1, "Escolha o livro."),
    chapter: z.coerce.number().int("Capítulo inválido.").min(1, "Capítulo inválido."),
    verseStart: z.coerce.number().int().min(1).nullable().optional(),
    verseEnd: z.coerce.number().int().min(1).nullable().optional(),
  })
  .refine((r) => isValidReference(r), { message: "Essa referência não existe na Bíblia. Confira livro, capítulo e versículos." });

export const uuidSchema = z.string().uuid("Identificador inválido.");

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Converte "" em undefined, útil para campos numéricos opcionais vindos de formulário. */
export const emptyToNull = (v: unknown) => (v === "" || v === undefined ? null : v);
