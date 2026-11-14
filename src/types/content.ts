import type { BibleReference } from "@/lib/bible/reference";

export type PublishStatus = "draft" | "published";

/** Palavra do dia. O texto bíblico nunca é armazenado aqui: é lido da tradução pela referência. */
export interface Devotional {
  id: string;
  slug: string;
  title: string;
  reference: BibleReference;
  reflection: string;
  application: string;
  prayer: string;
  publishDate: string; // AAAA-MM-DD
  status: PublishStatus;
}

export type NeedTopicSlug =
  | "triste"
  | "medo"
  | "ansiedade"
  | "solidao"
  | "desanimo"
  | "esperanca"
  | "paz"
  | "gratidao"
  | "aproximar-de-deus"
  | "dificuldades";

/** Conteúdo de "Preciso de uma palavra" (tabela reflections, kind = 'need'). */
export interface NeedReflection {
  id: string;
  topic: NeedTopicSlug;
  label: string; // "Estou triste"
  title: string;
  reference: BibleReference;
  context: string;
  reflection: string;
  hope: string;
  prayer: string;
  furtherReadings: BibleReference[];
  status: PublishStatus;
}

export type CoverTone = "sage" | "sand" | "deep" | "ivory";
export type CoverMotif = "arch" | "sun" | "waves" | "leaf" | "path" | "stars";

export interface PlanCover {
  tone: CoverTone;
  motif: CoverMotif;
}

export interface ReadingPlanDay {
  id: string;
  dayNumber: number;
  title: string;
  readings: BibleReference[];
  note?: string | null;
}

export interface ReadingPlan {
  id: string;
  slug: string;
  title: string;
  description: string;
  goal: string;
  cover: PlanCover;
  durationDays: number;
  status: PublishStatus;
  days: ReadingPlanDay[];
}

export type ReadingPlanSummary = Omit<ReadingPlan, "days">;
