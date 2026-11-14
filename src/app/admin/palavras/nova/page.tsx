import { PageHeader } from "@/components/layout/page";
import { DevotionalForm } from "@/components/admin/devotional-form";
import { Card } from "@/components/ui/card";
import { isoDate } from "@/lib/utils/dates";

export const metadata = { title: "Nova palavra do dia" };

export default function NewDevotional() {
  return (
    <>
      <PageHeader className="pt-0" back={{ href: "/admin/palavras", label: "Palavras do dia" }} title="Nova palavra do dia" />
      <Card>
        <DevotionalForm today={isoDate()} />
      </Card>
    </>
  );
}
