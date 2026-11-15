import { z } from "zod";
import { text } from "./common";

const email = z
  .string({ required_error: "Informe seu e-mail." })
  .trim()
  .toLowerCase()
  .min(1, "Informe seu e-mail.")
  .max(254, "E-mail muito longo.")
  .email("Esse e-mail não parece válido.");

const password = z
  .string({ required_error: "Informe uma senha." })
  .min(8, "A senha precisa ter pelo menos 8 caracteres.")
  .max(72, "A senha pode ter no máximo 72 caracteres.");

export const signInSchema = z.object({
  email,
  password: z.string().min(1, "Informe sua senha."),
});

export const signUpSchema = z.object({
  displayName: text(1, 60, "como gostaria de ser chamado"),
  email,
  password,
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "Para criar a conta, é preciso concordar com os Termos e a Política de Privacidade." }),
  }),
});

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({ password, confirm: z.string() })
  .refine((v) => v.password === v.confirm, { message: "As senhas não coincidem.", path: ["confirm"] });

export const profileSchema = z.object({
  displayName: text(1, 60, "como gostaria de ser chamado"),
});

export const deleteAccountSchema = z.object({
  confirmation: z
    .string()
    .trim()
    .refine((v) => v.toUpperCase() === "EXCLUIR", 'Digite EXCLUIR para confirmar.'),
});

/** Garante que o redirecionamento pós-login fique dentro do próprio site. */
export function safeNextPath(next: unknown, fallback = "/"): string {
  if (typeof next !== "string") return fallback;
  if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}
