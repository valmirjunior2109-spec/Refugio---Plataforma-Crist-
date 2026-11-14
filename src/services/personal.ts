import "server-only";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { formatReference } from "@/lib/bible/reference";
import { categoryLabel, type ActivityItem, type FavoriteReflection, type PlanEnrollment, type PrayerEntry, type SavedVerse, type SpiritualGoal } from "@/types/user";
import { goalFromRow, prayerFromRow, refFromRow, savedVerseFromRow } from "./mappers";

/**
 * Dados pessoais do usuário autenticado.
 * Todas as consultas usam a sessão do usuário: o RLS garante que só os próprios
 * registros sejam retornados. Sem sessão (ou em modo demonstração), retornam vazio.
 */

async function ctx() {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createClient();
  return supabase ? { supabase, user } : null;
}

export interface PrayerFilters {
  from?: string;
  to?: string;
  categoria?: string;
  q?: string;
}

export async function listPrayerEntries(filters: PrayerFilters = {}): Promise<PrayerEntry[]> {
  const c = await ctx();
  if (!c) return [];
  let query = c.supabase
    .from("prayer_entries")
    .select("*")
    .order("entry_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(200);
  if (filters.from) query = query.gte("entry_date", filters.from);
  if (filters.to) query = query.lte("entry_date", filters.to);
  if (filters.categoria) query = query.eq("category", filters.categoria);
  if (filters.q) {
    // Escapa curingas do ILIKE e vírgulas/parênteses do filtro "or" do PostgREST.
    const term = filters.q.replace(/[%_\\]/g, (m) => `\\${m}`).replace(/[,()]/g, " ");
    query = query.or(`title.ilike.%${term}%,content.ilike.%${term}%`);
  }
  const { data, error } = await query;
  if (error) throw new Error("Não foi possível carregar o diário.");
  return (data ?? []).map(prayerFromRow);
}

export async function getPrayerEntry(id: string): Promise<PrayerEntry | null> {
  const c = await ctx();
  if (!c || !/^[0-9a-f-]{36}$/i.test(id)) return null;
  const { data } = await c.supabase.from("prayer_entries").select("*").eq("id", id).maybeSingle();
  return data ? prayerFromRow(data) : null;
}

export async function listSavedVerses(limit = 100): Promise<SavedVerse[]> {
  const c = await ctx();
  if (!c) return [];
  const { data } = await c.supabase.from("saved_verses").select("*").order("created_at", { ascending: false }).limit(limit);
  return (data ?? []).map(savedVerseFromRow);
}

export async function listFavorites(limit = 50): Promise<FavoriteReflection[]> {
  const c = await ctx();
  if (!c) return [];
  const { data } = await c.supabase
    .from("favorite_reflections")
    .select("id, created_at, devotional_id, reflection_id, daily_devotionals(slug, title), reflections(topic, title)")
    .order("created_at", { ascending: false })
    .limit(limit);
  type Row = {
    id: string;
    created_at: string;
    devotional_id: string | null;
    reflection_id: string | null;
    daily_devotionals: { slug: string; title: string } | null;
    reflections: { topic: string; title: string } | null;
  };
  return ((data ?? []) as unknown as Row[]).flatMap((r): FavoriteReflection[] => {
    if (r.devotional_id && r.daily_devotionals) {
      return [{
        id: r.id,
        kind: "devotional",
        targetId: r.devotional_id,
        title: r.daily_devotionals.title,
        href: `/palavra-do-dia/${r.daily_devotionals.slug}`,
        createdAt: r.created_at,
      }];
    }
    if (r.reflection_id && r.reflections) {
      return [{
        id: r.id,
        kind: "need",
        targetId: r.reflection_id,
        title: r.reflections.title,
        href: `/preciso-de-uma-palavra/${r.reflections.topic}`,
        createdAt: r.created_at,
      }];
    }
    return [];
  });
}

export async function listGoals(): Promise<SpiritualGoal[]> {
  const c = await ctx();
  if (!c) return [];
  const { data } = await c.supabase
    .from("spiritual_goals")
    .select("*")
    .order("is_done", { ascending: true })
    .order("created_at", { ascending: false });
  return (data ?? []).map(goalFromRow);
}

export async function listEnrollments(): Promise<PlanEnrollment[]> {
  const c = await ctx();
  if (!c) return [];
  const [{ data: enrollments }, { data: progress }] = await Promise.all([
    c.supabase
      .from("reading_plan_enrollments")
      .select("plan_id, started_at, reading_plans(slug, title, reading_plan_days(count))")
      .order("started_at", { ascending: false }),
    c.supabase.from("reading_progress").select("plan_id, plan_day_id"),
  ]);
  type Row = {
    plan_id: string;
    started_at: string;
    reading_plans: { slug: string; title: string; reading_plan_days: { count: number }[] } | null;
  };
  return ((enrollments ?? []) as unknown as Row[])
    .filter((e) => e.reading_plans)
    .map((e) => ({
      planId: e.plan_id,
      planSlug: e.reading_plans!.slug,
      planTitle: e.reading_plans!.title,
      durationDays: e.reading_plans!.reading_plan_days[0]?.count ?? 0,
      startedAt: e.started_at,
      completedDayIds: (progress ?? []).filter((p) => p.plan_id === e.plan_id).map((p) => String(p.plan_day_id)),
    }));
}

export async function getPlanProgress(planId: string): Promise<{ enrolled: boolean; startedAt: string | null; completed: Set<string> }> {
  const empty = { enrolled: false, startedAt: null, completed: new Set<string>() };
  const c = await ctx();
  if (!c || planId.startsWith("demo-")) return empty;
  const [{ data: enrollment }, { data: progress }] = await Promise.all([
    c.supabase.from("reading_plan_enrollments").select("started_at").eq("plan_id", planId).maybeSingle(),
    c.supabase.from("reading_progress").select("plan_day_id").eq("plan_id", planId),
  ]);
  return {
    enrolled: Boolean(enrollment),
    startedAt: enrollment?.started_at ?? null,
    completed: new Set((progress ?? []).map((p) => String(p.plan_day_id))),
  };
}

/** Histórico recente, montado a partir dos próprios registros (nenhum rastreamento extra). */
export async function listRecentActivity(limit = 12): Promise<ActivityItem[]> {
  const c = await ctx();
  if (!c) return [];
  const [prayers, readings, verses, enrollments, goals] = await Promise.all([
    c.supabase.from("prayer_entries").select("id, title, category, created_at").order("created_at", { ascending: false }).limit(limit),
    c.supabase
      .from("reading_progress")
      .select("id, completed_at, reading_plan_days(title, day_number), reading_plans(slug, title)")
      .order("completed_at", { ascending: false })
      .limit(limit),
    c.supabase.from("saved_verses").select("*").order("created_at", { ascending: false }).limit(limit),
    c.supabase
      .from("reading_plan_enrollments")
      .select("id, started_at, reading_plans(slug, title)")
      .order("started_at", { ascending: false })
      .limit(limit),
    c.supabase.from("spiritual_goals").select("id, title, done_at").not("done_at", "is", null).order("done_at", { ascending: false }).limit(limit),
  ]);

  type ReadingRow = { id: string; completed_at: string; reading_plan_days: { title: string; day_number: number } | null; reading_plans: { slug: string; title: string } | null };
  type EnrollRow = { id: string; started_at: string; reading_plans: { slug: string; title: string } | null };

  const items: ActivityItem[] = [
    ...(prayers.data ?? []).map((p) => ({
      id: `p-${p.id}`,
      kind: "prayer" as const,
      label: `Registro no diário (${categoryLabel(p.category)}): ${p.title}`,
      href: `/oracoes/registro/${p.id}`,
      at: p.created_at,
    })),
    ...((readings.data ?? []) as unknown as ReadingRow[]).map((r) => ({
      id: `r-${r.id}`,
      kind: "reading" as const,
      label: `Leitura concluída: ${r.reading_plans?.title ?? "plano"}, dia ${r.reading_plan_days?.day_number ?? ""}`,
      href: r.reading_plans ? `/planos/${r.reading_plans.slug}` : null,
      at: r.completed_at,
    })),
    ...(verses.data ?? []).map((v) => ({
      id: `v-${v.id}`,
      kind: "verse" as const,
      label: `Versículo salvo: ${formatReference(refFromRow(v))}`,
      href: "/meu-espaco/versiculos",
      at: v.created_at,
    })),
    ...((enrollments.data ?? []) as unknown as EnrollRow[]).map((e) => ({
      id: `e-${e.id}`,
      kind: "plan" as const,
      label: `Plano iniciado: ${e.reading_plans?.title ?? ""}`,
      href: e.reading_plans ? `/planos/${e.reading_plans.slug}` : null,
      at: e.started_at,
    })),
    ...(goals.data ?? []).map((g) => ({
      id: `g-${g.id}`,
      kind: "goal" as const,
      label: `Objetivo alcançado: ${g.title}`,
      href: "/meu-espaco/objetivos",
      at: g.done_at as string,
    })),
  ];
  return items.sort((a, b) => (a.at < b.at ? 1 : -1)).slice(0, limit);
}

export async function getProfile() {
  const c = await ctx();
  if (!c) return null;
  const { data } = await c.supabase.from("profiles").select("display_name, role, created_at").eq("id", c.user.id).maybeSingle();
  return {
    email: c.user.email ?? "",
    displayName: (data?.display_name as string | null) ?? null,
    role: (data?.role as string | undefined) ?? "user",
    createdAt: (data?.created_at as string | undefined) ?? c.user.created_at,
  };
}
