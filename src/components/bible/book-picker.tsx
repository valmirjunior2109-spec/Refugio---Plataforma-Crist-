"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/form";
import { cn } from "@/lib/utils/cn";

interface BookItem {
  slug: string;
  name: string;
  testament: "AT" | "NT";
  chapters: number;
}

const normalize = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Lista de livros com busca e filtro por testamento. */
export function BookPicker({ books }: { books: BookItem[] }) {
  const [query, setQuery] = useState("");
  const [testament, setTestament] = useState<"all" | "AT" | "NT">("all");

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return books.filter((b) => (testament === "all" || b.testament === testament) && (!q || normalize(b.name).includes(q)));
  }, [books, query, testament]);

  const groups = (["AT", "NT"] as const)
    .map((t) => ({ t, items: filtered.filter((b) => b.testament === t) }))
    .filter((g) => g.items.length);

  return (
    <section aria-labelledby="livros">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="livros" className="font-serif text-2xl text-ink">
          Livros
        </h2>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div role="group" aria-label="Filtrar por testamento" className="flex rounded-full bg-surface-2 p-1 text-sm">
            {(
              [
                ["all", "Todos"],
                ["AT", "Antigo"],
                ["NT", "Novo"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={testament === value}
                onClick={() => setTestament(value)}
                className={cn(
                  "flex-1 rounded-full px-4 py-1.5 transition-colors",
                  testament === value ? "bg-surface font-medium text-ink shadow-sm" : "text-muted hover:text-ink",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="relative block">
            <span className="sr-only">Buscar livro</span>
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-subtle" aria-hidden />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar livro…"
              className="h-10 pl-10 sm:w-56"
            />
          </label>
        </div>
      </div>

      {groups.length === 0 && <p className="py-8 text-center text-muted">Nenhum livro encontrado para “{query}”.</p>}

      <div className="space-y-10">
        {groups.map(({ t, items }) => (
          <div key={t}>
            <h3 className="mb-3 text-xs font-semibold tracking-[0.14em] text-brand uppercase">
              {t === "AT" ? "Antigo Testamento" : "Novo Testamento"}
            </h3>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {items.map((b) => (
                <li key={b.slug}>
                  <Link
                    href={b.chapters === 1 ? `/biblia/${b.slug}/1` : `/biblia/${b.slug}`}
                    className="flex items-baseline justify-between gap-2 rounded-xl border border-line bg-surface px-3.5 py-3 text-ink-soft hover:border-brand/40 hover:text-brand-ink"
                  >
                    <span className="truncate">{b.name}</span>
                    <span className="shrink-0 text-xs text-subtle">{b.chapters}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
