import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "@/styles/globals.css";
import { Header } from "@/components/navigation/header";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { Footer } from "@/components/layout/footer";
import { DemoBanner } from "@/components/layout/demo-banner";
import { ServiceWorkerRegister } from "@/components/layout/service-worker-register";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { SITE } from "@/lib/site";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["SOFT", "opsz"],
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name}: ${SITE.slogan}`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: ["Bíblia", "oração", "devocional", "palavra do dia", "fé cristã", "esperança", "planos de leitura"],
  authors: [{ name: "Projeto Refúgio" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  appleWebApp: { capable: true, title: SITE.name, statusBarStyle: "default" },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
    title: `${SITE.name}: ${SITE.slogan}`,
    description: SITE.description,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F5EF" },
    { media: "(prefers-color-scheme: dark)", color: "#161C18" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Aplica o tema salvo antes da pintura, evitando "piscar" entre claro e escuro. */
const themeScript = `try{var t=localStorage.getItem("refugio-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const configured = isSupabaseConfigured();
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#conteudo"
          className="sr-only z-50 rounded-full bg-primary px-4 py-2 text-on-primary focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Pular para o conteúdo
        </a>
        {!configured && <DemoBanner />}
        <Header authEnabled={configured} />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <div className="pb-safe-nav">
          <Footer />
        </div>
        <BottomNav authEnabled={configured} />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
