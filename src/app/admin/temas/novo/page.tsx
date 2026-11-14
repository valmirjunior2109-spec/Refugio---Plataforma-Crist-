import { PageHeader } from "@/components/layout/page";
import { NeedForm } from "@/components/admin/need-form";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Novo tema" };

export default function NewNeed() {
  return (
    <>
      <PageHeader className="pt-0" back={{ href: "/admin/temas", label: "Preciso de uma palavra" }} title="Novo tema" />
      <Card>
        <NeedForm />
      </Card>
    </>
  );
}
