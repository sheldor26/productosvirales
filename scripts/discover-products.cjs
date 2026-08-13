#!/usr/bin/env node

/**
 * Arma docs/ideas-productos-nuevos.md a partir de paginas de categoria/
 * bestsellers scrapeadas con Web Unlocker (Bright Data, zone mcp_unlocker,
 * formato markdown). No toca el catalogo — es un generador de ideas para
 * detectar productos nuevos o tendencias antes de agregarlos a mano.
 *
 * Uso:
 *   node scripts/discover-products.cjs <source: amazon|ml> <label> <pagina.md>
 */

const fs = require("fs");
const path = require("path");

const REPORT_PATH = path.resolve("docs/ideas-productos-nuevos.md");
const TOP_N = 15;

const REPORT_INTRO = `# Ideas de productos nuevos

> Productos vistos en páginas de categoría/bestsellers de Amazon y
> MercadoLibre, de la corrida semanal automática. Generador de ideas — no
> toca el catálogo. Entradas nuevas arriba.

`;

function usage() {
  console.log(`Uso:
  node scripts/discover-products.cjs <source: amazon|ml> <label> <pagina.md>`);
}

// Amazon: bloques tipo
//   [Titulo corto](link)
//   [Titulo completo](link)
//   [4.6 out of 5 stars 471,708](link)
//   [$14.00](link)
function parseAmazon(text) {
  const items = [];
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  for (let i = 0; i < lines.length; i++) {
    const priceMatch = lines[i].match(/\$([\d,]+\.\d{2})/);
    if (!priceMatch) continue;
    // Buscar hacia atras el rating y el titulo mas cercano.
    let rating = null;
    let title = null;
    for (let j = i - 1; j >= Math.max(0, i - 6); j--) {
      const ratingMatch = lines[j].match(/([\d.]+) out of 5 stars ([\d,]+)/);
      if (ratingMatch && !rating) rating = `${ratingMatch[1]}★ (${ratingMatch[2]} reseñas)`;
      const titleMatch = lines[j].match(/^\[?([^[\]]{15,220})\]?\(/) || lines[j].match(/^([^[\]]{15,220})$/);
      if (titleMatch && !title && !/out of 5 stars|^\$/.test(lines[j])) {
        title = titleMatch[1].trim();
      }
      if (title && rating) break;
    }
    if (title) {
      items.push({ title, price: `US$${priceMatch[1]}`, rating });
    }
  }
  return items;
}

// MercadoLibre: bloques tipo
//   Titulo (linea plana, se repite como link despues)
//
// Ademas del titulo y el precio se captura la URL del producto. Sin eso el
// reporte servia para tener ideas pero no para sourcear: habia que salir a
// buscar cada ficha a mano, y las busquedas web devuelven listados, no fichas.
// Con la URL, el reporte alimenta directo al "Scraper puntual".
//   SELLER N.N
//   N% OFF $precio_original   (opcional)
//   $precio_final
function parseML(text) {
  const items = [];
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  // Mapa titulo -> URL, armado con los links markdown de toda la pagina.
  const urlPorTitulo = new Map();
  for (const m of text.matchAll(/\[([^\]]{15,150})\]\((https:\/\/[^)\s]*mercadolibre[^)\s]*)\)/g)) {
    const t = m[1].trim();
    if (!urlPorTitulo.has(t)) urlPorTitulo.set(t, m[2]);
  }
  for (let i = 0; i < lines.length; i++) {
    const priceMatch = lines[i].match(/^\$([\d.]+)$/);
    if (!priceMatch) continue;
    let title = null;
    let discount = null;
    for (let j = i - 1; j >= Math.max(0, i - 5); j--) {
      const discountMatch = lines[j].match(/(\d+)% OFF/);
      if (discountMatch && !discount) discount = `${discountMatch[1]}% OFF`;
      const looksLikeSellerRating = /^.{2,45}\s\d\.\d$/.test(lines[j]);
      const looksLikeJunk = /Otra opci[oó]n de compra|^\[|OFF|Envío|cuotas|^\$/.test(lines[j]);
      if (!title && lines[j].length > 15 && lines[j].length < 150 && !looksLikeSellerRating && !looksLikeJunk) {
        title = lines[j].replace(/^\d+\\?\.\s*/, "").replace(/^\[|\]$/g, "");
      }
      if (title) break;
    }
    if (title) {
      const url = urlPorTitulo.get(title) || null;
      // Las URLs de catalogo traen /p/MLA123 y las de articulo MLA-123: el
      // guion se saca para que el id quede igual al del catalogo.
      const idCrudo = url ? (url.match(/(MLA-?[A-Z]?\d+)/i) || [])[1] : null;
      const id = idCrudo ? idCrudo.toUpperCase().replace("-", "") : null;
      items.push({ title, price: `$${priceMatch[1]}`, rating: discount, url, id });
    }
  }
  return items;
}

function dedupe(items) {
  const seen = new Set();
  const out = [];
  for (const it of items) {
    if (seen.has(it.title)) continue;
    seen.add(it.title);
    out.push(it);
  }
  return out;
}

function buildSection(source, label, items) {
  const unique = dedupe(items).slice(0, TOP_N);
  const lines = unique.map((it) => {
    const base = `- ${it.title} — ${it.price}${it.rating ? ` (${it.rating})` : ""}`;
    return it.url ? `${base}\n  - ${it.url}` : base;
  });
  return `### ${label} [${source}] (${unique.length} productos)\n\n${lines.join("\n") || "_No se pudo extraer nada esta vez — revisar el parser._"}\n\n`;
}

function appendToReport(source, label, items, today) {
  const existing = fs.existsSync(REPORT_PATH) ? fs.readFileSync(REPORT_PATH, "utf8") : REPORT_INTRO;
  const section = buildSection(source, label, items);

  const todayHeader = `## ${today}\n\n`;
  const todayIdx = existing.indexOf(todayHeader);

  let next;
  if (todayIdx !== -1) {
    const insertAt = todayIdx + todayHeader.length;
    next = existing.slice(0, insertAt) + section + existing.slice(insertAt);
  } else {
    const firstSectionIdx = existing.indexOf("\n## ");
    const newBlock = todayHeader + section;
    next =
      firstSectionIdx === -1
        ? existing.trimEnd() + "\n\n" + newBlock
        : existing.slice(0, firstSectionIdx + 1) + newBlock + existing.slice(firstSectionIdx + 1);
  }
  fs.writeFileSync(REPORT_PATH, next);
}

function main() {
  const [source, label, mdPath] = process.argv.slice(2);
  if (!source || !label || !mdPath) {
    usage();
    process.exit(1);
  }
  const text = fs.readFileSync(mdPath, "utf8");
  const items = source === "amazon" ? parseAmazon(text) : parseML(text);

  const today = new Date().toISOString().slice(0, 10);
  appendToReport(source, label, items, today);
  console.log(`"${label}" [${source}]: ${dedupe(items).length} productos agregados a docs/ideas-productos-nuevos.md`);
}

main();
