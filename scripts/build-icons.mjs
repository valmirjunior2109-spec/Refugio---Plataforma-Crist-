/**
 * Gera os ícones PNG (PWA, iOS) a partir dos SVGs da marca.
 * Uso: npm run icons:build
 */
import sharp from "sharp";
import { mkdirSync, readFileSync } from "node:fs";

mkdirSync("public/icons", { recursive: true });

const icon = readFileSync("public/brand/icon.svg");
const maskable = readFileSync("public/brand/icon-maskable.svg");

const jobs = [
  { src: icon, size: 192, out: "public/icons/icon-192.png" },
  { src: icon, size: 512, out: "public/icons/icon-512.png" },
  { src: maskable, size: 512, out: "public/icons/icon-maskable-512.png" },
  { src: maskable, size: 180, out: "public/icons/apple-touch-icon.png" },
  { src: icon, size: 32, out: "public/icons/favicon-32.png" },
];

for (const { src, size, out } of jobs) {
  await sharp(src, { density: 384 }).resize(size, size).png({ compressionLevel: 9 }).toFile(out);
  console.log(`✓ ${out}`);
}
