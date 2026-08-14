#!/usr/bin/env node
/**
 * check-price-tokens.cjs
 *
 * Valida los tokens de precio en vivo ({{precio:MLA…}} y {{preciodif:A:B}}) de
 * las guías: cada token tiene que apuntar a producto(s) que existan en
 * curated-products.ts y tengan precio. Si alguno está roto, sale con código 1
 * (para CI / pre-publish).
 *
 * Uso:  node scripts/check-price-tokens.cjs
 */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const GUIDES = path.join(ROOT, "src", "data", "guides.ts");
const PRODUCTS = path.join(ROOT, "src", "data", "curated-products.ts");

const guidesSrc = fs.readFileSync(GUIDES, "utf8");
const productsSrc = fs.readFileSync(PRODUCTS, "utf8");

// IDs de producto que tienen precio > 0 (misma lógica de parseo que el backfill).
const priced = new Set();
const prodRe = /id:\s*['"]([^'"]+)['"][\s\S]*?\bprice:\s*(\d+)/g;
let pm;
while ((pm = prodRe.exec(productsSrc)) !== null) {
  if (Number(pm[2]) > 0) priced.add(pm[1]);
}

// Para reviews/rating hace falta cortar por bloque de producto: un regex lazy
// como el de arriba puede cruzar de un producto al siguiente si al primero le
// falta el campo, y ahí valida un token contra el dato del vecino.
const withReviews = new Set();
const withRating = new Set();
{
  const posiciones = [];
  const idRe = /^    id: ['"]([^'"]+)['"],/gm;
  let m;
  while ((m = idRe.exec(productsSrc)) !== null) posiciones.push({ id: m[1], at: m.index });
  for (let i = 0; i < posiciones.length; i++) {
    const hasta = i + 1 < posiciones.length ? posiciones[i + 1].at : productsSrc.length;
    const bloque = productsSrc.slice(posiciones[i].at, hasta);
    // Los campos pueden venir en su propia linea o compartida
    // (`rating: 4.1, reviewCount: 48,`): matchear por palabra, no por columna.
    const rc = bloque.match(/\breviewCount: *(\d+)/);
    const rt = bloque.match(/\brating: *([\d.]+)/);
    if (rc && Number(rc[1]) > 0) withReviews.add(posiciones[i].id);
    if (rt && Number(rt[1]) > 0) withRating.add(posiciones[i].id);
  }
}

// Todos los tokens {{precio:ID}} o {{precio:ID:k}} usados en las guías.
const tokenRe = /\{\{\s*precio:([A-Za-z0-9]+)(?::(k))?\s*\}\}/g;
const used = [];
let tm;
while ((tm = tokenRe.exec(guidesSrc)) !== null) {
  used.push(tm[1]);
}

// Tokens de diferencia {{preciodif:A:B}} — los dos IDs tienen que tener precio.
const diffRe = /\{\{\s*preciodif:([A-Za-z0-9]+):([A-Za-z0-9]+)\s*\}\}/g;
const usedPairs = [];
let dm;
while ((dm = diffRe.exec(guidesSrc)) !== null) {
  usedPairs.push([dm[1], dm[2]]);
}

// Tokens de prueba social {{reviews:ID}} y {{rating:ID}}.
// Se buscan en los DOS archivos: las fichas también los usan en articleBody,
// pros, description y verdict, que pasan por injectLivePrices en la página de
// producto. Antes solo se miraba guides.ts, así que un token roto dentro de una
// ficha pasaba el chequeo y salía crudo en producción.
function recolectar(re) {
  const out = [];
  for (const src of [guidesSrc, productsSrc]) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(src)) !== null) out.push(m[1]);
  }
  return out;
}
const usedReviews = recolectar(/\{\{\s*reviews:([A-Za-z0-9]+)\s*\}\}/g);
const usedRating = recolectar(/\{\{\s*rating:([A-Za-z0-9]+)\s*\}\}/g);

const broken = [...new Set(used)].filter((id) => !priced.has(id));
const brokenPairs = usedPairs.filter(([a, b]) => !priced.has(a) || !priced.has(b));
const brokenReviews = [...new Set(usedReviews)].filter((id) => !withReviews.has(id));
const brokenRating = [...new Set(usedRating)].filter((id) => !withRating.has(id));

console.log(`Tokens de precio encontrados: ${used.length} (${new Set(used).size} productos distintos)`);
console.log(`Tokens de diferencia encontrados: ${usedPairs.length}`);
console.log(`Tokens de reseñas encontrados: ${usedReviews.length} | de rating: ${usedRating.length}`);

if (brokenReviews.length > 0 || brokenRating.length > 0) {
  if (brokenReviews.length > 0) {
    console.error(`\n✖ ${brokenReviews.length} token(s) {{reviews:ID}} sin reviewCount en el catálogo:`);
    for (const id of brokenReviews) console.error(`   {{reviews:${id}}}`);
  }
  if (brokenRating.length > 0) {
    console.error(`\n✖ ${brokenRating.length} token(s) {{rating:ID}} sin rating en el catálogo:`);
    for (const id of brokenRating) console.error(`   {{rating:${id}}}`);
  }
  console.error(`\nRevisá el/los ID en curated-products.ts.`);
  process.exit(1);
}

if (broken.length > 0 || brokenPairs.length > 0) {
  if (broken.length > 0) {
    console.error(`\n✖ ${broken.length} token(s) {{precio:ID}} apuntan a productos inexistentes o sin precio:`);
    for (const id of broken) console.error(`   {{precio:${id}}}`);
  }
  if (brokenPairs.length > 0) {
    console.error(`\n✖ ${brokenPairs.length} token(s) {{preciodif:A:B}} con algún ID inexistente o sin precio:`);
    for (const [a, b] of brokenPairs) console.error(`   {{preciodif:${a}:${b}}}`);
  }
  console.error(`\nRevisá el/los ID en curated-products.ts.`);
  process.exit(1);
}

console.log("✓ Todos los tokens de precio son válidos.");
