"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getPassage, passageText } from "@/lib/bible/text";
import { plainScripture } from "@/lib/bible/format";
import { requireUser } from "@/lib/supabase/require-user";
import { referenceSchema, uuidSchema } from "@/lib/validations/common";
import { refToRow } from "@/services/mappers";
import type { ActionResult } from "@/types/actions";

/**
 * Salva um versículo. O texto é obtido no servidor, a partir da referência,
 * e nunca recebido do navegador: assim o registro sempre corresponde à fonte.
 */
export async function saveVerse(input: unknown): Promise<ActionResult> {
  const parsed = referenceSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Referência inválida." };
  const ref = { ...parsed.data, verseStart: parsed.data.verseStart ?? 1 };

  const passage = await getPassage(ref);
  if (!passage) return { ok: false, error: "Não encontramos esse versículo." };

  const auth = await requireUser();
  if (auth.error) return auth.error;
  const { supabase } = auth.ctx;

  const { error } = await supabase.from("saved_verses").insert({
    ...refToRow(ref),
    text_snapshot: plainScripture(passageText(passage)).slice(0, 4000),
  });
  if (error && error.code !== "23505") return { ok: false, error: "Não foi possível salvar agora. Tente novamente." };

  revalidatePath("/meu-espaco");
  return { ok: true, message: error ? "Este versículo já estava salvo." : "Versículo salvo no seu espaço." };
}

export async function removeSavedVerse(id: unknown): Promise<ActionResult> {
  const parsed = uuidSchema.safeParse(id);
  if (!parsed.success) return { ok: false, error: "Registro inválido." };
  const auth = await requireUser();
  if (auth.error) return auth.error;
  const { error } = await auth.ctx.supabase.from("saved_verses").delete().eq("id", parsed.data);
  if (error) return { ok: false, error: "Não foi possível remover agora." };
  revalidatePath("/meu-espaco");
  revalidatePath("/meu-espaco/versiculos");
  return { ok: true, message: "Versículo removido." };
}

const favoriteSchema = z.object({
  kind: z.enum(["devotional", "need"]),
  targetId: uuidSchema,
});

/** Marca ou desmarca uma reflexão como favorita. */
export async function toggleFavorite(input: unknown): Promise<ActionResult<{ favorited: boolean }>> {
  const parsed = favoriteSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Conteúdo inválido." };
  const auth = await requireUser();
  if (auth.error) return auth.error;
  const { supabase } = auth.ctx;
  const column = parsed.data.kind === "devotional" ? "devotional_id" : "reflection_id";

  const { data: existing } = await supabase
    .from("favorite_reflections")
    .select("id")
    .eq(column, parsed.data.targetId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from("favorite_reflections").delete().eq("id", existing.id);
    if (error) return { ok: false, error: "Não foi possível atualizar agora." };
    revalidatePath("/meu-espaco");
    return { ok: true, message: "Removido dos favoritos.", data: { favorited: false } };
  }

  const row = {
    devotional_id: parsed.data.kind === "devotional" ? parsed.data.targetId : null,
    reflection_id: parsed.data.kind === "need" ? parsed.data.targetId : null,
  };
  const { error } = await supabase.from("favorite_reflections").insert(row);
  if (error) return { ok: false, error: "Não foi possível favoritar agora." };
  revalidatePath("/meu-espaco");
  return { ok: true, message: "Guardado nos seus favoritos.", data: { favorited: true } };
}
