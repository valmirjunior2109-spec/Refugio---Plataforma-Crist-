"use client";

import { useMemo, useState } from "react";
import { Select } from "@/components/ui/form";
import { VerseActions } from "./verse-actions";

/**
 * Seleção de um versículo (ou intervalo) do capítulo para salvar, copiar ou compartilhar.
 */
export function ChapterVerseTools({
  bookSlug,
  bookName,
  chapter,
  verses,
  path,
  authEnabled,
}: {
  bookSlug: string;
  bookName: string;
  chapter: number;
  verses: { number: number; text: string }[];
  path: string;
  authEnabled: boolean;
}) {
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(1);
  const safeEnd = Math.max(start, end);

  const selection = useMemo(() => {
    const chosen = verses.filter((v) => v.number >= start && v.number <= safeEnd);
    const label = `${bookName} ${chapter}:${start}${safeEnd > start ? `-${safeEnd}` : ""}`;
    return { label, text: chosen.map((v) => v.text).join(" ") };
  }, [verses, start, safeEnd, bookName, chapter]);

  return (
    <section aria-labelledby="guardar" className="mt-12 rounded-2xl border border-line bg-surface p-5">
      <h2 id="guardar" className="font-medium text-ink">
        Guardar ou compartilhar um trecho
      </h2>
      <div className="mt-3 flex flex-wrap items-end gap-3">
        <label className="text-sm text-ink-soft">
          Do versículo
          <Select
            value={start}
            onChange={(e) => {
              const v = Number(e.target.value);
              setStart(v);
              if (end < v) setEnd(v);
            }}
            className="mt-1 h-10 w-24"
          >
            {verses.map((v) => (
              <option key={v.number} value={v.number}>
                {v.number}
              </option>
            ))}
          </Select>
        </label>
        <label className="text-sm text-ink-soft">
          até o
          <Select value={safeEnd} onChange={(e) => setEnd(Number(e.target.value))} className="mt-1 h-10 w-24">
            {verses
              .filter((v) => v.number >= start && v.number <= start + 30)
              .map((v) => (
                <option key={v.number} value={v.number}>
                  {v.number}
                </option>
              ))}
          </Select>
        </label>
      </div>
      <p className="mt-4 border-l-2 border-brand/40 pl-3 font-serif text-ink-soft">
        <span className="line-clamp-4">{selection.text}</span>
        <span className="mt-1 block font-sans text-xs font-semibold text-brand-ink">{selection.label}</span>
      </p>
      <div className="mt-4">
        <VerseActions
          reference={{ book: bookSlug, chapter, verseStart: start, verseEnd: safeEnd > start ? safeEnd : null }}
          label={selection.label}
          plainText={selection.text}
          path={`${path}#v${start}`}
          authEnabled={authEnabled}
        />
      </div>
    </section>
  );
}
