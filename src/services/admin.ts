import "server-only";
import { redirect } from "next/navigation";
import { createClient, isStaff } from "@/lib/supabase/server";
import type { Devotional, NeedReflection, ReadingPlan, ReadingPlanSummary } from "@/types/content";
import { devotionalFromRow, needFromRow, planFromRows, planSummaryFromRow, refFromRow } from "./mappers";
import type { BibleReference } from "@/lib/bible/reference";

/**
 * Leituras do painel (inclui rascunhos). A verificação de papel é feita aqui
 * e, novamente, pelas políticas RLS no banco (is_staff()).
 */
async function staffClient() {
  const supabase = await createClient();
  // Sem permissão (ou em modo demonstração): sai do painel, sem expor nada.
  if (!supabase || !(await isStaff())) redirect("/meu-espaco?sem-permissao=1");
  return supabase;
}

export async function adminCounts() {
  const s = await staffClient();
  const count = async (table: string, filter?: [string, string]) => {
    let q = s.from(table).select("*", { count: "exact", head: true });
    if (filter) q = q.eq(filter[0], filter[1]);
    const { count } = await q;
    return count ?? 0;
  };
  const [devotionals, needs, plans, verses, feedbackNew] = await Promise.all([
    count("daily_devotionals"),
    count("reflections"),
    count("reading_plans"),
    count("bible_verses"),
    count("feedbacks", ["status", "novo"]),
  ]);
  return { devotionals, needs, plans, verses, feedbackNew };
}

export async function adminListDevotionals(): Promise<Devotional[]> {
  const s = await staffClient();
  const { data } = await s.from("daily_devotionals").select("*").order("publish_date", { ascending: false }).limit(500);
  return (data ?? []).map(devotionalFromRow);
}

export async function adminGetDevotional(id: string): Promise<Devotional | null> {
  const s = await staffClient();
  const { data } = await s.from("daily_devotionals").select("*").eq("id", id).maybeSingle();
  return data ? devotionalFromRow(data) : null;
}

export async function adminListNeeds(): Promise<NeedReflection[]> {
  const s = await staffClient();
  const { data } = await s.from("reflections").select("*").eq("kind", "need").order("sort_order");
  return (data ?? []).map(needFromRow);
}

export async function adminGetNeed(id: string): Promise<(NeedReflection & { sortOrder: number }) | null> {
  const s = await staffClient();
  const { data } = await s.from("reflections").select("*").eq("id", id).maybeSingle();
  return data ? { ...needFromRow(data), sortOrder: Number(data.sort_order ?? 0) } : null;
}

export async function adminListPlans(): Promise<ReadingPlanSummary[]> {
  const s = await staffClient();
  const { data } = await s.from("reading_plans_with_duration").select("*").order("sort_order");
  return (data ?? []).map(planSummaryFromRow);
}

export async function adminGetPlan(id: string): Promise<(ReadingPlan & { sortOrder: number }) | null> {
  const s = await staffClient();
  const { data: plan } = await s.from("reading_plans").select("*").eq("id", id).maybeSingle();
  if (!plan) return null;
  const { data: days } = await s.from("reading_plan_days").select("*").eq("plan_id", id).order("day_number");
  return { ...planFromRows(plan, days ?? []), sortOrder: Number(plan.sort_order ?? 0) };
}

export interface AdminVerse {
  id: string;
  reference: BibleReference;
  theme: string | null;
  isFeatured: boolean;
  status: string;
}

export async function adminListVerses(): Promise<AdminVerse[]> {
  const s = await staffClient();
  const { data } = await s.from("bible_verses").select("*").order("created_at", { ascending: false });
  return (data ?? []).map((r) => ({
    id: r.id,
    reference: refFromRow(r),
    theme: r.theme,
    isFeatured: r.is_featured,
    status: r.status,
  }));
}

export interface AdminFeedback {
  id: string;
  kind: string;
  message: string;
  rating: number | null;
  contactEmail: string | null;
  status: string;
  createdAt: string;
}

export async function adminListFeedbacks(status?: string): Promise<AdminFeedback[]> {
  const s = await staffClient();
  let q = s.from("feedbacks").select("id, kind, message, rating, contact_email, status, created_at").order("created_at", { ascending: false }).limit(200);
  if (status) q = q.eq("status", status);
  const { data } = await q;
  return (data ?? []).map((r) => ({
    id: r.id,
    kind: r.kind,
    message: r.message,
    rating: r.rating,
    contactEmail: r.contact_email,
    status: r.status,
    createdAt: r.created_at,
  }));
}
