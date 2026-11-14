"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { feedbackSchema } from "@/lib/validations/feedback";
import { checkRateLimit } from "@/lib/utils/rate-limit";
import { DEMO_MODE_ERROR, type ActionResult } from "@/types/actions";

/** Hash não reversível do IP + agente, com segredo do servidor. O IP em si nunca é armazenado. */
async function clientHash(): Promise<string | null> {
  const salt = process.env.RATE_LIMIT_SALT;
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "";
  if (!salt || !ip) return null;
  return createHash("sha256").update(`${salt}:${ip}:${h.get("user-agent") ?? ""}`).digest("hex");
}

export async function submitFeedback(input: unknown): Promise<ActionResult> {
  const parsed = feedbackSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Confira os campos destacados.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;

  // Robôs: campo-isca preenchido ou envio rápido demais. Respondemos de forma neutra, sem gravar.
  const tooFast = data.startedAt ? Date.now() - data.startedAt < 2500 : false;
  if (data.website || tooFast) {
    return { ok: false, error: "Não foi possível enviar. Aguarde alguns segundos e tente novamente." };
  }

  const hash = await clientHash();
  // Limite em memória (primeira barreira). O banco aplica um segundo limite, persistente.
  if (!checkRateLimit(`feedback:${hash ?? "anon"}`, { limit: 3, windowMs: 10 * 60_000 })) {
    return { ok: false, error: "Você já enviou algumas mensagens agora há pouco. Tente novamente em alguns minutos." };
  }

  const supabase = await createClient();
  if (!supabase) return { ok: false, error: DEMO_MODE_ERROR };

  const { error } = await supabase.rpc("submit_feedback", {
    p_kind: data.kind,
    p_message: data.message,
    p_rating: data.rating,
    p_contact_email: data.contactEmail || null,
    p_page: data.page ?? null,
    p_client_hash: hash,
  });

  if (error) {
    if (error.message.includes("rate_limited")) {
      return { ok: false, error: "Recebemos várias mensagens em pouco tempo. Tente novamente em alguns minutos." };
    }
    return { ok: false, error: "Não foi possível enviar agora. Tente novamente mais tarde." };
  }
  return { ok: true, message: "Obrigado! Sua mensagem chegou até nós e será lida com carinho." };
}
