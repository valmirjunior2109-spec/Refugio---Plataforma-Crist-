import "server-only";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "./env";
import { getCurrentRole, getCurrentUser } from "./server";

/**
 * Para páginas pessoais: garante usuário autenticado (o middleware já redireciona,
 * esta é a segunda verificação, no próprio servidor). Em modo demonstração,
 * envia para a página que explica que contas não estão ativas.
 */
export async function requirePageUser(path: string): Promise<User> {
  if (!isSupabaseConfigured()) redirect("/meu-espaco");
  const user = await getCurrentUser();
  if (!user) redirect(`/entrar?next=${encodeURIComponent(path)}`);
  return user;
}

/** Para o painel: exige papel de equipe verificado no banco. */
export async function requirePageStaff(path: string): Promise<{ user: User; role: "admin" | "editor" }> {
  const user = await requirePageUser(path);
  const role = await getCurrentRole();
  if (role !== "admin" && role !== "editor") redirect("/meu-espaco?sem-permissao=1");
  return { user, role };
}
