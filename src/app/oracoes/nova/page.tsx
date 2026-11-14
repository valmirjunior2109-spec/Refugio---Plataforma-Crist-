import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/layout/page";
import { PrayerForm } from "@/components/prayer/prayer-form";
import { Alert } from "@/components/ui/feedback-states";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { isoDate } from "@/lib/utils/dates";

export const metadata: Metadata = { title: "Novo registro", robots: { index: false } };

export default function NewPrayerPage() {
  return (
    <Container className="max-w-2xl">
      <PageHeader back={{ href: "/oracoes", label: "Meu diário" }} eyebrow="Novo registro" title="Converse com Deus" />
      {isSupabaseConfigured() ? (
        <div className="rounded-3xl border border-line bg-surface p-5 sm:p-8">
          <PrayerForm today={isoDate()} />
        </div>
      ) : (
        <Alert tone="warning" title="Modo demonstração">
          O diário fica disponível quando o Supabase estiver configurado.
        </Alert>
      )}
    </Container>
  );
}
