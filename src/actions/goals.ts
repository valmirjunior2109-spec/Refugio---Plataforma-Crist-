"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/supabase/require-user";
import { uuidSchema } from "@/lib/validations/common";
import { goalSchema } from "@/lib/validations/prayer";
import type { ActionResult } from "@/types/actions";

function refresh() {
  revalidatePath("/meu-espaco");
  revalidatePath("/meu-espaco/objetivos");
}

export async function createGoal(input: unknown): Promise<ActionResult> {
  const parsed = goalSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Confira os campos.", fieldErrors: parsed.error.flatten().fieldErrors };
  const auth = await requireUser();
  if (auth.error) return auth.error;
  const { error } = await auth.ctx.supabase
    .from("spiritual_goals")
    .insert({ title: parsed.data.title, description: parsed.data.description || null });
  if (error) return { ok: false, error: "Não foi possível salvar agora." };
  refresh();
  return { ok: true, message: "Objetivo adicionado." };
}

export async function toggleGoal(id: unknown, done: unknown): Promise<ActionResult> {
  const idParsed = uuidSchema.safeParse(id);
  if (!idParsed.success || typeof done !== "boolean") return { ok: false, error: "Objetivo inválido." };
  const auth = await requireUser();
  if (auth.error) return auth.error;
  const { error } = await auth.ctx.supabase
    .from("spiritual_goals")
    .update({ is_done: done, done_at: done ? new Date().toISOString() : null })
    .eq("id", idParsed.data);
  if (error) return { ok: false, error: "Não foi possível atualizar agora." };
  refresh();
  return { ok: true };
}

export async function deleteGoal(id: unknown): Promise<ActionResult> {
  const idParsed = uuidSchema.safeParse(id);
  if (!idParsed.success) return { ok: false, error: "Objetivo inválido." };
  const auth = await requireUser();
  if (auth.error) return auth.error;
  const { error } = await auth.ctx.supabase.from("spiritual_goals").delete().eq("id", idParsed.data);
  if (error) return { ok: false, error: "Não foi possível excluir agora." };
  refresh();
  return { ok: true, message: "Objetivo removido." };
}
