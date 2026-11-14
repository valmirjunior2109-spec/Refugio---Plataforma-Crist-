"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/supabase/require-user";
import { uuidSchema } from "@/lib/validations/common";
import { prayerEntrySchema } from "@/lib/validations/prayer";
import type { ActionResult } from "@/types/actions";

function toRow(data: ReturnType<typeof prayerEntrySchema.parse>) {
  return {
    title: data.title,
    content: data.content,
    category: data.category,
    tags: data.tags,
    entry_date: data.entryDate,
  };
}

export async function createPrayerEntry(input: unknown): Promise<ActionResult> {
  const parsed = prayerEntrySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Confira os campos destacados.", fieldErrors: parsed.error.flatten().fieldErrors };
  const auth = await requireUser();
  if (auth.error) return auth.error;
  const { error } = await auth.ctx.supabase.from("prayer_entries").insert(toRow(parsed.data));
  if (error) return { ok: false, error: "Não foi possível salvar agora. Seu texto continua aqui; tente novamente." };
  revalidatePath("/oracoes");
  redirect("/oracoes?salvo=1");
}

export async function updatePrayerEntry(id: unknown, input: unknown): Promise<ActionResult> {
  const idParsed = uuidSchema.safeParse(id);
  if (!idParsed.success) return { ok: false, error: "Registro inválido." };
  const parsed = prayerEntrySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Confira os campos destacados.", fieldErrors: parsed.error.flatten().fieldErrors };
  const auth = await requireUser();
  if (auth.error) return auth.error;
  const { data, error } = await auth.ctx.supabase
    .from("prayer_entries")
    .update(toRow(parsed.data))
    .eq("id", idParsed.data)
    .select("id");
  if (error) return { ok: false, error: "Não foi possível salvar as alterações agora." };
  if (!data?.length) return { ok: false, error: "Registro não encontrado." };
  revalidatePath("/oracoes");
  return { ok: true, message: "Alterações salvas." };
}

export async function deletePrayerEntry(id: unknown): Promise<ActionResult> {
  const idParsed = uuidSchema.safeParse(id);
  if (!idParsed.success) return { ok: false, error: "Registro inválido." };
  const auth = await requireUser();
  if (auth.error) return auth.error;
  const { error } = await auth.ctx.supabase.from("prayer_entries").delete().eq("id", idParsed.data);
  if (error) return { ok: false, error: "Não foi possível excluir agora." };
  revalidatePath("/oracoes");
  redirect("/oracoes?excluido=1");
}

/** Apaga todo o diário (configurações → seus dados). */
export async function deleteAllPrayerEntries(): Promise<ActionResult> {
  const auth = await requireUser();
  if (auth.error) return auth.error;
  const { error } = await auth.ctx.supabase.from("prayer_entries").delete().eq("user_id", auth.ctx.user.id);
  if (error) return { ok: false, error: "Não foi possível apagar agora." };
  revalidatePath("/oracoes");
  return { ok: true, message: "Todos os registros do diário foram apagados." };
}
