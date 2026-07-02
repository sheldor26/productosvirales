#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Price drops — detecta bajas de precio reales comparando el precio GUARDADO
 * en cada ficha (la última vez que lo miramos, con su priceUpdated) contra el
 * precio actual de la API de ML. Sirve para dos cosas:
 *
 *   1. Munición de Threads: "El X bajó a $Y, el precio más bajo que le vi"
 *      es un posteo que convierte porque la urgencia es REAL, no inventada.
 *   2. Detectar descuentos vs precio de lista (original_price de la API).
 *
 * Además appendea un snapshot a .cache/price-history.json: con el tiempo
 * habilita el claim "el más barato de los últimos N meses".
 *
 * NO modifica precios (para eso está prices:update). Es solo radar + contenido.
 * Correr LOCAL desde Argentina. Uso:
 *   node scripts/price-drops.cjs                 # bajas >= 8% vs ficha
 *   node scripts/price-drops.cjs --min 15        # umbral de baja en %
 *   node scripts/price-drops.cjs --match gamer
 */

const fs = require("fs");
const path = require("path");

const CATALOG_PATH = path.resolve("src/data/curated-products.ts");
const REPORT_DIR = path.resolve(".cache");
const HISTORY_PATH = path.join(REPORT_DIR, "price-history.json");
const REPORT_PATH = path.join(REPORT_DIR, "price-drops-report.json");
const ML_API = "https://api.mercadolibre.com";
const API_CONCURRENCY = 8;

const argv = process.argv.slice(2);
const MIN_DROP = (() => { const i = argv.indexOf("--min"); return i >= 0 ? Number(argv[i + 1]) : 8; })();
const MATCH = (() => { const i = argv.indexOf("--match"); return i >= 0 ? String(argv[i + 1] || "").toLowerCase() : ""; })();
const TODAY = new Date().toISOString().slice(0, 10);

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
  return id.replace(/^MLA-?/, "").length < 10 ? { kind: "catalog", apiId: id } : { kind: "item", apiId: id };
}
function prop(block, p) {
  const m = block.match(new RegExp(`\\n\\s+${p}:\\s*(['"\`])([\\s\\S]*?)\\1\\s*,`));
  return m ? m[2] : "";
}
function numProp(block, p) {
  const m = block.match(new RegExp(`\\n\\s+${p}:\\s*(\\d+(?:\\.\\d+)?)`));
  return m ? Number(m[1]) : undefined;
}
function extractProducts(src) {
  const out = [];
  for (const m of src.matchAll(/^  \{\n[\s\S]*?^  \},/gm)) {
    const b = m[0];
    const id = prop(b, "id");
    if (!id) continue;
    out.push({
      id,
      permalink: prop(b, "permalink"),
      title: prop(b, "canonicalName") || prop(b, "title"),
      affiliateUrl: prop(b, "affiliateUrl"),
      visibility: prop(b, "visibility") || "normal",
      storedPrice: numProp(b, "price"),
    });
  }
  return out;
}
async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() { while (next < items.length) { const i = next++; results[i] = await fn(items[i], i); } }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}
async function currentPrice(token, p) {
  const { kind, apiId } = resolveApiId(p.id, p.permalink);
  const headers = { Authorization: `Bearer ${token}` };
  try {
    if (kind === "catalog") {
      const res = await fetch(`${ML_API}/products/${apiId}/items?limit=50`, { headers });
      if (!res.ok) return null;
      const news = ((await res.json()).results || []).filter((o) => o.condition === "new");
      if (!news.length) return null;
      const best = news.reduce((a, b) => (b.price < a.price ? b : a));
      return { price: Math.round(best.price), original: best.original_price ? Math.round(best.original_price) : null };
    }
    if (kind === "item") {
      const res = await fetch(`${ML_API}/items/${apiId}`, { headers });
      if (!res.ok) return null;
      const it = await res.json();
      if (it.status !== "active" || !it.price) return null;
      return { price: Math.round(it.price), original: it.original_price ? Math.round(it.original_price) : null };
    }
  } catch { /* ignore */ }
  return null;
}
const fmt = (n) => "$" + Math.round(n).toLocaleString("es-AR");

async function main() {
  const token = await getMlToken();
  if (!token) { console.error("Falta ML_APP_ID / ML_SECRET en .env."); process.exit(1); }

  const src = fs.readFileSync(CATALOG_PATH, "utf8");
  let products = extractProducts(src).filter((p) => p.visibility !== "deprioritized" && p.storedPrice);
  if (MATCH) products = products.filter((p) => (p.id + p.title + p.permalink).toLowerCase().includes(MATCH));

  console.log(`Detector de bajas — ${products.length} fichas visibles (umbral: -${MIN_DROP}% vs precio guardado)\n`);

  const now = await mapWithConcurrency(products, API_CONCURRENCY, async (p) => ({ ...p, cur: await currentPrice(token, p) }));

  const drops = [];
  const listDiscounts = [];
  const snapshot = [];
  for (const p of now) {
    if (!p.cur) continue;
    snapshot.push({ id: p.id, price: p.cur.price, original: p.cur.original });
    const dropPct = Math.round((1 - p.cur.price / p.storedPrice) * 100);
    if (dropPct >= MIN_DROP) drops.push({ ...p, dropPct });
    if (p.cur.original && p.cur.original > p.cur.price) {
      const off = Math.round((1 - p.cur.price / p.cur.original) * 100);
      if (off >= 15) listDiscounts.push({ ...p, off });
    }
  }
  drops.sort((a, b) => b.dropPct - a.dropPct);
  listDiscounts.sort((a, b) => b.off - a.off);

  if (drops.length) {
    console.log("── BAJARON vs la última vez que miramos (munición de Threads) ──");
    for (const d of drops) {
      console.log(`  ↓ -${d.dropPct}%  ${d.title}`);
      console.log(`      ${fmt(d.storedPrice)} → ${fmt(d.cur.price)}  | ${d.affiliateUrl || "(sin link)"}`);
      console.log(`      Threads: "El ${d.title} bajó a ${fmt(d.cur.price)} (venía ${fmt(d.storedPrice)}). Ojo que estos precios no duran."`);
    }
    console.log("");
  } else {
    console.log(`(ninguna ficha bajó ${MIN_DROP}% o más vs su precio guardado)\n`);
  }

  if (listDiscounts.length) {
    console.log("── DESCUENTO REAL vs precio de lista (para mostrar en la ficha) ──");
    for (const d of listDiscounts) console.log(`  %  -${d.off}% vs lista: ${d.title} (${fmt(d.cur.original)} → ${fmt(d.cur.price)})`);
    console.log("");
  }

  // history: appendear snapshot del día (para "el más barato de los últimos N meses")
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  let history = [];
  try { history = JSON.parse(fs.readFileSync(HISTORY_PATH, "utf8")); } catch { /* primera vez */ }
  const already = history.find((h) => h.date === TODAY);
  if (already) already.items = snapshot;
  else history.push({ date: TODAY, items: snapshot });
  fs.writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2));
  fs.writeFileSync(REPORT_PATH, JSON.stringify({ date: TODAY, drops, listDiscounts }, null, 2));

  console.log(`Snapshot #${history.length} guardado en price-history.json (${snapshot.length} precios).`);
  console.log("Con más corridas, esto habilita el claim 'el más barato de los últimos N meses'.");
}

main().catch((err) => { console.error("Error fatal:", err); process.exit(1); });
