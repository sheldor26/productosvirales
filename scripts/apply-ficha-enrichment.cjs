#!/usr/bin/env node
/**
 * apply-ficha-enrichment.cjs
 *
 * Inserta los campos ricos (seoTitle, metaDescription, verdict, pros, cons,
 * articleBody, faq, extraSpecs) producidos por el workflow de enriquecimiento
 * dentro de cada bloque de producto en curated-products.ts.
 *
 * Seguro: salta cualquier producto que YA tenga verdict/articleBody (no pisa).
 * Solo agrega campos; no toca los existentes.
 *
 * Uso: node scripts/apply-ficha-enrichment.cjs <fichas.json> [--dry-run]
 */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const FILE = path.join(ROOT, "src", "data", "curated-products.ts");
const fichasPath = process.argv[2];
const DRY = process.argv.includes("--dry-run");
if (!fichasPath) { console.error("Falta el archivo de fichas."); process.exit(1); }

const fichas = JSON.parse(fs.readFileSync(fichasPath, "utf8"));
const j = (s) => JSON.stringify(s ?? "");
const safeBody = (s) => String(s || "").replace(/`/g, "'").replace(/\$\{/g, "$ {");

function fieldLines(f) {
  const L = [];
  if (f.seoTitle) L.push(`    seoTitle: ${j(f.seoTitle)},`);
  if (f.metaDescription) L.push(`    metaDescription: ${j(f.metaDescription)},`);
  if (f.verdict) L.push(`    verdict: ${j(f.verdict)},`);
  if (Array.isArray(f.pros) && f.pros.length) {
    L.push(`    pros: [`);
    f.pros.forEach((p) => L.push(`      ${j(p)},`));
    L.push(`    ],`);
  }
  if (Array.isArray(f.cons) && f.cons.length) {
    L.push(`    cons: [`);
    f.cons.forEach((c) => L.push(`      ${j(c)},`));
    L.push(`    ],`);
  }
  if (f.articleBody) L.push(`    articleBody: \`${safeBody(f.articleBody)}\`,`);
  if (Array.isArray(f.faq) && f.faq.length) {
    L.push(`    faq: [`);
    f.faq.forEach((q) => {
      L.push(`      {`);
      L.push(`        question: ${j(q.question)},`);
      L.push(`        answer: ${j(q.answer)},`);
      L.push(`      },`);
    });
    L.push(`    ],`);
  }
  return L;
}

let applied = 0, skipped = [];

for (const f of fichas) {
  if (!f || !f.id) continue;
  let lines = fs.readFileSync.__cache || null; // noop placeholder
  const src = fs.readFileSync(FILE, "utf8").split("\n");
  // localizar el bloque
  const idLine = src.findIndex((l) => l.trim() === `id: "${f.id}",` || l.trim() === `id: '${f.id}',`);
  if (idLine === -1) { skipped.push(`${f.id} (no encontrado)`); continue; }
  let closeIdx = -1;
  for (let i = idLine + 1; i < src.length; i++) { if (src[i] === "  },") { closeIdx = i; break; } }
  if (closeIdx === -1) { skipped.push(`${f.id} (sin cierre)`); continue; }
  const block = src.slice(idLine, closeIdx).join("\n");
  if (/\b(verdict|articleBody):/.test(block)) { skipped.push(`${f.id} (ya enriquecida)`); continue; }

  const newLines = fieldLines(f);

  // extraSpecs: insertar antes del cierre del array specs, si existe
  if (Array.isArray(f.extraSpecs) && f.extraSpecs.length) {
    let specsClose = -1;
    for (let i = idLine + 1; i < closeIdx; i++) {
      if (src[i].trim() === "specs: [") {
        for (let k = i + 1; k < closeIdx; k++) { if (src[k].trim() === "],") { specsClose = k; break; } }
        break;
      }
    }
    if (specsClose !== -1) {
      const specLines = f.extraSpecs.map((s) => `      { label: ${j(s.label)}, value: ${j(s.value)} },`);
      src.splice(specsClose, 0, ...specLines);
      if (specsClose <= closeIdx) closeIdx += specLines.length;
    }
  }

  src.splice(closeIdx, 0, ...newLines);
  if (!DRY) fs.writeFileSync(FILE, src.join("\n"), "utf8");
  applied++;
}

console.log(`\n=== ENRIQUECIMIENTO DE FICHAS ===`);
console.log(`Aplicadas: ${applied} / ${fichas.length}`);
if (skipped.length) { console.log(`Salteadas:`); skipped.forEach((s) => console.log(`  ${s}`)); }
if (DRY) console.log(`\n[dry-run] (igual se reescribió por simplicidad de re-lectura; usar git para revertir si hace falta)`);
