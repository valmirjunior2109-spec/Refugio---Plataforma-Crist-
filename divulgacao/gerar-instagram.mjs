/**
 * Gera as imagens do Instagram do Refúgio (PNG) a partir de HTML, usando o Edge headless.
 * Uso: node divulgacao/gerar-instagram.mjs
 * Saída: divulgacao/instagram/*.png
 *
 * Versículos: Bíblia Livre (CC BY 4.0), texto exato da fonte em data/bible/blivre.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "divulgacao", "instagram");
const tmp = join(tmpdir(), "refugio-insta");
mkdirSync(out, { recursive: true });
mkdirSync(tmp, { recursive: true });

const EDGE = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
].find(existsSync);
if (!EDGE) throw new Error("Edge ou Chrome não encontrado.");

const C = { sage: "#668773", deep: "#34463B", sand: "#E9E4D7", ivory: "#F7F5EF", white: "#FFFFFF", gray: "#8C918A", ink: "#343F37" };

/** Lê um versículo da Bíblia Livre e marca palavras acrescentadas [..] em itálico. */
function verse(book, ch, v) {
  const data = JSON.parse(readFileSync(join(root, "data/bible/blivre", `${book}.json`), "utf8"));
  return data.chapters[ch - 1][v - 1];
}
const fmt = (t) => t.replace(/\[\s*([^\]]+?)\s*\]/g, "<i>$1</i>").replace(/- <i>/g, "-<i>");

const mark = (stroke, dot, size) =>
  `<svg viewBox="0 0 48 48" width="${size}" height="${size}"><path d="M9 22.5 24 10l15 12.5" fill="none" stroke="${stroke}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="24" cy="29.2" r="3.7" fill="${dot}"/><path d="M14 30.2c1.1 5.9 4.9 9.6 10 9.6s8.9-3.7 10-9.6" fill="none" stroke="${stroke}" stroke-width="3.6" stroke-linecap="round"/></svg>`;

const wordmark = (color, accent, size = 56) =>
  `<div style="display:flex;align-items:center;gap:${size * 0.28}px">${mark(accent, color, size * 1.15)}<span style="font-family:Fraunces;font-size:${size}px;color:${color};letter-spacing:-0.01em">refúgio<span style="color:${accent}">.</span></span></div>`;

/** Arco decorativo (o "abrigo" da marca) ao fundo. */
const arch = (color, opacity, w, h, top) =>
  `<svg style="position:absolute;left:50%;top:${top}px;transform:translateX(-50%);opacity:${opacity}" width="${w}" height="${h}" viewBox="0 0 100 120" preserveAspectRatio="none"><path d="M4 120V50a46 46 0 0 1 92 0v70" fill="none" stroke="${color}" stroke-width="0.6"/></svg>`;

function page(w, h, body, bg) {
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..500&family=DM+Sans:wght@400;500;600&display=block" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}html,body{width:${w}px;height:${h}px;overflow:hidden;background:${bg}}
body{font-family:"DM Sans",sans-serif;position:relative;-webkit-font-smoothing:antialiased}
i{font-style:italic}.serif{font-family:Fraunces,serif}</style></head><body>${body}</body></html>`;
}

function render(name, w, h, html) {
  const file = join(tmp, `${name}.html`);
  writeFileSync(file, html);
  const png = join(out, `${name}.png`);
  rmSync(png, { force: true });
  execFileSync(EDGE, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    `--user-data-dir=${join(tmp, "profile")}`,
    "--force-device-scale-factor=1",
    `--window-size=${w},${h}`,
    "--virtual-time-budget=10000",
    `--screenshot=${png}`,
    `file:///${file.replace(/\\/g, "/")}`,
  ], { stdio: "ignore" });
  console.log(existsSync(png) ? `ok  ${name}.png` : `ERRO ${name}`);
}

const credit = (ref, color) =>
  `<p style="font-size:26px;letter-spacing:0.12em;text-transform:uppercase;color:${color};font-weight:500">${ref}</p>`;

/* ---------- 1. Foto de perfil (1080x1080; o Instagram recorta em círculo) ---------- */
render("01-perfil", 1080, 1080, page(1080, 1080,
  `<div style="position:absolute;inset:0;display:grid;place-items:center">${mark(C.ivory, C.sand, 600)}</div>`, C.sage));

/* ---------- Feed (1080x1350, formato 4:5) ---------- */
const W = 1080, H = 1350;

// 2. Apresentação
render("02-boas-vindas", W, H, page(W, H, `
  ${arch(C.sage, 0.35, 900, 1060, 120)}
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:120px">
    ${mark(C.sage, C.deep, 190)}
    <h1 class="serif" style="margin-top:48px;font-size:132px;font-weight:400;color:${C.deep};letter-spacing:-0.02em">refúgio<span style="color:${C.sage}">.</span></h1>
    <p class="serif" style="margin-top:28px;font-size:52px;font-style:italic;font-weight:300;color:${C.ink};line-height:1.25">Um lugar para sua<br>alma descansar.</p>
    <p style="margin-top:72px;font-size:24px;letter-spacing:0.14em;text-transform:uppercase;color:${C.gray}">Gratuito · Sem anúncios · Para sempre</p>
  </div>`, C.ivory));

// Cartões de versículo
function verseCard(name, { text, ref, dark }) {
  const bg = dark ? C.deep : C.ivory;
  const fg = dark ? C.ivory : C.deep;
  const accent = dark ? "#9DB5A6" : C.sage;
  const size = text.length > 150 ? 50 : text.length > 100 ? 58 : 68;
  render(name, W, H, page(W, H, `
    ${arch(accent, dark ? 0.25 : 0.3, 940, 1080, 90)}
    <div style="position:absolute;left:0;right:0;top:0;bottom:170px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:260px 165px 0">
      <span class="serif" style="font-size:180px;line-height:0.5;height:70px;color:${accent};opacity:0.6">“</span>
      <p class="serif" style="margin-top:24px;font-size:${size}px;line-height:1.32;font-weight:350;color:${fg};letter-spacing:-0.005em">${fmt(text)}</p>
      <div style="margin-top:52px;width:90px;height:3px;background:${accent}"></div>
      <div style="margin-top:30px">${credit(ref, accent)}</div>
    </div>
    <div style="position:absolute;left:130px;right:130px;bottom:90px;display:flex;justify-content:space-between;align-items:center">
      ${wordmark(fg, accent, 44)}
      <span style="font-size:20px;color:${dark ? "#9DB5A6" : C.gray}">Bíblia Livre · CC BY 4.0</span>
    </div>`, bg));
}

verseCard("03-mateus-11-28", { text: verse("MAT", 11, 28), ref: "Mateus 11:28", dark: true });
verseCard("04-isaias-41-10", { text: verse("ISA", 41, 10), ref: "Isaías 41:10", dark: false });
verseCard("05-lamentacoes-3-22-23", {
  text: `${verse("LAM", 3, 22)} ${verse("LAM", 3, 23)}`,
  ref: "Lamentações 3:22-23",
  dark: true,
});
verseCard("06-joao-14-27", { text: verse("JOH", 14, 27), ref: "João 14:27", dark: false });

// 7. O que tem no app
const features = [
  ["Palavra do dia", "Passagem, reflexão e oração para cada dia."],
  ["Preciso de uma palavra", "Conforto para quando o coração aperta."],
  ["Bíblia completa", "E também o Livro de Mórmon."],
  ["Diário de oração", "Privado. Só você lê."],
  ["Planos de leitura", "No seu ritmo, sem cobrança."],
];
render("07-o-que-tem", W, H, page(W, H, `
  <div style="position:absolute;inset:0;padding:120px 110px;display:flex;flex-direction:column">
    <p style="font-size:26px;letter-spacing:0.18em;text-transform:uppercase;color:#9DB5A6;font-weight:500">No Refúgio você encontra</p>
    <div style="margin-top:56px;display:flex;flex-direction:column;gap:40px">
      ${features.map(([t, d]) => `
        <div style="display:flex;gap:32px;align-items:flex-start">
          <div style="margin-top:14px;width:18px;height:18px;border-radius:50%;background:${C.sand};flex-shrink:0"></div>
          <div><p class="serif" style="font-size:54px;color:${C.ivory};line-height:1.1">${t}</p>
          <p style="margin-top:8px;font-size:32px;color:#C9D5CD">${d}</p></div>
        </div>`).join("")}
    </div>
    <div style="margin-top:auto;display:flex;justify-content:space-between;align-items:center">
      ${wordmark(C.ivory, "#9DB5A6", 48)}
      <span style="font-size:26px;color:#C9D5CD">Gratuito · link na bio</span>
    </div>
  </div>`, C.deep));

// 8. Diário de oração
render("08-diario", W, H, page(W, H, `
  ${arch(C.sage, 0.3, 760, 980, 150)}
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:140px">
    <p style="font-size:26px;letter-spacing:0.18em;text-transform:uppercase;color:${C.sage};font-weight:500">Diário de oração</p>
    <h2 class="serif" style="margin-top:36px;font-size:86px;font-weight:400;color:${C.deep};line-height:1.12">Escreva o que<br>está no seu<br><i style="color:${C.sage}">coração.</i></h2>
    <p style="margin-top:44px;font-size:34px;color:${C.ink};line-height:1.45">Seus registros são privados.<br>Ninguém mais lê. Nem a nossa equipe.</p>
  </div>
  <div style="position:absolute;left:0;right:0;bottom:90px;display:flex;justify-content:center">${wordmark(C.deep, C.sage, 44)}</div>`, C.ivory));

/* ---------- Stories (1080x1920) ---------- */
render("09-story-conheca", 1080, 1920, page(1080, 1920, `
  ${arch("#9DB5A6", 0.3, 840, 1300, 260)}
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:160px 120px">
    ${mark(C.ivory, C.sand, 200)}
    <h1 class="serif" style="margin-top:48px;font-size:130px;font-weight:400;color:${C.ivory}">refúgio<span style="color:#9DB5A6">.</span></h1>
    <p class="serif" style="margin-top:28px;font-size:56px;font-style:italic;font-weight:300;color:${C.sand};line-height:1.25">Um lugar para sua<br>alma descansar.</p>
    <p style="margin-top:90px;font-size:36px;color:#C9D5CD;line-height:1.5">Palavra do dia, Bíblia, diário de oração<br>e planos de leitura.</p>
    <div style="margin-top:80px;padding:30px 64px;border-radius:999px;background:${C.ivory};color:${C.deep};font-size:38px;font-weight:600">Crie sua conta grátis</div>
    <p style="margin-top:28px;font-size:28px;color:#9DB5A6">link na bio</p>
  </div>`, C.deep));

render("10-story-versiculo", 1080, 1920, page(1080, 1920, `
  ${arch(C.sage, 0.3, 960, 1440, 170)}
  <div style="position:absolute;left:0;right:0;top:0;bottom:300px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:420px 150px 0">
    <p style="font-size:28px;letter-spacing:0.18em;text-transform:uppercase;color:${C.sage};font-weight:500">Palavra para hoje</p>
    <p class="serif" style="margin-top:48px;font-size:72px;line-height:1.3;font-weight:350;color:${C.deep}">${fmt(verse("MAT", 11, 28))}</p>
    <div style="margin-top:56px;width:90px;height:3px;background:${C.sage}"></div>
    <div style="margin-top:32px">${credit("Mateus 11:28", C.sage)}</div>
  </div>
  <div style="position:absolute;left:0;right:0;bottom:150px;display:flex;flex-direction:column;align-items:center;gap:16px">
    ${wordmark(C.deep, C.sage, 50)}
    <span style="font-size:22px;color:${C.gray}">Bíblia Livre · CC BY 4.0</span>
  </div>`, C.ivory));

/* ---------- Capas de destaques (1080x1920; o ícone fica no centro) ---------- */
const icons = {
  palavra: `<path d="M12 7v14M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>`,
  oracao: `<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>`,
  planos: `<path d="M8 2v4M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18M9 16l2 2 4-4"/>`,
  sobre: null,
};
for (const [name, path] of Object.entries(icons)) {
  const glyph = path
    ? `<svg viewBox="0 0 24 24" width="380" height="380" fill="none" stroke="${C.ivory}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`
    : mark(C.ivory, C.sand, 440);
  render(`destaque-${name}`, 1080, 1920, page(1080, 1920,
    `<div style="position:absolute;inset:0;display:grid;place-items:center">${glyph}</div>`, C.sage));
}

rmSync(tmp, { recursive: true, force: true });
console.log(`\nImagens em ${out}`);
