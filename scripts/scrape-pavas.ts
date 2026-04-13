#!/usr/bin/env npx tsx
import puppeteer, { type Page } from "puppeteer";
import * as fs from "fs";
import * as path from "path";

interface ProductInput {
  url: string;
  affiliateUrl: string;
}

const PRODUCTS: ProductInput[] = [
  { url: "https://www.mercadolibre.com.ar/pava-electrica-atma-18-l-interior-acero-inoxidable-negro/p/MLA49747515", affiliateUrl: "https://meli.la/1TBSj3K" },
  { url: "https://www.mercadolibre.com.ar/jarra-electrica-philips-hd935090-daily-collection/p/MLA24601443", affiliateUrl: "https://meli.la/2kpg1Zr" },
  { url: "https://www.mercadolibre.com.ar/pava-peabody-pe-dk2200n-digital-15-litros-negro/p/MLA47275624", affiliateUrl: "https://meli.la/2cyQgD2" },
  { url: "https://www.mercadolibre.com.ar/social/jm159", affiliateUrl: "https://meli.la/1JfvkMc" },
  { url: "https://www.mercadolibre.com.ar/pava-electrica-philips-hd9396-17l-2200w-color-negro-mate/p/MLA47183370", affiliateUrl: "https://meli.la/1nfm8ft" },
  { url: "https://www.mercadolibre.com.ar/pava-electrica-atma-pe0821ap-17lts-blanco/p/MLA19589524", affiliateUrl: "https://meli.la/27qLeLL" },
];

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
];
function randomUA() { return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]; }
function delay(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

const PASTEL_MAP: Record<string, string> = {
  cocina: "var(--pastel-coral)", hogar: "var(--pastel-amber)", tech: "var(--pastel-blue)",
};

async function scrapePage(page: Page, url: string) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let total = 0;
      const timer = setInterval(() => { window.scrollBy(0, 400); total += 400; if (total >= document.body.scrollHeight) { clearInterval(timer); resolve(); } }, 100);
    });
  });
  await page.waitForSelector("h1", { timeout: 15000 });
  await delay(2000);

  return page.evaluate(() => {
    const title = document.querySelector("h1.ui-pdp-title")?.textContent?.trim() || "";
    const priceSelectors = [".ui-pdp-price__second-line .andes-money-amount__fraction", ".ui-pdp-price .andes-money-amount__fraction"];
    let priceText = "";
    for (const s of priceSelectors) { const e = document.querySelector(s); if (e?.textContent) { priceText = e.textContent.trim(); break; } }
    const price = parseInt(priceText.replace(/\./g, ""), 10) || 0;
    const centsEl = document.querySelector(".ui-pdp-price__second-line .andes-money-amount__cents");
    const cents = centsEl ? parseInt(centsEl.textContent?.trim() || "0", 10) : 0;
    const origEl = document.querySelector(".ui-pdp-price__original-value .andes-money-amount__fraction");
    const originalPrice = origEl ? parseInt(origEl.textContent?.trim().replace(/\./g, "") || "0", 10) : undefined;
    const currEl = document.querySelector(".ui-pdp-price__second-line .andes-money-amount__currency-symbol");
    const currency = (currEl?.textContent?.trim() || "$") === "U$S" ? "USD" : "ARS";

    const descSelectors = [".ui-pdp-description__content p", ".ui-pdp-description__content", ".ui-vpp-highlighted-specs__striped-specs"];
    let description = "";
    for (const s of descSelectors) { const e = document.querySelector(s); if (e?.textContent?.trim()) { description = e.textContent.trim(); break; } }

    const imgSet = new Set<string>();
    document.querySelectorAll(".ui-pdp-gallery__figure img, .ui-pdp-image").forEach((img) => {
      const src = (img as HTMLImageElement).dataset.zoom || (img as HTMLImageElement).src || "";
      if (src && !src.includes("data:") && src.includes("mlstatic")) imgSet.add(src.replace(/-[A-Z]\.jpg/, "-O.jpg"));
    });
    document.querySelectorAll(".ui-pdp-thumbnail__picture img").forEach((img) => {
      const src = (img as HTMLImageElement).src || "";
      if (src && !src.includes("data:") && src.includes("mlstatic")) imgSet.add(src.replace(/-[A-Z]\.jpg/, "-O.jpg"));
    });

    const condText = (document.querySelector(".ui-pdp-header__subtitle, .ui-pdp-subtitle")?.textContent || "").toLowerCase();
    const condition: "new" | "used" = condText.includes("usado") ? "used" : "new";
    const soldMatch = condText.match(/(\+?\d[\d.]*)\s*(vendidos?|sold)/i);
    const soldQuantity = soldMatch ? parseInt(soldMatch[1].replace(/\./g, ""), 10) : undefined;

    const shipText = (document.querySelector(".ui-pdp-media__title, .ui-pdp-color--GREEN")?.textContent || "").toLowerCase();
    const freeShipping = shipText.includes("gratis") || shipText.includes("free");

    const ratingEl = document.querySelector(".ui-pdp-review__rating, .ui-pdp-reviews__rating__summary__average");
    const rating = ratingEl ? parseFloat(ratingEl.textContent?.trim() || "0") || undefined : undefined;

    const categoryBreadcrumb: string[] = [];
    document.querySelectorAll(".andes-breadcrumb__item a, .andes-breadcrumb__link").forEach((el) => {
      const t = el.textContent?.trim();
      if (t && t !== "..." && t !== "\u2026") categoryBreadcrumb.push(t);
    });

    return {
      title, price: price + cents / 100, originalPrice, currency,
      description, images: Array.from(imgSet), condition, freeShipping,
      rating, soldQuantity, categoryBreadcrumb,
    };
  });
}

async function main() {
  console.log(`\n🚀 Scraping ${PRODUCTS.length} pava products...\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-blink-features=AutomationControlled"],
  });

  const page = await browser.newPage();
  await page.setUserAgent(randomUA());
  await page.setViewport({ width: 1920, height: 1080 });
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
    // @ts-expect-error anti-detection
    window.chrome = { runtime: {} };
  });

  const results: string[] = [];
  let success = 0;

  for (let i = 0; i < PRODUCTS.length; i++) {
    const { url, affiliateUrl } = PRODUCTS[i];
    const mlaMatch = url.match(/MLA[-]?(\d+)/i);
    const id = mlaMatch ? `MLA${mlaMatch[1]}` : `scraped-${Date.now()}`;

    console.log(`[${i + 1}/${PRODUCTS.length}] ${id} — ${url.slice(0, 80)}...`);

    try {
      const data = await scrapePage(page, url);

      if (!data.title || data.price === 0) {
        console.log(`  ⚠️ Blocked or empty — skipping`);
        continue;
      }

      const images = data.images.length > 0 ? data.images : [];
      const catName = data.categoryBreadcrumb[0] || "Cocina";

      const entry = `  {
    id: '${id}',
    title: ${JSON.stringify(data.title)},
    price: ${data.price},
    originalPrice: ${data.originalPrice ?? "undefined"},
    currency: '${data.currency}',
    image: '${images[0] || ""}',
    images: ${JSON.stringify(images, null, 6).replace(/\n\s*/g, "\n      ")},
    category: ${JSON.stringify(catName)},
    categorySlug: 'cocina',
    permalink: '${url.split("?")[0]}',
    affiliateUrl: '${affiliateUrl}',
    condition: '${data.condition}',
    freeShipping: ${data.freeShipping},
    rating: ${data.rating ?? "undefined"},
    soldQuantity: ${data.soldQuantity ?? "undefined"},
    pastelColor: 'var(--pastel-coral)',
    description: ${JSON.stringify((data.description || "").slice(0, 300))},
  }`;

      results.push(entry);
      success++;
      console.log(`  ✅ ${data.title.slice(0, 60)}… — $${data.price}`);

      const wait = 3000 + Math.random() * 4000;
      await delay(wait);
      if ((i + 1) % 3 === 0) await page.setUserAgent(randomUA());
    } catch (err) {
      console.log(`  ❌ Error: ${err instanceof Error ? err.message : err}`);
    }
  }

  await browser.close();

  if (results.length > 0) {
    const filePath = path.resolve(__dirname, "../src/data/curated-products.ts");
    let content = fs.readFileSync(filePath, "utf-8");
    const insertPoint = content.lastIndexOf("];");
    const newEntries = results.join(",\n");
    content = content.slice(0, insertPoint) + newEntries + ",\n" + content.slice(insertPoint);
    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`\n✅ Appended ${results.length} products to curated-products.ts`);
  }

  console.log(`\n📊 Results: ${success} success out of ${PRODUCTS.length} total`);
}

main().catch(console.error);
