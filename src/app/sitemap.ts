import type { MetadataRoute } from "next";
import { BIBLE_BOOKS } from "@/lib/bible/books";
import { SITE } from "@/lib/site";
import { listDevotionalHistory, listNeeds, listPlans } from "@/services/content";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const u = (path: string) => `${SITE.url}${path}`;
  const [devotionals, needs, plans] = await Promise.all([listDevotionalHistory(), listNeeds(), listPlans()]);

  const staticPages = ["/", "/palavra-do-dia", "/preciso-de-uma-palavra", "/biblia", "/planos", "/refugio", "/sobre", "/ajuda", "/ajude-a-crescer", "/privacidade", "/termos"].map(
    (p) => ({ url: u(p), changeFrequency: p === "/" ? ("daily" as const) : ("weekly" as const), priority: p === "/" ? 1 : 0.7 }),
  );

  return [
    ...staticPages,
    ...devotionals.map((d) => ({ url: u(`/palavra-do-dia/${d.slug}`), lastModified: d.publishDate, priority: 0.6 })),
    ...needs.map((n) => ({ url: u(`/preciso-de-uma-palavra/${n.topic}`), priority: 0.7 })),
    ...plans.map((p) => ({ url: u(`/planos/${p.slug}`), priority: 0.6 })),
    ...BIBLE_BOOKS.flatMap((b) => [
      { url: u(`/biblia/${b.slug}`), priority: 0.5 },
      ...Array.from({ length: b.chapters }, (_, i) => ({ url: u(`/biblia/${b.slug}/${i + 1}`), priority: 0.4 })),
    ]),
  ];
}
