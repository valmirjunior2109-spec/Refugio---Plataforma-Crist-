"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { removeSavedVerse } from "@/actions/saved";
import { Button } from "@/components/ui/button";

export function RemoveSavedVerseButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  return (
    <Button
      variant="ghost"
      size="sm"
      loading={pending}
      icon={<Trash2 className="size-4" aria-hidden />}
      onClick={() => start(async () => void (await removeSavedVerse(id)))}
    >
      Remover
    </Button>
  );
}
