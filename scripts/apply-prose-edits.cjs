#!/usr/bin/env node
/**
 * apply-prose-edits.cjs
 *
 * Aplica los cambios de tokenización de prosa propuestos por el workflow, con
 * guardrails determinísticos. NO confía ciegamente en el agente:
 *   - Solo aplica si el "esqueleto" de la línea (texto con precios y tokens
 *     normalizados a §) queda IDÉNTICO → garantiza que solo cambió precio↔token.
 *   - El productId del token debe existir y tener precio.
 *   - newLine debe contener el token del productId.
 *
 * Uso:  node scripts/apply-prose-edits.cjs <edits.json> [--dry-run]
 */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const GUIDES = path.join(ROOT, "src", "data", "guides.ts");
const PRODUCTS = path.join(ROOT, "src", "data", "curated-products.ts");
const editsPath = process.argv[2];
const DRY = process.argv.includes("--dry-run");

if (!editsPath) { console.error("Falta el archivo de edits."); process.exit(1); }
const edits = JSON.parse(fs.readFileSync(editsPath, "utf8"));

// Productos con precio (para validar el token)
const productsSrc = fs.readFileSync(PRODUCTS, "utf8");
const priced = new Set();
const ids = [...productsSrc.matchAll(/\bid:\s*['"](MLA\w+)['"]/g)];
for (let k = 0; k < ids.length; k++) {
  const id = ids[k][1], s = ids[k].index, e = k + 1 < ids.length ? ids[k + 1].index : productsSrc.length;
  if (/\bprice:\s*\d+/.test(productsSrc.slice(s, e))) priced.add(id);
}

const skeleton = (str) =>
  str.replace(/\$\d{1,3}(?:\.\d{3})+/g, "§").replace(/\{\{precio:[^}]+\}\}/g, "§");

const lines = fs.readFileSync(GUIDES, "utf8").split("\n");
const applied = [], rejected = [];

for (const e of edits) {
  const cur = lines[e.line - 1];
  const reason = (r) => rejected.push({ line: e.line, productId: e.productId, why: r });

  if (cur === undefined) { reason("línea inexistente"); continue; }
  if (!priced.has(e.productId)) { reason(`producto ${e.productId} no existe/sin precio`); continue; }
  if (!e.newLine.includes(`{{precio:${e.productId}`)) { reason("newLine no contiene el token del productId"); continue; }
  // Si la línea ya tiene tokens, deben preservarse intactos en newLine.
  const existing = cur.match(/\{\{precio:[^}]+\}\}/g) || [];
  if (existing.some((tok) => !e.newLine.includes(tok))) { reason("newLine no preserva un token existente de la línea"); continue; }
  if (skeleton(cur) !== skeleton(e.newLine)) { reason("el texto cambió además del precio (esqueleto distinto)"); continue; }

  lines[e.line - 1] = e.newLine;
  applied.push({ line: e.line, productId: e.productId, mode: e.mode });
}

console.log(`\n=== APLICAR EDITS DE PROSA ===`);
console.log(`Aplicados: ${applied.length}   |   Rechazados: ${rejected.length}\n`);
if (rejected.length) {
  console.log("RECHAZADOS por guardrail:");
  for (const r of rejected) console.log(`  L${r.line} ${r.productId} — ${r.why}`);
  console.log("");
}

if (DRY) { console.log("[dry-run] No se escribió nada."); process.exit(0); }
fs.writeFileSync(GUIDES, lines.join("\n"), "utf8");
console.log(`Escrito: src/data/guides.ts (${applied.length} líneas)`);
