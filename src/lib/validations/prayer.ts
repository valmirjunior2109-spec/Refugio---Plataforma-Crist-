import { z } from "zod";
import { PRAYER_CATEGORIES } from "@/types/user";
import { cleanText, isoDateSchema, optionalText, text } from "./common";

const categoryValues = PRAYER_CATEGORIES.map((c) => c.value) as [string, ...string[]];

export const tagsSchema = z
  .string()
  .optional()
  .transform((raw) =>
    Array.from(
      new Set(
        (raw ?? "")
          .split(",")
          .map((t) => cleanText(t).toLowerCase().replace(/^#/, ""))
          .filter(Boolean),
      ),
    ),
  )
  .pipe(
    z
      .array(z.string().max(30, "Cada marcador pode ter no máximo 30 caracteres."))
      .max(8, "Use no máximo 8 marcadores."),
  );

export const prayerEntrySchema = z.object({
  title: text(1, 120, "um título"),
  content: text(1, 10000, "o que deseja registrar"),
  category: z.enum(categoryValues, { errorMap: () => ({ message: "Escolha uma categoria." }) }),
  tags: tagsSchema,
  entryDate: isoDateSchema,
});

export type PrayerEntryInput = z.input<typeof prayerEntrySchema>;
export type PrayerEntryData = z.output<typeof prayerEntrySchema>;

export const prayerFilterSchema = z.object({
  from: isoDateSchema.optional().catch(undefined),
  to: isoDateSchema.optional().catch(undefined),
  categoria: z.enum(categoryValues).optional().catch(undefined),
  q: z.string().max(80).optional().catch(undefined),
});

export const goalSchema = z.object({
  title: text(2, 120, "o objetivo"),
  description: optionalText(1000, "a descrição"),
});
