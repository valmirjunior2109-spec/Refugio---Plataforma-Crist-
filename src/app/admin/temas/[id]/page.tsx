import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page";
import { NeedForm } from "@/components/admin/need-form";
import { Card } from "@/components/ui/card";
import { adminGetNeed } from "@/services/admin";

export const metadata = { title: "Editar tema" };

export default async function EditNeed({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const need = /^[0-9a-f-]{36}$/i.test(id) ? await adminGetNeed(id) : null;
  if (!need) notFound();
  return (
    <>
      <PageHeader className="pt-0" back={{ href: "/admin/temas", label: "Preciso de uma palavra" }} title={need.label} />
      <Card>
        <NeedForm need={need} />
      </Card>
    </>
  );
}
