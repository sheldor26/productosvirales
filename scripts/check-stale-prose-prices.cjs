#!/usr/bin/env node
/**
 * check-stale-prose-prices.cjs
 *
 * Detecta precios ESCRITOS A MANO en la prosa de las guías (no tokens) que ya
 * no coinciden con el precio actual del producto en curated-products.ts.
 *
 * Nació de una auditoría (2026-07) que encontró ~24 precios absolutos
 * desactualizados (algunos hasta 35% por debajo del precio real) escondidos en
 * tablas, product-cards y prosa de guías nunca revisadas desde que se
 * escribieron. La causa raíz: un precio tipeado a mano nunca se entera de que
 * el producto subió o bajó. La solución de fondo es tokenizar ({{precio:ID}}
 * o {{precio:ID:k}}); este script es la red de seguridad que detecta cuando
 * ALGUIEN (humano o Claude) escribió un precio a mano en vez de un token, y
 * ese precio ya quedó viejo.
 *
 * Solo compara líneas con EXACTAMENTE un precio ($NNN.NNN) y EXACTAMENTE un
 * producto resoluble en esa misma línea (via link meli.la o id MLA). Excluye:
 *   - líneas que ya usan un token ({{precio...}})
 *   - CLAIMS DE DELTA ("$X más caro", "$X menos", "$X más barata que..."): ahí
 *     el número no es el precio absoluto del producto linkeado sino una
 *     diferencia frente a OTRO producto (a veces ni siquiera el linkeado es el
 *     sujeto de la frase). Para esos casos usar el token {{preciodif:A:B}}
 *     (ver src/lib/price-token.ts), no este chequeo.
 *   - tramos con notación $K ($120K–$250K, frágil por diseño)
 *   - claims comparativos/superlativos ("el más caro", "tope de gama"...)
 *
 * No escribe nada (a diferencia de migrate-prose-price-tokens.cjs, que sí
 * tokeniza). Este script es de DETECCIÓN continua: correrlo antes de publicar
 * o optimizar una guía para no arrastrar precios viejos sin darse cuenta.
 * Sale con código 1 si encuentra alguno por encima del umbral.
 *
 * Uso:
 *   node scripts/check-stale-prose-prices.cjs                  # todo el archivo
 *   node scripts/check-stale-prose-prices.cjs --threshold 5    # umbral en % (default 3)
 *   node scripts/check-stale-prose-prices.cjs --from 100 --to 500   # rango de líneas
 */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const G_PATH = path.join(ROOT, "src", "data", "guides.ts");
const P_PATH = path.join(ROOT, "src", "data", "curated-products.ts");

const arg = (name, def) => {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? Number(process.argv[i + 1]) : def;
};
const FROM = arg("from", 1);
const THRESHOLD = arg("threshold", 3);

const productsSrc = fs.readFileSync(P_PATH, "utf8");
const codeToId = new Map();
const idToPrice = new Map();
// El precio de lista (originalPrice) también aparece a mano en la prosa: "el
// cartel dice 66% off, pero parte de un precio de lista ($150.000)". Ese número
// NO tiene que coincidir con `price`; compararlo contra el precio actual daba
// un -66% falso. Si lo escrito es exactamente el originalPrice de hoy, está al
// día por definición, y si mañana cambia el de lista el chequeo vuelve a saltar.
const idToOriginal = new Map();
const idMatches = [...productsSrc.matchAll(/\bid:\s*['"](MLA\w+)['"]/g)];
for (let k = 0; k < idMatches.length; k++) {
  const id = idMatches[k][1];
  const s = idMatches[k].index;
  const e = k + 1 < idMatches.length ? idMatches[k + 1].index : productsSrc.length;
  const slice = productsSrc.slice(s, e);
  const pm = slice.match(/\bprice:\s*(\d+)/);
  if (pm) idToPrice.set(id, Number(pm[1]));
  const om = slice.match(/\boriginalPrice:\s*(\d+)/);
  if (om) idToOriginal.set(id, Number(om[1]));
  let cm;
  const codeRe = /meli\.la\/(\w+)/g;
  while ((cm = codeRe.exec(slice)) !== null) codeToId.set(cm[1], id);
}

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

const PRICE_RE = /\$\d{1,3}(?:\.\d{3})+/g;
const COMPARATIVE_RE =
  /más del doble|el más caro|la más cara|el robot más caro|más caro que|más cara que|el más barat|la más barat|el de más|tope de gama|premium más|lejísimos|abismo|doble que|más que la|menos que la|Entrada \(|Medio \(|Premium \(|más caro del|más barato del|más cara del|más barata del/i;

const guidesLines = fs.readFileSync(G_PATH, "utf8").split("\n");
const TO = arg("to", guidesLines.length);

const stale = [];
let skippedDelta = 0;

for (let i = FROM - 1; i < TO && i < guidesLines.length; i++) {
  const line = guidesLines[i];
  if (line.includes("{{precio")) continue;
  const prices = line.match(PRICE_RE);
  if (!prices) continue;
  if (/\$\d+\s*[Kk]\b/.test(line)) continue;
  if (COMPARATIVE_RE.test(line)) continue;

  const ids = resolveIds(line);
  if (prices.length !== 1 || ids.length !== 1) continue;

  const priceStr = prices[0];
  const idx = line.indexOf(priceStr);
  const after = line.slice(idx + priceStr.length, idx + priceStr.length + 20);
  const isDelta = /^\s*(más|menos)\b/i.test(after) || /a ciegas|de diferencia/.test(line);
  if (isDelta) {
    skippedDelta++;
    continue;
  }
  // Precio POR UNIDAD ("$5.312 el litro", "cuesta por litro con $5.312"): es un
  // cociente, no el precio del producto. Compararlo contra `price` daba un
  // +13.000% falso apenas la línea tenía un ID resoluble. La unidad puede ir
  // después del monto o antes ("menos cuesta por litro con $5.312").
  const UNIDAD = "(?:litro|kilo|kg|gramo|metro|m2|m²|unidad|estante|calor[ií]a|plaza|persona|mes|d[ií]a)";
  const before = line.slice(Math.max(0, idx - 30), idx);
  if (
    new RegExp(`^\\s*(?:el|por|la|cada)\\s+${UNIDAD}\\b`, "i").test(after) ||
    new RegExp(`\\b(?:por|el|cada)\\s+${UNIDAD}\\b[^$]{0,12}$`, "i").test(before)
  ) {
    skippedDelta++;
    continue;
  }

  const id = ids[0];
  const written = Number(priceStr.replace(/\D/g, ""));
  const current = idToPrice.get(id);
  if (!current || !written) continue;
  if (idToOriginal.get(id) === written) continue; // es el precio de lista, no el actual

  const diffPct = ((current - written) / written) * 100;
  if (Math.abs(diffPct) >= THRESHOLD) {
    stale.push({ ln: i + 1, written, current, diffPct, id, snippet: line.trim().slice(0, 110) });
  }
}

console.log(`=== Precios en prosa vs. precio actual (umbral ${THRESHOLD}%, líneas ${FROM}-${TO}) ===`);
console.log(`Deltas ignorados (usan {{preciodif:A:B}}, no este chequeo): ${skippedDelta}\n`);

if (stale.length === 0) {
  console.log("✓ Ningún precio hardcodeado está desactualizado por encima del umbral.");
  process.exit(0);
}

console.log(`✗ ${stale.length} precio(s) hardcodeados desactualizados:\n`);
for (const s of stale) {
  const sign = s.diffPct > 0 ? "+" : "";
  console.log(`  L${s.ln}  escrito=$${s.written.toLocaleString("es-AR")}  actual=$${s.current.toLocaleString("es-AR")}  (${sign}${s.diffPct.toFixed(1)}%)  ${s.id}`);
  console.log(`       ${s.snippet}`);
}
console.log(`\nTokenizá estos precios ({{precio:${stale[0].id}}}) o actualizá el número a mano antes de publicar.`);
process.exit(1);
