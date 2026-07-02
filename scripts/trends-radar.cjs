#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Trends radar — qué busca la gente AHORA en MercadoLibre, cruzado con lo
 * que el sitio YA cubre. Usa /trends/MLA/{categoryId} (top 50 keywords por
 * categoría, actualizado por ML) para las categorías de nuestros silos.
 *
 * Para cada keyword caliente marca:
 *   ✓ CUBIERTO  — ya hay una guía o ficha que la responde
 *   ★ HUECO     — nadie en el sitio la cubre (candidata a guía nueva)
 *
 * Es la ventaja de curador convertida en sistema: detectás el próximo
 * Khamrah / la próxima freidora viral antes de que aparezca en Ubersuggest.
 *
 * Correr LOCAL desde Argentina. Uso:
 *   node scripts/trends-radar.cjs                 # todas las categorías de silos
 *   node scripts/trends-radar.cjs --cat MLA5726   # una categoría puntual
 *   node scripts/trends-radar.cjs --gaps          # solo los huecos
 */

const fs = require("fs");
const path = require("path");

const GUIDES_PATH = path.resolve("src/data/guides.ts");
const CATALOG_PATH = path.resolve("src/data/curated-products.ts");
const REPORT_DIR = path.resolve(".cache");
const REPORT_PATH = path.join(REPORT_DIR, "trends-report.json");
const ML_API = "https://api.mercadolibre.com";

// Categorías de ML que mapean a los silos/nichos del sitio.
const SILO_CATEGORIES = [
  { id: "MLA5726", name: "Electrodomésticos y Aires Ac.", silos: "cocina, climatización" },
  { id: "MLA1000", name: "Electrónica, Audio y Video", silos: "audio, proyectores" },
  { id: "MLA1648", name: "Computación", silos: "gaming (mouse, teclado, monitor)" },
  { id: "MLA1144", name: "Consolas y Videojuegos", silos: "gaming" },
  { id: "MLA1246", name: "Belleza y Cuidado Personal", silos: "perfumes, cuidado personal" },
  { id: "MLA1574", name: "Hogar, Muebles y Jardín", silos: "hogar, sillas gamer" },
  { id: "MLA1276", name: "Deportes y Fitness", silos: "masajeadores, fitness" },
];

const STOP = new Set([
  "de","la","el","con","para","por","y","en","a","los","las","un","una","del","al",
  "sin","mas","más","o","su","2","4","x","kit","set","pro","plus","mini","cm","ml","lt",
]);

// Ruido: búsquedas navegacionales/de tienda/de marca-store que NO son nichos de
// producto (no sirven como idea de guía). Se listan aparte, no como hueco.
const NOISE_RE = /tienda oficial|outlet|mi cuenta|go cuotas|acceder|mercado libre|mecado libre|fravega|carrefour|coto|rodo|novogar|devoto|miniso|casa rodo|top house|digi expert|pilisar|electro outlet|store|argentina|prepago|liberado|habilitador|repuestos|patas |placa quemada|cambio pantalla|cambio de pantalla/i;

// Marca conocida sola (sin producto) = navegacional, no hueco de contenido.
const BRAND_ONLY = /^(midea|drean|whirlpool|ariston|orbis|electrolux|gafa|atma|peabody|liliana|smartlife|philips|samsung|lg|noblex|bgh|general electric|logitech|razer|xiaomi|gigabyte|corsair|hyperx|redragon|sony|jbl)$/i;

function looksLikeModelCode(kw) {
  // ej "whirlpool wfx57di", "qn55q60tagczb", "un40f5000": termina/es código alfanumérico
  return /\b[a-z]{1,4}[-]?\d{2,}[a-z0-9]*\b/i.test(kw) && kw.split(" ").length <= 3;
}

const argv = process.argv.slice(2);
const ONLY_GAPS = argv.includes("--gaps");
const ONE_CAT = (() => { const i = argv.indexOf("--cat"); return i >= 0 ? argv[i + 1] : null; })();

function loadDotEnv() {
  const out = {};
  try {
    for (const line of fs.readFileSync(path.resolve(".env"), "utf8").split("\n")) {
      const eq = line.indexOf("=");
      if (eq > 0 && !line.startsWith("#")) out[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
  } catch { /* getMlToken avisa */ }
  return out;
}

async function getMlToken() {
  const env = loadDotEnv();
  const appId = env.ML_APP_ID || process.env.ML_APP_ID;
  const secret = env.ML_SECRET || process.env.ML_SECRET;
  if (!appId || !secret) return null;
  const res = await fetch(`${ML_API}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=client_credentials&client_id=${appId}&client_secret=${secret}`,
  });
  return (await res.json().catch(() => ({}))).access_token || null;
}

function tokens(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
}

function main() {
  return getMlToken().then(async (token) => {
    if (!token) { console.error("Falta ML_APP_ID / ML_SECRET en .env."); process.exit(1); }
    const headers = { Authorization: `Bearer ${token}` };

    // corpus del sitio: títulos de guías + títulos de fichas
    const guidesSrc = fs.readFileSync(GUIDES_PATH, "utf8");
    const catalogSrc = fs.readFileSync(CATALOG_PATH, "utf8");
    const corpus = new Set();
    for (const m of guidesSrc.matchAll(/(?:title|seoTitle|h1):\s*`([^`]+)`/g)) tokens(m[1]).forEach((t) => corpus.add(t));
    for (const m of guidesSrc.matchAll(/slug:\s*"([^"]+)"/g)) tokens(m[1].replace(/-/g, " ")).forEach((t) => corpus.add(t));
    for (const m of catalogSrc.matchAll(/(?:title|canonicalName):\s*"([^"]+)"/g)) tokens(m[1]).forEach((t) => corpus.add(t));

    const cats = ONE_CAT ? SILO_CATEGORIES.filter((c) => c.id === ONE_CAT) : SILO_CATEGORIES;
    const report = [];

    for (const cat of cats) {
      let trends;
      try {
        const res = await fetch(`${ML_API}/trends/MLA/${cat.id}`, { headers });
        trends = res.ok ? await res.json() : [];
      } catch { trends = []; }
      if (!Array.isArray(trends) || !trends.length) continue;

      console.log(`\n${"=".repeat(64)}\n${cat.name}  [${cat.id}]  → silos: ${cat.silos}`);
      const rows = trends.map((t, i) => {
        const kw = t.keyword || "";
        const kwTokens = tokens(kw);
        const covered = kwTokens.length > 0 && kwTokens.every((tk) => corpus.has(tk));
        const noise = NOISE_RE.test(kw) || BRAND_ONLY.test(kw.trim()) || looksLikeModelCode(kw);
        return { rank: i + 1, keyword: kw, covered, noise };
      });

      const gaps = rows.filter((r) => !r.covered && !r.noise);
      const covered = rows.filter((r) => r.covered);
      console.log("  ── ★ HUECOS (ideas de guía: buscado y sin cubrir) ──");
      for (const r of gaps) console.log(`     ${r.keyword}`);
      if (!ONLY_GAPS) {
        console.log("  ── ✓ ya cubierto ──  " + (covered.map((r) => r.keyword).join(", ") || "(nada)"));
      }
      console.log(`  → ${gaps.length} huecos reales · ${covered.length} cubiertos · ${rows.length - gaps.length - covered.length} ruido (tiendas/marcas/modelos)`);
      report.push({ category: cat, gaps: gaps.map((r) => r.keyword), covered: covered.map((r) => r.keyword) });
    }

    fs.mkdirSync(REPORT_DIR, { recursive: true });
    fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
    console.log(`\nReporte guardado en ${path.relative(process.cwd(), REPORT_PATH)}`);
    console.log("Los ★ HUECO son ideas de guía: la gente los busca y el sitio todavía no los cubre.");
  });
}

main().catch((err) => { console.error("Error fatal:", err); process.exit(1); });
