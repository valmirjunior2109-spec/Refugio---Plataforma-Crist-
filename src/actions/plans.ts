"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/require-user";
import type { ActionResult } from "@/types/actions";

const planInput = z.object({ planId: z.string().uuid(), slug: z.string().max(80) });
const dayInput = planInput.extend({ dayId: z.string().uuid(), done: z.boolean() });

export async function startPlan(input: unknown): Promise<ActionResult> {
  const parsed = planInput.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Plano inválido." };
  const auth = await requireUser();
  if (auth.error) return auth.error;
  const { error } = await auth.ctx.supabase
    .from("reading_plan_enrollments")
    .upsert({ plan_id: parsed.data.planId }, { onConflict: "user_id,plan_id", ignoreDuplicates: true });
  if (error) return { ok: false, error: "Não foi possível iniciar o plano agora." };
  revalidatePath(`/planos/${parsed.data.slug}`);
  revalidatePath("/meu-espaco");
  return { ok: true, message: "Plano iniciado. Leia no seu ritmo." };
}

export async function leavePlan(input: unknown): Promise<ActionResult> {
  const parsed = planInput.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Plano inválido." };
  const auth = await requireUser();
  if (auth.error) return auth.error;
  const { supabase } = auth.ctx;
  const [a, b] = await Promise.all([
    supabase.from("reading_progress").delete().eq("plan_id", parsed.data.planId),
    supabase.from("reading_plan_enrollments").delete().eq("plan_id", parsed.data.planId),
  ]);
  if (a.error || b.error) return { ok: false, error: "Não foi possível sair do plano agora." };
  revalidatePath(`/planos/${parsed.data.slug}`);
  revalidatePath("/meu-espaco");
  return { ok: true, message: "Você saiu do plano. O progresso foi apagado." };
}

export async function setDayDone(input: unknown): Promise<ActionResult> {
  const parsed = dayInput.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Leitura inválida." };
  const auth = await requireUser();
  if (auth.error) return auth.error;
  const { supabase } = auth.ctx;
  const { planId, dayId, done, slug } = parsed.data;

  if (done) {
    // Marcar uma leitura também inicia o plano, se ainda não tiver sido iniciado.
    await supabase
      .from("reading_plan_enrollments")
      .upsert({ plan_id: planId }, { onConflict: "user_id,plan_id", ignoreDuplicates: true });
    const { error } = await supabase
      .from("reading_progress")
      .upsert({ plan_id: planId, plan_day_id: dayId }, { onConflict: "user_id,plan_day_id", ignoreDuplicates: true });
    if (error) return { ok: false, error: "Não foi possível marcar agora." };
  } else {
    const { error } = await supabase.from("reading_progress").delete().eq("plan_day_id", dayId);
    if (error) return { ok: false, error: "Não foi possível desmarcar agora." };
  }
  revalidatePath(`/planos/${slug}`);
  revalidatePath("/meu-espaco");
  return { ok: true };
}
