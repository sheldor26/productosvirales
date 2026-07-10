#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Manda a Telegram (SOLO al chat privado de Juan, nunca al canal público) las
 * mejores bajas de precio detectadas por apply-brightdata-prices.cjs en la
 * última corrida. Pensado para correr sin intervención manual como parte del
 * workflow automático — por eso no tiene ninguna opción para publicar en el
 * canal: eso sigue siendo siempre a mano, ver scripts/telegram-price-drop.cjs.
 *
 * Lee .cache/pending-price-drops.json (lo escribe apply-brightdata-prices.cjs
 * en cada corrida --apply). Filtra:
 *   - bajas de al menos --min % (default 15%)
 *   - productos con una contra real en la ficha (no un texto genérico tipo
 *     "sin fabricante rastreable"), para no mandar fichas flojas
 * y manda como máximo --max (default 5), las más grandes primero, para no
 * saturar el chat en corridas con muchas bajas.
 *
 * Reusa scripts/telegram-price-drop.cjs por producto (mismo formato de
 * mensaje ya probado: foto + texto + segundo mensaje con el link de ML).
 *
 * Uso:
 *   node scripts/notify-price-drops-telegram.cjs [--max 5] [--min 15]
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const PENDING_DROPS_PATH = path.resolve(".cache/pending-price-drops.json");
const CATALOG_PATH = path.resolve("src/data/curated-products.ts");

const argv = process.argv.slice(2);
function argNum(flag, def) {
  const i = argv.indexOf(flag);
  return i >= 0 ? Number(argv[i + 1]) : def;
}
const MAX = argNum("--max", 5);
const MIN_PCT = argNum("--min", 15);

function extractProductBlock(src, id) {
  const blocks = src.split(/\n  \{\n/).slice(1);
  for (const b of blocks) {
    const m = b.match(/(?:^|\n)\s*id:\s*['"`]([^'"`]+)['"`]/);
    if (m && m[1].toUpperCase() === id.toUpperCase()) return b;
  }
  return null;
}

// Misma heurística usada a mano para elegir los ejemplos de prueba: una
// contra real y específica, no el texto de relleno de una ficha sin
// enriquecer (ver docs/fichas.md sobre fichas "peladas").
function hasRealCons(block) {
  const m = block.match(/cons:\s*\[([\s\S]{0,400}?)\]/);
  if (!m) return false;
  const inner = m[1].trim();
  if (inner.length < 20) return false;
  return !/sin fabricante rastreable|no especificad/i.test(inner);
}

function main() {
  if (!fs.existsSync(PENDING_DROPS_PATH)) {
    console.log("Sin bajas para notificar (no existe .cache/pending-price-drops.json).");
    return;
  }
  const { drops } = JSON.parse(fs.readFileSync(PENDING_DROPS_PATH, "utf8"));
  if (!drops || drops.length === 0) {
    console.log("Sin bajas en esta corrida.");
    return;
  }

  const catalogSrc = fs.readFileSync(CATALOG_PATH, "utf8");

  const qualifying = drops
    .filter((d) => d.pct <= -MIN_PCT)
    .filter((d) => {
      const block = extractProductBlock(catalogSrc, d.id);
      return block && hasRealCons(block);
    })
    .sort((a, b) => a.pct - b.pct)
    .slice(0, MAX);

  console.log(`Bajas totales: ${drops.length}. Califican (>=${MIN_PCT}%, con contra real): ${qualifying.length}. Mandando hasta ${MAX}.`);

  if (qualifying.length === 0) return;

  for (const d of qualifying) {
    console.log(`\n--- ${d.id} ${d.title} (${d.pct}%) ---`);
    try {
      execFileSync(
        "node",
        ["scripts/telegram-price-drop.cjs", d.id, String(d.scraped), "--old", String(d.stored)],
        { stdio: "inherit" }
      );
    } catch (err) {
      console.error(`No se pudo notificar ${d.id}: ${err.message}`);
    }
  }
}

main();
