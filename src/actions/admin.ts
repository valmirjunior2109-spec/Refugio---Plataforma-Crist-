"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/supabase/require-user";
import { uuidSchema } from "@/lib/validations/common";
import {
  devotionalSchema,
  feedbackStatusSchema,
  needSchema,
  planSchema,
  verseSchema,
} from "@/lib/validations/admin";
import type { ActionResult } from "@/types/actions";

/**
 * Ações do painel. Cada uma verifica o papel no servidor (requireStaff)
 * e o banco verifica de novo pelas políticas RLS (is_staff()).
 */

const invalid = (e: { flatten: () => { fieldErrors: Record<string, string[] | undefined>; formErrors: string[] } }): ActionResult => {
  const f = e.flatten();
  return { ok: false, error: f.formErrors[0] ?? "Confira os campos destacados.", fieldErrors: f.fieldErrors };
};

function dbError(error: { code?: string; message: string }): ActionResult {
  if (error.code === "23505") return { ok: false, error: "Já existe um item com esse endereço (slug) ou tema." };
  if (error.code === "42501") return { ok: false, error: "Você não tem permissão para esta ação." };
  return { ok: false, error: "Não foi possível salvar. Confira os dados e tente novamente." };
}

function refreshPublic() {
  revalidatePath("/", "layout");
}

// ── Palavras do dia ──────────────────────────────────────────

export async function saveDevotional(id: string | null, input: unknown): Promise<ActionResult> {
  const parsed = devotionalSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const auth = await requireStaff();
  if (auth.error) return auth.error;
  const d = parsed.data;
  const row = {
    slug: d.slug,
    title: d.title,
    book: d.book,
    chapter: d.chapter,
    verse_start: d.verseStart,
    verse_end: d.verseEnd && d.verseEnd !== d.verseStart ? d.verseEnd : null,
    reflection: d.reflection,
    application: d.application,
    prayer: d.prayer,
    publish_date: d.publishDate,
    status: d.status,
  };
  const { supabase, user } = auth.ctx;
  const { error } = id
    ? await supabase.from("daily_devotionals").update(row).eq("id", uuidSchema.parse(id))
    : await supabase.from("daily_devotionals").insert({ ...row, created_by: user.id });
  if (error) return dbError(error);
  refreshPublic();
  redirect("/admin/palavras?salvo=1");
}

export async function deleteDevotional(id: unknown): Promise<ActionResult> {
  const parsed = uuidSchema.safeParse(id);
  if (!parsed.success) return { ok: false, error: "Item inválido." };
  const auth = await requireStaff();
  if (auth.error) return auth.error;
  const { error } = await auth.ctx.supabase.from("daily_devotionals").delete().eq("id", parsed.data);
  if (error) return dbError(error);
  refreshPublic();
  redirect("/admin/palavras?excluido=1");
}

// ── Preciso de uma palavra ───────────────────────────────────

export async function saveNeed(id: string | null, input: unknown): Promise<ActionResult> {
  const parsed = needSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const auth = await requireStaff();
  if (auth.error) return auth.error;
  const d = parsed.data;
  const row = {
    kind: "need",
    topic: d.topic,
    label: d.label,
    title: d.title,
    book: d.book,
    chapter: d.chapter,
    verse_start: d.verseStart,
    verse_end: d.verseEnd,
    context: d.context,
    body: d.reflection,
    hope: d.hope,
    prayer: d.prayer,
    further_readings: d.furtherReadings,
    sort_order: d.sortOrder,
    status: d.status,
  };
  const { supabase, user } = auth.ctx;
  const { error } = id
    ? await supabase.from("reflections").update(row).eq("id", uuidSchema.parse(id))
    : await supabase.from("reflections").insert({ ...row, created_by: user.id });
  if (error) return dbError(error);
  refreshPublic();
  redirect("/admin/temas?salvo=1");
}

export async function deleteNeed(id: unknown): Promise<ActionResult> {
  const parsed = uuidSchema.safeParse(id);
  if (!parsed.success) return { ok: false, error: "Item inválido." };
  const auth = await requireStaff();
  if (auth.error) return auth.error;
  const { error } = await auth.ctx.supabase.from("reflections").delete().eq("id", parsed.data);
  if (error) return dbError(error);
  refreshPublic();
  redirect("/admin/temas?excluido=1");
}

// ── Planos de leitura ────────────────────────────────────────

export async function savePlan(id: string | null, input: unknown): Promise<ActionResult> {
  const parsed = planSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const auth = await requireStaff();
  if (auth.error) return auth.error;
  const { supabase, user } = auth.ctx;
  const d = parsed.data;
  const row = {
    slug: d.slug,
    title: d.title,
    description: d.description,
    goal: d.goal,
    cover_tone: d.coverTone,
    cover_motif: d.coverMotif,
    sort_order: d.sortOrder,
    status: d.status,
  };

  let planId = id ? uuidSchema.parse(id) : null;
  if (planId) {
    const { error } = await supabase.from("reading_plans").update(row).eq("id", planId);
    if (error) return dbError(error);
  } else {
    const { data, error } = await supabase.from("reading_plans").insert({ ...row, created_by: user.id }).select("id").single();
    if (error) return dbError(error);
    planId = data.id as string;
  }

  // Dias: atualiza por número do dia (preserva o progresso de quem já leu) e remove os excedentes.
  const days = d.days.map((day, i) => ({
    plan_id: planId,
    day_number: i + 1,
    title: day.title,
    readings: day.readings,
    note: day.note || null,
  }));
  const { error: upsertError } = await supabase.from("reading_plan_days").upsert(days, { onConflict: "plan_id,day_number" });
  if (upsertError) return dbError(upsertError);
  const { error: trimError } = await supabase.from("reading_plan_days").delete().eq("plan_id", planId).gt("day_number", days.length);
  if (trimError) return dbError(trimError);

  refreshPublic();
  redirect("/admin/planos?salvo=1");
}

export async function deletePlan(id: unknown): Promise<ActionResult> {
  const parsed = uuidSchema.safeParse(id);
  if (!parsed.success) return { ok: false, error: "Item inválido." };
  const auth = await requireStaff();
  if (auth.error) return auth.error;
  const { error } = await auth.ctx.supabase.from("reading_plans").delete().eq("id", parsed.data);
  if (error) return dbError(error);
  refreshPublic();
  redirect("/admin/planos?excluido=1");
}

// ── Versículos ───────────────────────────────────────────────

export async function createVerse(input: unknown): Promise<ActionResult> {
  const parsed = verseSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const auth = await requireStaff();
  if (auth.error) return auth.error;
  const d = parsed.data;
  const { error } = await auth.ctx.supabase.from("bible_verses").insert({
    book: d.book,
    chapter: d.chapter,
    verse_start: d.verseStart,
    verse_end: d.verseEnd && d.verseEnd !== d.verseStart ? d.verseEnd : null,
    theme: d.theme || null,
    is_featured: d.isFeatured,
    status: d.status,
    created_by: auth.ctx.user.id,
  });
  if (error) return dbError(error);
  revalidatePath("/admin/versiculos");
  return { ok: true, message: "Versículo adicionado." };
}

export async function deleteVerse(id: unknown): Promise<ActionResult> {
  const parsed = uuidSchema.safeParse(id);
  if (!parsed.success) return { ok: false, error: "Item inválido." };
  const auth = await requireStaff();
  if (auth.error) return auth.error;
  const { error } = await auth.ctx.supabase.from("bible_verses").delete().eq("id", parsed.data);
  if (error) return dbError(error);
  revalidatePath("/admin/versiculos");
  return { ok: true, message: "Versículo removido." };
}

// ── Feedbacks ────────────────────────────────────────────────

export async function setFeedbackStatus(input: unknown): Promise<ActionResult> {
  const parsed = feedbackStatusSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Status inválido." };
  const auth = await requireStaff();
  if (auth.error) return auth.error;
  const { error } = await auth.ctx.supabase.from("feedbacks").update({ status: parsed.data.status }).eq("id", parsed.data.id);
  if (error) return dbError(error);
  revalidatePath("/admin/feedbacks");
  revalidatePath("/admin");
  return { ok: true };
}
