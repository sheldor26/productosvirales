#!/usr/bin/env npx tsx
/**
 * Scrape the 14 products that were blocked by ML anti-bot on previous attempts.
 * Appends results to curated-products.ts.
 *
 * Usage: npx tsx scripts/scrape-remaining-14.ts
 */

import puppeteer, { type Page } from "puppeteer";
import * as fs from "fs";
import * as path from "path";

interface ProductInput {
  url: string;
  affiliateUrl: string;
}

const PRODUCTS: ProductInput[] = [
  { url: "https://www.mercadolibre.com.ar/aspiradora-inalambrica-yelmo-as-3244-395ml-recargable-usb-celestenaranja-filtro-hepa/p/MLA44863825", affiliateUrl: "https://meli.la/2Eur6DD" },
  { url: "https://www.mercadolibre.com.ar/multi-cepillo-9-en-1-rotativo-450-rpm-para-limpieza-de-casa-auto-vidrios-con-mango-extensible-y-bateria-recargable-mts-powerbrushpro-amitosai/p/MLA43422049", affiliateUrl: "https://meli.la/1SefDq3" },
  { url: "https://www.mercadolibre.com.ar/cepillo-electrico-recargable-para-limpieza-de-piso-lineal-jt080350-blanco-unidad-1/p/MLA23532244", affiliateUrl: "https://meli.la/17LA34g" },
  { url: "https://www.mercadolibre.com.ar/mini-proyector-portatil-4k-fika-p8-hd-720p-8000-lumens-170-ansi-android-wifi-4k-cine-color-blanco/p/MLA52661526", affiliateUrl: "https://meli.la/2SE2D2R" },
  { url: "https://www.mercadolibre.com.ar/mini-proyector-portatil-4k-fika-b2-full-hd-1080p-14000-lumens-300-ansi-lumens-android-wifi-cine-color-blanco/p/MLA52364259", affiliateUrl: "https://meli.la/2RMfJnH" },
  { url: "https://www.mercadolibre.com.ar/mini-proyector-portatil-4k-fika-p8-hd-720p-8000-lumens-170-ansi-android-wifi-cine-color-negro/p/MLA52018443", affiliateUrl: "https://meli.la/2X4c4V9" },
  { url: "https://www.mercadolibre.com.ar/proyector-portatil-4k-hy300-full-hd-wifi-hdmi-android-11-bt-50/p/MLA42238146", affiliateUrl: "https://meli.la/1MtgG5J" },
  { url: "https://www.mercadolibre.com.ar/proyector-mini-ultrahd-hy-300-8000lm-blanco/p/MLA43932163", affiliateUrl: "https://meli.la/1h76Rbw" },
  { url: "https://www.mercadolibre.com.ar/proyector-portatil-led-dakota-8500lm-wifi-1080p-mirrorlink-color-negro/p/MLA24692647", affiliateUrl: "https://meli.la/1XNEyWg" },
  { url: "https://www.mercadolibre.com.ar/proyector-generica-proyector-android-9000lm-blanco/p/MLA43926951", affiliateUrl: "https://meli.la/1rYKE5Q" },
  { url: "https://www.mercadolibre.com.ar/proyector-portatil-gadnic-p-3129-fhd-soporta-4k-bt-multi-conexion-5000-lumenes-control-remoto-40-a-150/p/MLA43928643", affiliateUrl: "https://meli.la/1keA7kg" },
  { url: "https://www.mercadolibre.com.ar/mini-proyector-led-portatil-1200-lumens-color-blanco/p/MLA22975097", affiliateUrl: "https://meli.la/2UNEksE" },
  { url: "https://www.mercadolibre.com.ar/proyector-led-smart-android-11-fhd-4500-lumenes-wifi-bt-color-blanco/p/MLA28251222", affiliateUrl: "https://meli.la/13EBUyg" },
  { url: "https://www.mercadolibre.com.ar/proyector-portatil-long-xing-mini-hy300-android-11-wi-fi-bluetooth-4k-blanco/p/MLA42796008", affiliateUrl: "https://meli.la/1Q9Gwjq" },
];

// ─── Helpers ───
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
];
function randomUA() { return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]; }
function delay(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

const CATEGORY_MAP: Record<string, string> = {
  "bazar-cocina": "cocina", cocina: "cocina", "pequenos-electrodomesticos": "cocina",
  "electrodomesticos-cocina": "cocina", sarten: "cocina", sellador: "cocina",
  "hogar-muebles-jardin": "hogar", "decoracion-hogar": "hogar",
  iluminacion: "hogar", organizacion: "hogar", limpieza: "hogar",
  organizador: "hogar", mopa: "hogar", aspiradora: "hogar", cepillo: "hogar",
  "limpia-vidrio": "hogar", robot: "hogar", lampara: "hogar", velador: "hogar",
  ventilador: "hogar", astronauta: "hogar",
  electronica: "tech", computacion: "tech", proyector: "tech", "mini-proyector": "tech",
  "belleza-cuidado-personal": "belleza", aromatizador: "belleza", humidificador: "belleza",
  difusor: "belleza",
};
const PASTEL_MAP: Record<string, string> = {
  cocina: "var(--pastel-coral)", hogar: "var(--pastel-amber)", tech: "var(--pastel-blue)",
  belleza: "var(--pastel-pink)", fitness: "var(--pastel-green)", moda: "var(--pastel-purple)",
  gadgets: "var(--pastel-blue)",
};
function mapCategory(text: string): string {
  const lower = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  for (const [key, cat] of Object.entries(CATEGORY_MAP)) {
    if (lower.includes(key)) return cat;
  }
  return "gadgets";
}

interface ScrapedData {
  title: string; price: number; originalPrice?: number; currency: string;
  description: string; images: string[]; condition: "new" | "used";
  freeShipping: boolean; rating?: number; soldQuantity?: number;
  categoryBreadcrumb: string[];
}

async function scrapePage(page: Page, url: string): Promise<ScrapedData> {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
  // Scroll to trigger lazy loading
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let total = 0;
      const timer = setInterval(() => { window.scrollBy(0, 400); total += 400; if (total >= document.body.scrollHeight) { clearInterval(timer); resolve(); } }, 100);
    });
  });
  await page.waitForSelector("h1", { timeout: 15000 });
  await delay(1500);

  return page.evaluate(() => {
    const title = document.querySelector("h1.ui-pdp-title")?.textContent?.trim() || "";

    const priceSelectors = [
      ".ui-pdp-price__second-line .andes-money-amount__fraction",
      ".ui-pdp-price .andes-money-amount__fraction",
      "[class*='price'] .andes-money-amount__fraction",
    ];
    let priceText = "";
    for (const s of priceSelectors) { const e = document.querySelector(s); if (e?.textContent) { priceText = e.textContent.trim(); break; } }
    const price = parseInt(priceText.replace(/\./g, ""), 10) || 0;
    const centsEl = document.querySelector(".ui-pdp-price__second-line .andes-money-amount__cents");
    const cents = centsEl ? parseInt(centsEl.textContent?.trim() || "0", 10) : 0;

    const origEl = document.querySelector(".ui-pdp-price__original-value .andes-money-amount__fraction");
    const originalPrice = origEl ? parseInt(origEl.textContent?.trim().replace(/\./g, "") || "0", 10) : undefined;

    const currEl = document.querySelector(".ui-pdp-price__second-line .andes-money-amount__currency-symbol");
    const currency = (currEl?.textContent?.trim() || "$") === "U$S" ? "USD" : "ARS";

    // Description
    const descSelectors = [".ui-pdp-description__content p", ".ui-pdp-description__content", ".ui-pdp-description p", ".ui-vpp-highlighted-specs__striped-specs"];
    let description = "";
    for (const s of descSelectors) { const e = document.querySelector(s); if (e?.textContent?.trim()) { description = e.textContent.trim(); break; } }
    if (!description) {
      const features = document.querySelectorAll(".ui-vpp-highlighted-specs__features-list li, .ui-pdp-features__item");
      if (features.length > 0) {
        const items: string[] = [];
        features.forEach((f) => { if (f.textContent?.trim()) items.push(f.textContent.trim()); });
        description = items.join(". ");
      }
    }

    // Images
    const imgSet = new Set<string>();
    document.querySelectorAll(".ui-pdp-gallery__figure img, .ui-pdp-image.ui-pdp-image--gallery").forEach((img) => {
      const src = (img as HTMLImageElement).dataset.zoom || (img as HTMLImageElement).src || "";
      if (src && !src.includes("data:") && !src.includes("placeholder")) imgSet.add(src.replace(/-[A-Z]\.jpg/, "-O.jpg"));
    });
    document.querySelectorAll(".ui-pdp-thumbnail__picture img").forEach((img) => {
      const src = (img as HTMLImageElement).src || "";
      if (src && !src.includes("data:")) imgSet.add(src.replace(/-[A-Z]\.jpg/, "-O.jpg"));
    });

    // Condition & sold
    const condText = (document.querySelector(".ui-pdp-header__subtitle, .ui-pdp-subtitle")?.textContent || "").toLowerCase();
    const condition: "new" | "used" = condText.includes("usado") ? "used" : "new";
    const soldMatch = condText.match(/(\+?\d[\d.]*)\s*(vendidos?|sold)/i);
    const soldQuantity = soldMatch ? parseInt(soldMatch[1].replace(/\./g, ""), 10) : undefined;

    // Shipping
    const shipText = (document.querySelector(".ui-pdp-media__title, .ui-pdp-color--GREEN")?.textContent || "").toLowerCase();
    const freeShipping = shipText.includes("gratis") || shipText.includes("free");

    // Rating
    const ratingEl = document.querySelector(".ui-pdp-review__rating, .ui-pdp-reviews__rating__summary__average");
    const rating = ratingEl ? parseFloat(ratingEl.textContent?.trim() || "0") || undefined : undefined;

    // Category breadcrumb
    const categoryBreadcrumb: string[] = [];
    document.querySelectorAll(".andes-breadcrumb__item a, .andes-breadcrumb__link").forEach((el) => {
      const t = el.textContent?.trim();
      if (t && t !== "..." && t !== "\u2026") categoryBreadcrumb.push(t);
    });
    if (categoryBreadcrumb.length === 0) {
      const tl = title.toLowerCase();
      if (tl.includes("proyector") || tl.includes("mini proyector")) categoryBreadcrumb.push("Tech");
      else if (tl.includes("aspiradora") || tl.includes("cepillo")) categoryBreadcrumb.push("Hogar");
    }

    return {
      title, price: price + cents / 100, originalPrice, currency,
      description, images: Array.from(imgSet), condition, freeShipping,
      rating, soldQuantity, categoryBreadcrumb,
    };
  });
}

async function main() {
  console.log(`\n🚀 Scraping ${PRODUCTS.length} remaining products...\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox", "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--disable-infobars", "--window-size=1920,1080",
    ],
  });

  const page = await browser.newPage();
  await page.setUserAgent(randomUA());
  await page.setViewport({ width: 1920, height: 1080 });
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
    // @ts-expect-error -- anti-detection
    window.chrome = { runtime: {} };
    Object.defineProperty(navigator, "plugins", { get: () => [1, 2, 3, 4, 5] });
    Object.defineProperty(navigator, "languages", { get: () => ["es-AR", "es", "en-US", "en"] });
  });

  const results: string[] = [];
  let success = 0;
  let failed = 0;

  for (let i = 0; i < PRODUCTS.length; i++) {
    const { url, affiliateUrl } = PRODUCTS[i];
    const mlaMatch = url.match(/MLA[-]?(\d+)/i);
    const id = mlaMatch ? `MLA${mlaMatch[1]}` : `scraped-${Date.now()}`;

    console.log(`[${i + 1}/${PRODUCTS.length}] ${id} — ${url}`);

    try {
      const data = await scrapePage(page, url);

      if (!data.title || data.price === 0) {
        console.log(`  ⚠️ Blocked or empty — skipping`);
        failed++;
        continue;
      }

      const catText = [...data.categoryBreadcrumb, data.title].join(" ");
      const catSlug = mapCategory(catText);
      const pastel = PASTEL_MAP[catSlug] || "var(--pastel-blue)";
      const catName = data.categoryBreadcrumb[0] || (catSlug.charAt(0).toUpperCase() + catSlug.slice(1));

      const images = data.images.length > 0 ? data.images : [`https://http2.mlstatic.com/D_NQ_NP_${id}-F.webp`];

      const entry = `  {
    id: '${id}',
    title: ${JSON.stringify(data.title)},
    price: ${data.price},
    originalPrice: ${data.originalPrice ?? "undefined"},
    currency: '${data.currency}',
    image: '${images[0]}',
    images: ${JSON.stringify(images, null, 6).replace(/\n\s*/g, "\n      ")},
    category: ${JSON.stringify(catName)},
    categorySlug: '${catSlug}',
    permalink: '${url}',
    affiliateUrl: '${affiliateUrl}',
    condition: '${data.condition}',
    freeShipping: ${data.freeShipping},
    rating: ${data.rating ?? "undefined"},
    soldQuantity: ${data.soldQuantity ?? "undefined"},
    pastelColor: '${pastel}',
    description: ${JSON.stringify((data.description || "").slice(0, 300))},
  }`;

      results.push(entry);
      success++;
      console.log(`  ✅ ${data.title.slice(0, 60)}… — $${data.price}`);

      // Random delay 3-7 seconds
      const wait = 3000 + Math.random() * 4000;
      console.log(`  ⏳ Waiting ${Math.round(wait / 1000)}s...`);
      await delay(wait);

      // Rotate UA every 4 products
      if ((i + 1) % 4 === 0) {
        await page.setUserAgent(randomUA());
      }
    } catch (err) {
      console.log(`  ❌ Error: ${err instanceof Error ? err.message : err}`);
      failed++;
    }
  }

  await browser.close();

  if (results.length > 0) {
    const filePath = path.resolve(__dirname, "../src/data/curated-products.ts");
    let content = fs.readFileSync(filePath, "utf-8");

    // Find last ];  and insert before it
    const insertPoint = content.lastIndexOf("];");
    if (insertPoint === -1) {
      console.error("❌ Could not find end of array in curated-products.ts");
      process.exit(1);
    }

    const newEntries = results.join(",\n");
    content = content.slice(0, insertPoint) + newEntries + ",\n" + content.slice(insertPoint);

    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`\n✅ Appended ${results.length} products to curated-products.ts`);
  }

  console.log(`\n📊 Results: ${success} success, ${failed} failed out of ${PRODUCTS.length} total`);
}

main().catch(console.error);
