"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/types/actions";

export function FormFooter({
  pending,
  onDelete,
  onDeleteError,
}: {
  pending: boolean;
  onDelete?: () => Promise<ActionResult>;
  onDeleteError?: (msg: string) => void;
}) {
  const [deleting, start] = useTransition();
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
      <Button type="submit" loading={pending}>
        Salvar
      </Button>
      {onDelete && (
        <Button
          variant="ghost"
          className="text-danger hover:bg-danger-soft"
          loading={deleting}
          icon={<Trash2 className="size-4" aria-hidden />}
          onClick={() => {
            if (!confirm("Excluir definitivamente? Essa ação não pode ser desfeita.")) return;
            start(async () => {
              const res = await onDelete();
              if (res && !res.ok) onDeleteError?.(res.error);
            });
          }}
        >
          Excluir
        </Button>
      )}
    </div>
  );
}
