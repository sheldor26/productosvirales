#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * New models radar — para cada nicho/silo del sitio, busca en el catálogo de
 * ML (/products/search) y marca los catálogos con MUCHAS reseñas que NO están
 * todavía en curated-products.ts. Son productos establecidos que nos faltan, o
 * modelos nuevos que están explotando (salió el Odyssey nuevo, la freidora
 * nueva de Atma) y conviene sumar a la guía antes de que quede vieja.
 *
 * Filtra por reviewCount para no ahogarse en catálogos muertos (la API de
 * search devuelve muchos sin buy box; ver memoria ml-api-oficial-funciona).
 *
 * Correr LOCAL desde Argentina. Uso:
 *   node scripts/new-models.cjs                  # todos los nichos
 *   node scripts/new-models.cjs --min 300        # umbral de reseñas
 *   node scripts/new-models.cjs --niche gamer
 */

const fs = require("fs");
const path = require("path");

const CATALOG_PATH = path.resolve("src/data/curated-products.ts");
const REPORT_DIR = path.resolve(".cache");
const REPORT_PATH = path.join(REPORT_DIR, "new-models-report.json");
const ML_API = "https://api.mercadolibre.com";

// Nichos del sitio → queries de descubrimiento. Uno o más por silo.
const NICHES = [
  { niche: "gaming", queries: ["silla gamer", "mouse gamer", "teclado gamer", "monitor gamer", "auriculares gamer"] },
  { niche: "audio", queries: ["parlante bluetooth", "auriculares inalambricos", "barra de sonido"] },
  { niche: "cocina", queries: ["freidora de aire", "cafetera express", "microondas", "horno electrico", "batidora"] },
  { niche: "climatizacion", queries: ["estufa electrica", "caloventor", "ventilador de pie"] },
  { niche: "perfumes-arabes", queries: ["perfume arabe", "lattafa", "rasasi"] },
  { niche: "limpieza", queries: ["robot aspiradora", "aspiradora sin cable"] },
  { niche: "masajeadores", queries: ["masajeador", "pistola masajeadora"] },
];

const argv = process.argv.slice(2);
const MIN_REVIEWS = (() => { const i = argv.indexOf("--min"); return i >= 0 ? Number(argv[i + 1]) : 300; })();
const ONE_NICHE = (() => { const i = argv.indexOf("--niche"); return i >= 0 ? argv[i + 1] : null; })();

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

async function main() {
  const token = await getMlToken();
  if (!token) { console.error("Falta ML_APP_ID / ML_SECRET en .env."); process.exit(1); }
  const headers = { Authorization: `Bearer ${token}` };
  const api = async (p) => { try { const r = await fetch(ML_API + p, { headers }); return r.ok ? r.json() : null; } catch { return null; } };

  // IDs que YA tenemos (por id y por permalink)
  const src = fs.readFileSync(CATALOG_PATH, "utf8");
  const known = new Set();
  for (const m of src.matchAll(/\/p\/(MLA\d+)/g)) known.add(m[1].toUpperCase());
  for (const m of src.matchAll(/\/up\/(MLAU\d+)/g)) known.add(m[1].toUpperCase());
  for (const m of src.matchAll(/id:\s*"(MLA[U]?\d+)"/g)) known.add(m[1].toUpperCase());
  console.log(`Catálogo actual: ${known.size} IDs conocidos. Umbral: >= ${MIN_REVIEWS} reseñas.\n`);

  const niches = ONE_NICHE ? NICHES.filter((n) => n.niche === ONE_NICHE) : NICHES;
  const report = [];

  for (const { niche, queries } of niches) {
    const found = [];
    const seen = new Set();
    for (const q of queries) {
      const d = await api(`/products/search?site_id=MLA&status=active&q=${encodeURIComponent(q)}&limit=30`);
      for (const r of (d && d.results) || []) {
        const id = (r.id || "").toUpperCase();
        if (known.has(id) || seen.has(id)) continue;
        seen.add(id);
        const items = await api(`/products/${id}/items?limit=20`);
        const news = ((items && items.results) || []).filter((o) => o.condition === "new");
        if (!news.length) continue;
        const cheap = news.reduce((a, b) => (b.price < a.price ? b : a));
        const rev = await api(`/reviews/item/${cheap.item_id}?catalog_product_id=${id}`);
        const total = (rev && rev.paging && rev.paging.total) || 0;
        if (total >= MIN_REVIEWS) {
          found.push({ id, name: (r.name || "").slice(0, 60), price: Math.round(cheap.price), reviews: total, query: q });
        }
      }
    }
    found.sort((a, b) => b.reviews - a.reviews);
    console.log(`${"=".repeat(64)}\n${niche}  (${found.length} candidatos que NO tenemos)`);
    for (const f of found) {
      console.log(`  ${String(f.reviews).padStart(5)} rev  $${f.price.toLocaleString("es-AR").padStart(9)}  ${f.name}`);
      console.log(`         [${f.query}]  https://www.mercadolibre.com.ar/p/${f.id}`);
    }
    report.push({ niche, found });
  }

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  console.log(`\nReporte guardado en ${path.relative(process.cwd(), REPORT_PATH)}`);
  console.log("Estos son productos con ventas reales que el sitio todavía no cubre. Candidatos a sumar a la guía del nicho.");
}

main().catch((err) => { console.error("Error fatal:", err); process.exit(1); });
