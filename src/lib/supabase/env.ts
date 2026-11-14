/**
 * Configuração pública do Supabase.
 * A chave "anon" é pública por definição: a segurança vem das políticas RLS.
 * Nenhuma chave privada (service_role) é usada por esta aplicação.
 */
export function getSupabaseConfig(): { url: string; anonKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

/** Sem Supabase configurado, o app roda em modo demonstração (somente leitura). */
export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig() !== null;
}
