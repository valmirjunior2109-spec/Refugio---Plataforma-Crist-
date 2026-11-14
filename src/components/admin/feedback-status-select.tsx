"use client";

import { useState, useTransition } from "react";
import { setFeedbackStatus } from "@/actions/admin";
import { Select } from "@/components/ui/form";
import { FEEDBACK_STATUSES } from "@/lib/validations/feedback";

export function FeedbackStatusSelect({ id, status }: { id: string; status: string }) {
  const [value, setValue] = useState(status);
  const [pending, start] = useTransition();
  const [error, setError] = useState(false);
  return (
    <label className="text-xs text-muted">
      <span className="sr-only">Status</span>
      <Select
        value={value}
        disabled={pending}
        aria-invalid={error}
        className="h-9 w-40 text-sm"
        onChange={(e) => {
          const next = e.target.value;
          const prev = value;
          setValue(next);
          start(async () => {
            const res = await setFeedbackStatus({ id, status: next });
            setError(!res.ok);
            if (!res.ok) setValue(prev);
          });
        }}
      >
        {FEEDBACK_STATUSES.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </Select>
      {error && <span className="mt-1 block text-danger">Não foi possível atualizar.</span>}
    </label>
  );
}
