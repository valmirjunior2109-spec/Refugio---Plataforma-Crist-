"use client";

import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import type { ActionResult } from "@/types/actions";

/** Aplica no formulário os erros de campo devolvidos pela Server Action. */
export function applyServerErrors<T extends FieldValues>(res: ActionResult<unknown>, setError: UseFormSetError<T>) {
  if (res.ok || !res.fieldErrors) return;
  for (const [field, messages] of Object.entries(res.fieldErrors)) {
    if (messages?.[0]) setError(field as Path<T>, { type: "server", message: messages[0] });
  }
}
