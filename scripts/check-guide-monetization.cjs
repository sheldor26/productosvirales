#!/usr/bin/env node
/**
 * check-guide-monetization.cjs
 *
 * REGLA OBLIGATORIA: toda guía tiene que tener al menos UN camino de compra
 * real (product-card, quickPick, o link de afiliado/ficha). Nació de una
 * auditoría (2026-07) que encontró 18 guías publicadas, sumando 1.521
 * impresiones y 23 clicks en 28 días, sin ningún botón de compra: el
 * contenido rankea y atrae lectores, pero no puede generar ni un peso de
 * comisión porque no hay nada clickeable.
 *
 * Corre ANTES de publicar (parte del checklist de la skill optimizador-guias-pv,
 * Fase 4) y se puede sumar a CI. Sale con código 1 si encuentra alguna guía
 * sin monetización, para que sea imposible que pase desapercibido.
 *
 * Uso:  node scripts/check-guide-monetization.cjs
 *       node scripts/check-guide-monetization.cjs --include-staged=false   (default: true)
 */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const GUIDES = path.join(ROOT, "src", "data", "guides.ts");
const src = fs.readFileSync(GUIDES, "utf8");

const today = new Date().toISOString().slice(0, 10);
const includeStaged = process.argv.includes("--include-staged=false") ? false : true;

const slugMatches = [...src.matchAll(/slug:\s*[`"]([^`"]+)[`"]/g)];
const broken = [];

for (let i = 0; i < slugMatches.length; i++) {
  const slug = slugMatches[i][1];
  const start = slugMatches[i].index;
  const end = i + 1 < slugMatches.length ? slugMatches[i + 1].index : src.length;
  const block = src.slice(start, end);

  const pubMatch = block.match(/publishedDate:\s*[`"]([^`"]+)[`"]/);
  const pub = pubMatch ? pubMatch[1] : null;
  const isStaged = pub && pub > today;
  if (isStaged && !includeStaged) continue;

  const hasProductCard = /type:\s*[`"]product-card[`"]/.test(block);
  const hasQuickPicks = /quickPicks:/.test(block);
  const hasBuyLink = /meli\.la\/|\/producto\/[a-z0-9-]/.test(block);

  if (!hasProductCard && !hasQuickPicks && !hasBuyLink) {
    broken.push({ slug, status: isStaged ? "staged" : "publicada", pub });
  }
}

if (broken.length === 0) {
  console.log("✓ Todas las guías tienen al menos un camino de compra (product-card, quickPick, o link).");
  process.exit(0);
}

console.log(`✗ ${broken.length} guía(s) SIN ningún camino de compra (product-card, quickPick, ni link de afiliado/ficha):\n`);
for (const b of broken) {
  console.log(`  [${b.status}] ${b.slug}  (publicada: ${b.pub})`);
}
console.log(`\nEsto es la regla obligatoria del repo: ninguna guía se publica sin al menos un botón de compra real.`);
console.log(`Agregá un product-card, un quickPick, o un link de afiliado antes de publicar/mergear.`);
process.exit(1);
