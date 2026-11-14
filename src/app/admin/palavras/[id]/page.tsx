import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page";
import { DevotionalForm } from "@/components/admin/devotional-form";
import { Card } from "@/components/ui/card";
import { adminGetDevotional } from "@/services/admin";
import { isoDate } from "@/lib/utils/dates";

export const metadata = { title: "Editar palavra do dia" };

export default async function EditDevotional({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const devotional = /^[0-9a-f-]{36}$/i.test(id) ? await adminGetDevotional(id) : null;
  if (!devotional) notFound();
  return (
    <>
      <PageHeader className="pt-0" back={{ href: "/admin/palavras", label: "Palavras do dia" }} title={devotional.title} />
      <Card>
        <DevotionalForm devotional={devotional} today={isoDate()} />
      </Card>
    </>
  );
}
