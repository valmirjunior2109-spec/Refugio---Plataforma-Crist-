/**
 * Conversão entre linhas do banco (snake_case) e tipos de domínio.
 * Mantém o restante do app independente do formato das tabelas.
 */
import type { BibleReference } from "@/lib/bible/reference";
import type {
  CoverMotif,
  CoverTone,
  Devotional,
  NeedReflection,
  NeedTopicSlug,
  PublishStatus,
  ReadingPlan,
  ReadingPlanDay,
  ReadingPlanSummary,
} from "@/types/content";
import type { PrayerCategory, PrayerEntry, SavedVerse, SpiritualGoal } from "@/types/user";

type Row = Record<string, unknown>;

const str = (v: unknown): string => (typeof v === "string" ? v : "");
const num = (v: unknown): number => (typeof v === "number" ? v : Number(v));
const numOrNull = (v: unknown): number | null => (v == null ? null : Number(v));

export function refFromRow(row: Row): BibleReference {
  return {
    book: str(row.book),
    chapter: num(row.chapter),
    verseStart: numOrNull(row.verse_start),
    verseEnd: numOrNull(row.verse_end),
  };
}

export function refToRow(ref: BibleReference) {
  return {
    book: ref.book,
    chapter: ref.chapter,
    verse_start: ref.verseStart ?? null,
    verse_end: ref.verseEnd ?? null,
  };
}

function refList(v: unknown): BibleReference[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((x): x is Row => typeof x === "object" && x !== null)
    .map((x) => ({
      book: str(x.book),
      chapter: num(x.chapter),
      verseStart: numOrNull(x.verseStart ?? x.verse_start),
      verseEnd: numOrNull(x.verseEnd ?? x.verse_end),
    }));
}

export function devotionalFromRow(row: Row): Devotional {
  return {
    id: str(row.id),
    slug: str(row.slug),
    title: str(row.title),
    reference: refFromRow(row),
    reflection: str(row.reflection),
    application: str(row.application),
    prayer: str(row.prayer),
    publishDate: str(row.publish_date).slice(0, 10),
    status: (str(row.status) || "draft") as PublishStatus,
  };
}

export function needFromRow(row: Row): NeedReflection {
  return {
    id: str(row.id),
    topic: str(row.topic) as NeedTopicSlug,
    label: str(row.label),
    title: str(row.title),
    reference: refFromRow(row),
    context: str(row.context),
    reflection: str(row.body),
    hope: str(row.hope),
    prayer: str(row.prayer),
    furtherReadings: refList(row.further_readings),
    status: (str(row.status) || "draft") as PublishStatus,
  };
}

export function planSummaryFromRow(row: Row): ReadingPlanSummary {
  return {
    id: str(row.id),
    slug: str(row.slug),
    title: str(row.title),
    description: str(row.description),
    goal: str(row.goal),
    cover: { tone: (str(row.cover_tone) || "sage") as CoverTone, motif: (str(row.cover_motif) || "arch") as CoverMotif },
    durationDays: num(row.duration_days ?? 0),
    status: (str(row.status) || "draft") as PublishStatus,
  };
}

export function planDayFromRow(row: Row): ReadingPlanDay {
  return {
    id: str(row.id),
    dayNumber: num(row.day_number),
    title: str(row.title),
    readings: refList(row.readings),
    note: row.note == null ? null : str(row.note),
  };
}

export function planFromRows(plan: Row, days: Row[]): ReadingPlan {
  const mapped = days.map(planDayFromRow).sort((a, b) => a.dayNumber - b.dayNumber);
  return { ...planSummaryFromRow(plan), durationDays: mapped.length, days: mapped };
}

export function prayerFromRow(row: Row): PrayerEntry {
  return {
    id: str(row.id),
    title: str(row.title),
    content: str(row.content),
    category: (str(row.category) || "outros") as PrayerCategory,
    tags: Array.isArray(row.tags) ? (row.tags as unknown[]).map(String) : [],
    entryDate: str(row.entry_date).slice(0, 10),
    createdAt: str(row.created_at),
    updatedAt: str(row.updated_at),
  };
}

export function savedVerseFromRow(row: Row): SavedVerse {
  return {
    id: str(row.id),
    reference: refFromRow(row),
    textSnapshot: str(row.text_snapshot),
    note: row.note == null ? null : str(row.note),
    createdAt: str(row.created_at),
  };
}

export function goalFromRow(row: Row): SpiritualGoal {
  return {
    id: str(row.id),
    title: str(row.title),
    description: row.description == null ? null : str(row.description),
    isDone: Boolean(row.is_done),
    createdAt: str(row.created_at),
  };
}
