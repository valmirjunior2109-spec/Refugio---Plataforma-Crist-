"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleFavorite } from "@/actions/saved";
import { Button, buttonClasses } from "@/components/ui/button";
import { ActionStatus } from "@/components/ui/action-status";
import { useSessionUser } from "@/hooks/use-session-user";

/** Guarda uma reflexão nos favoritos. Só aparece quando contas estão ativas. */
export function FavoriteButton({
  kind,
  targetId,
  path,
  authEnabled,
}: {
  kind: "devotional" | "need";
  targetId: string;
  path: string;
  authEnabled: boolean;
}) {
  const { user, ready } = useSessionUser();
  const [pending, start] = useTransition();
  const [favorited, setFavorited] = useState<boolean | null>(null);
  const [status, setStatus] = useState<{ message: string | null; tone: "ok" | "error" }>({ message: null, tone: "ok" });

  if (!authEnabled || !ready) return null;

  if (!user) {
    return (
      <Link href={`/entrar?next=${encodeURIComponent(path)}`} className={buttonClasses("secondary", "sm")}>
        <Heart className="size-4" aria-hidden />
        Entrar para favoritar
      </Link>
    );
  }

  return (
    <div>
      <Button
        variant="secondary"
        size="sm"
        loading={pending}
        aria-pressed={favorited ?? undefined}
        icon={<Heart className={favorited ? "size-4 fill-current text-brand" : "size-4"} aria-hidden />}
        onClick={() =>
          start(async () => {
            const res = await toggleFavorite({ kind, targetId });
            if (res.ok) {
              setFavorited(res.data?.favorited ?? null);
              setStatus({ message: res.message ?? null, tone: "ok" });
            } else setStatus({ message: res.error, tone: "error" });
          })
        }
      >
        {favorited ? "Nos favoritos" : "Favoritar reflexão"}
      </Button>
      <ActionStatus message={status.message} tone={status.tone} className="mt-1" />
    </div>
  );
}
