/**
 * Limitador simples em memória (janela deslizante), por instância do servidor.
 * É uma primeira barreira barata; o limite persistente fica no banco
 * (função submit_feedback). Em produção, pode ser complementado pelo firewall da Vercel.
 */
const buckets = new Map<string, number[]>();
const MAX_KEYS = 5000;

export function checkRateLimit(key: string, { limit, windowMs }: { limit: number; windowMs: number }, now = Date.now()): boolean {
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    buckets.set(key, recent);
    return false;
  }
  recent.push(now);
  buckets.set(key, recent);
  if (buckets.size > MAX_KEYS) {
    const oldest = buckets.keys().next().value;
    if (oldest !== undefined) buckets.delete(oldest);
  }
  return true;
}

export function resetRateLimits() {
  buckets.clear();
}
