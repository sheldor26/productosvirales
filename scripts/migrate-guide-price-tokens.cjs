#!/usr/bin/env node
/**
 * migrate-guide-price-tokens.cjs
 *
 * Reemplaza los precios hardcodeados de las TABLAS de guías por tokens en vivo
 * ({{precio:MLA…}}). El mapeo es determinístico: para cada celda de precio,
 * toma el link de afiliado (meli.la/CODIGO) o el id MLA de la MISMA fila y lo
 * resuelve contra curated-products.ts. No adivina.
 *
 * Reglas de seguridad (si algo no es 100% claro, NO toca y lo reporta):
 *   - Solo actúa sobre líneas que son fila de tabla (empiezan con [`).
 *   - Solo si la fila tiene exactamente UNA celda de precio (`$...`).
 *   - Solo si encuentra UN producto resoluble en esa fila.
 *   - Filas con 2+ precios (ej. precio + precio anterior) → se saltean y reportan.
 *
 * Uso:
 *   node scripts/migrate-guide-price-tokens.cjs --dry-run   # muestra el plan
 *   node scripts/migrate-guide-price-tokens.cjs             # aplica
 */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const GUIDES = path.join(ROOT, "src", "data", "guides.ts");
const PRODUCTS = path.join(ROOT, "src", "data", "curated-products.ts");
const DRY = process.argv.includes("--dry-run");

// ── 1) Mapa de productos: meli.la/CODIGO → id, y id → precio actual ──
// Acotamos cada producto entre `id:` consecutivos (robusto, no depende de llaves).
const productsSrc = fs.readFileSync(PRODUCTS, "utf8");
const codeToId = new Map();
const idToPrice = new Map();
const idMatches = [...productsSrc.matchAll(/\bid:\s*['"](MLA\w+)['"]/g)];
for (let k = 0; k < idMatches.length; k++) {
  const id = idMatches[k][1];
  const start = idMatches[k].index;
  const end = k + 1 < idMatches.length ? idMatches[k + 1].index : productsSrc.length;
  const slice = productsSrc.slice(start, end);
  const priceM = slice.match(/\bprice:\s*(\d+)/);
  if (priceM) idToPrice.set(id, Number(priceM[1]));
  let cm;
  const codeRe = /meli\.la\/(\w+)/g;
  while ((cm = codeRe.exec(slice)) !== null) codeToId.set(cm[1], id);
}

// ── 2) Resolver el producto de una fila de tabla ──
const PRICE_CELL = /`\$[0-9][0-9.]*`/g;

function resolveId(line) {
  const ids = new Set();
  let m;
  const codeRe = /meli\.la\/(\w+)/g;
  while ((m = codeRe.exec(line)) !== null) {
    const id = codeToId.get(m[1]);
    if (id) ids.add(id);
  }
  // Links internos /producto/...-mlaXX280 o ids MLA sueltos en la fila.
  const mlaRe = /\bMLA\d+/gi;
  while ((m = mlaRe.exec(line)) !== null) {
    const id = m[0].toUpperCase();
    if (idToPrice.has(id)) ids.add(id);
  }
  return [...ids];
}

// ── 3) Recorrer guías línea por línea ──
const lines = fs.readFileSync(GUIDES, "utf8").split("\n");
const applied = [];
const skipped = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (!line.trim().startsWith("[`")) continue; // no es fila de tabla
  const priceCells = line.match(PRICE_CELL);
  if (!priceCells) continue;

  if (priceCells.length > 1) {
    skipped.push({ ln: i + 1, why: `${priceCells.length} precios en la fila`, line: line.trim() });
    continue;
  }
  const ids = resolveId(line);
  if (ids.length === 0) {
    skipped.push({ ln: i + 1, why: "sin producto resoluble", line: line.trim() });
    continue;
  }
  if (ids.length > 1) {
    skipped.push({ ln: i + 1, why: `ambiguo (${ids.join(", ")})`, line: line.trim() });
    continue;
  }
  const id = ids[0];
  const oldCell = priceCells[0]; // `$149.132`
  const oldPrice = Number(oldCell.replace(/[`$.]/g, ""));
  const curPrice = idToPrice.get(id);
  lines[i] = line.replace(PRICE_CELL, `\`{{precio:${id}}}\``);
  applied.push({ ln: i + 1, id, oldPrice, curPrice, drift: curPrice - oldPrice });
}

// ── 4) Reporte ──
console.log(`\n=== MIGRACIÓN DE TOKENS DE PRECIO EN TABLAS ===`);
console.log(`Aplicados: ${applied.length}   |   Salteados: ${skipped.length}\n`);

const drifted = applied.filter((a) => Math.abs(a.drift) > 0);
if (drifted.length) {
  console.log(`Precios que estaban DESACTUALIZADOS (el token ya los corrige):`);
  for (const a of drifted) {
    const pct = a.oldPrice ? Math.round((a.drift / a.oldPrice) * 100) : 0;
    console.log(`  L${a.ln} ${a.id}: tabla $${a.oldPrice.toLocaleString("es-AR")} → real $${(a.curPrice ?? 0).toLocaleString("es-AR")} (${pct > 0 ? "+" : ""}${pct}%)`);
  }
  console.log("");
}

if (skipped.length) {
  console.log(`Salteados (revisar a mano si corresponde):`);
  for (const s of skipped) console.log(`  L${s.ln} [${s.why}] ${s.line.slice(0, 90)}`);
  console.log("");
}

if (DRY) {
  console.log("[dry-run] No se escribió nada.");
  process.exit(0);
}

fs.writeFileSync(GUIDES, lines.join("\n"), "utf8");
console.log(`Escrito: src/data/guides.ts (${applied.length} celdas tokenizadas)`);
