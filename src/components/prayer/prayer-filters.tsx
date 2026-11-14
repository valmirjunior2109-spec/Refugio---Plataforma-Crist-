"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form";
import { PRAYER_CATEGORIES } from "@/types/user";

/** Filtros do diário (período, categoria e busca), refletidos na URL. */
export function PrayerFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [values, setValues] = useState({
    q: params.get("q") ?? "",
    categoria: params.get("categoria") ?? "",
    from: params.get("from") ?? "",
    to: params.get("to") ?? "",
  });
  const active = Object.values(values).some(Boolean);

  function apply(next = values) {
    const sp = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => v && sp.set(k, v));
    router.push(`/oracoes${sp.size ? `?${sp}` : ""}`);
  }

  return (
    <form
      role="search"
      aria-label="Filtrar diário"
      onSubmit={(e) => {
        e.preventDefault();
        apply();
      }}
      className="grid gap-3 rounded-2xl border border-line bg-surface p-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_0.9fr_0.9fr_auto]"
    >
      <label className="relative block">
        <span className="sr-only">Buscar</span>
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-subtle" aria-hidden />
        <Input
          type="search"
          placeholder="Buscar no diário"
          value={values.q}
          maxLength={80}
          onChange={(e) => setValues({ ...values, q: e.target.value })}
          className="h-10 pl-10"
        />
      </label>
      <label>
        <span className="sr-only">Categoria</span>
        <Select value={values.categoria} onChange={(e) => setValues({ ...values, categoria: e.target.value })} className="h-10">
          <option value="">Todas as categorias</option>
          {PRAYER_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </Select>
      </label>
      <label className="flex items-center gap-2 text-sm text-muted">
        De
        <Input type="date" value={values.from} onChange={(e) => setValues({ ...values, from: e.target.value })} className="h-10" />
      </label>
      <label className="flex items-center gap-2 text-sm text-muted">
        Até
        <Input type="date" value={values.to} onChange={(e) => setValues({ ...values, to: e.target.value })} className="h-10" />
      </label>
      <div className="flex gap-2">
        <Button type="submit" size="sm" className="h-10 flex-1">
          Filtrar
        </Button>
        {active && (
          <Button
            variant="ghost"
            size="sm"
            className="h-10"
            aria-label="Limpar filtros"
            onClick={() => {
              const cleared = { q: "", categoria: "", from: "", to: "" };
              setValues(cleared);
              apply(cleared);
            }}
          >
            <X className="size-4" aria-hidden />
          </Button>
        )}
      </div>
    </form>
  );
}
