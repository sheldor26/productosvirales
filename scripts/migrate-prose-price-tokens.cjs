#!/usr/bin/env node
/**
 * migrate-prose-price-tokens.cjs
 *
 * Tokeniza precios hardcodeados que están en PROSA/listas (no tablas), de forma
 * MUY conservadora. Una línea se toca solo si cumple TODO:
 *   1. Tiene exactamente UN precio ($NNN.NNN) y exactamente UN producto resoluble
 *      (link meli.la/CODIGO o id MLA en la misma línea).
 *   2. Ese precio coincide con el historial real del producto (price-history.json)
 *      o con su precio actual — exacto o redondeado al mil. Si no coincide, NO toca
 *      (probable mala asociación) y lo reporta.
 *
 * El modo del token sale del match: si el precio escrito es exacto → {{precio:ID}};
 * si es un redondeo al mil de un precio real → {{precio:ID:k}}.
 *
 * Uso:
 *   node scripts/migrate-prose-price-tokens.cjs --from 13790 --to 16640 --dry-run
 *   node scripts/migrate-prose-price-tokens.cjs --from 13790 --to 16640
 */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const G_PATH = path.join(ROOT, "src", "data", "guides.ts");
const P_PATH = path.join(ROOT, "src", "data", "curated-products.ts");
const HIST = require(path.join(ROOT, "src", "data", "price-history.json"));

const arg = (name, def) => {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? Number(process.argv[i + 1]) : def;
};
const DRY = process.argv.includes("--dry-run");
const FROM = arg("from", 13790);
const TO = arg("to", 16640);

// ── Mapas de producto ──
const productsSrc = fs.readFileSync(P_PATH, "utf8");
const codeToId = new Map();
const idToPrice = new Map();
const idMatches = [...productsSrc.matchAll(/\bid:\s*['"](MLA\w+)['"]/g)];
for (let k = 0; k < idMatches.length; k++) {
  const id = idMatches[k][1];
  const s = idMatches[k].index;
  const e = k + 1 < idMatches.length ? idMatches[k + 1].index : productsSrc.length;
  const slice = productsSrc.slice(s, e);
  const pm = slice.match(/\bprice:\s*(\d+)/);
  if (pm) idToPrice.set(id, Number(pm[1]));
  let cm;
  const codeRe = /meli\.la\/(\w+)/g;
  while ((cm = codeRe.exec(slice)) !== null) codeToId.set(cm[1], id);
}

// Valores reales (actual + histórico) de un producto.
function valuesFor(id) {
  const vals = new Set();
  if (idToPrice.has(id)) vals.add(idToPrice.get(id));
  for (const p of HIST[id] || []) vals.add(p.p);
  return vals;
}

const PRICE_RE = /\$\d{1,3}(?:\.\d{3})+/g;
function resolveIds(line) {
  const ids = new Set();
  let m;
  const codeRe = /meli\.la\/(\w+)/g;
  while ((m = codeRe.exec(line)) !== null) {
    const id = codeToId.get(m[1]);
    if (id) ids.add(id);
  }
  const mlaRe = /\bMLA\d+/gi;
  while ((m = mlaRe.exec(line)) !== null) {
    const id = m[0].toUpperCase();
    if (idToPrice.has(id)) ids.add(id);
  }
  return [...ids];
}

const lines = fs.readFileSync(G_PATH, "utf8").split("\n");
const applied = [];
const skipped = [];

for (let i = FROM - 1; i < TO && i < lines.length; i++) {
  const line = lines[i];
  if (line.includes("{{precio")) continue; // ya tiene token
  const prices = line.match(PRICE_RE);
  if (!prices) continue;

  // Excluir párrafos de tramos con rangos en notación K ($120K–$250K): el rango
  // está hardcodeado y un precio en vivo puede contradecirlo.
  if (/\$\d+\s*[Kk]\b/.test(line)) {
    skipped.push({ ln: i + 1, why: "tramo con rango $K (frágil)", snippet: line.trim().slice(0, 100) });
    continue;
  }

  // Excluir líneas con claims comparativos/superlativos/de tramo: si el precio
  // cambió, esos claims quedan falsos. Se limpian aparte por barrido de grep.
  if (/más del doble|el más caro|la más cara|el robot más caro|más caro que|más cara que|el más barat|la más barat|el de más|tope de gama|premium más|lejísimos|abismo|doble que|más que la|menos que la|Entrada \(|Medio \(|Premium \(|más caro del|más barato del|más cara del|más barata del/i.test(line)) {
    skipped.push({ ln: i + 1, why: "claim comparativo/superlativo (revisar aparte)", snippet: line.trim().slice(0, 100) });
    continue;
  }

  const ids = resolveIds(line);
  if (prices.length !== 1 || ids.length !== 1) {
    skipped.push({ ln: i + 1, why: `${prices.length} precio(s) / ${ids.length} producto(s)`, snippet: line.trim().slice(0, 100) });
    continue;
  }
  const id = ids[0];
  const priceStr = prices[0];
  const priceNum = Number(priceStr.replace(/\D/g, ""));
  const vals = valuesFor(id);

  const exactMatch = vals.has(priceNum);
  const roundedMatch = !exactMatch && [...vals].some((v) => Math.round(v / 1000) * 1000 === priceNum);
  if (!exactMatch && !roundedMatch) {
    skipped.push({ ln: i + 1, why: `precio ${priceStr} no coincide con historial de ${id}`, snippet: line.trim().slice(0, 100) });
    continue;
  }

  // Modo :k si el texto enmarca el precio como aproximado, o si solo matcheó redondeado.
  const idx = line.indexOf(priceStr);
  const before = line.slice(Math.max(0, idx - 20), idx).toLowerCase();
  const approx = /~|menos de|alrededor|cerca de|ronda|unos|bajo|debajo|por menos|hasta/.test(before);
  const useK = approx || roundedMatch;
  const token = useK ? `{{precio:${id}:k}}` : `{{precio:${id}}}`;
  lines[i] = line.replace(priceStr, token);
  applied.push({ ln: i + 1, id, priceStr, mode: useK ? "k" : "exact", snippet: lines[i].trim().slice(0, 120) });
}

console.log(`\n=== MIGRACIÓN DE PRECIOS EN PROSA (líneas ${FROM}-${TO}) ===`);
console.log(`Aplicados: ${applied.length}   |   Salteados: ${skipped.length}\n`);
console.log(`APLICADOS (revisar coherencia del texto):`);
for (const a of applied) console.log(`  L${a.ln} [${a.mode}] ${a.id}\n     ${a.snippet}`);
console.log(`\nSALTEADOS (no tocados):`);
for (const s of skipped) console.log(`  L${s.ln} [${s.why}] ${s.snippet}`);

if (DRY) {
  console.log("\n[dry-run] No se escribió nada.");
  process.exit(0);
}
fs.writeFileSync(G_PATH, lines.join("\n"), "utf8");
console.log(`\nEscrito: src/data/guides.ts (${applied.length} precios tokenizados en prosa)`);
