#!/usr/bin/env npx tsx
/**
 * Scrape a single ML product URL and output the curated-products.ts entry.
 * Run: npx tsx scripts/scrape-product.ts <ML_URL> [affiliate_url]
 */

import { scrapeProduct, scrapedToProduct } from "../src/lib/scraper";
import { buildAffiliateUrl } from "../src/lib/mercadolibre";

async function main() {
  const url = process.argv[2];
  const affiliateOverride = process.argv[3];

  if (!url) {
    console.log("Uso: npx tsx scripts/scrape-product.ts <ML_URL> [affiliate_url]");
    process.exit(1);
  }

  console.log(`\nScrapeando ${url}...\n`);

  try {
    const scraped = await scrapeProduct(url);
    const product = scrapedToProduct(scraped);

    if (affiliateOverride) {
      product.affiliateUrl = affiliateOverride;
    } else {
      product.affiliateUrl = buildAffiliateUrl(url);
    }

    console.log("═══════════════════════════════════════");
    console.log("PRODUCTO SCRAPEADO");
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
    soldQuantity: ${product.soldQuantity || "undefined"},
    pastelColor: '${product.pastelColor}',${product.description ? `\n    description: '${product.description.replace(/'/g, "\\'").slice(0, 200)}',` : ""}
  },`;

    console.log(code);
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
