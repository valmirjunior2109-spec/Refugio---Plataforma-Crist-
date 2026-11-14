import Link from "next/link";
import { BookOpen } from "lucide-react";
import { getPassage, passageText } from "@/lib/bible/text";
import { plainScripture } from "@/lib/bible/format";
import { formatReference, referenceHref, type BibleReference } from "@/lib/bible/reference";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { cn } from "@/lib/utils/cn";
import { ScriptureText } from "./scripture-text";
import { VerseActions } from "./verse-actions";

/**
 * Passagem bíblica em destaque, com o texto lido da Bíblia Livre.
 * Se a referência não existir, mostra apenas a referência e um aviso. Nada é inventado.
 */
export async function PassageBlock({
  reference,
  path,
  size = "lg",
  actions = true,
  className,
}: {
  reference: BibleReference;
  path: string;
  size?: "md" | "lg";
  actions?: boolean;
  className?: string;
}) {
  const passage = await getPassage(reference);
  const label = formatReference(reference);

  if (!passage) {
    return (
      <div className={cn("rounded-2xl border border-line bg-surface p-6", className)}>
        <p className="font-medium text-ink">{label}</p>
        <p className="mt-1 text-sm text-muted">O texto desta passagem não está disponível no momento.</p>
      </div>
    );
  }

  return (
    <figure className={cn("relative", className)}>
      <blockquote
        className={cn(
          "scripture font-serif text-ink",
          size === "lg" ? "text-[1.45rem] leading-[1.55] sm:text-[1.7rem]" : "text-[1.2rem] leading-relaxed",
        )}
      >
        {passage.verses.map((v, i) => (
          <span key={v.number}>
            {passage.verses.length > 1 && (
              <sup className="mr-1 font-sans text-[0.55em] font-semibold text-brand">{v.number}</sup>
            )}
            <ScriptureText text={v.text} />
            {i < passage.verses.length - 1 ? " " : ""}
          </span>
        ))}
      </blockquote>
      <figcaption className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <Link
          href={referenceHref(reference)}
          className="inline-flex items-center gap-1.5 font-semibold text-brand-ink hover:underline"
        >
          <BookOpen className="size-4" aria-hidden />
          {label}
        </Link>
        <span className="text-muted">Bíblia Livre</span>
      </figcaption>
      {actions && (
        <div className="mt-4">
          <VerseActions
            reference={reference}
            label={label}
            plainText={plainScripture(passageText(passage))}
            path={path}
            authEnabled={isSupabaseConfigured()}
          />
        </div>
      )}
    </figure>
  );
}
