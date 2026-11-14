import "server-only";
import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { DEVOTIONAL_SEEDS } from "@/content/devotionals";
import { NEED_SEEDS } from "@/content/needs";
import { PLAN_SEEDS } from "@/content/reading-plans";
import { demoDevotionals, devotionalHistory, pickDevotionalForDate } from "@/lib/content/select";
import { isoDate } from "@/lib/utils/dates";
import type { Devotional, NeedReflection, ReadingPlan, ReadingPlanSummary } from "@/types/content";
import {
  devotionalFromRow,
  needFromRow,
  planFromRows,
  planSummaryFromRow,
} from "./mappers";

/**
 * Conteúdo público (sem login): Palavra do dia, "Preciso de uma palavra" e planos.
 * Com Supabase: lê do banco (RLS libera apenas o que está publicado).
 * Sem Supabase: usa o conteúdo demonstrativo de src/content.
 */

// ── Palavra do dia ───────────────────────────────────────────

const allDevotionals = cache(async (): Promise<Devotional[]> => {
  const today = isoDate();
  const supabase = createPublicClient();
  if (!supabase) return demoDevotionals(DEVOTIONAL_SEEDS, today);
  const { data, error } = await supabase
    .from("daily_devotionals")
    .select("*")
    .eq("status", "published")
    .lte("publish_date", today)
    .order("publish_date", { ascending: false })
    .limit(400);
  if (error) throw new Error(`Não foi possível carregar a Palavra do dia: ${error.message}`);
  return (data ?? []).map(devotionalFromRow);
});

export async function getTodayDevotional(): Promise<Devotional | null> {
  return pickDevotionalForDate(await allDevotionals(), isoDate());
}

export async function listDevotionalHistory(): Promise<Devotional[]> {
  return devotionalHistory(await allDevotionals(), isoDate());
}

export async function getDevotionalBySlug(slug: string): Promise<Devotional | null> {
  return (await allDevotionals()).find((d) => d.slug === slug) ?? null;
}

// ── Preciso de uma palavra ───────────────────────────────────

const allNeeds = cache(async (): Promise<NeedReflection[]> => {
  const supabase = createPublicClient();
  if (!supabase) {
    return NEED_SEEDS.map((n) => ({ ...n, id: `demo-${n.topic}`, status: "published" as const }));
  }
  const { data, error } = await supabase
    .from("reflections")
    .select("*")
    .eq("kind", "need")
    .eq("status", "published")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(`Não foi possível carregar as reflexões: ${error.message}`);
  return (data ?? []).map(needFromRow);
});

export async function listNeeds(): Promise<NeedReflection[]> {
  return allNeeds();
}

export async function getNeed(topic: string): Promise<NeedReflection | null> {
  return (await allNeeds()).find((n) => n.topic === topic) ?? null;
}

// ── Planos de leitura ────────────────────────────────────────

function demoPlans(): ReadingPlan[] {
  return PLAN_SEEDS.map((p) => ({
    id: `demo-${p.slug}`,
    slug: p.slug,
    title: p.title,
    description: p.description,
    goal: p.goal,
    cover: p.cover,
    durationDays: p.days.length,
    status: "published",
    days: p.days.map((d, i) => ({
      id: `demo-${p.slug}-d${i + 1}`,
      dayNumber: i + 1,
      title: d.title,
      readings: d.readings,
      note: d.note ?? null,
    })),
  }));
}

export const listPlans = cache(async (): Promise<ReadingPlanSummary[]> => {
  const supabase = createPublicClient();
  if (!supabase) return demoPlans().map(({ id, slug, title, description, goal, cover, durationDays, status }) => ({ id, slug, title, description, goal, cover, durationDays, status }));
  const { data, error } = await supabase
    .from("reading_plans_with_duration")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(`Não foi possível carregar os planos: ${error.message}`);
  return (data ?? []).map(planSummaryFromRow);
});

export const getPlanBySlug = cache(async (slug: string): Promise<ReadingPlan | null> => {
  const supabase = createPublicClient();
  if (!supabase) return demoPlans().find((p) => p.slug === slug) ?? null;
  const { data: plan, error } = await supabase
    .from("reading_plans")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw new Error(`Não foi possível carregar o plano: ${error.message}`);
  if (!plan) return null;
  const { data: days, error: daysError } = await supabase
    .from("reading_plan_days")
    .select("*")
    .eq("plan_id", plan.id)
    .order("day_number", { ascending: true });
  if (daysError) throw new Error(`Não foi possível carregar as leituras: ${daysError.message}`);
  return planFromRows(plan, days ?? []);
});
