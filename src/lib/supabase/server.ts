import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { cache } from "react";
import { getSupabaseConfig } from "./env";

/**
 * Cliente Supabase para Server Components, Server Actions e Route Handlers.
 * Usa a sessão do usuário (cookies) — todas as consultas passam pelas políticas RLS.
 * Retorna null em modo demonstração.
 */
export async function createClient(): Promise<SupabaseClient | null> {
  const config = getSupabaseConfig();
  if (!config) return null;
  const cookieStore = await cookies();
  return createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Chamado em Server Component: o middleware renova a sessão.
        }
      },
    },
  });
}

/** Usuário autenticado (validado no servidor do Supabase), uma vez por requisição. */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
});

export type Role = "user" | "editor" | "admin";

/** Papel do usuário, lido do banco (fonte de verdade), uma vez por requisição. */
export const getCurrentRole = cache(async (): Promise<Role | null> => {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  return (data?.role as Role | undefined) ?? "user";
});

export async function isStaff(): Promise<boolean> {
  const role = await getCurrentRole();
  return role === "admin" || role === "editor";
}
