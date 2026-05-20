#!/usr/bin/env npx tsx
/**
 * Standalone MercadoLibre product importer, without the official API.
 *
 * Prefer passing a full ML URL. IDs are supported as a convenience:
 * - MLA catalog IDs use https://www.mercadolibre.com.ar/p/<ID>
 * - MLAU product IDs use https://www.mercadolibre.com.ar/up/<ID>
 * - article-like MLA IDs use https://articulo.mercadolibre.com.ar/MLA-<digits>
 *
 * Run:
 *   npx tsx scripts/ml-product-importer.ts "https://www.mercadolibre.com.ar/..."
 *   npx tsx scripts/ml-product-importer.ts MLA39861162
 */

import { scrapeProduct, scrapedToProduct } from "../src/lib/scraper";

function resolveInputToUrl(input: string): string {
  const trimmed = input.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  const mlauMatch = trimmed.match(/^(MLAU\d+)$/i);
  if (mlauMatch) return `https://www.mercadolibre.com.ar/up/${mlauMatch[1].toUpperCase()}`;

  const mlaMatch = trimmed.match(/^MLA-?(\d+)$/i);
  if (mlaMatch) {
    const id = `MLA${mlaMatch[1]}`;
    return mlaMatch[1].length >= 10
      ? `https://articulo.mercadolibre.com.ar/MLA-${mlaMatch[1]}`
      : `https://www.mercadolibre.com.ar/p/${id}`;
  }

  throw new Error(`No se pudo resolver URL de MercadoLibre desde: "${input}"`);
}

async function main() {
  const input = process.argv[2];
  if (!input) {
    console.log("Uso: npx tsx scripts/ml-product-importer.ts <MLA_ID o URL>");
    console.log('Ejemplo: npx tsx scripts/ml-product-importer.ts "https://www.mercadolibre.com.ar/..."');
    console.log("Tip: si ML bloquea, corré una vez con ML_SCRAPER_HEADFUL=true y perfil persistente.");
    process.exit(1);
  }

  const url = resolveInputToUrl(input);
  console.log(`\nImportando desde ${url}...\n`);

  const scraped = await scrapeProduct(url);
  const product = scrapedToProduct(scraped);
  const today = new Date().toISOString().slice(0, 10);

  console.log("═══════════════════════════════════════");
  console.log("PRODUCTO IMPORTADO");
  console.log("═══════════════════════════════════════");
  console.log(`ID:              ${product.id}`);
  console.log(`Título:          ${product.title}`);
  console.log(`Precio:          $${product.price.toLocaleString("es-AR")} ${product.currency}`);
  if (product.originalPrice) {
    console.log(`Precio original: $${product.originalPrice.toLocaleString("es-AR")}`);
  }
  console.log(`Condición:       ${product.condition}`);
  console.log(`Envío gratis:    ${product.freeShipping ? "SÍ" : "NO"}`);
  console.log(`Vendidos:        ${product.soldQuantity || "N/A"}`);
  console.log(`Rating:          ${product.rating || "N/A"}`);
  console.log(`Reviews:         ${product.reviewCount || "N/A"}`);
  console.log(`Categoría sitio: ${product.categorySlug}`);
  console.log(`Permalink:       ${product.permalink}`);
  console.log(`Affiliate URL:   ${product.affiliateUrl}`);
  console.log(`Imagen principal:${product.image}`);
  console.log(`Total imágenes:  ${product.images?.length || 0}`);
  console.log("");
  console.log("─── Para curated-products.ts ───");
  console.log("");

  const productCode = `{
  id: '${product.id}',
  title: '${product.title.replace(/'/g, "\\'")}',
  price: ${product.price},
  originalPrice: ${product.originalPrice || "undefined"},
  currency: '${product.currency}',
  image: '${product.image}',
  images: ${JSON.stringify(product.images, null, 4)},
  category: '${product.category}',
  categorySlug: '${product.categorySlug}',
  permalink: '${product.permalink}',
  affiliateUrl: '${product.affiliateUrl}',
  condition: '${product.condition}',
  freeShipping: ${product.freeShipping},
  rating: ${product.rating || "undefined"},
  reviewCount: ${product.reviewCount || "undefined"},
  soldQuantity: ${product.soldQuantity || "undefined"},
  tiktokViews: undefined,
  badge: undefined,
  pastelColor: '${product.pastelColor}',
  priceUpdated: "${today}",
  priceLastChecked: "${today}",
  priceStatus: "fresh",
  pros: [],
  cons: [],
  verdict: undefined,
  description: ${product.description ? `'${product.description.replace(/'/g, "\\'").slice(0, 300)}'` : "undefined"},
},`;

  console.log(productCode);
}

main().catch((error) => {
  console.error("Error:", error instanceof Error ? error.message : error);
  process.exit(1);
});
