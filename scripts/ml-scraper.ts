#!/usr/bin/env npx tsx
/**
 * ML Product Scraper (Puppeteer)
 *
 * Scraping directo de la web de MercadoLibre, sin API.
 *
 * Uso:
 *   npx tsx scripts/ml-scraper.ts <URL_DE_PRODUCTO>
 *   npx tsx scripts/ml-scraper.ts "https://articulo.mercadolibre.com.ar/MLA-850734153-..."
 *   npx tsx scripts/ml-scraper.ts --search "mandolina cortador"
 *   npx tsx scripts/ml-scraper.ts --search "selladora al vacío" --limit 5
 */

import puppeteer, { type Page } from "puppeteer";

// ─── Types ───
interface ScrapedProduct {
  url: string;
  title: string;
  price: number;
  originalPrice?: number;
  currency: string;
  description: string;
  images: string[];
  condition: "new" | "used";
  freeShipping: boolean;
  rating?: number;
  reviewCount?: number;
  soldQuantity?: number;
  sellerName?: string;
  sellerReputation?: string;
  categoryBreadcrumb: string[];
  attributes: Array<{ name: string; value: string }>;
}

// ─── Helpers ───
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
];

const AFFILIATE_TOOL_ID = "12465328";
const AFFILIATE_WORD = "productosvirales";

function randomUA(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildAffiliateUrl(permalink: string): string {
  try {
    const url = new URL(permalink);
    url.searchParams.set("matt_tool", AFFILIATE_TOOL_ID);
    url.searchParams.set("matt_word", AFFILIATE_WORD);
    return url.toString();
  } catch {
    return permalink;
  }
}

const CATEGORY_MAP: Record<string, { categorySlug: string; pastelColor: string }> = {
  "bazar-cocina": { categorySlug: "cocina", pastelColor: "var(--pastel-coral)" },
  cocina: { categorySlug: "cocina", pastelColor: "var(--pastel-coral)" },
  "pequenos-electrodomesticos": { categorySlug: "cocina", pastelColor: "var(--pastel-coral)" },
  "electrodomesticos-cocina": { categorySlug: "cocina", pastelColor: "var(--pastel-coral)" },
  mandolina: { categorySlug: "cocina", pastelColor: "var(--pastel-coral)" },
  cortador: { categorySlug: "cocina", pastelColor: "var(--pastel-coral)" },
  rallador: { categorySlug: "cocina", pastelColor: "var(--pastel-coral)" },
  picador: { categorySlug: "cocina", pastelColor: "var(--pastel-coral)" },
  "utensilios-de-preparacion": { categorySlug: "cocina", pastelColor: "var(--pastel-coral)" },
  "hogar-muebles-jardin": { categorySlug: "hogar", pastelColor: "var(--pastel-amber)" },
  "decoracion-hogar": { categorySlug: "hogar", pastelColor: "var(--pastel-amber)" },
  iluminacion: { categorySlug: "hogar", pastelColor: "var(--pastel-amber)" },
  organizacion: { categorySlug: "hogar", pastelColor: "var(--pastel-amber)" },
  limpieza: { categorySlug: "hogar", pastelColor: "var(--pastel-amber)" },
  electronica: { categorySlug: "tech", pastelColor: "var(--pastel-blue)" },
  "celulares-accesorios": { categorySlug: "tech", pastelColor: "var(--pastel-blue)" },
  computacion: { categorySlug: "tech", pastelColor: "var(--pastel-blue)" },
  "belleza-cuidado-personal": { categorySlug: "belleza", pastelColor: "var(--pastel-pink)" },
  "salud-belleza": { categorySlug: "belleza", pastelColor: "var(--pastel-pink)" },
  "deportes-fitness": { categorySlug: "fitness", pastelColor: "var(--pastel-green)" },
  "ropa-accesorios": { categorySlug: "moda", pastelColor: "var(--pastel-purple)" },
};

function mapCategory(slug: string): { categorySlug: string; pastelColor: string } {
  for (const [key, value] of Object.entries(CATEGORY_MAP)) {
    if (slug.includes(key) || key.includes(slug)) return value;
  }
  return { categorySlug: "gadgets", pastelColor: "var(--pastel-blue)" };
}

// ─── Core scraping logic ───
async function extractProductData(page: Page, url: string): Promise<ScrapedProduct> {
  await page.waitForSelector("h1", { timeout: 15000 });
  await delay(1500);

  const data = await page.evaluate(() => {
    const titleEl = document.querySelector("h1.ui-pdp-title");
    const title = titleEl?.textContent?.trim() || "";

    const priceSelectors = [
      ".ui-pdp-price__second-line .andes-money-amount__fraction",
      ".ui-pdp-price .andes-money-amount__fraction",
      "[class*='price'] .andes-money-amount__fraction",
    ];
    let priceText = "";
    for (const sel of priceSelectors) {
      const el = document.querySelector(sel);
      if (el?.textContent) { priceText = el.textContent.trim(); break; }
    }
    const price = parseInt(priceText.replace(/\./g, ""), 10) || 0;

    const centsEl = document.querySelector(".ui-pdp-price__second-line .andes-money-amount__cents");
    const cents = centsEl ? parseInt(centsEl.textContent?.trim() || "0", 10) : 0;

    const origPriceEl = document.querySelector(".ui-pdp-price__original-value .andes-money-amount__fraction");
    const originalPrice = origPriceEl ? parseInt(origPriceEl.textContent?.trim().replace(/\./g, "") || "0", 10) : undefined;

    const currencyEl = document.querySelector(".ui-pdp-price__second-line .andes-money-amount__currency-symbol");
    const currencySymbol = currencyEl?.textContent?.trim() || "$";
    const currency = currencySymbol === "U$S" ? "USD" : "ARS";

    // Description: try multiple selectors (article pages vs catalog pages)
    const descSelectors = [
      ".ui-pdp-description__content p",
      ".ui-pdp-description__content",
      ".ui-pdp-description p",
      ".ui-vpp-highlighted-specs__striped-specs",
    ];
    let description = "";
    for (const sel of descSelectors) {
      const el = document.querySelector(sel);
      if (el?.textContent?.trim()) { description = el.textContent.trim(); break; }
    }
    // Fallback: grab all feature highlights if no description found
    if (!description) {
      const features = document.querySelectorAll(".ui-vpp-highlighted-specs__features-list li, .ui-pdp-features__item");
      if (features.length > 0) {
        const items: string[] = [];
        features.forEach((f) => { if (f.textContent?.trim()) items.push(f.textContent.trim()); });
        description = items.join(". ");
      }
    }

    const imageElements = document.querySelectorAll(".ui-pdp-gallery__figure img, .ui-pdp-image.ui-pdp-image--gallery");
    const imagesSet = new Set<string>();
    imageElements.forEach((img) => {
      const src = (img as HTMLImageElement).dataset.zoom || (img as HTMLImageElement).src || "";
      if (src && !src.includes("data:") && !src.includes("placeholder")) {
        imagesSet.add(src.replace(/-[A-Z]\.jpg/, "-O.jpg"));
      }
    });
    const thumbs = document.querySelectorAll(".ui-pdp-thumbnail__picture img");
    thumbs.forEach((img) => {
      const src = (img as HTMLImageElement).src || "";
      if (src && !src.includes("data:")) {
        imagesSet.add(src.replace(/-[A-Z]\.jpg/, "-O.jpg"));
      }
    });

    const conditionEl = document.querySelector(".ui-pdp-header__subtitle, .ui-pdp-subtitle");
    const conditionText = conditionEl?.textContent?.toLowerCase() || "";
    const condition: "new" | "used" = conditionText.includes("usado") ? "used" : "new";
    const soldMatch = conditionText.match(/(\+?\d[\d.]*)\s*(vendidos?|sold)/i);
    const soldQuantity = soldMatch ? parseInt(soldMatch[1].replace(/\./g, ""), 10) : undefined;

    const shippingEl = document.querySelector(".ui-pdp-media__title, .ui-pdp-color--GREEN");
    const freeShipping = (shippingEl?.textContent?.toLowerCase() || "").includes("gratis");

    const ratingEl = document.querySelector(".ui-pdp-review__rating, .ui-pdp-reviews__rating__summary__average");
    const rating = ratingEl ? parseFloat(ratingEl.textContent?.trim() || "0") : undefined;
    const reviewCountEl = document.querySelector(".ui-pdp-review__amount, .ui-pdp-reviews__rating__summary__label");
    const reviewMatch = (reviewCountEl?.textContent?.trim() || "").match(/(\d+)/);
    const reviewCount = reviewMatch ? parseInt(reviewMatch[1], 10) : undefined;

    const sellerEl = document.querySelector(".ui-pdp-seller__link-trigger, .ui-pdp-action__title");
    const sellerName = sellerEl?.textContent?.trim() || undefined;
    const reputationEl = document.querySelector(".ui-pdp-seller__status-info .ui-pdp-color--GREEN");
    const sellerReputation = reputationEl?.textContent?.trim() || undefined;

    // Breadcrumb: filter out "..." entries (catalog pages truncate breadcrumbs)
    const breadcrumbEls = document.querySelectorAll(".andes-breadcrumb__item a, .andes-breadcrumb__link");
    const categoryBreadcrumb: string[] = [];
    breadcrumbEls.forEach((el) => {
      const text = el.textContent?.trim();
      if (text && text !== "..." && text !== "…") categoryBreadcrumb.push(text);
    });
    // Fallback: use title keywords to infer category if breadcrumb is empty/useless
    if (categoryBreadcrumb.length === 0) {
      const titleLower = title.toLowerCase();
      const catKeywords: Record<string, string> = {
        "cocina": "Cocina", "mandolina": "Cocina", "cortador": "Cocina", "rallador": "Cocina",
        "picador": "Cocina", "sartén": "Cocina", "olla": "Cocina", "sellador": "Cocina",
        "organizador": "Hogar", "lámpara": "Hogar", "led": "Hogar", "ventilador": "Hogar",
        "proyector": "Tech", "auricular": "Tech", "parlante": "Tech", "cargador": "Tech",
      };
      for (const [kw, cat] of Object.entries(catKeywords)) {
        if (titleLower.includes(kw)) { categoryBreadcrumb.push(cat); break; }
      }
    }

    const attrRows = document.querySelectorAll(".ui-pdp-specs__table tr, .andes-table__row");
    const attributes: Array<{ name: string; value: string }> = [];
    attrRows.forEach((row) => {
      const cells = row.querySelectorAll("th, td");
      if (cells.length >= 2) {
        attributes.push({ name: cells[0].textContent?.trim() || "", value: cells[1].textContent?.trim() || "" });
      }
    });

    return {
      title, price: price + cents / 100, originalPrice, currency, description,
      images: Array.from(imagesSet), condition, freeShipping,
      rating: rating || undefined, reviewCount, soldQuantity,
      sellerName, sellerReputation, categoryBreadcrumb, attributes,
    };
  });

  return { ...data, url };
}

// ─── Auto scroll ───
async function autoScroll(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= document.body.scrollHeight) { clearInterval(timer); resolve(); }
      }, 150);
    });
  });
}

// ─── Print results ───
function printProduct(scraped: ScrapedProduct): void {
  const mlaMatch = scraped.url.match(/MLA[-]?(\d+)/i);
  const id = mlaMatch ? `MLA${mlaMatch[1]}` : "unknown";

  const discount = scraped.originalPrice && scraped.originalPrice > scraped.price
    ? Math.round(((scraped.originalPrice - scraped.price) / scraped.originalPrice) * 100)
    : null;

  const breadcrumbSlugs = scraped.categoryBreadcrumb.map((bc) =>
    bc.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-")
  );
  const titleSlug = scraped.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-");
  const catSlug = [...breadcrumbSlugs, titleSlug].join(" ");
  const mapped = mapCategory(catSlug);

  console.log("═══════════════════════════════════════");
  console.log("PRODUCTO SCRAPEADO");
  console.log("═══════════════════════════════════════");
  console.log(`ID:              ${id}`);
  console.log(`Título:          ${scraped.title}`);
  console.log(`Precio:          $${scraped.price.toLocaleString("es-AR")} ${scraped.currency}`);
  if (scraped.originalPrice) {
    console.log(`Precio original: $${scraped.originalPrice.toLocaleString("es-AR")} (${discount}% OFF)`);
  }
  console.log(`Condición:       ${scraped.condition}`);
  console.log(`Envío gratis:    ${scraped.freeShipping ? "SÍ" : "NO"}`);
  console.log(`Vendidos:        ${scraped.soldQuantity || "N/A"}`);
  console.log(`Rating:          ${scraped.rating || "N/A"} (${scraped.reviewCount || 0} reviews)`);
  console.log(`Categoría:       ${scraped.categoryBreadcrumb.join(" > ") || "N/A"}`);
  console.log(`Categoría sitio: ${mapped.categorySlug} (${mapped.pastelColor})`);
  console.log(`Vendedor:        ${scraped.sellerName || "N/A"} (${scraped.sellerReputation || "N/A"})`);
  console.log(`Imágenes:        ${scraped.images.length}`);
  console.log(`URL:             ${scraped.url}`);
  console.log(`Affiliate URL:   ${buildAffiliateUrl(scraped.url)}`);

  if (scraped.description) {
    console.log(`\n─── Descripción ───`);
    console.log(scraped.description.substring(0, 500) + (scraped.description.length > 500 ? "..." : ""));
  }

  if (scraped.attributes.length > 0) {
    console.log(`\n─── Atributos (${scraped.attributes.length}) ───`);
    scraped.attributes.slice(0, 10).forEach((attr) => {
      console.log(`  ${attr.name}: ${attr.value}`);
    });
  }

  console.log("\n─── Para curated-products.ts ───\n");

  const productCode = `{
  id: '${id}',
  title: '${scraped.title.replace(/'/g, "\\'")}',
  price: ${scraped.price},
  originalPrice: ${scraped.originalPrice || "undefined"},
  currency: '${scraped.currency}',
  image: '${scraped.images[0] || ""}',
  images: ${JSON.stringify(scraped.images, null, 4)},
  category: '${scraped.categoryBreadcrumb[0] || "General"}',
  categorySlug: '${mapped.categorySlug}',
  permalink: '${scraped.url}',
  affiliateUrl: '${buildAffiliateUrl(scraped.url)}',
  condition: '${scraped.condition}',
  freeShipping: ${scraped.freeShipping},
  rating: ${scraped.rating || "undefined"},
  soldQuantity: ${scraped.soldQuantity || "undefined"},
  tiktokViews: undefined,
  badge: undefined,
  pastelColor: '${mapped.pastelColor}',
  pros: [],
  cons: [],
  verdict: undefined,
  description: ${scraped.description ? `'${scraped.description.replace(/'/g, "\\'").substring(0, 300)}'` : "undefined"},
},`;

  console.log(productCode);
}

// ─── Main ───
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("ML Product Scraper (Puppeteer)");
    console.log("─────────────────────────────");
    console.log("Uso:");
    console.log('  npx tsx scripts/ml-scraper.ts "https://articulo.mercadolibre.com.ar/MLA-..."');
    console.log('  npx tsx scripts/ml-scraper.ts --search "mandolina cortador"');
    console.log('  npx tsx scripts/ml-scraper.ts --search "selladora al vacío" --limit 5');
    process.exit(1);
  }

  const searchIdx = args.indexOf("--search");
  const limitIdx = args.indexOf("--limit");

  if (searchIdx !== -1) {
    // Search mode
    const query = args[searchIdx + 1];
    const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : 5;

    if (!query) {
      console.error("Error: falta el término de búsqueda después de --search");
      process.exit(1);
    }

    console.log(`\nBuscando "${query}" (limit: ${limit})...\n`);

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-blink-features=AutomationControlled"],
    });

    try {
      const page = await browser.newPage();
      await page.setUserAgent(randomUA());
      await page.setViewport({ width: 1920, height: 1080 });
      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, "webdriver", { get: () => false });
      });

      const searchUrl = `https://listado.mercadolibre.com.ar/${encodeURIComponent(query).replace(/%20/g, "-")}`;
      await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
      await delay(2000);

      const productLinks = await page.evaluate((max: number) => {
        const links = document.querySelectorAll("a.ui-search-link, a.ui-search-item__group__element, .ui-search-result__wrapper a[href*='articulo.mercadolibre']");
        const urls = new Set<string>();
        links.forEach((a) => {
          const href = (a as HTMLAnchorElement).href;
          if (href && href.includes("mercadolibre") && href.includes("MLA") && !href.includes("/noindex/")) {
            urls.add(href.split("#")[0].split("?")[0]);
          }
        });
        return Array.from(urls).slice(0, max);
      }, limit);

      console.log(`Encontrados ${productLinks.length} productos\n`);

      for (let i = 0; i < productLinks.length; i++) {
        console.log(`\n[${i + 1}/${productLinks.length}] ${productLinks[i]}`);
        try {
          await page.goto(productLinks[i], { waitUntil: "domcontentloaded", timeout: 30000 });
          await autoScroll(page);
          const scraped = await extractProductData(page, productLinks[i]);
          printProduct(scraped);
          if (i < productLinks.length - 1) await delay(2000 + Math.random() * 3000);
        } catch (error) {
          console.error(`  Error:`, error instanceof Error ? error.message : error);
        }
      }
    } finally {
      await browser.close();
    }
  } else {
    // Single URL mode
    const url = args[0];
    if (!url.includes("mercadolibre")) {
      console.error("Error: la URL debe ser de MercadoLibre");
      process.exit(1);
    }

    console.log(`\nScraping: ${url}\n`);

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-blink-features=AutomationControlled"],
    });

    try {
      const page = await browser.newPage();
      await page.setUserAgent(randomUA());
      await page.setViewport({ width: 1920, height: 1080 });
      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, "webdriver", { get: () => false });
      });

      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
      await autoScroll(page);

      const scraped = await extractProductData(page, url);
      printProduct(scraped);
    } finally {
      await browser.close();
    }
  }
}

main().catch((error) => {
  console.error("Fatal:", error);
  process.exit(1);
});
