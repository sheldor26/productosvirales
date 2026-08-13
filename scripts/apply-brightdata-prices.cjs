#!/usr/bin/env node

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
 * product_title, description, current_price, installment_price, installment_text,
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
// Guard compartido con los otros 3 scripts que escriben precios, para que el
// umbral no viva duplicado en cuatro lugares que se desincronizan.
const { PROTECCION_MANUAL_DIAS, diasDesde, FORCE_FLAG } = require("./lib/price-guard.cjs");

const CATALOG_PATH = path.resolve("src/data/curated-products.ts");
const SUSPICIOUS_DOC_PATH = path.resolve("docs/precios-sospechosos.md");
const PROTECTED_DOC_PATH = path.resolve("docs/precios-protegidos.md");
const HISTORY_PATH = path.resolve("src/data/price-history.json");
const ENRICHMENT_CACHE_PATH = path.resolve(".cache/brightdata-enrichment.json");
const PENDING_DROPS_PATH = path.resolve(".cache/pending-price-drops.json");
const MIN_RATIO = 0.5;
const MAX_RATIO = 2;
// Igual criterio que precios: una caida a menos de la mitad es sospechosa,
// no una baja real.
const REVIEW_COUNT_MIN_RATIO = 0.5;
/**
 * Lee un dataset de Bright Data, que puede venir como array JSON o como NDJSON
 * (un objeto por linea). Bright Data cambia el formato sin avisar: el
 * 2026-08-07 paso de array a NDJSON y rompio el workflow de precios en
 * silencio, que quedo 3 dias sin correr mientras el catalogo envejecia.
 */
function leerDataset(p) {
  const txt = fs.readFileSync(p, "utf8").trim();
  if (!txt) return [];
  try {
    const j = JSON.parse(txt);
    return Array.isArray(j) ? j : [j];
  } catch {
    return txt
      .split("\n")
      .filter(Boolean)
      .map((linea, i) => {
        try {
          return JSON.parse(linea);
        } catch {
          throw new Error(`Linea ${i + 1} del dataset no es JSON valido`);
        }
      });
  }
}

/**
 * ¿El producto está sin stock? Devuelve `true` (sin stock), `false` (con stock)
 * o `null` cuando NO SE PUEDE DETERMINAR.
 *
 * Hasta el 2026-08-10 esto era `!r.stock_available`, o sea que trataba la
 * ausencia del dato como prueba de que no hay stock. Y `stock_available` es
 * solo el texto que MercadoLibre muestra al lado del boton ("+50 disponibles"),
 * que ML no siempre renderiza. Resultado medido ese dia: de 14 productos
 * marcados sin stock, 13 estaban perfectamente a la venta (93% de falsos
 * positivos). Eso llego a produccion y, combinado con la redireccion de links
 * sin stock a la ficha interna, desvio 84 links de afiliado en 22 guias.
 *
 * Ahora se exige EVIDENCIA POSITIVA para marcar sin stock:
 *   - texto explicito de pausa/agotado en los campos scrapeados, o
 *   - el registro no trae precio (una publicacion viva siempre trae precio).
 * Si el precio esta y no hay senal de pausa, se asume CON stock. Y si no hay
 * ni precio ni senal util, se devuelve null y no se toca el estado anterior.
 */
function sinStock(r) {
  const textos = [r.stock_available, r.availability, r.status, r.product_status]
    .filter((v) => typeof v === "string")
    .join(" ")
    .toLowerCase();

  if (/pausada|sin stock|agotado|no disponible|out of stock|unavailable/.test(textos)) return true;

  const tienePrecio = Number.isFinite(Number(r?.current_price?.value)) && Number(r.current_price.value) > 0;
  if (tienePrecio) return false; // hay precio y ninguna senal de pausa: esta a la venta

  if (r.error) return true; // el scraper no pudo abrir la publicacion
  return null; // sin datos suficientes: no tocar el estado anterior
}

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
    priceStatus: get(b, "priceStatus"),
    priceVerifiedAt: get(b, "priceVerifiedAt"),
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
  const stockChanges = [];

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
        priceVerifiedAt: product.priceVerifiedAt,
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

    // Estado de stock: priceStatus persiste el estado de la corrida anterior,
    // el dato scrapeado es el de ahora. El cruce detecta el flip.
    const prevOut = product.priceStatus === "out_of_stock";
    const nowOut = sinStock(r);
    if (nowOut === true) {
      stockMissing.push({ id: product.id, title: product.title, permalink: product.permalink });
    }
    // Con nowOut === null (no se pudo determinar) no se toca nada: se deja el
    // estado anterior y no se reporta flip.
    if (prevOut && nowOut === false) {
      stockChanges.push({ id: product.id, title: product.title, permalink: product.permalink, direction: "restock" });
    } else if (!prevOut && nowOut === true) {
      stockChanges.push({ id: product.id, title: product.title, permalink: product.permalink, direction: "out" });
    }
  }
  return {
    matched, unmatched, errored,
    unchanged: unchangedList.length, unchangedList, changes,
    ratingReviewChanges, stockMissing, stockChanges,
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
    const hasEnrichment = r.specs?.length || r.images?.length || r.review_headers?.length || r.review_contents?.length || r.description;
    if (!hasEnrichment) continue;
    cache[r.input.url] = {
      fetchedAt: today,
      product_title: r.product_title,
      description: r.description || "",
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

// Bajas reales (precio nuevo menor al guardado) de esta corrida, para que
// scripts/notify-price-drops-telegram.cjs las mande al chat privado de Juan
// sin intervencion manual. Se pisa en cada corrida (no acumula entre dias):
// el notificador corre siempre a continuacion, en el mismo workflow.
function savePendingDrops(reasonable, today) {
  const drops = reasonable
    .filter((c) => c.scraped < c.stored)
    .map((c) => ({
      id: c.id,
      title: c.title,
      stored: c.stored,
      scraped: c.scraped,
      pct: Math.round(((c.scraped - c.stored) / c.stored) * 100),
    }));
  fs.mkdirSync(path.dirname(PENDING_DROPS_PATH), { recursive: true });
  fs.writeFileSync(PENDING_DROPS_PATH, JSON.stringify({ date: today, drops }, null, 2) + "\n");
  return drops.length;
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

const PROTECTED_DOC_INTRO = `# Precios protegidos

> Cambios que Bright Data propuso y NO se aplicaron porque el precio estaba
> verificado a mano hace poco (campo \`priceVerifiedAt\`, ventana de
> ${PROTECCION_MANUAL_DIAS} dias). Lo escribe \`apply-brightdata-prices.cjs\`.
>
> Existe porque el workflow de precios auto-mergea su PR: si esto quedara solo
> en el log de Actions, nadie se enteraria. El 2026-08-12 Bright Data piso 11
> de 15 precios verificados a mano devolviendolos a valores viejos, y se
> descubrio de casualidad.
>
> **Como leerlo:** si un producto aparece aca 3 corridas seguidas, o Bright
> Data tiene un dato roto para esa publicacion, o el precio cambio de verdad y
> la verificacion manual quedo vieja. En los dos casos: mirar la publicacion en
> MercadoLibre y, si el precio nuevo es el correcto, actualizar el catalogo a
> mano y refrescar \`priceVerifiedAt\`.

`;

/**
 * Deja constancia de los cambios que se descartaron por proteccion manual.
 * Devuelve true si escribio algo.
 */
function appendProtectedDoc(protegidos, today) {
  if (protegidos.length === 0) return false;
  const existe = fs.existsSync(PROTECTED_DOC_PATH);
  const previo = existe ? fs.readFileSync(PROTECTED_DOC_PATH, "utf8") : PROTECTED_DOC_INTRO;
  const filas = protegidos
    .map((c) => {
      const dias = diasDesde(c.priceVerifiedAt);
      return `- **${c.id}** ${c.title}\n` +
             `  - catalogo (verificado a mano el ${c.priceVerifiedAt}, hace ${dias}d): $${c.stored}\n` +
             `  - Bright Data propuso: $${c.scraped} — descartado\n` +
             `  - ${c.permalink}`;
    })
    .join("\n");
  fs.writeFileSync(PROTECTED_DOC_PATH, `${previo}\n## Corrida ${today}\n\n${filas}\n`);
  return true;
}

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

// Marca priceStatus 'out_of_stock' para las fichas que Bright Data devolvio sin
// stock. Corre DESPUES de applyChanges/refreshCheckedMetadata (que dejan 'fresh'
// porque una publicacion pausada igual devuelve precio), asi el estado de stock
// queda persistido en el catalogo y sirve de "estado anterior" en la proxima
// corrida para detectar el flip. Solo toca la ficha si ya tiene el campo
// priceStatus (todas las que pasaron por el pipeline lo tienen).
function markOutOfStock(src, ids, today) {
  let next = src;
  let touched = 0;
  for (const id of ids) {
    let idPos = next.indexOf(`id: "${id}",`);
    if (idPos === -1) idPos = next.indexOf(`id: '${id}',`);
    if (idPos === -1) continue;
    let blockEndCursor = next.indexOf("\n  {", idPos);
    if (blockEndCursor === -1) blockEndCursor = next.length;
    let touchedThis = false;

    // priceLastChecked: solo actualizar si ya existe (no es imprescindible
    // para el cruce, no lo insertamos para no ensuciar fichas que no lo usan).
    {
      const re = /(\n\s*priceLastChecked:\s*)['"`][^'"`]*['"`]/;
      const fm = re.exec(next.slice(idPos, blockEndCursor));
      if (fm) {
        const abs = idPos + fm.index;
        const newText = `${fm[1]}"${today}"`;
        next = next.slice(0, abs) + newText + next.slice(abs + fm[0].length);
        blockEndCursor += newText.length - fm[0].length;
        touchedThis = true;
      }
    }

    // priceStatus: actualizar si existe, INSERTAR despues de la linea del id
    // si falta. Es el campo que el cruce de la proxima corrida lee como
    // "estado anterior"; sin el, una ficha sin stock se marcaria como flip
    // 🔴 en cada corrida (ruido). Insertarlo lo evita.
    {
      const re = /(\n\s*priceStatus:\s*)['"`][^'"`]*['"`]/;
      const fm = re.exec(next.slice(idPos, blockEndCursor));
      if (fm) {
        const abs = idPos + fm.index;
        const newText = `${fm[1]}"out_of_stock"`;
        next = next.slice(0, abs) + newText + next.slice(abs + fm[0].length);
        touchedThis = true;
      } else {
        const idLineEnd = next.indexOf("\n", idPos);
        if (idLineEnd !== -1) {
          next = next.slice(0, idLineEnd) + `\n    priceStatus: "out_of_stock",` + next.slice(idLineEnd);
          touchedThis = true;
        }
      }
    }
    if (touchedThis) touched++;
  }
  return { next, touched };
}

const STOCK_DOC_PATH = path.resolve("docs/cambios-de-stock.md");
const STOCK_DOC_INTRO = `# Cambios de stock

> Cambios de estado de stock que detecto el cruce automatico con Bright Data
> (una publicacion paso de con stock a "Publicacion pausada" o al reves). Se
> dejan en el PR de precios para que Juan los vea, sin canal aparte (nada de
> Telegram). 🟢 = volvio el stock (candidato a reactivar / hacer swap de vuelta).
> 🔴 = se quedo sin stock (el link de afiliado apunta a una pagina pausada).
> Entradas nuevas arriba.

`;

// Deja los flips de stock de esta corrida en docs/cambios-de-stock.md. El
// workflow suma este archivo al PR, asi el aviso llega por el mismo lugar que
// Juan ya revisa (el PR de precios), no por Telegram.
function appendStockChangesDoc(stockChanges, today) {
  if (stockChanges.length === 0) return false;
  const existing = fs.existsSync(STOCK_DOC_PATH)
    ? fs.readFileSync(STOCK_DOC_PATH, "utf8")
    : STOCK_DOC_INTRO;

  const entries = stockChanges
    .map((c) => {
      const icon = c.direction === "restock" ? "🟢 VOLVIO EL STOCK" : "🔴 SIN STOCK";
      return `- ${icon} — **${c.id}** ${c.title}\n  - ML: ${c.permalink}\n  - Sitio: https://productosvirales.com.ar/producto/${c.id}`;
    })
    .join("\n");
  const section = `## ${today}\n\n${entries}\n\n`;

  const firstSectionIdx = existing.indexOf("\n## ");
  const next =
    firstSectionIdx === -1
      ? existing.trimEnd() + "\n\n" + section
      : existing.slice(0, firstSectionIdx + 1) + section + existing.slice(firstSectionIdx + 1);

  fs.writeFileSync(STOCK_DOC_PATH, next);
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

  const report = leerDataset(datasetPath);
  const src = fs.readFileSync(CATALOG_PATH, "utf8");
  const catalog = loadCatalog(src);
  const {
    matched, unmatched, errored, unchanged, unchangedList, changes,
    ratingReviewChanges, stockMissing, stockChanges,
  } = compare(catalog, report);

  // Precios verificados a mano hace poco: Bright Data NO los pisa. Quedan
  // registrados en docs/precios-protegidos.md (doc propio, no el de
  // sospechosos: son motivos distintos) para que se vea que el scraper
  // propuso otra cosa y se descarto a proposito.
  const forzar = args.includes(FORCE_FLAG);
  const protegidos = forzar
    ? []
    : changes.filter((c) => diasDesde(c.priceVerifiedAt) <= PROTECCION_MANUAL_DIAS);
  if (forzar) {
    console.log(`${FORCE_FLAG}: la proteccion manual de precios queda DESACTIVADA en esta corrida.`);
  }
  const suspicious = changes.filter((c) => {
    if (protegidos.includes(c)) return false;
    const ratio = c.scraped / c.stored;
    return ratio < MIN_RATIO || ratio > MAX_RATIO;
  });
  const reasonable = changes.filter(
    (c) => !suspicious.includes(c) && !protegidos.includes(c)
  );

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
  console.log(`Protegidos (verificados a mano hace <= ${PROTECCION_MANUAL_DIAS} dias, sin tocar): ${protegidos.length}`);
  for (const c of protegidos) {
    console.log(
      `  PROTEGIDO ${c.id}  ${c.stored} -> ${c.scraped} (descartado)  ` +
      `verificado el ${c.priceVerifiedAt}, hace ${diasDesde(c.priceVerifiedAt)}d  ${c.title}`
    );
  }
  console.log(`Con rating/reviewCount para actualizar: ${ratingReviewChanges.length}`);
  if (stockMissing.length) {
    console.log(`Sin stock confirmado (senal explicita de pausa/agotado, o sin precio): ${stockMissing.length}`);
    for (const s of stockMissing) console.log(`  ${s.id}  ${s.title}  ${s.permalink}`);
  }
  if (stockChanges.length) {
    console.log(`\nCAMBIOS DE STOCK (flip pausada<->activa) detectados: ${stockChanges.length}`);
    for (const s of stockChanges) console.log(`  ${s.direction === "restock" ? "🟢 VOLVIO" : "🔴 SIN STOCK"}  ${s.id}  ${s.title}`);
  }

  if (!doApply) {
    console.log("\nDry run - no se escribio nada. Correr con --apply para aplicar.");
    return;
  }

  const today = new Date().toISOString().slice(0, 10);

  if (doApply && appendProtectedDoc(protegidos, today)) {
    console.log(`\nRegistrados ${protegidos.length} caso(s) protegido(s) en docs/precios-protegidos.md`);
  }
  if (appendSuspiciousDoc(suspicious, today)) {
    console.log(`\nAgregados ${suspicious.length} caso(s) sospechoso(s) a docs/precios-sospechosos.md`);
  }

  if (appendStockChangesDoc(stockChanges, today)) {
    console.log(`Cambios de stock guardados en docs/cambios-de-stock.md: ${stockChanges.length}`);
  }

  const historyPoints = unchangedList
    .concat(reasonable.map((c) => ({ id: c.id, price: c.scraped })));
  const historyAdded = appendPriceHistory(historyPoints, today);
  console.log(`\nPuntos nuevos en price-history.json: ${historyAdded} (de ${historyPoints.length} precios confiables)`);

  const pendingDrops = savePendingDrops(reasonable, today);
  console.log(`Bajas de precio de esta corrida guardadas en .cache/pending-price-drops.json: ${pendingDrops}`);

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

  // Al final: persistir priceStatus 'out_of_stock' para los que Bright Data
  // devolvio sin stock, pisando el 'fresh' que dejaron los pasos de arriba.
  // Asi la proxima corrida sabe el estado anterior y detecta el flip.
  const { next: afterStock, touched: stockMarked } = markOutOfStock(
    working,
    stockMissing.map((s) => s.id),
    today
  );
  working = afterStock;
  totalTouched += stockMarked;
  if (stockMarked) console.log(`priceStatus marcado 'out_of_stock': ${stockMarked}`);

  if (totalTouched === 0) {
    console.log("\nNada para aplicar en el catalogo.");
    return;
  }
  fs.writeFileSync(CATALOG_PATH, working);
  console.log("Escrito en curated-products.ts");
}

main();
