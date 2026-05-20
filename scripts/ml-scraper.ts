#!/usr/bin/env npx tsx
/**
 * MercadoLibre product scraper, without the official API.
 *
 * Uses the shared Puppeteer scraper from src/lib/scraper.ts so the CLI,
 * /api/scrape and price updater all benefit from the same challenge handling
 * and price parsing logic.
 *
 * Usage:
 *   npx tsx scripts/ml-scraper.ts <URL_DE_PRODUCTO>
 *   npx tsx scripts/ml-scraper.ts --search "freidora de aire" --limit 5
 */

import {
  scrapeProduct,
  scrapeSearch,
  scrapedToProduct,
  type ScrapedProduct,
} from "../src/lib/scraper";

function formatValue(value: unknown): string {
  if (typeof value === "number") return value.toLocaleString("es-AR");
  if (value === undefined || value === null || value === "") return "N/A";
  return String(value);
}

function printProduct(scraped: ScrapedProduct): void {
  const product = scrapedToProduct(scraped);

  console.log("═══════════════════════════════════════");
  console.log("PRODUCTO SCRAPEADO");
  console.log("═══════════════════════════════════════");
  console.log(`ID:              ${product.id}`);
  console.log(`Título:          ${product.title}`);
  console.log(`Precio:          $${formatValue(product.price)} ${product.currency}`);
  if (product.originalPrice) {
    console.log(`Precio original: $${formatValue(product.originalPrice)}`);
  }
  console.log(`Condición:       ${product.condition}`);
  console.log(`Envío gratis:    ${product.freeShipping ? "SÍ" : "NO"}`);
  console.log(`Vendidos:        ${formatValue(product.soldQuantity)}`);
  console.log(`Rating:          ${formatValue(product.rating)}`);
  console.log(`Reviews:         ${formatValue(product.reviewCount)}`);
  console.log(`Categoría:       ${product.category} → ${product.categorySlug}`);
  console.log(`Imágenes:        ${product.images?.length || 0}`);
  console.log(`Affiliate URL:   ${product.affiliateUrl}`);
  console.log("");
  console.log("─── Para curated-products.ts ───");
  console.log("");

  const code = `  {
    id: '${product.id}',
    title: '${product.title.replace(/'/g, "\\'")}',
    price: ${product.price},
    originalPrice: ${product.originalPrice || "undefined"},
    currency: '${product.currency}',
    image: '${product.image}',
    images: ${JSON.stringify(product.images, null, 6)
      .split("\n")
      .map((line, idx) => (idx === 0 ? line : "    " + line))
      .join("\n")},
    category: '${product.category}',
    categorySlug: '${product.categorySlug}',
    permalink: '${product.permalink}',
    affiliateUrl: '${product.affiliateUrl}',
    condition: '${product.condition}',
    freeShipping: ${product.freeShipping},
    rating: ${product.rating || "undefined"},
    reviewCount: ${product.reviewCount || "undefined"},
    soldQuantity: ${product.soldQuantity || "undefined"},
    pastelColor: '${product.pastelColor}',
    priceUpdated: "${new Date().toISOString().slice(0, 10)}",
    priceLastChecked: "${new Date().toISOString().slice(0, 10)}",
    priceStatus: "fresh",${product.description ? `\n    description: '${product.description.replace(/'/g, "\\'").slice(0, 300)}',` : ""}
  },`;

  console.log(code);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log("Uso:");
    console.log('  npx tsx scripts/ml-scraper.ts "https://www.mercadolibre.com.ar/..."');
    console.log('  npx tsx scripts/ml-scraper.ts --search "freidora de aire" --limit 5');
    console.log("");
    console.log("Si MercadoLibre pide verificación:");
    console.log("  ML_SCRAPER_HEADFUL=true ML_SCRAPER_PROFILE_DIR=.cache/ml-scraper-profile npx tsx scripts/ml-scraper.ts <URL>");
    process.exit(1);
  }

  const searchIdx = args.indexOf("--search");
  const limitIdx = args.indexOf("--limit");

  if (searchIdx !== -1) {
    const query = args[searchIdx + 1];
    const limit = limitIdx !== -1 ? Number(args[limitIdx + 1]) : 5;
    if (!query) throw new Error("Falta el término de búsqueda después de --search");

    console.log(`\nBuscando "${query}" (limit: ${limit})...\n`);
    const results = await scrapeSearch(query, limit);
    if (results.length === 0) {
      console.log("No se pudieron scrapear productos para esa búsqueda.");
      return;
    }
    results.forEach((scraped, index) => {
      console.log(`\n[${index + 1}/${results.length}]`);
      printProduct(scraped);
    });
    return;
  }

  const url = args[0];
  if (!url.includes("mercadolibre")) {
    throw new Error("La URL debe ser de MercadoLibre");
  }

  console.log(`\nScraping: ${url}\n`);
  const scraped = await scrapeProduct(url);
  printProduct(scraped);
}

main().catch((error) => {
  console.error("Fatal:", error instanceof Error ? error.message : error);
  process.exit(1);
});
