import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: `${SITE.name}: ${SITE.slogan}`,
    short_name: SITE.name,
    description: SITE.description,
    lang: "pt-BR",
    dir: "ltr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#F7F5EF",
    theme_color: "#F7F5EF",
    categories: ["lifestyle", "books", "education"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/brand/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
    shortcuts: [
      { name: "Palavra do dia", url: "/palavra-do-dia", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Bíblia", url: "/biblia", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Meu diário", url: "/oracoes", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
