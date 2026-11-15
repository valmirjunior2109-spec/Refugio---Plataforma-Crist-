import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { guestRedirect, isGuestOnlyPath, isPublicPath } from "./access";
import { getSupabaseConfig } from "./env";

/**
 * Renova a sessão do Supabase a cada requisição e aplica a regra de acesso:
 * visitantes só abrem as páginas públicas (ver access.ts); o resto pede login.
 *
 * Em modo demonstração (sem Supabase) não há como entrar, então nada é bloqueado.
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request });
  const config = getSupabaseConfig();
  if (!config) return response;

  const supabase = createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) => {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;

  if (!user && !isPublicPath(pathname)) {
    return redirectKeepingCookies(request, response, guestRedirect(pathname, search));
  }

  if (user && isGuestOnlyPath(pathname)) {
    return redirectKeepingCookies(request, response, "/");
  }

  // Páginas vistas com sessão nunca devem ser guardadas em caches compartilhados.
  if (user) response.headers.set("Cache-Control", "private, no-store");
  return response;
}

/** Redireciona preservando cookies de sessão que o Supabase possa ter renovado. */
function redirectKeepingCookies(request: NextRequest, response: NextResponse, target: string): NextResponse {
  const redirect = NextResponse.redirect(new URL(target, request.url));
  response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
  redirect.headers.set("Cache-Control", "private, no-store");
  return redirect;
}
