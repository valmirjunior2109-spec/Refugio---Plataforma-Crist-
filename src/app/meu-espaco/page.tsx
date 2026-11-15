import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  BookOpen,
  CalendarDays,
  Heart,
  History,
  NotebookPen,
  Settings,
  Shield,
  Target,
  UserRound,
} from "lucide-react";
import { Container, PageHeader } from "@/components/layout/page";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/feedback-states";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { getCurrentRole, getCurrentUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { formatReference, referenceHref } from "@/lib/bible/reference";
import { formatDateTime } from "@/lib/utils/dates";
import {
  getProfile,
  listEnrollments,
  listFavorites,
  listGoals,
  listRecentActivity,
  listSavedVerses,
} from "@/services/personal";

export const metadata: Metadata = { title: "Meu espaço", robots: { index: false } };

export default async function MySpacePage({ searchParams }: { searchParams: Promise<{ "bem-vindo"?: string; "sem-permissao"?: string }> }) {
  const configured = isSupabaseConfigured();
  const user = configured ? await getCurrentUser() : null;

  if (!user) return <GuestSpace configured={configured} />;

  const sp = await searchParams;
  const [profile, enrollments, verses, favorites, goals, activity, role] = await Promise.all([
    getProfile(),
    listEnrollments(),
    listSavedVerses(3),
    listFavorites(5),
    listGoals(),
    listRecentActivity(8),
    getCurrentRole(),
  ]);
  const name = profile?.displayName?.split(" ")[0];
  const openGoals = goals.filter((g) => !g.isDone);

  return (
    <Container>
      <PageHeader
        eyebrow="Meu espaço"
        title={name ? `Que bom te ver, ${name}.` : "Que bom te ver."}
        description="Sua caminhada, no seu ritmo. Aqui não há metas a cumprir nem comparações."
        actions={
          <>
            {(role === "admin" || role === "editor") && (
              <ButtonLink href="/admin" variant="soft" size="sm" icon={<Shield className="size-4" aria-hidden />}>
                Painel
              </ButtonLink>
            )}
            <ButtonLink href="/meu-espaco/configuracoes" variant="ghost" size="sm" icon={<Settings className="size-4" aria-hidden />}>
              Configurações
            </ButtonLink>
          </>
        }
      />

      {sp["sem-permissao"] && (
        <Alert tone="warning" className="mb-6">
          Você não tem acesso ao painel administrativo.
        </Alert>
      )}
      {sp["bem-vindo"] && (
        <Alert tone="success" className="mb-6" title="Seu espaço está pronto">
          Comece escrevendo no diário, salvando um versículo ou escolhendo um plano de leitura.
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Planos */}
        <Card className="lg:col-span-2">
          <CardHeading icon={<CalendarDays className="size-4" />} title="Planos iniciados" href="/planos" linkLabel="Ver planos" />
          {enrollments.length === 0 ? (
            <p className="text-sm text-muted">
              Você ainda não iniciou nenhum plano.{" "}
              <Link href="/planos" className="text-brand-ink underline">
                Conheça as jornadas
              </Link>
              .
            </p>
          ) : (
            <ul className="space-y-4">
              {enrollments.map((e) => {
                const done = e.completedDayIds.length;
                const pct = e.durationDays ? Math.round((done / e.durationDays) * 100) : 0;
                return (
                  <li key={e.planId}>
                    <Link href={`/planos/${e.planSlug}`} className="group block">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="font-medium text-ink group-hover:text-brand-ink">{e.planTitle}</span>
                        <span className="shrink-0 text-xs text-muted">
                          {done}/{e.durationDays} leituras
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2" aria-hidden>
                        <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        {/* Atalhos */}
        <Card className="flex flex-col gap-2">
          <ShortcutLink href="/oracoes/nova" icon={<NotebookPen className="size-4" />} label="Escrever no diário" />
          <ShortcutLink href="/oracoes" icon={<BookOpen className="size-4" />} label="Ler meu diário" />
          <ShortcutLink href="/meu-espaco/versiculos" icon={<Bookmark className="size-4" />} label="Versículos salvos" />
          <ShortcutLink href="/meu-espaco/objetivos" icon={<Target className="size-4" />} label="Objetivos pessoais" />
          <ShortcutLink href="/meu-espaco/perfil" icon={<UserRound className="size-4" />} label="Meu perfil" />
        </Card>

        {/* Versículos salvos */}
        <Card>
          <CardHeading icon={<Bookmark className="size-4" />} title="Versículos salvos" href="/meu-espaco/versiculos" linkLabel="Todos" />
          {verses.length === 0 ? (
            <p className="text-sm text-muted">Use “Salvar” em qualquer passagem para guardá-la aqui.</p>
          ) : (
            <ul className="space-y-4">
              {verses.map((v) => (
                <li key={v.id}>
                  <p className="line-clamp-3 font-serif text-ink-soft">“{v.textSnapshot}”</p>
                  <Link href={referenceHref(v.reference)} className="mt-1 inline-block text-xs font-semibold text-brand-ink hover:underline">
                    {formatReference(v.reference)}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Favoritos */}
        <Card>
          <CardHeading icon={<Heart className="size-4" />} title="Reflexões favoritas" />
          {favorites.length === 0 ? (
            <p className="text-sm text-muted">Toque em “Favoritar reflexão” na Palavra do dia para guardá-la aqui.</p>
          ) : (
            <ul className="space-y-2">
              {favorites.map((f) => (
                <li key={f.id}>
                  <Link href={f.href} className="block rounded-lg py-1 text-ink-soft hover:text-brand-ink">
                    {f.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Objetivos */}
        <Card>
          <CardHeading icon={<Target className="size-4" />} title="Objetivos" href="/meu-espaco/objetivos" linkLabel="Gerenciar" />
          {openGoals.length === 0 ? (
            <p className="text-sm text-muted">
              Defina, se quiser, pequenos objetivos para sua caminhada, como “orar antes de dormir”.
            </p>
          ) : (
            <ul className="list-inside list-disc space-y-1.5 text-ink-soft marker:text-brand">
              {openGoals.slice(0, 5).map((g) => (
                <li key={g.id}>{g.title}</li>
              ))}
            </ul>
          )}
        </Card>

        {/* Histórico */}
        <Card className="lg:col-span-3">
          <CardHeading icon={<History className="size-4" />} title="Atividade recente" />
          {activity.length === 0 ? (
            <p className="text-sm text-muted">Sua atividade aparecerá aqui. Só você pode vê-la.</p>
          ) : (
            <ol className="divide-y divide-line">
              {activity.map((a) => (
                <li key={a.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 py-2.5 text-sm">
                  {a.href ? (
                    <Link href={a.href} className="text-ink-soft hover:text-brand-ink">
                      {a.label}
                    </Link>
                  ) : (
                    <span className="text-ink-soft">{a.label}</span>
                  )}
                  <time dateTime={a.at} className="text-xs text-muted">
                    {formatDateTime(a.at)}
                  </time>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>

      <div className="mt-10 flex justify-center">
        <SignOutButton />
      </div>
    </Container>
  );
}

function CardHeading({ icon, title, href, linkLabel }: { icon: React.ReactNode; title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-2 font-medium text-ink">
        <span className="text-brand" aria-hidden>
          {icon}
        </span>
        {title}
      </h2>
      {href && (
        <Link href={href} className="inline-flex items-center gap-1 text-xs font-medium text-brand-ink hover:underline">
          {linkLabel} <ArrowRight className="size-3" aria-hidden />
        </Link>
      )}
    </div>
  );
}

function ShortcutLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-ink-soft hover:bg-surface-2 hover:text-ink">
      <span className="text-brand" aria-hidden>
        {icon}
      </span>
      {label}
    </Link>
  );
}

function GuestSpace({ configured }: { configured: boolean }) {
  const items = [
    { icon: NotebookPen, title: "Diário de oração privado", text: "Registre orações, agradecimentos e pedidos." },
    { icon: CalendarDays, title: "Progresso nos planos", text: "Marque as leituras concluídas, no seu ritmo." },
    { icon: Bookmark, title: "Versículos salvos", text: "Guarde as passagens que tocaram seu coração." },
    { icon: Target, title: "Objetivos pessoais", text: "Pequenos passos para a sua caminhada." },
  ];
  return (
    <Container className="max-w-3xl">
      <PageHeader
        eyebrow="Meu espaço"
        title="Um espaço só seu"
        description="Com sua conta gratuita, você acessa todo o conteúdo do Refúgio e guarda o que é pessoal, com privacidade."
      />
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map(({ icon: Icon, title, text }) => (
          <li key={title} className="rounded-2xl border border-line bg-surface p-5">
            <Icon className="size-5 text-brand" aria-hidden />
            <p className="mt-3 font-medium text-ink">{title}</p>
            <p className="text-sm text-muted">{text}</p>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        {configured ? (
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/cadastro">Criar conta gratuita</ButtonLink>
            <ButtonLink href="/entrar" variant="secondary">
              Entrar
            </ButtonLink>
          </div>
        ) : (
          <Alert tone="warning" title="Modo demonstração">
            Contas ficam disponíveis quando o Supabase estiver configurado.
          </Alert>
        )}
      </div>
    </Container>
  );
}
