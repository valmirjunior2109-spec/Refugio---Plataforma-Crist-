import type { Metadata } from "next";
import { requirePageUser } from "@/lib/supabase/require-page-user";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import { Container, PageHeader } from "@/components/layout/page";
import { RemoveSavedVerseButton } from "@/components/journey/remove-saved-verse";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/feedback-states";
import { formatReference, referenceHref } from "@/lib/bible/reference";
import { formatLongDate } from "@/lib/utils/dates";
import { listSavedVerses } from "@/services/personal";

export const metadata: Metadata = { title: "Versículos salvos", robots: { index: false } };

export default async function SavedVersesPage() {
  await requirePageUser("/meu-espaco/versiculos");
  const verses = await listSavedVerses();
  return (
    <Container className="max-w-3xl">
      <PageHeader back={{ href: "/meu-espaco", label: "Meu espaço" }} eyebrow="Meu espaço" title="Versículos salvos" />
      {verses.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="size-5" aria-hidden />}
          title="Nenhum versículo salvo ainda"
          description="Ao ler a Bíblia ou a Palavra do dia, use “Salvar” para guardar uma passagem aqui."
          action={<ButtonLink href="/biblia">Abrir a Bíblia</ButtonLink>}
        />
      ) : (
        <ul className="space-y-3">
          {verses.map((v) => (
            <li key={v.id} className="rounded-2xl border border-line bg-surface p-5">
              <blockquote className="font-serif text-lg leading-relaxed text-ink">“{v.textSnapshot}”</blockquote>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm">
                  <Link href={referenceHref(v.reference)} className="font-semibold text-brand-ink hover:underline">
                    {formatReference(v.reference)}
                  </Link>
                  <span className="text-muted"> · salvo em {formatLongDate(v.createdAt.slice(0, 10))}</span>
                </p>
                <RemoveSavedVerseButton id={v.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
