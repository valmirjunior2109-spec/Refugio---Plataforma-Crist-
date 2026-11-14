import { z } from "zod";
import { cleanText, text } from "./common";

export const FEEDBACK_KINDS = [
  { value: "sugestao", label: "Sugestão" },
  { value: "critica", label: "Crítica construtiva" },
  { value: "problema", label: "Problema encontrado" },
  { value: "ideia", label: "Ideia de funcionalidade" },
  { value: "avaliacao", label: "Avaliação da experiência" },
] as const;

const kinds = FEEDBACK_KINDS.map((k) => k.value) as [string, ...string[]];

export const feedbackSchema = z.object({
  kind: z.enum(kinds, { errorMap: () => ({ message: "Escolha o tipo de mensagem." }) }),
  message: text(10, 3000, "sua mensagem"),
  rating: z.preprocess(
    (v) => (v === "" || v == null ? null : Number(v)),
    z.number().int().min(1).max(5).nullable(),
  ),
  contactEmail: z
    .string()
    .optional()
    .transform((v) => cleanText(v ?? ""))
    .pipe(z.union([z.literal(""), z.string().email("Esse e-mail não parece válido.").max(254)])),
  page: z.string().max(200).optional(),
  /** Campo-isca invisível: pessoas não preenchem; robôs costumam preencher. */
  website: z.string().max(0).optional(),
  /** Momento em que o formulário foi aberto (ms). Envios instantâneos são descartados. */
  startedAt: z.coerce.number().optional(),
});

export type FeedbackInput = z.input<typeof feedbackSchema>;

export const FEEDBACK_STATUSES = [
  ["novo", "Novo"],
  ["lido", "Lido"],
  ["em-andamento", "Em andamento"],
  ["resolvido", "Resolvido"],
  ["arquivado", "Arquivado"],
] as const;
