/**
 * Regras de acesso por rota.
 *
 * O Refúgio exige conta para todo o conteúdo. Ficam abertas apenas as páginas
 * necessárias para conhecer o projeto, criar conta e entrar, os documentos
 * legais e, sempre, a página de ajuda emergencial: ninguém em crise precisa de
 * cadastro para encontrar o CVV.
 */
const PUBLIC_PATHS = new Set([
  "/boas-vindas",
  "/entrar",
  "/cadastro",
  "/recuperar-senha",
  "/redefinir-senha",
  "/ajuda",
  "/sobre",
  "/termos",
  "/privacidade",
  "/ajude-a-crescer",
  "/instalar",
  "/offline",
  "/opengraph-image",
]);

const PUBLIC_PREFIXES = ["/auth/"];

/** Páginas só para visitantes: quem já entrou é levado ao início. */
const GUEST_ONLY = new Set(["/boas-vindas"]);

export function isPublicPath(pathname: string): boolean {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return PUBLIC_PATHS.has(path) || PUBLIC_PREFIXES.some((p) => path.startsWith(p));
}

export function isGuestOnlyPath(pathname: string): boolean {
  return GUEST_ONLY.has(pathname.replace(/\/+$/, ""));
}

/** Para onde mandar um visitante que tentou abrir uma página fechada. */
export function guestRedirect(pathname: string, search = ""): string {
  if (pathname === "/") return "/boas-vindas";
  return `/entrar?next=${encodeURIComponent(pathname + search)}`;
}
