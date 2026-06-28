#!/usr/bin/env node
/**
 * backfill-price-history.cjs
 *
 * Reconstruye el historial de precios de cada producto leyendo el git log de
 * src/data/curated-products.ts. Cada commit que cambió un precio queda como un
 * punto {d: fecha, p: precio} en src/data/price-history.json.
 *
 * Uso:
 *   node scripts/backfill-price-history.cjs           # escribe price-history.json
 *   node scripts/backfill-price-history.cjs --dry-run # solo muestra el resumen
 *
 * Es idempotente: si lo corrés de nuevo, regenera el mismo historial desde git.
 * Una vez generado, el workflow semanal solo agrega puntos nuevos (ver
 * scripts/append-price-history.cjs).
 */
const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const DATA_FILE = "src/data/curated-products.ts";
const OUT_FILE = path.join(__dirname, "..", "src", "data", "price-history.json");
const DRY = process.argv.includes("--dry-run");

/** Extrae { idProducto: precio } de una versión del archivo de datos. */
function parsePrices(source) {
  const prices = {};
  // id: 'MLA...' seguido (lazy) del primer price: NNN del mismo bloque.
  // "price:" es case-sensitive, así que no matchea originalPrice: ni priceUpdated:.
  const re = /id:\s*['"]([^'"]+)['"][\s\S]*?\bprice:\s*(\d+)/g;
  let m;
  while ((m = re.exec(source)) !== null) {
    const [, id, price] = m;
    // Solo el primer match por id (el bloque del producto).
    if (!(id in prices)) prices[id] = Number(price);
  }
  return prices;
}

function git(cmd) {
  return execSync(`git ${cmd}`, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
}

// Commits que tocaron el archivo, del más viejo al más nuevo.
const log = git(`log --reverse --format='%H|%ad' --date=short -- ${DATA_FILE}`)
  .trim()
  .split("\n")
  .filter(Boolean)
  .map((line) => {
    const [hash, date] = line.split("|");
    return { hash, date };
  });

console.log(`Procesando ${log.length} commits de ${DATA_FILE}...`);

// history[id] = [{ d, p }] — solo agregamos un punto cuando el precio cambia.
const history = {};

for (const { hash, date } of log) {
  let source;
  try {
    source = git(`show ${hash}:${DATA_FILE}`);
  } catch {
    continue; // el archivo no existía en ese commit
  }
  const prices = parsePrices(source);
  for (const [id, price] of Object.entries(prices)) {
    if (!Number.isFinite(price) || price <= 0) continue;
    const series = (history[id] ||= []);
    const last = series[series.length - 1];
    if (last && last.p === price) {
      last.d = date; // mismo precio: corremos la fecha (sigue vigente)
      continue;
    }
    series.push({ d: date, p: price });
  }
}

// Resumen
const ids = Object.keys(history).sort();
const withChanges = ids.filter((id) => history[id].length > 1);
console.log(`\n${ids.length} productos con historial.`);
console.log(`${withChanges.length} tuvieron al menos un cambio de precio.\n`);
for (const id of withChanges.slice(0, 15)) {
  const s = history[id];
  console.log(`  ${id}: ${s.length} puntos  (${s[0].p} → ${s[s.length - 1].p})`);
}

if (DRY) {
  console.log("\n[dry-run] No se escribió nada.");
  process.exit(0);
}

fs.writeFileSync(OUT_FILE, JSON.stringify(history, null, 2) + "\n", "utf8");
console.log(`\nEscrito: ${path.relative(process.cwd(), OUT_FILE)}`);
