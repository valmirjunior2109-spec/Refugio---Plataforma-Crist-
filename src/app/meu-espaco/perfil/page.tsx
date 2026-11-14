import type { Metadata } from "next";
import { requirePageUser } from "@/lib/supabase/require-page-user";
import { notFound } from "next/navigation";
import { Container, PageHeader } from "@/components/layout/page";
import { ProfileForm } from "@/components/journey/account-forms";
import { Card } from "@/components/ui/card";
import { getProfile } from "@/services/personal";
import { formatLongDate } from "@/lib/utils/dates";

export const metadata: Metadata = { title: "Meu perfil", robots: { index: false } };

export default async function ProfilePage() {
  await requirePageUser("/meu-espaco/perfil");
  const profile = await getProfile();
  if (!profile) notFound();
  return (
    <Container className="max-w-2xl">
      <PageHeader back={{ href: "/meu-espaco", label: "Meu espaço" }} eyebrow="Meu espaço" title="Meu perfil" />
      <div className="space-y-6">
        <Card>
          <ProfileForm displayName={profile.displayName ?? ""} />
        </Card>
        <Card>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted">E-mail</dt>
              <dd className="text-ink">{profile.email}</dd>
            </div>
            <div>
              <dt className="text-muted">No Refúgio desde</dt>
              <dd className="text-ink">{formatLongDate(profile.createdAt.slice(0, 10))}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </Container>
  );
}
