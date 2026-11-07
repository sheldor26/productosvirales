#!/usr/bin/env node

/**
 * Arma el snippet de JS para el chequeo diario de stock de productos caros
 * (>$200.000, pedido por Juan 2026-11-07, ver docs/productos-sin-stock.md).
 *
 * No llama a ninguna API: solo lee el catalogo local y genera el texto que
 * hay que pegar en una pestaña de mercadolibre.com.ar logueada (Chrome real
 * de Juan) via mcp__claude-in-chrome__javascript_tool. De ahi en mas, lanzar
 * el loop de fetch en la propia pestana (ver receta completa en
 * docs/productos-sin-stock.md).
 *
 * Uso:
 *   node scripts/list-productos-caros.cjs [--min-price 200000]
 *
 * Imprime por stdout un bloque listo para pegar que define
 * window.__productos (id/path, mismo origen) y window.__articulos
 * (id/url absoluta, para los MLA de articulo.mercadolibre.com.ar, otro
 * subdominio — se fetchean aparte).
 */

const fs = require("fs");
const path = require("path");

const CATALOG_PATH = path.resolve("src/data/curated-products.ts");

const argv = process.argv.slice(2);
function flag(name, fallback) {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : fallback;
}
const MIN_PRICE = Number(flag("--min-price", "200000"));

function get(block, prop) {
  const m = block.match(new RegExp(`(?:^|\\n)\\s*${prop}:\\s*['"\`]([^'"\`]*)['"\`]`));
  return m ? m[1] : "";
}
function getPrice(block) {
  const m = block.match(/(?:^|\n)\s*price:\s*(?:['"`]([^'"`]*)['"`]|(\d+(?:\.\d+)?))/);
  if (!m) return NaN;
  return Number(m[1] ?? m[2]);
}

// Mismo criterio que docs/productos-sin-stock.md: el tipo real sale del
// permalink, no del prefijo del id. /up/ y /p/ son mismo origen
// (mercadolibre.com.ar) y entran en window.__productos; articulo.mercado...
// es otro subdominio, va aparte en window.__articulos.
function clasificar(permalink) {
  const up = permalink.match(/\/up\/(MLAU?\d+)/i);
  if (up) return { kind: "up", path: "/up/" + up[1].toUpperCase() };
  const cat = permalink.match(/\/p\/(MLA\d+)/i);
  if (cat) return { kind: "p", path: "/p/" + cat[1].toUpperCase() };
  return { kind: "articulo", path: null };
}

function main() {
  const src = fs.readFileSync(CATALOG_PATH, "utf8");
  const blocks = src.split(/\n(?:  \{|const \w+: Product = \{)\n/).slice(1);

  const productos = [];
  const articulos = [];
  for (const b of blocks) {
    const price = getPrice(b);
    const visibility = get(b, "visibility") || "normal";
    const permalink = get(b, "permalink");
    if (!(price > MIN_PRICE) || !permalink || visibility !== "normal") continue;
    const id = get(b, "id");
    const { kind, path: p } = clasificar(permalink);
    if (kind === "articulo") articulos.push({ id, url: permalink });
    else productos.push({ id, path: p });
  }

  console.error(`${productos.length} productos (mismo origen) + ${articulos.length} de articulo.mercadolibre.com.ar, precio > ${MIN_PRICE}`);
  console.error(`(los de articulo.mercadolibre.com.ar son otro subdominio: fetchealos aparte, no entran en el loop de abajo)`);
  console.log(
    `window.__productos = ${JSON.stringify(productos)};\n` +
      `window.__articulos = ${JSON.stringify(articulos)};\n` +
      `"cargado: " + window.__productos.length + " + " + window.__articulos.length + " articulo";`
  );
}

main();
