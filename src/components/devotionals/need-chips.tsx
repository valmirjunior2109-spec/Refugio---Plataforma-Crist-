import Link from "next/link";
import {
  CloudRain,
  Compass,
  Feather,
  HandHeart,
  HeartHandshake,
  Mountain,
  ShieldHalf,
  Sprout,
  Sunrise,
  Wind,
  type LucideIcon,
} from "lucide-react";
import type { NeedReflection, NeedTopicSlug } from "@/types/content";
import { cn } from "@/lib/utils/cn";

export const NEED_ICONS: Record<NeedTopicSlug, LucideIcon> = {
  triste: CloudRain,
  medo: ShieldHalf,
  ansiedade: Wind,
  solidao: HeartHandshake,
  desanimo: Sprout,
  esperanca: Sunrise,
  paz: Feather,
  gratidao: HandHeart,
  "aproximar-de-deus": Compass,
  dificuldades: Mountain,
};

export function NeedChips({ needs, className }: { needs: Pick<NeedReflection, "topic" | "label">[]; className?: string }) {
  return (
    <ul className={cn("grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5", className)}>
      {needs.map((n) => {
        const Icon = NEED_ICONS[n.topic] ?? Compass;
        return (
          <li key={n.topic}>
            <Link
              href={`/preciso-de-uma-palavra/${n.topic}`}
              className="group flex h-full items-center gap-2.5 rounded-xl border border-line bg-surface px-3 py-3 text-sm text-ink-soft transition-colors hover:border-brand/50 hover:bg-brand-soft hover:text-brand-ink"
            >
              <Icon className="size-4.5 shrink-0 text-brand transition-transform group-hover:scale-110" aria-hidden />
              <span className="leading-snug">{n.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
