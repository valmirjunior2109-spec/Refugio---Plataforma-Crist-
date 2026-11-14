import { twMerge } from "tailwind-merge";

type ClassValue = string | false | null | undefined | 0;

/**
 * Junta classes condicionalmente e resolve conflitos do Tailwind
 * (a última vence): cn("h-11 px-4", "h-10") → "px-4 h-10".
 */
export function cn(...classes: ClassValue[]): string {
  return twMerge(classes.filter(Boolean).join(" "));
}
