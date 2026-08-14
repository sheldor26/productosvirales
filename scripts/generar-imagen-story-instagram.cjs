#!/usr/bin/env node
// Genera la imagen (PNG 1080x1920) de una Historia de Instagram a partir de datos de producto ya verificados.
// Uso: node scripts/generar-imagen-story-instagram.cjs '<json de producto>' [ruta-salida.png]
//
// Mismo JSON que scripts/generar-imagen-post-threads.cjs (imgUrl, badge, title, brand,
// rating, sold, oldPrice, newPrice, offPct, savings). Usa una plantilla propia
// (threads-post-template-story.html) con proporción 9:16 real para Historias —
// nunca reusar la imagen 1080x1350 del post cuadrado, Instagram la recorta en el celular.
//
// Datos ya verificados en vivo por Claude antes de llamar a este script (precio, stock, cupón,
// cuotas por banco si corresponde). Este script solo arma la pieza visual, no valida nada de ML.

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const TEMPLATE_PATH = path.join(__dirname, "threads-post-template-story.html");
const ML_LOGO_PATH = path.join(__dirname, "..", "public", "logo", "mercadolibre.svg");
const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const REQUIRED_FIELDS = [
  "imgUrl", "badge", "title", "brand", "rating", "sold",
  "oldPrice", "newPrice", "offPct", "savings",
];

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(str) {
  return escapeHtml(str);
}

function buildMlLogoDataUri() {
  const svg = fs.readFileSync(ML_LOGO_PATH, "utf8");
  const base64 = Buffer.from(svg, "utf8").toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}

// Sticker de ocasión (ej. Día del Niño): opcional, solo se usa cuando se pasa
// `sticker` en el JSON con la ruta a un PNG/WEBP local. Nunca se usa por default.
function buildStickerHtml(stickerPath) {
  if (!stickerPath) return "";
  const ext = path.extname(stickerPath).slice(1) || "png";
  const buffer = fs.readFileSync(stickerPath);
  const base64 = buffer.toString("base64");
  return `<img class="occasion-sticker" src="data:image/${ext};base64,${base64}" />`;
}

function main() {
  const jsonArg = process.argv[2];
  const outputArg = process.argv[3];
  if (!jsonArg) {
    console.error("Uso: node scripts/generar-imagen-story-instagram.cjs '<json de producto>' [salida.png]");
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(jsonArg);
  } catch (err) {
    console.error("JSON inválido:", err.message);
    process.exit(1);
  }

  const missing = REQUIRED_FIELDS.filter((f) => !data[f] && data[f] !== 0);
  if (missing.length) {
    console.error("Faltan campos requeridos:", missing.join(", "));
    process.exit(1);
  }

  let html = fs.readFileSync(TEMPLATE_PATH, "utf8");

  const replacements = {
    __IMG_URL__: escapeAttr(data.imgUrl),
    __BADGE__: escapeHtml(data.badge),
    __TITLE__: escapeHtml(data.title),
    __BRAND__: escapeHtml(data.brand),
    __RATING__: escapeHtml(data.rating),
    __SOLD__: escapeHtml(data.sold),
    __OLD_PRICE__: escapeHtml(data.oldPrice),
    __NEW_PRICE__: escapeHtml(data.newPrice),
    __OFF_PCT__: escapeHtml(data.offPct),
    __SAVINGS__: escapeHtml(data.savings),
    __ML_LOGO__: buildMlLogoDataUri(),
    __STICKER_HTML__: buildStickerHtml(data.sticker),
  };

  for (const [token, value] of Object.entries(replacements)) {
    html = html.split(token).join(value);
  }

  const tmpDir = fs.mkdtempSync(path.join(require("os").tmpdir(), "pv-story-"));
  const htmlPath = path.join(tmpDir, "story.html");
  fs.writeFileSync(htmlPath, html, "utf8");

  const outPath = outputArg
    ? path.resolve(outputArg)
    : path.join(tmpDir, "story.png");

  execFileSync(CHROME_PATH, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--window-size=1080,1920",
    `--screenshot=${outPath}`,
    "--virtual-time-budget=4000",
    "--allow-file-access-from-files",
    `file://${htmlPath}`,
  ], { stdio: "inherit" });

  console.log(outPath);
}

main();
