import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page";
import { PlanForm } from "@/components/admin/plan-form";
import { Card } from "@/components/ui/card";
import { adminGetPlan } from "@/services/admin";

export const metadata = { title: "Editar plano" };

export default async function EditPlan({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plan = /^[0-9a-f-]{36}$/i.test(id) ? await adminGetPlan(id) : null;
  if (!plan) notFound();
  return (
    <>
      <PageHeader className="pt-0" back={{ href: "/admin/planos", label: "Planos de leitura" }} title={plan.title} />
      <Card>
        <PlanForm plan={plan} />
      </Card>
    </>
  );
}
