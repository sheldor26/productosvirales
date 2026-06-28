#!/usr/bin/env node
/**
 * check-price-tokens.cjs
 *
 * Valida los tokens de precio en vivo ({{precio:MLA…}}) de las guías:
 * cada token tiene que apuntar a un producto que exista en curated-products.ts
 * y tenga precio. Si alguno está roto, sale con código 1 (para CI / pre-publish).
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

// Todos los tokens {{precio:ID}} o {{precio:ID:k}} usados en las guías.
const tokenRe = /\{\{\s*precio:([A-Za-z0-9]+)(?::(k))?\s*\}\}/g;
const used = [];
let tm;
while ((tm = tokenRe.exec(guidesSrc)) !== null) {
  used.push(tm[1]);
}

const broken = [...new Set(used)].filter((id) => !priced.has(id));

console.log(`Tokens de precio encontrados: ${used.length} (${new Set(used).size} productos distintos)`);

if (broken.length > 0) {
  console.error(`\n✖ ${broken.length} token(s) apuntan a productos inexistentes o sin precio:`);
  for (const id of broken) console.error(`   {{precio:${id}}}`);
  console.error(`\nRevisá el ID o el producto en curated-products.ts.`);
  process.exit(1);
}

console.log("✓ Todos los tokens de precio son válidos.");
