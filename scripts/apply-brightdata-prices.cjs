#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Aplica precios desde un dataset de Bright Data (collector mercadolibre.com.ar,
 * c_mrbcvyc91n9lmqv6dt) al catalogo. Reemplaza al viejo update-prices-from-ml.cjs
 * para el circuito automatico: la API oficial de ML sigue bloqueada (401) y el
 * scraper Puppeteer propio choca con el antibot de ML (ver MISTAKES.md /
 * memoria del proyecto, 2026-07-06/07). Bright Data resuelve el scraping;
 * este script solo hace el cruce + escritura, igual que el flujo manual
 * verificado el 2026-07-08.
 *
 * Uso:
 *   node scripts/apply-brightdata-prices.cjs <dataset.json>            # dry-run
 *   node scripts/apply-brightdata-prices.cjs <dataset.json> --apply    # escribe
 *
 * El dataset.json es el array crudo que devuelve Bright Data (schema:
 * product_title, current_price, installment_price, installment_text,
 * price_without_taxes, input, warning, warning_code, error).
 */

const fs = require("fs");
const path = require("path");

const CATALOG_PATH = path.resolve("src/data/curated-products.ts");
const SUSPICIOUS_DOC_PATH = path.resolve("docs/precios-sospechosos.md");
const MIN_RATIO = 0.5;
const MAX_RATIO = 2;

function usage() {
  console.log(`Uso:
  node scripts/apply-brightdata-prices.cjs <dataset.json> [--apply]

  --apply   Escribe los cambios razonables en curated-products.ts.
            Sin esta flag, solo hace dry-run e imprime el resumen.`);
}

function get(block, prop) {
  const strMatch = block.match(new RegExp(`(?:^|\\n)\\s*${prop}:\\s*['"\`]([^'"\`]*)['"\`]`));
  if (strMatch) return strMatch[1];
  const numMatch = block.match(new RegExp(`(?:^|\\n)\\s*${prop}:\\s*(\\d+(?:\\.\\d+)?)`));
  if (numMatch) return numMatch[1];
  return "";
}

// price puede aparecer de nuevo, como string, dentro de structuredData.offers
// (JSON-LD, a veces desactualizado) - un regex combinado para quedarse con
// el que aparece primero en el bloque (el campo real, no el anidado).
function getPrice(block) {
  const m = block.match(/(?:^|\n)\s*price:\s*(?:['"`]([^'"`]*)['"`]|(\d+(?:\.\d+)?))/);
  if (!m) return NaN;
  return Number(m[1] ?? m[2]);
}

function loadCatalog(src) {
  const blocks = src.split(/\n  \{\n/).slice(1);
  return blocks.map((b) => ({
    id: get(b, "id"),
    title: get(b, "title"),
    price: getPrice(b),
    permalink: get(b, "permalink"),
  }));
}

function compare(catalog, report) {
  const byUrl = new Map(catalog.map((p) => [p.permalink, p]));
  let matched = 0, unmatched = 0, errored = 0, unchanged = 0;
  const changes = [];

  for (const r of report) {
    const url = r.input?.url;
    const product = url ? byUrl.get(url) : null;
    if (!product) { unmatched++; continue; }
    if (r.error) { errored++; continue; }
    const scraped = r.current_price?.value;
    if (typeof scraped !== "number") { errored++; continue; }
    matched++;
    if (scraped === product.price) { unchanged++; continue; }
    changes.push({
      id: product.id,
      title: product.title,
      stored: product.price,
      scraped,
      permalink: product.permalink,
    });
  }
  return { matched, unmatched, errored, unchanged, changes };
}

function applyChanges(src, changes, today) {
  let next = src;
  let applied = 0;
  let metaUpdated = 0;
  const missed = [];

  for (const c of changes) {
    let idPos = next.indexOf(`id: "${c.id}",`);
    if (idPos === -1) idPos = next.indexOf(`id: '${c.id}',`);
    if (idPos === -1) { missed.push(c.id); continue; }
    const after = next.slice(idPos);
    const priceRe = /\n(\s*price:\s*)\d+(?:\.\d+)?,/;
    const m = priceRe.exec(after);
    if (!m) { missed.push(c.id); continue; }
    const absoluteStart = idPos + m.index;
    const newPriceLine = `\n${m[1]}${c.scraped},`;
    next = next.slice(0, absoluteStart) + newPriceLine + next.slice(absoluteStart + m[0].length);
    applied++;

    let cursor = absoluteStart + newPriceLine.length;
    let blockEndCursor = next.indexOf("\n  {", cursor);
    if (blockEndCursor === -1) blockEndCursor = next.length;
    let touched = false;
    for (const [field, value] of [
      ["priceUpdated", today],
      ["priceLastChecked", today],
      ["priceStatus", "fresh"],
    ]) {
      const re = new RegExp(`(\\n\\s*${field}:\\s*)['"\`][^'"\`]*['"\`]`);
      const slice = next.slice(cursor, blockEndCursor);
      const fm = re.exec(slice);
      if (fm) {
        const fieldAbsStart = cursor + fm.index;
        const oldLen = fm[0].length;
        const newText = `${fm[1]}"${value}"`;
        next = next.slice(0, fieldAbsStart) + newText + next.slice(fieldAbsStart + oldLen);
        blockEndCursor += newText.length - oldLen;
        touched = true;
      }
    }
    if (touched) metaUpdated++;
  }
  return { next, applied, metaUpdated, missed };
}

const SUSPICIOUS_DOC_INTRO = `# Precios sospechosos

> Cambios de precio que el cruce automático con Bright Data descartó por
> parecer un error (el precio se duplicó o cayó a menos de la mitad). El
> workflow los deja afuera del PR de precios a propósito — hay que
> chequearlos en MercadoLibre. Si son reales, avisar para aplicarlos a mano.
> Entradas nuevas arriba.

`;

function appendSuspiciousDoc(suspicious, today) {
  if (suspicious.length === 0) return false;
  const existing = fs.existsSync(SUSPICIOUS_DOC_PATH)
    ? fs.readFileSync(SUSPICIOUS_DOC_PATH, "utf8")
    : SUSPICIOUS_DOC_INTRO;

  const entries = suspicious
    .map((c) => {
      const pct = Math.round(((c.scraped - c.stored) / c.stored) * 100);
      const sign = pct > 0 ? "+" : "";
      return `- **${c.id}** — ${c.title}: $${c.stored.toLocaleString("es-AR")} → $${c.scraped.toLocaleString("es-AR")} (${sign}${pct}%)\n  - ML: ${c.permalink}\n  - Sitio: https://productosvirales.com.ar/producto/${c.id}`;
    })
    .join("\n");
  const section = `## ${today}\n\n${entries}\n\n`;

  const firstSectionIdx = existing.indexOf("\n## ");
  const next =
    firstSectionIdx === -1
      ? existing.trimEnd() + "\n\n" + section
      : existing.slice(0, firstSectionIdx + 1) + section + existing.slice(firstSectionIdx + 1);

  fs.writeFileSync(SUSPICIOUS_DOC_PATH, next);
  return true;
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    usage();
    process.exit(args.length === 0 ? 1 : 0);
  }
  const datasetPath = args[0];
  const doApply = args.includes("--apply");

  const report = JSON.parse(fs.readFileSync(datasetPath, "utf8"));
  const src = fs.readFileSync(CATALOG_PATH, "utf8");
  const catalog = loadCatalog(src);
  const { matched, unmatched, errored, unchanged, changes } = compare(catalog, report);

  const suspicious = changes.filter((c) => {
    const ratio = c.scraped / c.stored;
    return ratio < MIN_RATIO || ratio > MAX_RATIO;
  });
  const reasonable = changes.filter((c) => !suspicious.includes(c));

  console.log(`Filas del dataset: ${report.length}`);
  console.log(`Matcheados con el catalogo: ${matched}`);
  console.log(`Sin match (URL no encontrada): ${unmatched}`);
  console.log(`Con error/sin precio: ${errored}`);
  console.log(`Sin cambio de precio: ${unchanged}`);
  console.log(`Con cambio razonable: ${reasonable.length}`);
  console.log(`Sospechosos (precio se duplico o cayo a menos de la mitad, sin tocar): ${suspicious.length}`);
  for (const c of suspicious) {
    console.log(`  SOSPECHOSO ${c.id}  ${c.stored} -> ${c.scraped}  ${c.title}`);
  }

  if (!doApply) {
    console.log("\nDry run - no se escribio nada. Correr con --apply para aplicar.");
    return;
  }

  const today = new Date().toISOString().slice(0, 10);

  if (appendSuspiciousDoc(suspicious, today)) {
    console.log(`\nAgregados ${suspicious.length} caso(s) sospechoso(s) a docs/precios-sospechosos.md`);
  }

  if (reasonable.length === 0) {
    console.log("\nNada para aplicar en el catalogo.");
    return;
  }

  const { next, applied, metaUpdated, missed } = applyChanges(src, reasonable, today);
  console.log(`\nReemplazados (precio): ${applied}`);
  console.log(`Con metadata actualizada: ${metaUpdated}`);
  if (missed.length) console.log(`Sin match al escribir (revisar a mano): ${missed.join(", ")}`);
  fs.writeFileSync(CATALOG_PATH, next);
  console.log("Escrito en curated-products.ts");
}

main();
