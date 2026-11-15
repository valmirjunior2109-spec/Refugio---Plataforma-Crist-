import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/** Apenas páginas públicas: o conteúdo exige conta e não é indexado. */
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/boas-vindas", "/sobre", "/ajuda", "/ajude-a-crescer", "/privacidade", "/termos"].map((p) => ({
    url: `${SITE.url}${p}`,
    changeFrequency: "monthly" as const,
    priority: p === "/boas-vindas" ? 1 : 0.5,
  }));
}
