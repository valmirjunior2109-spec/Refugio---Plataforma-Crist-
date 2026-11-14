import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, HandHeart, NotebookPen } from "lucide-react";
import { Container } from "@/components/layout/page";
import { PassageBlock } from "@/components/bible/passage-block";
import { Greeting } from "@/components/home/greeting";
import { NeedChips } from "@/components/devotionals/need-chips";
import { PlanCard } from "@/components/reading-plans/plan-card";
import { ButtonLink } from "@/components/ui/button";
import { SectionTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/feedback-states";
import { messageForDate } from "@/content/messages";
import { getTodayDevotional, listNeeds, listPlans } from "@/services/content";
import { formatWeekdayDate, isoDate } from "@/lib/utils/dates";
import { SITE } from "@/lib/site";

export const revalidate = 300;

const shortcuts = [
  { href: "/biblia", label: "Bíblia", description: "Leia as Escrituras", icon: BookOpen },
  { href: "/oracoes", label: "Diário de oração", description: "Converse com Deus", icon: NotebookPen },
  { href: "/planos", label: "Planos de leitura", description: "Jornadas no seu ritmo", icon: CalendarDays },
  { href: "/preciso-de-uma-palavra", label: "Preciso de uma palavra", description: "Para o que você sente", icon: HandHeart },
];

export default async function HomePage() {
  const today = isoDate();
  const [devotional, needs, plans] = await Promise.all([getTodayDevotional(), listNeeds(), listPlans()]);

  return (
    <>
      {/* Acolhimento */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_22rem_at_50%_-4rem,var(--brand-soft),transparent_70%)]"
        />
        <Container className="relative pt-10 pb-8 sm:pt-16 sm:pb-12">
          <div className="max-w-2xl animate-fade-up">
            <Greeting />
            <h1 className="mt-3 font-serif text-[2.4rem] leading-[1.08] tracking-tight text-ink sm:text-[3.4rem]">
              {SITE.slogan}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted">{messageForDate(today)}</p>
          </div>
        </Container>
      </section>

      <Container className="space-y-16 sm:space-y-20">
        {/* Palavra do dia */}
        <section aria-labelledby="palavra-titulo" className="animate-fade-up [animation-delay:80ms]">
          <div className="rounded-3xl border border-line bg-surface p-6 shadow-soft sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p id="palavra-titulo" className="text-xs font-semibold tracking-[0.14em] text-brand uppercase">
                Palavra do dia
              </p>
              <p className="text-sm text-muted first-letter:uppercase">{formatWeekdayDate(devotional?.publishDate ?? today)}</p>
            </div>

            {devotional ? (
              <>
                <h2 className="mt-3 mb-6 font-serif text-xl text-ink-soft sm:text-2xl">{devotional.title}</h2>
                <PassageBlock reference={devotional.reference} path={`/palavra-do-dia/${devotional.slug}`} />
                <div className="mt-6 border-t border-line pt-6">
                  <p className="line-clamp-3 max-w-3xl text-ink-soft">{devotional.reflection.split("\n")[0]}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <ButtonLink href={`/palavra-do-dia/${devotional.slug}`} icon={<ArrowRight className="size-4" aria-hidden />}>
                      Ler reflexão completa
                    </ButtonLink>
                    <ButtonLink href="/palavra-do-dia" variant="ghost">
                      Palavras anteriores
                    </ButtonLink>
                  </div>
                </div>
              </>
            ) : (
              <EmptyState
                className="mt-6"
                title="A Palavra de hoje ainda está sendo preparada"
                description="Enquanto isso, você pode ler a Bíblia ou escolher uma palavra para o que está sentindo."
                action={<ButtonLink href="/biblia">Abrir a Bíblia</ButtonLink>}
              />
            )}
          </div>
        </section>

        {/* Preciso de uma palavra */}
        {needs.length > 0 && (
          <section aria-label="Preciso de uma palavra">
            <SectionTitle
              eyebrow="Preciso de uma palavra"
              title="Como está o seu coração hoje?"
              description="Escolha o que mais se aproxima do que você sente. Vamos caminhar juntos pelas Escrituras."
              className="mb-6"
            />
            <NeedChips needs={needs} />
          </section>
        )}

        {/* Atalhos */}
        <section aria-labelledby="atalhos-titulo">
          <h2 id="atalhos-titulo" className="sr-only">
            Atalhos
          </h2>
          <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {shortcuts.map(({ href, label, description, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group flex h-full flex-col gap-6 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-brand/40 sm:p-5"
                >
                  <span className="grid size-10 place-items-center rounded-xl bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block font-medium text-ink">{label}</span>
                    <span className="block text-sm text-muted">{description}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Convite para oração */}
        <section
          aria-labelledby="convite-titulo"
          className="relative overflow-hidden rounded-3xl bg-[#34463B] px-6 py-10 text-[#F7F5EF] sm:px-12 sm:py-14"
        >
          <svg aria-hidden viewBox="0 0 200 200" className="absolute -right-10 -bottom-16 w-72 opacity-15">
            <path d="M30 95 100 37l70 58" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="100" cy="125" r="17" fill="currentColor" />
            <path d="M58 129c5 27 22 44 42 44s37-17 42-44" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
          </svg>
          <div className="relative max-w-xl">
            <p className="text-xs font-semibold tracking-[0.14em] text-[#A9C0B0] uppercase">Um convite</p>
            <h2 id="convite-titulo" className="mt-2 font-serif text-3xl leading-tight sm:text-4xl">
              Reserve um momento para conversar com Deus.
            </h2>
            <p className="mt-3 text-[#E9E4D7]/85">
              Não é preciso ter as palavras certas. Escreva o que está no coração, agradeça, peça ou simplesmente fique em
              silêncio. Seu diário é só seu.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="/oracoes"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-[#F7F5EF] px-5 font-medium text-[#34463B] transition-colors hover:bg-white"
              >
                <NotebookPen className="size-4" aria-hidden />
                Abrir meu diário
              </Link>
            </div>
          </div>
        </section>

        {/* Planos de leitura */}
        {plans.length > 0 && (
          <section aria-label="Planos de leitura">
            <SectionTitle
              eyebrow="Planos de leitura"
              title="Jornadas pelas Escrituras"
              description="Leituras diárias, sem pressa e sem cobrança. Comece quando quiser."
              action={
                <Link href="/planos" className="hidden items-center gap-1 text-sm font-medium text-brand-ink hover:underline sm:inline-flex">
                  Ver todos <ArrowRight className="size-4" aria-hidden />
                </Link>
              }
              className="mb-6"
            />
            <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
              {plans.slice(0, 4).map((plan) => (
                <li key={plan.id} className="w-[78%] shrink-0 snap-start sm:w-auto">
                  <PlanCard plan={plan} className="h-full" />
                </li>
              ))}
            </ul>
            <div className="mt-4 sm:hidden">
              <ButtonLink href="/planos" variant="secondary" className="w-full">
                Ver todos os planos
              </ButtonLink>
            </div>
          </section>
        )}
      </Container>
    </>
  );
}
