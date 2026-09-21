#!/usr/bin/env npx tsx
/**
 * Genera src/data/product-slug-map.json: un mapa liviano { MLA_ID: slug_canonico }
 * a partir del catálogo completo (curated-products.ts, ~7.5MB, pesado para Proxy).
 *
 * Lo consume proxy.ts para redirigir en el servidor (308 real) cualquier request a
 * /producto/<slug-viejo>-MLA... hacia /producto/<slug-actual>-MLA..., sin necesitar
 * importar el catálogo completo ahí.
 *
 * Se corre antes de build/dev (ver "predev"/"prebuild" en package.json) para que el
 * mapa nunca quede desactualizado contra los títulos actuales del catálogo.
 */
import * as fs from "fs";
import * as path from "path";
import { curatedProducts } from "../src/data/curated-products";
import { productSlug } from "../src/lib/product-url";

const map: Record<string, string> = {};
for (const product of curatedProducts) {
  map[product.id.toUpperCase()] = productSlug(product);
}

const outPath = path.join(__dirname, "../src/data/product-slug-map.json");
fs.writeFileSync(outPath, JSON.stringify(map) + "\n");

console.log(`product-slug-map.json: ${Object.keys(map).length} productos`);
