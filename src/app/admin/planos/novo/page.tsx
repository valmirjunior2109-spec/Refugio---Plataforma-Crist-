import { PageHeader } from "@/components/layout/page";
import { PlanForm } from "@/components/admin/plan-form";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Novo plano" };

export default function NewPlan() {
  return (
    <>
      <PageHeader className="pt-0" back={{ href: "/admin/planos", label: "Planos de leitura" }} title="Novo plano de leitura" />
      <Card>
        <PlanForm />
      </Card>
    </>
  );
}
