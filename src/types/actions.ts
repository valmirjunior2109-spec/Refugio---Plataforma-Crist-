/** Resultado padronizado das Server Actions. */
export type ActionResult<T = undefined> =
  | { ok: true; message?: string; data?: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[] | undefined>; requiresAuth?: boolean };

export const DEMO_MODE_ERROR =
  "O Refúgio está em modo demonstração: nada foi salvo. Para salvar, configure o Supabase.";

export const AUTH_REQUIRED_ERROR = "Entre na sua conta para salvar.";
