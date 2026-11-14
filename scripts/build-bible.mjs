/**
 * Converte o arquivo "verse per line" da Bíblia Livre (BLIVRE, ebible.org: porbr2018)
 * em um JSON por livro em data/bible/blivre/<CÓDIGO>.json.
 *
 * Uso:  node scripts/build-bible.mjs <caminho/para/porbr2018_vpl.txt>
 * Fonte: https://ebible.org/Scriptures/porbr2018_vpl.zip
 * Licença do texto: Creative Commons Atribuição 4.0 Brasil — ver data/bible/blivre/LICENSE.md
 *
 * O texto não é alterado: apenas removemos espaços nas pontas de cada versículo.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";

const src = process.argv[2];
if (!src) {
  console.error("Informe o caminho do arquivo porbr2018_vpl.txt");
  process.exit(1);
}

const outDir = resolve("data/bible/blivre");
mkdirSync(outDir, { recursive: true });

const books = new Map();
const lineRe = /^([1-3A-Z][A-Z0-9]{2}) (\d+):(\d+) (.*)$/;
let count = 0;

for (const raw of readFileSync(src, "utf8").replace(/^﻿/, "").split(/\r?\n/)) {
  if (!raw.trim()) continue;
  const m = lineRe.exec(raw);
  if (!m) throw new Error(`Linha inesperada: ${raw.slice(0, 80)}`);
  const [, code, ch, vs, text] = m;
  if (!books.has(code)) books.set(code, []);
  const chapters = books.get(code);
  const c = Number(ch) - 1;
  const v = Number(vs) - 1;
  chapters[c] ??= [];
  chapters[c][v] = text.trim();
  count++;
}

const gaps = [];
for (const [code, chapters] of books) {
  chapters.forEach((verses, ci) => {
    for (let vi = 0; vi < verses.length; vi++) {
      if (verses[vi] === undefined) {
        verses[vi] = "";
        gaps.push(`${code} ${ci + 1}:${vi + 1}`);
      }
    }
  });
  writeFileSync(join(outDir, `${code}.json`), JSON.stringify({ code, chapters }));
}

console.log(`${books.size} livros, ${count} versículos gravados em ${outDir}`);
if (gaps.length) console.log(`Versículos ausentes na fonte (${gaps.length}): ${gaps.join(", ")}`);
