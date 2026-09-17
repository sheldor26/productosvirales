#!/usr/bin/env node
/**
 * check-guide-monetization.cjs
 *
 * REGLA OBLIGATORIA: toda guía tiene que tener al menos UN camino de compra
 * real (product-card, quickPick, o link de afiliado/ficha), y ese camino tiene
 * que resolver de verdad: el producto existe en el catálogo y su affiliateUrl
 * no es un placeholder. Nació de una
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

// ── Segunda pasada: ninguna guía puede referenciar un producto cuyo
// affiliateUrl sea el placeholder (PEGAR_MELI_LA) o falte. Los CTAs de
// guías (quickPicks, product-cards, botones de GuideRenderer) usan
// affiliateUrl directo, así que un placeholder ahí sería un botón de compra
// roto en la página que más convierte. Chequearlo acá (build-time) es más
// seguro que un guard en runtime: falla el check antes de publicar, en vez
// de degradar el CTA en producción.
const PRODUCTS = path.join(ROOT, "src", "data", "curated-products.ts");
const productsSrc = fs.readFileSync(PRODUCTS, "utf8");
const urlByProduct = new Map();
for (const m of productsSrc.matchAll(
  /id:\s*['"`](MLA[UF]?\d+)['"`][\s\S]*?affiliateUrl:\s*['"`]([^'"`]*)['"`]/g
)) {
  // El primer affiliateUrl después de cada id pertenece a ese producto
  // (los campos van en ese orden en todas las fichas del catálogo).
  if (!urlByProduct.has(m[1])) urlByProduct.set(m[1], m[2]);
}

// Set aparte con TODOS los ids del catálogo. No se reusa `urlByProduct` porque
// esa parte exige que la ficha tenga `affiliateUrl`: una ficha sin ese campo
// quedaría fuera del Map y se reportaría como huérfana sin serlo.
const catalogIds = new Set();
for (const m of productsSrc.matchAll(/^\s*id:\s*['"`](MLA[UF]?\d+)['"`]/gm)) {
  catalogIds.add(m[1]);
}

const placeholderRefs = [];
const orphanRefs = [];
for (let i = 0; i < slugMatches.length; i++) {
  const slug = slugMatches[i][1];
  const start = slugMatches[i].index;
  const end = i + 1 < slugMatches.length ? slugMatches[i + 1].index : src.length;
  const block = src.slice(start, end);

  const pubMatch = block.match(/publishedDate:\s*[`"]([^`"]+)[`"]/);
  const pub = pubMatch ? pubMatch[1] : null;
  const isStaged = pub && pub > today;
  if (isStaged && !includeStaged) continue;

  const ids = new Set(block.match(/MLA[UF]?\d+/g) ?? []);
  for (const id of ids) {
    const url = urlByProduct.get(id);
    // Un id suelto en prosa que no está en el catálogo no es un CTA roto;
    // los huérfanos estructurales (productMlaId) se chequean abajo.
    if (url === undefined) continue;
    if (!url || url === "PEGAR_MELI_LA") {
      placeholderRefs.push({ slug, id, status: isStaged ? "staged" : "publicada" });
    }
  }

  // Todo `productMlaId` (quickPicks y bloques product-card) tiene que existir
  // en el catálogo. Si no existe, NADIE avisa: QuickPicks.tsx resuelve con
  // getProductById y descarta el pick con `.filter((p) => p.product)`, y
  // guides/ProductCard.tsx hace `if (!product) return null`. La guía renderiza
  // perfecta, sin error ni hueco visible, simplemente sin ese botón de compra.
  // Es la falla más cara posible justamente porque es invisible: si son los
  // únicos CTAs de la guía, queda publicada sin monetización y el check de
  // arriba no lo ve, porque la clave `quickPicks:` sigue estando ahí.
  for (const m of block.matchAll(/productMlaId:\s*['"`](MLA[UF]?\d+)['"`]/g)) {
    if (!catalogIds.has(m[1])) {
      orphanRefs.push({ slug, id: m[1], status: isStaged ? "staged" : "publicada" });
    }
  }
}

let failed = false;

if (broken.length === 0) {
  console.log("✓ Todas las guías tienen al menos un camino de compra (product-card, quickPick, o link).");
} else {
  failed = true;
  console.log(`✗ ${broken.length} guía(s) SIN ningún camino de compra (product-card, quickPick, ni link de afiliado/ficha):\n`);
  for (const b of broken) {
    console.log(`  [${b.status}] ${b.slug}  (publicada: ${b.pub})`);
  }
  console.log(`\nEsto es la regla obligatoria del repo: ninguna guía se publica sin al menos un botón de compra real.`);
  console.log(`Agregá un product-card, un quickPick, o un link de afiliado antes de publicar/mergear.`);
}

if (orphanRefs.length === 0) {
  console.log("✓ Todo productMlaId de quickPicks/product-cards existe en el catálogo.");
} else {
  failed = true;
  console.log(`✗ ${orphanRefs.length} referencia(s) productMlaId que NO existen en curated-products.ts:\n`);
  for (const r of orphanRefs) {
    console.log(`  [${r.status}] ${r.slug} → ${r.id}`);
  }
  console.log(`\nEstos picks se descartan en silencio al renderizar: la guía se ve bien pero pierde ese botón de compra.`);
  console.log(`Importá la ficha a curated-products.ts (docs/fichas.md) o sacá la referencia de la guía.`);
}

if (placeholderRefs.length === 0) {
  console.log("✓ Ninguna guía referencia productos con affiliateUrl placeholder o vacío.");
} else {
  failed = true;
  console.log(`✗ ${placeholderRefs.length} referencia(s) a productos con affiliateUrl placeholder/vacío:\n`);
  for (const r of placeholderRefs) {
    console.log(`  [${r.status}] ${r.slug} → ${r.id}`);
  }
  console.log(`\nCompletá el link meli.la real en curated-products.ts (o sacá el producto de la guía) antes de publicar.`);
}

process.exit(failed ? 1 : 0);
