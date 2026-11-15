"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/supabase/require-user";
import { SITE } from "@/lib/site";
import {
  deleteAccountSchema,
  forgotPasswordSchema,
  profileSchema,
  resetPasswordSchema,
  safeNextPath,
  signInSchema,
  signUpSchema,
} from "@/lib/validations/auth";
import { checkRateLimit } from "@/lib/utils/rate-limit";
import { DEMO_MODE_ERROR, type ActionResult } from "@/types/actions";

const fieldErrors = (e: { flatten: () => { fieldErrors: Record<string, string[] | undefined> } }) => e.flatten().fieldErrors;

export async function signIn(input: unknown, next?: unknown): Promise<ActionResult> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Confira os campos.", fieldErrors: fieldErrors(parsed.error) };
  if (!checkRateLimit(`signin:${parsed.data.email}`, { limit: 8, windowMs: 10 * 60_000 })) {
    return { ok: false, error: "Muitas tentativas. Aguarde alguns minutos e tente novamente." };
  }
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: DEMO_MODE_ERROR };
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    if (error.code === "email_not_confirmed") {
      return { ok: false, error: "Confirme seu e-mail pelo link que enviamos antes de entrar." };
    }
    return { ok: false, error: "E-mail ou senha incorretos." };
  }
  revalidatePath("/", "layout");
  redirect(safeNextPath(next));
}

export async function signUp(input: unknown): Promise<ActionResult> {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Confira os campos.", fieldErrors: fieldErrors(parsed.error) };
  if (!checkRateLimit(`signup:${parsed.data.email}`, { limit: 3, windowMs: 60 * 60_000 })) {
    return { ok: false, error: "Muitas tentativas. Tente novamente mais tarde." };
  }
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: DEMO_MODE_ERROR };
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${SITE.url}/auth/confirmar?next=/`,
      data: { display_name: parsed.data.displayName, accepted_terms: true },
    },
  });
  if (error) {
    if (error.code === "weak_password") return { ok: false, error: "Escolha uma senha mais forte." };
    return { ok: false, error: "Não foi possível criar a conta agora. Tente novamente." };
  }
  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/meu-espaco?bem-vindo=1");
  }
  // Mesma mensagem exista ou não a conta, para não revelar e-mails cadastrados.
  return { ok: true, message: "Quase lá! Enviamos um link de confirmação para o seu e-mail." };
}

export async function requestPasswordReset(input: unknown): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Confira o e-mail.", fieldErrors: fieldErrors(parsed.error) };
  if (!checkRateLimit(`reset:${parsed.data.email}`, { limit: 3, windowMs: 60 * 60_000 })) {
    return { ok: false, error: "Muitas tentativas. Tente novamente mais tarde." };
  }
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: DEMO_MODE_ERROR };
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${SITE.url}/auth/confirmar?next=/redefinir-senha`,
  });
  return {
    ok: true,
    message: "Se houver uma conta com esse e-mail, você receberá um link para criar uma nova senha.",
  };
}

export async function updatePassword(input: unknown): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Confira os campos.", fieldErrors: fieldErrors(parsed.error) };
  const auth = await requireUser();
  if (auth.error) return { ok: false, error: "O link expirou. Peça um novo link de recuperação." };
  const { error } = await auth.ctx.supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { ok: false, error: "Não foi possível atualizar a senha. Tente outra senha." };
  return { ok: true, message: "Senha atualizada." };
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function updateProfile(input: unknown): Promise<ActionResult> {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Confira os campos.", fieldErrors: fieldErrors(parsed.error) };
  const auth = await requireUser();
  if (auth.error) return auth.error;
  const { supabase, user } = auth.ctx;
  const { error } = await supabase.from("profiles").update({ display_name: parsed.data.displayName }).eq("id", user.id);
  if (error) return { ok: false, error: "Não foi possível salvar agora." };
  await supabase.auth.updateUser({ data: { display_name: parsed.data.displayName } });
  revalidatePath("/meu-espaco", "layout");
  return { ok: true, message: "Perfil atualizado." };
}

/** Exclusão definitiva da conta e de todos os dados pessoais (LGPD, art. 18). */
export async function deleteAccount(input: unknown): Promise<ActionResult> {
  const parsed = deleteAccountSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Digite EXCLUIR para confirmar.", fieldErrors: fieldErrors(parsed.error) };
  const auth = await requireUser();
  if (auth.error) return auth.error;
  const { error } = await auth.ctx.supabase.rpc("delete_my_account");
  if (error) return { ok: false, error: "Não foi possível excluir a conta agora. Tente novamente ou fale conosco." };
  await auth.ctx.supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/?conta-excluida=1");
}
