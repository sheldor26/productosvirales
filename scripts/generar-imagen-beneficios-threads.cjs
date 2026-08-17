#!/usr/bin/env node
// Genera la 2da imagen del carrusel de Threads: "Lo que tenés que saber" (beneficios reales).
// Va siempre después de la imagen principal (generar-imagen-post-threads.cjs).
// Uso: node scripts/generar-imagen-beneficios-threads.cjs '<json>' [salida.png]
//
// JSON esperado:
// {
//   "imgUrl": "https://http2.mlstatic.com/....webp",
//   "title": "Auriculares JBL Wave Beam 2 TWS In-ear Negro",
//   "benefits": [
//     { "icon": "🔇", "title": "Cancelación de ruido activa", "desc": "Bloquea sonidos externos para escuchar mejor" },
//     { "icon": "💧", "title": "Resistencia IP54", "desc": "A prueba de agua y polvo, ideal para gym o lluvia" },
//     { "icon": "🔋", "title": "8 h de batería", "desc": "Más el estuche de carga incluido" },
//     { "icon": "📶", "title": "Bluetooth 5.3", "desc": "Conexión TWS estable, 5 m de alcance" }
//   ]
// }
//
// Los 4 beneficios deben salir de la ficha técnica real de MercadoLibre (specs/"lo que tenés
// que saber"), nunca inventados. Verificar contra la ficha antes de llamar a este script.

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const TEMPLATE_PATH = path.join(__dirname, "threads-post-template-beneficios.html");
const ML_LOGO_PATH = path.join(__dirname, "..", "public", "logo", "mercadolibre.svg");
// Chrome de macOS por default (como se corre a mano). En CI, donde no existe
// esa ruta, el workflow exporta CHROME_PATH apuntando al Chromium que ya trae
// puppeteer, que es dependencia del repo. Ver .github/workflows/bot-social.yml.
const CHROME_PATH =
  process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildMlLogoDataUri() {
  const svg = fs.readFileSync(ML_LOGO_PATH, "utf8");
  const base64 = Buffer.from(svg, "utf8").toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}

function main() {
  const jsonArg = process.argv[2];
  const outputArg = process.argv[3];
  if (!jsonArg) {
    console.error("Uso: node scripts/generar-imagen-beneficios-threads.cjs '<json>' [salida.png]");
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(jsonArg);
  } catch (err) {
    console.error("JSON inválido:", err.message);
    process.exit(1);
  }

  if (!data.imgUrl || !data.title) {
    console.error("Faltan campos requeridos: imgUrl, title");
    process.exit(1);
  }
  if (!Array.isArray(data.benefits) || data.benefits.length !== 4) {
    console.error("El campo 'benefits' debe ser un array de exactamente 4 items {icon, title, desc}");
    process.exit(1);
  }
  data.benefits.forEach((b, i) => {
    if (!b || !b.icon || !b.title || !b.desc) {
      console.error(`Falta un campo en benefits[${i}]: cada item requiere icon, title y desc`);
      process.exit(1);
    }
  });

  let html = fs.readFileSync(TEMPLATE_PATH, "utf8");

  const replacements = {
    __IMG_URL__: escapeHtml(data.imgUrl),
    __TITLE__: escapeHtml(data.title),
    __ML_LOGO__: buildMlLogoDataUri(),
  };
  data.benefits.forEach((b, i) => {
    replacements[`__ICON_${i + 1}__`] = escapeHtml(b.icon);
    replacements[`__BENEFIT_TITLE_${i + 1}__`] = escapeHtml(b.title);
    replacements[`__BENEFIT_DESC_${i + 1}__`] = escapeHtml(b.desc);
  });

  for (const [token, value] of Object.entries(replacements)) {
    html = html.split(token).join(value);
  }

  const tmpDir = fs.mkdtempSync(path.join(require("os").tmpdir(), "pv-threads-beneficios-"));
  const htmlPath = path.join(tmpDir, "post.html");
  fs.writeFileSync(htmlPath, html, "utf8");

  const outPath = outputArg
    ? path.resolve(outputArg)
    : path.join(tmpDir, "post.png");

  execFileSync(CHROME_PATH, [
    "--headless=new",
    "--disable-gpu",
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
