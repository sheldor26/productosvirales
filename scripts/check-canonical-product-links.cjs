#!/usr/bin/env node
/**
 * check-canonical-product-links.cjs
 *
 * REGLA: todo link interno a una ficha va a la URL canónica con slug
 * (`/producto/freidora-de-aire-atma-...-mla39861162`), nunca a la forma pelada
 * `/producto/MLA39861162`.
 *
 * Por qué importa: la URL pelada existe y resuelve, pero la ruta está
 * prerenderizada, así que el redirect a la canónica sale como meta-refresh
 * dentro de un HTTP 200. Para un crawler eso no es un redirect: es una página
 * más, sin H1 y sin contenido. Cada link interno a esa forma le suma a Google
 * una página basura que compite con la ficha real.
 *
 * Uso:  node scripts/check-canonical-product-links.cjs
 */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const FILES = ["src/data/guides.ts", "src/data/curated-products.ts"];
const PRODUCTS = path.join(ROOT, "src/data/curated-products.ts");
const BARE_LINK = /\/producto\/(MLAU?\d+)(?=[)"'`\s,.;])/g;
// Link con slug: hay que validar que el slug sea EXACTAMENTE el que genera
// productSlug(). Un slug distinto resuelve igual (la página parsea el ID del
// final y redirige), pero con el mismo costo que la URL pelada: un salto de
// más para el crawler en cada link interno. Ya pasó: 21 links de las guías de
// verano tenían el título cortado a mano en el lugar equivocado.
const SLUG_LINK = /\/producto\/([a-z0-9-]+)-(mlau?\d+)(?=[)"'`\s,.;])/g;

// productSlug() de src/lib/product-url.ts, replicado. Si cambia allá, cambia acá.
const SLUG_MAX_LENGTH = 80;
function slugifyTitle(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_MAX_LENGTH)
    .replace(/-+$/, "");
}

// Título por ID. Se corta por bloque de producto para no cruzar de una ficha a
// la siguiente, y se aceptan comillas simples y dobles: el catálogo tiene las dos.
const canonSlug = {};
{
  const src = fs.readFileSync(PRODUCTS, "utf8");
  const pos = [];
  const idRe = /^ {4}id: ['"]([^'"]+)['"],/gm;
  let m;
  while ((m = idRe.exec(src)) !== null) pos.push({ id: m[1], at: m.index });
  for (let i = 0; i < pos.length; i++) {
    const hasta = i + 1 < pos.length ? pos[i + 1].at : src.length;
    const bloque = src.slice(pos[i].at, hasta);
    const t = bloque.match(/\btitle: (?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)')/);
    if (!t) continue;
    const title = (t[1] !== undefined ? t[1] : t[2]).replace(/\\(['"])/g, "$1");
    canonSlug[pos[i].id] = `${slugifyTitle(title)}-${pos[i].id.toLowerCase()}`;
  }
}

let bare = 0;
let wrongSlug = 0;

for (const rel of FILES) {
  const lines = fs.readFileSync(path.join(ROOT, rel), "utf8").split("\n");
  lines.forEach((line, i) => {
    for (const m of line.matchAll(BARE_LINK)) {
      console.error(`${rel}:${i + 1}  /producto/${m[1]}`);
      bare++;
    }
    for (const m of line.matchAll(SLUG_LINK)) {
      const esperado = canonSlug[m[2].toUpperCase()];
      // Sin ficha no hay contra qué comparar: eso lo cubre check-price-tokens.
      if (!esperado || esperado === `${m[1]}-${m[2]}`) continue;
      console.error(`${rel}:${i + 1}\n   tiene: ${m[1]}-${m[2]}\n   canónica: ${esperado}`);
      wrongSlug++;
    }
  });
}

if (bare || wrongSlug) {
  if (bare) {
    console.error(
      `\n✗ ${bare} link(s) a la URL pelada de producto.\n` +
        `  Usá la canónica con slug: /producto/<titulo-slug>-<mlaid en minúscula>.`
    );
  }
  if (wrongSlug) {
    console.error(
      `\n✗ ${wrongSlug} link(s) con slug distinto al canónico.\n` +
        `  Cada uno le cuesta un redirect al crawler. Copiá la canónica de arriba.`
    );
  }
  console.error(`  El slug sale de productSlug() en src/lib/product-url.ts.`);
  process.exit(1);
}

console.log("✓ Todos los links internos de producto apuntan a la URL canónica.");
