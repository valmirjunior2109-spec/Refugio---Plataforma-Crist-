import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Lock, NotebookPen, Plus } from "lucide-react";
import { Container, PageHeader } from "@/components/layout/page";
import { PrayerFilters } from "@/components/prayer/prayer-filters";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { Alert, EmptyState } from "@/components/ui/feedback-states";
import { getCurrentUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { prayerFilterSchema } from "@/lib/validations/prayer";
import { listPrayerEntries } from "@/services/personal";
import { categoryLabel } from "@/types/user";
import { formatLongDate } from "@/lib/utils/dates";

export const metadata: Metadata = {
  title: "Orações",
  description: "Seu diário de oração pessoal e privado: registre orações, agradecimentos, pedidos e reflexões.",
};

const prompts = [
  "Pelo que você é grato hoje?",
  "O que está pesando no seu coração?",
  "Por quem você gostaria de orar?",
  "O que você gostaria de dizer a Deus agora?",
];

type SP = Promise<Record<string, string | undefined>>;

export default async function PrayersPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const configured = isSupabaseConfigured();
  const user = configured ? await getCurrentUser() : null;

  if (!user) {
    return (
      <Container className="max-w-3xl">
        <PageHeader
          eyebrow="Orações"
          title="Um diário para conversar com Deus"
          description="Escreva orações, agradecimentos e pedidos. Volte a eles depois e perceba como Deus tem cuidado de você."
        />
        <div className="space-y-6">
          <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
            <p className="text-xs font-semibold tracking-[0.14em] text-brand uppercase">Para começar agora</p>
            <ul className="mt-4 space-y-3">
              {prompts.map((p) => (
                <li key={p} className="font-serif text-xl text-ink-soft">
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-muted">
              Você pode responder em silêncio, em oração. Se quiser guardar o que escreveu, crie uma conta gratuita.
            </p>
          </div>

          <div className="flex items-start gap-3 rounded-2xl bg-brand-soft p-5 text-sm text-ink-soft">
            <Lock className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
            <p>
              <strong className="text-brand-ink">Seu diário é privado.</strong> Os registros ficam protegidos por regras de
              acesso no banco de dados: só você pode lê-los. Nada é compartilhado ou usado para publicidade.
            </p>
          </div>

          {configured ? (
            <div className="flex flex-wrap gap-2">
              <ButtonLink href="/cadastro">Criar meu diário</ButtonLink>
              <ButtonLink href="/entrar?next=/oracoes" variant="secondary">
                Já tenho conta
              </ButtonLink>
            </div>
          ) : (
            <Alert tone="warning" title="Modo demonstração">
              O diário fica disponível quando o Supabase estiver configurado. Nada do que for escrito aqui seria salvo.
            </Alert>
          )}
        </div>
      </Container>
    );
  }

  const filters = prayerFilterSchema.parse(sp);
  const entries = await listPrayerEntries(filters);
  const filtering = Object.values(filters).some(Boolean);

  return (
    <Container className="max-w-4xl">
      <PageHeader
        eyebrow="Orações"
        title="Meu diário de oração"
        description={
          <span className="inline-flex items-center gap-1.5 text-sm">
            <Lock className="size-4 text-brand" aria-hidden /> Privado: só você pode ver.
          </span>
        }
        actions={
          <ButtonLink href="/oracoes/nova" icon={<Plus className="size-4" aria-hidden />}>
            Novo registro
          </ButtonLink>
        }
      />

      {sp.salvo && <Alert tone="success" className="mb-6">Registro salvo no seu diário.</Alert>}
      {sp.excluido && <Alert className="mb-6">Registro excluído.</Alert>}

      <Suspense>
        <PrayerFilters />
      </Suspense>

      <div className="mt-6">
        {entries.length === 0 ? (
          <EmptyState
            icon={<NotebookPen className="size-5" aria-hidden />}
            title={filtering ? "Nenhum registro encontrado" : "Seu diário está esperando por você"}
            description={
              filtering
                ? "Tente outro período, categoria ou termo de busca."
                : "Escreva sua primeira oração. Pode ser curta: uma frase sincera já é uma conversa com Deus."
            }
            action={!filtering && <ButtonLink href="/oracoes/nova">Escrever agora</ButtonLink>}
          />
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {entries.map((e) => (
              <li key={e.id}>
                <Link
                  href={`/oracoes/registro/${e.id}`}
                  className="flex h-full flex-col rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-brand/40"
                >
                  <div className="flex items-center justify-between gap-2 text-xs text-muted">
                    <span>{formatLongDate(e.entryDate)}</span>
                    <Badge tone="brand">{categoryLabel(e.category)}</Badge>
                  </div>
                  <h2 className="mt-2 font-serif text-lg text-ink">{e.title}</h2>
                  <p className="mt-1 line-clamp-3 text-sm whitespace-pre-line text-ink-soft">{e.content}</p>
                  {e.tags.length > 0 && (
                    <p className="mt-auto flex flex-wrap gap-1 pt-3">
                      {e.tags.map((t) => (
                        <span key={t} className="text-xs text-muted">
                          #{t}
                        </span>
                      ))}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Container>
  );
}
