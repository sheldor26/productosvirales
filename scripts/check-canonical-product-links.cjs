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
const BARE_LINK = /\/producto\/(MLAU?\d+)(?=[)"'`\s,.;])/g;

let found = 0;

for (const rel of FILES) {
  const lines = fs.readFileSync(path.join(ROOT, rel), "utf8").split("\n");
  lines.forEach((line, i) => {
    for (const m of line.matchAll(BARE_LINK)) {
      console.error(`${rel}:${i + 1}  /producto/${m[1]}`);
      found++;
    }
  });
}

if (found) {
  console.error(
    `\n✗ ${found} link(s) a la URL pelada de producto.\n` +
      `  Usá la canónica con slug: /producto/<titulo-slug>-<mlaid en minúscula>.\n` +
      `  El slug sale de productSlug() en src/lib/product-url.ts.`
  );
  process.exit(1);
}

console.log("✓ Todos los links internos de producto apuntan a la URL canónica.");
