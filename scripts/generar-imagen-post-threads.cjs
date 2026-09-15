#!/usr/bin/env node
// Genera la imagen (PNG 1080x1350) de un post de Threads a partir de datos de producto ya verificados.
// Uso: node scripts/generar-imagen-post-threads.cjs '<json de producto>' [ruta-salida.png]
//
// JSON esperado (todos los campos son texto, ya formateados como se van a mostrar):
// {
//   "imgUrl": "https://http2.mlstatic.com/....webp",
//   "badge": "ÚLTIMA UNIDAD",
//   "title": "Harman Kardon Onyx Studio 9 Parlante Bluetooth",
//   "brand": "Harman Kardon",
//   "rating": "4.9",
//   "sold": "+500 vendidos",
//   "oldPrice": "949.999",
//   "newPrice": "269.779",
//   "offPct": "71",
//   "savings": "680.220"
// }
//
// Si el producto no tiene una baja real que mostrar (ej. una consola a precio de
// lista), omitir oldPrice/offPct/savings y pasar "noDiscount": true. La tarjeta
// muestra el precio solo, sin el círculo de descuento ni el cartel "Ahorrás $0"
// (que sería un dato inventado).
//
// Datos ya verificados en vivo por Claude antes de llamar a este script (precio, stock, cupón,
// cuotas por banco si corresponde). Este script solo arma la pieza visual, no valida nada de ML.

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const TEMPLATE_PATH = path.join(__dirname, "threads-post-template.html");
const ML_LOGO_PATH = path.join(__dirname, "..", "public", "logo", "mercadolibre.svg");
// Chrome de macOS por default (como se corre a mano). En CI, donde no existe
// esa ruta, el workflow exporta CHROME_PATH apuntando al Chromium que ya trae
// puppeteer, que es dependencia del repo. Ver .github/workflows/bot-social.yml.
const CHROME_PATH =
  process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const REQUIRED_FIELDS_BASE = [
  "imgUrl", "badge", "title", "brand", "rating", "sold", "newPrice",
];
const REQUIRED_FIELDS_DISCOUNT = ["oldPrice", "offPct", "savings"];

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(str) {
  // para atributos src: mismo escapado que texto alcanza para HTML válido en un atributo con comillas dobles
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
    console.error("Uso: node scripts/generar-imagen-post-threads.cjs '<json de producto>' [salida.png]");
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(jsonArg);
  } catch (err) {
    console.error("JSON inválido:", err.message);
    process.exit(1);
  }

  const requiredFields = data.noDiscount
    ? REQUIRED_FIELDS_BASE
    : [...REQUIRED_FIELDS_BASE, ...REQUIRED_FIELDS_DISCOUNT];
  const missing = requiredFields.filter((f) => !data[f] && data[f] !== 0);
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
    __OLD_PRICE__: escapeHtml(data.oldPrice || ""),
    __NEW_PRICE__: escapeHtml(data.newPrice),
    __OFF_PCT__: escapeHtml(data.offPct || ""),
    __SAVINGS__: escapeHtml(data.savings || ""),
    __ML_LOGO__: buildMlLogoDataUri(),
    __STICKER_HTML__: buildStickerHtml(data.sticker),
    __CANVAS_CLASS__: data.noDiscount ? "no-discount" : "",
  };

  for (const [token, value] of Object.entries(replacements)) {
    html = html.split(token).join(value);
  }

  const tmpDir = fs.mkdtempSync(path.join(require("os").tmpdir(), "pv-threads-post-"));
  const htmlPath = path.join(tmpDir, "post.html");
  fs.writeFileSync(htmlPath, html, "utf8");

  const outPath = outputArg
    ? path.resolve(outputArg)
    : path.join(tmpDir, "post.png");

  execFileSync(CHROME_PATH, [
    "--headless=new",
    "--disable-gpu",
    // El runner de GitHub Actions (Ubuntu 24.04+) restringe user namespaces sin
    // privilegios por AppArmor, y Chromium no puede armar su sandbox: crashea
    // con "No usable sandbox!" sin este flag. Confirmado en la corrida real de
    // workflow_dispatch del 2026-08-17. La plantilla es HTML local de confianza
    // (nunca navega a una URL externa), así que perder el sandbox acá no abre
    // superficie de ataque real.
    "--no-sandbox",
    "--hide-scrollbars",
    "--window-size=1080,1350",
    `--screenshot=${outPath}`,
    "--virtual-time-budget=4000",
    "--allow-file-access-from-files",
    `file://${htmlPath}`,
  ], { stdio: "inherit" });

  console.log(outPath);
}

main();
