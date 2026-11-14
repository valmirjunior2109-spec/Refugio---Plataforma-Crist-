import type { BibleReference } from "@/lib/bible/reference";

export const PRAYER_CATEGORIES = [
  { value: "agradecimento", label: "Agradecimento" },
  { value: "pedido", label: "Pedido de oração" },
  { value: "reflexao", label: "Reflexão" },
  { value: "familia", label: "Família" },
  { value: "vida-pessoal", label: "Vida pessoal" },
  { value: "fe", label: "Fé" },
  { value: "outros", label: "Outros" },
] as const;

export type PrayerCategory = (typeof PRAYER_CATEGORIES)[number]["value"];

export function categoryLabel(value: string): string {
  return PRAYER_CATEGORIES.find((c) => c.value === value)?.label ?? "Outros";
}

export interface PrayerEntry {
  id: string;
  title: string;
  content: string;
  category: PrayerCategory;
  tags: string[];
  entryDate: string; // AAAA-MM-DD
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  displayName: string | null;
  role: "user" | "editor" | "admin";
  createdAt: string;
}

export interface SavedVerse {
  id: string;
  reference: BibleReference;
  textSnapshot: string;
  note: string | null;
  createdAt: string;
}

export interface FavoriteReflection {
  id: string;
  kind: "devotional" | "need";
  targetId: string;
  title: string;
  href: string;
  createdAt: string;
}

export interface SpiritualGoal {
  id: string;
  title: string;
  description: string | null;
  isDone: boolean;
  createdAt: string;
}

export interface PlanEnrollment {
  planId: string;
  planSlug: string;
  planTitle: string;
  durationDays: number;
  startedAt: string;
  completedDayIds: string[];
}

export interface ActivityItem {
  id: string;
  kind: "prayer" | "reading" | "verse" | "plan" | "goal";
  label: string;
  href: string | null;
  at: string;
}
