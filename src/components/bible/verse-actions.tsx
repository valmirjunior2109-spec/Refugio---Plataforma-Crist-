"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Bookmark, Check, Copy, Share2 } from "lucide-react";
import { saveVerse } from "@/actions/saved";
import { buttonClasses, Button } from "@/components/ui/button";
import { ActionStatus } from "@/components/ui/action-status";
import { useSessionUser } from "@/hooks/use-session-user";
import type { BibleReference } from "@/lib/bible/reference";

interface Props {
  reference: BibleReference;
  label: string;
  plainText: string;
  /** Caminho da página atual, para compartilhar e voltar após o login. */
  path: string;
  authEnabled: boolean;
}

export function VerseActions({ reference, label, plainText, path, authEnabled }: Props) {
  const { user, ready } = useSessionUser();
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ message: string | null; tone: "ok" | "error" }>({ message: null, tone: "ok" });
  const [copied, setCopied] = useState(false);

  const shareText = `“${plainText}” (${label}, BLIVRE)`;

  async function share() {
    const url = new URL(path, window.location.origin).toString();
    if (navigator.share) {
      try {
        await navigator.share({ title: label, text: shareText, url });
        return;
      } catch (e) {
        if ((e as DOMException).name === "AbortError") return;
      }
    }
    await copy(`${shareText}\n${url}`);
  }

  async function copy(content = shareText) {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setStatus({ message: "Copiado.", tone: "ok" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setStatus({ message: "Não foi possível copiar neste navegador.", tone: "error" });
    }
  }

  function save() {
    startTransition(async () => {
      const res = await saveVerse(reference);
      setStatus(res.ok ? { message: res.message ?? "Salvo.", tone: "ok" } : { message: res.error, tone: "error" });
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {authEnabled && ready && user && (
          <Button variant="soft" size="sm" onClick={save} loading={pending} icon={<Bookmark className="size-4" aria-hidden />}>
            Salvar
          </Button>
        )}
        {authEnabled && ready && !user && (
          <Link
            href={`/entrar?next=${encodeURIComponent(path)}`}
            className={buttonClasses("soft", "sm")}
          >
            <Bookmark className="size-4" aria-hidden />
            Entrar para salvar
          </Link>
        )}
        <Button variant="ghost" size="sm" onClick={share} icon={<Share2 className="size-4" aria-hidden />}>
          Compartilhar
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copy()}
          icon={copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
        >
          Copiar
        </Button>
      </div>
      <ActionStatus message={status.message} tone={status.tone} className="mt-1" />
    </div>
  );
}
