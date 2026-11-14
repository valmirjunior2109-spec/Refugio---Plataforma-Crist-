import "server-only";
import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "./env";

let client: SupabaseClient | null = null;

/**
 * Cliente anônimo, sem sessão nem cookies, para conteúdo público.
 * Permite que páginas públicas sejam geradas e cacheadas (ISR),
 * e o RLS garante que só o que está publicado seja retornado.
 */
export function createPublicClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config) return null;
  client ??= createSupabaseClient(config.url, config.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return client;
}
