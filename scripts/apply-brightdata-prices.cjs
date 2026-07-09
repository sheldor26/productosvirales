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
 * price_without_taxes, specs, rating, review_count, stock_available, images,
 * review_headers, review_contents, input, warning, warning_code, error).
 *
 * rating/review_count se aplican al catalogo igual que el precio (mismo
 * cruce + guarda contra bajas sospechosas). specs/images/review_headers/
 * review_contents NO se escriben solos en curated-products.ts: una ficha
 * de ProductosVirales no copia texto crudo del vendedor (ver docs/fichas.md),
 * necesitan la curaduria editorial (elegir 3-4 reseñas reales, cruzar specs
 * contra el fabricante, etc). En cambio quedan cacheados en
 * .cache/brightdata-enrichment.json para usarlos a mano cuando se arma o
 * actualiza una ficha, sin tener que volver a scrapear.
 */

const fs = require("fs");
const path = require("path");

const CATALOG_PATH = path.resolve("src/data/curated-products.ts");
const SUSPICIOUS_DOC_PATH = path.resolve("docs/precios-sospechosos.md");
const HISTORY_PATH = path.resolve("src/data/price-history.json");
const ENRICHMENT_CACHE_PATH = path.resolve(".cache/brightdata-enrichment.json");
const MIN_RATIO = 0.5;
const MAX_RATIO = 2;
const REVIEW_COUNT_MIN_RATIO = 0.5; // igual criterio que precios: una caida a menos de la mitad es sospechosa, no una baja real

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

function numProp(block, prop) {
  const m = block.match(new RegExp(`(?:^|\\n)\\s*${prop}:\\s*(\\d+(?:\\.\\d+)?)`));
  return m ? Number(m[1]) : undefined;
}

function loadCatalog(src) {
  const blocks = src.split(/\n  \{\n/).slice(1);
  return blocks.map((b) => ({
    id: get(b, "id"),
    title: get(b, "title"),
    price: getPrice(b),
    permalink: get(b, "permalink"),
    rating: numProp(b, "rating"),
    reviewCount: numProp(b, "reviewCount"),
  }));
}

// "4,7" -> 4.7 (ML a veces usa coma decimal)
function parseRating(text) {
  if (!text) return NaN;
  return parseFloat(String(text).replace(",", "."));
}

// "(3.106)" -> 3106
function parseReviewCount(text) {
  if (!text) return NaN;
  const digits = String(text).replace(/[^\d]/g, "");
  return digits ? Number(digits) : NaN;
}

function compare(catalog, report) {
  const byUrl = new Map(catalog.map((p) => [p.permalink, p]));
  let matched = 0, unmatched = 0, errored = 0;
  const changes = [];
  const unchangedList = [];
  const ratingReviewChanges = [];
  const stockMissing = [];

  for (const r of report) {
    const url = r.input?.url;
    const product = url ? byUrl.get(url) : null;
    if (!product) { unmatched++; continue; }
    if (r.error) { errored++; continue; }
    const scraped = r.current_price?.value;
    if (typeof scraped !== "number") { errored++; continue; }
    matched++;
    if (scraped === product.price) {
      unchangedList.push({ id: product.id, price: product.price });
    } else {
      changes.push({
        id: product.id,
        title: product.title,
        stored: product.price,
        scraped,
        permalink: product.permalink,
      });
    }

    const scrapedRating = parseRating(r.rating);
    const scrapedReviewCount = parseReviewCount(r.review_count);
    if (Number.isFinite(scrapedRating) || Number.isFinite(scrapedReviewCount)) {
      ratingReviewChanges.push({
        id: product.id,
        title: product.title,
        storedRating: product.rating,
        scrapedRating: Number.isFinite(scrapedRating) ? scrapedRating : product.rating,
        storedReviewCount: product.reviewCount,
        scrapedReviewCount: Number.isFinite(scrapedReviewCount) ? scrapedReviewCount : product.reviewCount,
      });
    }

    if (!r.stock_available) {
      stockMissing.push({ id: product.id, title: product.title, permalink: product.permalink });
    }
  }
  return {
    matched, unmatched, errored,
    unchanged: unchangedList.length, unchangedList, changes,
    ratingReviewChanges, stockMissing,
  };
}

// Un punto por dia por producto, para poder armar series de tiempo (indice de
// precios) mas adelante. Solo se appendean precios en los que confiamos: los
// que no cambiaron y los cambios razonables, nunca los sospechosos (podrian
// ser un error de scraping, no un precio real).
function appendPriceHistory(points, today) {
  if (points.length === 0) return 0;
  let history = {};
  try {
    history = JSON.parse(fs.readFileSync(HISTORY_PATH, "utf8"));
  } catch { /* primera vez, arranca vacio */ }

  let added = 0;
  for (const { id, price } of points) {
    if (!Number.isFinite(price)) continue;
    const series = history[id] || (history[id] = []);
    const last = series[series.length - 1];
    if (last && last.d === today) {
      last.p = price; // ya se corrio hoy (ej. reintento): pisa el punto, no duplica
    } else {
      series.push({ d: today, p: price });
      added++;
    }
  }
  fs.writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2) + "\n");
  return added;
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

// Escribe rating/reviewCount reales en el catalogo, mismo mecanismo que el
// precio. reviewCount nunca deberia bajar salvo error de scraping (ML no
// borra calificaciones), asi que una caida a menos de la mitad se descarta
// como sospechosa igual que un precio que se duplica.
function applyRatingReviewChanges(src, changes, today) {
  let next = src;
  let applied = 0;
  const skipped = [];

  for (const c of changes) {
    const ratingChanged = Number.isFinite(c.scrapedRating) && c.scrapedRating !== c.storedRating;
    const reviewCountChanged = Number.isFinite(c.scrapedReviewCount) && c.scrapedReviewCount !== c.storedReviewCount;
    if (!ratingChanged && !reviewCountChanged) continue;

    if (Number.isFinite(c.storedReviewCount) && c.storedReviewCount > 0 && Number.isFinite(c.scrapedReviewCount)) {
      const ratio = c.scrapedReviewCount / c.storedReviewCount;
      if (ratio < REVIEW_COUNT_MIN_RATIO) {
        skipped.push(c);
        continue;
      }
    }

    let idPos = next.indexOf(`id: "${c.id}",`);
    if (idPos === -1) idPos = next.indexOf(`id: '${c.id}',`);
    if (idPos === -1) continue;
    let blockEndCursor = next.indexOf("\n  {", idPos);
    if (blockEndCursor === -1) blockEndCursor = next.length;

    let touchedThis = false;
    const fields = [];
    if (ratingChanged) fields.push(["rating", c.scrapedRating]);
    if (reviewCountChanged) fields.push(["reviewCount", c.scrapedReviewCount]);
    for (const [field, value] of fields) {
      const re = new RegExp(`(\\n\\s*${field}:\\s*)\\d+(?:\\.\\d+)?`);
      const slice = next.slice(idPos, blockEndCursor);
      const fm = re.exec(slice);
      if (fm) {
        const fieldAbsStart = idPos + fm.index;
        const oldLen = fm[0].length;
        const newText = `${fm[1]}${value}`;
        next = next.slice(0, fieldAbsStart) + newText + next.slice(fieldAbsStart + oldLen);
        blockEndCursor += newText.length - oldLen;
        touchedThis = true;
      }
    }
    if (touchedThis) applied++;
  }
  return { next, applied, skipped };
}

// specs/images/review_headers/review_contents quedan cacheados aca, uno por
// producto, para usarlos a mano al armar o actualizar una ficha (docs/fichas.md
// sigue mandando: cruzar contra fabricante, elegir reseñas reales, nunca
// copiar crudo). No se auto-escriben en curated-products.ts.
function saveEnrichmentCache(report, today) {
  let cache = {};
  try {
    cache = JSON.parse(fs.readFileSync(ENRICHMENT_CACHE_PATH, "utf8"));
  } catch { /* primera vez */ }

  let saved = 0;
  for (const r of report) {
    if (r.error || !r.input?.url) continue;
    const hasEnrichment = r.specs?.length || r.images?.length || r.review_headers?.length || r.review_contents?.length;
    if (!hasEnrichment) continue;
    cache[r.input.url] = {
      fetchedAt: today,
      product_title: r.product_title,
      specs: r.specs || [],
      images: r.images || [],
      review_headers: r.review_headers || [],
      review_contents: r.review_contents || [],
      rating: r.rating,
      review_count: r.review_count,
      stock_available: r.stock_available,
    };
    saved++;
  }
  if (saved > 0) {
    fs.mkdirSync(path.dirname(ENRICHMENT_CACHE_PATH), { recursive: true });
    fs.writeFileSync(ENRICHMENT_CACHE_PATH, JSON.stringify(cache, null, 2) + "\n");
  }
  return saved;
}

// Los productos sin cambio de precio tambien fueron re-verificados hoy, pero
// como no pasan por applyChanges (no hay precio nuevo que escribir), su
// priceLastChecked quedaba viejo para siempre aunque Bright Data los chequee
// 3 veces por semana. Eso rompe priceValidUntil del JSON-LD (30 dias desde
// priceLastChecked): una oferta que nunca cambia de precio terminaria
// marcada como "vencida" pese a estar activamente confirmada. Solo se toca
// priceLastChecked/priceStatus, nunca price ni priceUpdated (ese campo
// significa "cuando cambio el valor", no "cuando se confirmo").
function refreshCheckedMetadata(src, ids, today) {
  let next = src;
  let touched = 0;
  for (const id of ids) {
    let idPos = next.indexOf(`id: "${id}",`);
    if (idPos === -1) idPos = next.indexOf(`id: '${id}',`);
    if (idPos === -1) continue;
    let blockEndCursor = next.indexOf("\n  {", idPos);
    if (blockEndCursor === -1) blockEndCursor = next.length;
    let touchedThis = false;
    for (const [field, value] of [
      ["priceLastChecked", today],
      ["priceStatus", "fresh"],
    ]) {
      const re = new RegExp(`(\\n\\s*${field}:\\s*)['"\`][^'"\`]*['"\`]`);
      const slice = next.slice(idPos, blockEndCursor);
      const fm = re.exec(slice);
      if (fm) {
        const fieldAbsStart = idPos + fm.index;
        const oldLen = fm[0].length;
        const newText = `${fm[1]}"${value}"`;
        next = next.slice(0, fieldAbsStart) + newText + next.slice(fieldAbsStart + oldLen);
        blockEndCursor += newText.length - oldLen;
        touchedThis = true;
      }
    }
    if (touchedThis) touched++;
  }
  return { next, touched };
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
  const {
    matched, unmatched, errored, unchanged, unchangedList, changes,
    ratingReviewChanges, stockMissing,
  } = compare(catalog, report);

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
  console.log(`Con rating/reviewCount para actualizar: ${ratingReviewChanges.length}`);
  if (stockMissing.length) {
    console.log(`Sin "unidades disponibles" detectado (revisar si sigue en stock): ${stockMissing.length}`);
    for (const s of stockMissing) console.log(`  ${s.id}  ${s.title}  ${s.permalink}`);
  }

  if (!doApply) {
    console.log("\nDry run - no se escribio nada. Correr con --apply para aplicar.");
    return;
  }

  const today = new Date().toISOString().slice(0, 10);

  if (appendSuspiciousDoc(suspicious, today)) {
    console.log(`\nAgregados ${suspicious.length} caso(s) sospechoso(s) a docs/precios-sospechosos.md`);
  }

  const historyPoints = unchangedList
    .concat(reasonable.map((c) => ({ id: c.id, price: c.scraped })));
  const historyAdded = appendPriceHistory(historyPoints, today);
  console.log(`\nPuntos nuevos en price-history.json: ${historyAdded} (de ${historyPoints.length} precios confiables)`);

  const enrichmentSaved = saveEnrichmentCache(report, today);
  console.log(`Productos con specs/imagenes/reseñas cacheados en .cache/brightdata-enrichment.json: ${enrichmentSaved}`);

  let working = src;
  let totalTouched = 0;

  const { next: afterRefresh, touched: refreshed } = refreshCheckedMetadata(
    working,
    unchangedList.map((u) => u.id),
    today
  );
  working = afterRefresh;
  totalTouched += refreshed;
  console.log(`priceLastChecked refrescado (sin cambio de precio): ${refreshed}`);

  if (reasonable.length > 0) {
    const { next, applied, metaUpdated, missed } = applyChanges(working, reasonable, today);
    working = next;
    totalTouched += applied;
    console.log(`Reemplazados (precio): ${applied}`);
    console.log(`Con metadata actualizada: ${metaUpdated}`);
    if (missed.length) console.log(`Sin match al escribir (revisar a mano): ${missed.join(", ")}`);
  }

  const { next: afterRatingReview, applied: ratingReviewApplied, skipped: ratingReviewSkipped } =
    applyRatingReviewChanges(working, ratingReviewChanges, today);
  working = afterRatingReview;
  totalTouched += ratingReviewApplied;
  console.log(`Rating/reviewCount actualizados: ${ratingReviewApplied}`);
  if (ratingReviewSkipped.length) {
    console.log(`Rating/reviewCount sospechosos (reviewCount cayo a menos de la mitad, sin tocar): ${ratingReviewSkipped.length}`);
    for (const s of ratingReviewSkipped) {
      console.log(`  SOSPECHOSO ${s.id}  reviewCount ${s.storedReviewCount} -> ${s.scrapedReviewCount}  ${s.title}`);
    }
  }

  if (totalTouched === 0) {
    console.log("\nNada para aplicar en el catalogo.");
    return;
  }
  fs.writeFileSync(CATALOG_PATH, working);
  console.log("Escrito en curated-products.ts");
}

main();
