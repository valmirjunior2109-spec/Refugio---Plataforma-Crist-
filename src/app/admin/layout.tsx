import type { Metadata } from "next";
import { Container } from "@/components/layout/page";
import { AdminNav } from "@/components/admin/admin-nav";
import { requirePageStaff } from "@/lib/supabase/require-page-user";

export const metadata: Metadata = { title: { default: "Painel", template: "%s · Painel do Refúgio" }, robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { role } = await requirePageStaff("/admin");
  return (
    <Container className="py-6 sm:py-10">
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside>
          <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-brand uppercase">
            Painel · {role === "admin" ? "Administração" : "Edição"}
          </p>
          <AdminNav />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </Container>
  );
}
