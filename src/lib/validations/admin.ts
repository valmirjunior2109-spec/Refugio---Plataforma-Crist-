import { z } from "zod";
import { isValidReference, parseReference } from "@/lib/bible/reference";
import { emptyToNull, isoDateSchema, optionalText, referenceSchema, slugSchema, text } from "./common";

const status = z.enum(["draft", "published"], { errorMap: () => ({ message: "Escolha o status." }) });
const verseNum = z.preprocess(emptyToNull, z.coerce.number().int().min(1).nullable());

export const devotionalSchema = z
  .object({
    slug: slugSchema,
    title: text(3, 120, "o título"),
    book: z.string().min(1, "Escolha o livro."),
    chapter: z.coerce.number().int().min(1, "Capítulo inválido."),
    verseStart: z.coerce.number().int().min(1, "Informe o versículo inicial."),
    verseEnd: verseNum,
    reflection: text(20, 6000, "a reflexão"),
    application: text(5, 2000, "a aplicação prática"),
    prayer: text(5, 2000, "a sugestão de oração"),
    publishDate: isoDateSchema,
    status,
  })
  .refine((d) => isValidReference({ book: d.book, chapter: d.chapter, verseStart: d.verseStart, verseEnd: d.verseEnd }), {
    message: "Essa referência não existe. Confira livro, capítulo e versículos.",
    path: ["chapter"],
  });

export type DevotionalFormInput = z.input<typeof devotionalSchema>;

/** Lista de referências em texto ("Salmos 23; João 3:16-17") para o painel. */
export const referenceListSchema = z
  .string()
  .transform((raw, ctx) => {
    const parts = raw
      .split(/[;\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
    const refs = [];
    for (const p of parts) {
      const ref = parseReference(p);
      if (!ref) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Não reconheci a referência "${p}".` });
        return z.NEVER;
      }
      refs.push(ref);
    }
    return refs;
  });

export const needSchema = z
  .object({
    topic: slugSchema,
    label: text(2, 60, "o rótulo"),
    title: text(3, 120, "o título"),
    book: z.string().min(1, "Escolha o livro."),
    chapter: z.coerce.number().int().min(1),
    verseStart: verseNum,
    verseEnd: verseNum,
    context: optionalText(3000, "a contextualização"),
    reflection: text(20, 6000, "a reflexão"),
    hope: optionalText(2000, "a mensagem de esperança"),
    prayer: optionalText(2000, "a oração"),
    furtherReadings: referenceListSchema,
    sortOrder: z.coerce.number().int().min(0).max(999).default(0),
    status,
  })
  .refine((d) => isValidReference({ book: d.book, chapter: d.chapter, verseStart: d.verseStart, verseEnd: d.verseEnd }), {
    message: "Essa referência não existe. Confira livro, capítulo e versículos.",
    path: ["chapter"],
  });

export type NeedFormInput = z.input<typeof needSchema>;

export const planDaySchema = z.object({
  title: text(1, 120, "o título do dia"),
  readings: referenceListSchema.pipe(z.array(referenceSchema).min(1, "Cada dia precisa de ao menos uma leitura.").max(10)),
  note: optionalText(1000, "a observação"),
});

export const planSchema = z.object({
  slug: slugSchema,
  title: text(3, 120, "o nome do plano"),
  description: text(10, 1000, "a descrição"),
  goal: text(5, 500, "o objetivo"),
  coverTone: z.enum(["sage", "sand", "deep", "ivory"]),
  coverMotif: z.enum(["arch", "sun", "waves", "leaf", "path", "stars"]),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
  status,
  days: z.array(planDaySchema).min(1, "Adicione pelo menos um dia de leitura.").max(400),
});

export type PlanFormInput = z.input<typeof planSchema>;

export const verseSchema = z
  .object({
    book: z.string().min(1, "Escolha o livro."),
    chapter: z.coerce.number().int().min(1),
    verseStart: z.coerce.number().int().min(1, "Informe o versículo inicial."),
    verseEnd: verseNum,
    theme: optionalText(60, "o tema"),
    isFeatured: z.coerce.boolean().default(false),
    status,
  })
  .refine((d) => isValidReference({ book: d.book, chapter: d.chapter, verseStart: d.verseStart, verseEnd: d.verseEnd }), {
    message: "Essa referência não existe. Confira livro, capítulo e versículos.",
    path: ["chapter"],
  });

export const feedbackStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["novo", "lido", "em-andamento", "resolvido", "arquivado"]),
});
