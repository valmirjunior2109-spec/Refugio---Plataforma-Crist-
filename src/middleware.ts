import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Ignora arquivos estáticos, imagens, ícones e o service worker.
    "/((?!_next/static|_next/image|favicon.svg|favicon.ico|sw.js|manifest.webmanifest|brand/|icons/|images/|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
