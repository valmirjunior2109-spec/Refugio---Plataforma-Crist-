import type { Metadata } from "next";
import { requirePageUser } from "@/lib/supabase/require-page-user";
import { notFound } from "next/navigation";
import { Container, PageHeader } from "@/components/layout/page";
import { PrayerForm } from "@/components/prayer/prayer-form";
import { getPrayerEntry } from "@/services/personal";
import { formatDateTime, isoDate } from "@/lib/utils/dates";

export const metadata: Metadata = { title: "Registro do diário", robots: { index: false } };

export default async function PrayerEntryPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePageUser("/oracoes");
  const entry = await getPrayerEntry((await params).id);
  if (!entry) notFound();
  return (
    <Container className="max-w-2xl">
      <PageHeader
        back={{ href: "/oracoes", label: "Meu diário" }}
        eyebrow="Registro do diário"
        title={entry.title}
        description={<span className="text-sm">Última alteração: {formatDateTime(entry.updatedAt)}</span>}
      />
      <div className="rounded-3xl border border-line bg-surface p-5 sm:p-8">
        <PrayerForm entry={entry} today={isoDate()} />
      </div>
    </Container>
  );
}
