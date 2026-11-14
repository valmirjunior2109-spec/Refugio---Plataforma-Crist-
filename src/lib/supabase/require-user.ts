import "server-only";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { AUTH_REQUIRED_ERROR, DEMO_MODE_ERROR, type ActionResult } from "@/types/actions";
import { createClient, getCurrentRole } from "./server";

type Ctx = { supabase: SupabaseClient; user: User };

/**
 * Para Server Actions: obtém cliente + usuário ou um erro pronto para retornar.
 * Nunca finge sucesso em modo demonstração.
 */
export async function requireUser(): Promise<{ ctx: Ctx; error?: never } | { ctx?: never; error: ActionResult<never> }> {
  const supabase = await createClient();
  if (!supabase) return { error: { ok: false, error: DEMO_MODE_ERROR } };
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { error: { ok: false, error: AUTH_REQUIRED_ERROR, requiresAuth: true } };
  return { ctx: { supabase, user: data.user } };
}

/** Exige papel de equipe (editor/admin), verificado no banco. O RLS confere de novo. */
export async function requireStaff(): Promise<{ ctx: Ctx; error?: never } | { ctx?: never; error: ActionResult<never> }> {
  const result = await requireUser();
  if (result.error) return result;
  const role = await getCurrentRole();
  if (role !== "admin" && role !== "editor") {
    return { error: { ok: false, error: "Você não tem permissão para esta ação." } };
  }
  return result;
}
