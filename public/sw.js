/* Refúgio · Service Worker
 * - Páginas públicas: rede primeiro, com cópia em cache para uso offline.
 * - Arquivos estáticos versionados (/_next/static): cache primeiro.
 * - NUNCA guarda rotas pessoais, administrativas ou de autenticação,
 *   nem respostas marcadas como privadas (usuário logado).
 */
const VERSION = "refugio-v2";
const STATIC_CACHE = `${VERSION}-static`;
const PAGES_CACHE = `${VERSION}-pages`;
const OFFLINE_URL = "/offline";
const PRECACHE = [OFFLINE_URL, "/favicon.svg", "/icons/icon-192.png", "/manifest.webmanifest"];

// Só páginas abertas a visitantes. Páginas vistas com sessão chegam como
// "private, no-store" e nunca são guardadas (ver isCacheableResponse).
const PUBLIC_PREFIXES = [
  "/boas-vindas",
  "/sobre",
  "/ajuda",
  "/privacidade",
  "/termos",
];
const MAX_PAGES = 80;

function isPublicPage(pathname) {
  return PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function isCacheableResponse(res) {
  if (!res || !res.ok || res.type !== "basic") return false;
  const cc = res.headers.get("Cache-Control") || "";
  return !/private|no-store/i.test(cc) && !res.headers.has("Set-Cookie");
}

async function trimCache(name, max) {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Arquivos estáticos com hash no nome: imutáveis.
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/") || url.pathname.startsWith("/brand/")) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            if (isCacheableResponse(res)) {
              const copy = res.clone();
              caches.open(STATIC_CACHE).then((c) => c.put(request, copy));
            }
            return res;
          }),
      ),
    );
    return;
  }

  // Navegação entre páginas.
  if (request.mode === "navigate") {
    const publicPage = isPublicPage(url.pathname);
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (publicPage && !url.search && isCacheableResponse(res)) {
            const copy = res.clone();
            caches
              .open(PAGES_CACHE)
              .then((c) => c.put(request, copy))
              .then(() => trimCache(PAGES_CACHE, MAX_PAGES));
          }
          return res;
        })
        .catch(async () => {
          if (publicPage) {
            const cached = await caches.match(request, { ignoreSearch: true });
            if (cached) return cached;
          }
          return (await caches.match(OFFLINE_URL)) || Response.error();
        }),
    );
  }
});
