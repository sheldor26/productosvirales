#!/usr/bin/env node

/**
 * Stock watchdog — detecta productos sin stock en MercadoLibre.
 *
 * Recorre todas las fichas de src/data/curated-products.ts y consulta la API
 * oficial de ML: un catálogo cuyo /products/{id}/items devuelve 404 o cero
 * ofertas "new" quedó SIN VENDEDORES (los clicks de afiliado van a una página
 * muerta). Las publicaciones individuales (articulo...) se chequean con
 * /items/{id} (status + available_quantity).
 *
 * También cruza contra src/data/guides.ts para decir QUÉ guías referencian
 * cada producto muerto, y avisa si un producto "deprioritized" volvió a tener
 * stock (candidato a reactivar).
 *
 * Correr LOCAL desde Argentina (mismo criterio que el resto de scripts ML).
 *
 * Uso:
 *   node scripts/stock-watchdog.cjs              # reporte (no toca nada)
 *   node scripts/stock-watchdog.cjs --apply      # además marca los muertos como deprioritized
 *   node scripts/stock-watchdog.cjs --match gamer
 */

const fs = require("fs");
const path = require("path");

const CATALOG_PATH = path.resolve("src/data/curated-products.ts");
const GUIDES_PATH = path.resolve("src/data/guides.ts");
const REPORT_DIR = path.resolve(".cache");
const REPORT_PATH = path.join(REPORT_DIR, "stock-report.json");

const ML_API = "https://api.mercadolibre.com";
const API_CONCURRENCY = 8;

// ─── args ───

const argv = process.argv.slice(2);
const APPLY = argv.includes("--apply");
const MATCH = (() => {
  const i = argv.indexOf("--match");
  return i >= 0 ? String(argv[i + 1] || "").toLowerCase() : "";
})();

// ─── helpers compartidos (mismo criterio que update-prices-from-ml.cjs) ───

function loadDotEnv() {
  const out = {};
  try {
    for (const line of fs.readFileSync(path.resolve(".env"), "utf8").split("\n")) {
      const eq = line.indexOf("=");
      if (eq > 0 && !line.startsWith("#")) out[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
  } catch {
    // sin .env: getMlToken avisa
  }
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
  const data = await res.json().catch(() => ({}));
  return data.access_token || null;
}

// El tipo real sale del permalink (hay fichas con el prefijo mal guardado).
function resolveApiId(id, permalink) {
  const up = (permalink || "").match(/\/up\/(MLAU\d+)/i);
  if (up) return { kind: "catalog", apiId: up[1].toUpperCase() };
  const cat = (permalink || "").match(/\/p\/(MLA\d+)/i);
  if (cat) return { kind: "catalog", apiId: cat[1].toUpperCase() };
  if (/articulo\.mercadolibre/i.test(permalink || "")) {
    const item = (permalink || "").match(/MLA-?(\d{8,})/i);
    return item ? { kind: "item", apiId: `MLA${item[1]}` } : { kind: "unknown", apiId: null };
  }
  if (id.startsWith("MLAU")) return { kind: "catalog", apiId: id };
  return id.replace(/^MLA-?/, "").length < 10
    ? { kind: "catalog", apiId: id }
    : { kind: "item", apiId: id };
}

function extractQuotedProp(block, prop) {
  const m = block.match(new RegExp(`\\n\\s+${prop}:\\s*(['"\`])([\\s\\S]*?)\\1\\s*,`));
  return m ? m[2] : "";
}

function extractProducts(src) {
  const products = [];
  const blockRe = /^  \{\n[\s\S]*?^  \},/gm;
  let m;
  while ((m = blockRe.exec(src)) !== null) {
    const block = m[0];
    const id = extractQuotedProp(block, "id");
    if (!id) continue;
    products.push({
      id,
      permalink: extractQuotedProp(block, "permalink"),
      title: extractQuotedProp(block, "canonicalName") || extractQuotedProp(block, "title"),
      visibility: extractQuotedProp(block, "visibility") || "normal",
    });
  }
  return products;
}

async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

// ─── chequeo de stock ───

async function checkStock(token, product) {
  const { kind, apiId } = resolveApiId(product.id, product.permalink);
  const headers = { Authorization: `Bearer ${token}` };

  try {
    if (kind === "catalog") {
      const res = await fetch(`${ML_API}/products/${apiId}/items?limit=50`, { headers });
      if (res.status === 404) return { ...product, stock: "out_of_stock", detail: "catálogo sin vendedores (404)" };
      if (!res.ok) return { ...product, stock: "error", detail: `HTTP ${res.status}` };
      const data = await res.json();
      const news = (data.results || []).filter((o) => o.condition === "new");
      if (!news.length) return { ...product, stock: "out_of_stock", detail: "sin ofertas new" };
      return { ...product, stock: "ok", detail: `${news.length} ofertas` };
    }
    if (kind === "item") {
      const res = await fetch(`${ML_API}/items/${apiId}`, { headers });
      if (res.status === 404) return { ...product, stock: "out_of_stock", detail: "publicación eliminada (404)" };
      if (!res.ok) return { ...product, stock: "error", detail: `HTTP ${res.status}` };
      const it = await res.json();
      if (it.status !== "active") return { ...product, stock: "out_of_stock", detail: `status ${it.status}` };
      if (it.available_quantity === 0) return { ...product, stock: "out_of_stock", detail: "sin cantidad disponible" };
      return { ...product, stock: "ok", detail: `activa, qty ${it.available_quantity}` };
    }
    return { ...product, stock: "error", detail: "id/permalink no reconocible" };
  } catch (err) {
    return { ...product, stock: "error", detail: String(err.message || err) };
  }
}

// ─── cruce con guías: qué guías referencian cada producto ───

function guidesUsingProduct(guidesSrc, productId) {
  const slugs = [];
  const sections = guidesSrc.split(/\n\s+slug: "/).slice(1);
  for (const section of sections) {
    const slug = section.slice(0, section.indexOf('"'));
    if (section.includes(productId)) slugs.push(slug);
  }
  return slugs;
}

// ─── apply: marcar deprioritized (edición ACOTADA AL BLOQUE del producto) ───
// Nunca usar regex con [\s\S]*? entre id y visibility a nivel archivo: si el
// bloque no tiene el campo, la regex cruza al bloque siguiente y corrompe
// OTRO producto (bug real detectado el 2026-07-01).

function findBlock(src, productId) {
  const idRe = new RegExp(`id: (["'])${productId}\\1`);
  const m = idRe.exec(src);
  if (!m) return null;
  const start = src.lastIndexOf("\n  {", m.index);
  const end = src.indexOf("\n  },", m.index);
  if (start < 0 || end < 0) return null;
  return { start: start + 1, end: end + 4 };
}

function markDeprioritized(src, productId) {
  const b = findBlock(src, productId);
  if (!b) return { src, changed: false };
  let block = src.slice(b.start, b.end);
  const visRe = /(visibility: )(["'])[a-z]+\2/;
  if (visRe.test(block)) {
    const updated = block.replace(visRe, `$1$2deprioritized$2`);
    if (updated === block) return { src, changed: false }; // ya estaba
    block = updated;
  } else {
    // ficha vieja sin campo visibility: insertarlo después de la línea del id
    block = block.replace(/(id: (["'])[A-Z0-9]+\2,)/, `$1\n    visibility: 'deprioritized',`);
  }
  return { src: src.slice(0, b.start) + block + src.slice(b.end), changed: true };
}

// ─── main ───

async function main() {
  const token = await getMlToken();
  if (!token) {
    console.error("Falta ML_APP_ID / ML_SECRET en .env — no puedo consultar la API.");
    process.exit(1);
  }

  const catalogSrc = fs.readFileSync(CATALOG_PATH, "utf8");
  const guidesSrc = fs.readFileSync(GUIDES_PATH, "utf8");
  let products = extractProducts(catalogSrc);
  if (MATCH) {
    products = products.filter(
      (p) =>
        p.id.toLowerCase().includes(MATCH) ||
        p.title.toLowerCase().includes(MATCH) ||
        p.permalink.toLowerCase().includes(MATCH)
    );
  }

  console.log(`Vigía de stock — ${products.length} fichas a chequear (API, ${API_CONCURRENCY} en paralelo)\n`);

  const results = await mapWithConcurrency(products, API_CONCURRENCY, (p) => checkStock(token, p));

  const dead = results.filter((r) => r.stock === "out_of_stock" && r.visibility === "normal");
  const restocked = results.filter((r) => r.stock === "ok" && r.visibility === "deprioritized");
  const errors = results.filter((r) => r.stock === "error");
  const ok = results.filter((r) => r.stock === "ok" && r.visibility === "normal");

  console.log(`OK con stock:        ${ok.length}`);
  console.log(`SIN STOCK (visibles): ${dead.length}`);
  console.log(`Reactivables:        ${restocked.length} (deprioritized que volvieron a tener stock)`);
  console.log(`Errores de chequeo:  ${errors.length}\n`);

  if (dead.length) {
    console.log("── SIN STOCK — clicks de afiliado yendo a página muerta ──");
    for (const d of dead) {
      const guides = guidesUsingProduct(guidesSrc, d.id);
      console.log(`  ✗ ${d.id}  ${d.title}`);
      console.log(`      motivo: ${d.detail}`);
      console.log(`      guías afectadas: ${guides.length ? guides.join(", ") : "(ninguna: solo ficha /producto/)"}`);
    }
    console.log("");
  }

  if (restocked.length) {
    console.log("── VOLVIÓ EL STOCK — candidatos a reactivar (visibility normal) ──");
    for (const r of restocked) console.log(`  ↺ ${r.id}  ${r.title}  (${r.detail})`);
    console.log("");
  }

  if (errors.length) {
    console.log("── ERRORES (revisar a mano) ──");
    for (const e of errors) console.log(`  ? ${e.id}  ${e.title}  (${e.detail})`);
    console.log("");
  }

  // registro para comparar corridas
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(
    REPORT_PATH,
    JSON.stringify({ date: new Date().toISOString(), dead, restocked, errors: errors.map((e) => ({ id: e.id, detail: e.detail })) }, null, 2)
  );
  console.log(`Reporte guardado en ${path.relative(process.cwd(), REPORT_PATH)}`);

  if (APPLY && dead.length) {
    let src = catalogSrc;
    let changed = 0;
    for (const d of dead) {
      const res = markDeprioritized(src, d.id);
      src = res.src;
      if (res.changed) changed++;
    }
    fs.writeFileSync(CATALOG_PATH, src);
    console.log(`\n--apply: ${changed} productos marcados como deprioritized en curated-products.ts`);
    console.log("Revisá también las guías afectadas: el producto sigue mencionado en el ranking.");
  } else if (dead.length) {
    console.log(`\n(reporte solamente; corré con --apply para marcar los ${dead.length} sin stock como deprioritized)`);
  }
}

main().catch((err) => {
  console.error("Error fatal:", err);
  process.exit(1);
});
