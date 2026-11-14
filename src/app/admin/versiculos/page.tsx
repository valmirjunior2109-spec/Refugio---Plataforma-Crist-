import { SectionTitle } from "@/components/ui/card";
import { VerseManager } from "@/components/admin/verse-manager";
import { adminListVerses } from "@/services/admin";

export const metadata = { title: "Versículos" };

export default async function AdminVerses() {
  const verses = await adminListVerses();
  return (
    <div className="space-y-6">
      <SectionTitle
        as="h1"
        title="Versículos de referência"
        description="Catálogo curado de passagens por tema. O texto é sempre obtido da Bíblia Livre pela referência."
      />
      <VerseManager verses={verses} />
    </div>
  );
}
