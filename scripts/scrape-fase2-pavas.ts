#!/usr/bin/env npx tsx
import puppeteer, { type Page } from "puppeteer";
import * as fs from "fs";
import * as path from "path";

const PRODUCTS = [
  { url: "https://www.mercadolibre.com.ar/pava-jarra-electrica-peabody-digital-acero-17lts-pe-dk1850/p/MLA14263533", affiliateUrl: "https://meli.la/2T7Y1zd" },
  { url: "https://www.mercadolibre.com.ar/pava-electrica-vintage-peabody-pe-kv8215r-color-rojo-2200-w/p/MLA15276005", affiliateUrl: "https://meli.la/2E5nXaB" },
  { url: "https://www.mercadolibre.com.ar/pava-electrica-acero-inoxidable-17-l-ap152-liliana/p/MLA61505857", affiliateUrl: "https://meli.la/1QMfKob" },
  { url: "https://www.mercadolibre.com.ar/jarra-electrica-liliana-base-giratoria-36-17l-2000w-blanco/p/MLA8933826", affiliateUrl: "https://meli.la/2qM28cx" },
  { url: "https://www.mercadolibre.com.ar/pava-electrica-liliana-tempomate-ap175-capacidad-17-l-negro/p/MLA27849823", affiliateUrl: "https://meli.la/2GFun2e" },
  { url: "https://www.mercadolibre.com.ar/pava-electrica-liliana-safeheat-ap992b-15lts-blanca-color-blanco/p/MLA54152343", affiliateUrl: "https://meli.la/1hkV3Et" },
  { url: "https://www.mercadolibre.com.ar/pava-electrica-oster-bvstkt4970b-negra-17-litros/p/MLA11145437", affiliateUrl: "https://meli.la/31ihPzQ" },
  { url: "https://www.mercadolibre.com.ar/pava-electrica-oster-8970-color-plateado/p/MLA8993736", affiliateUrl: "https://meli.la/1jdC3sW" },
];

function delay(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

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
    const priceSel = [".ui-pdp-price__second-line .andes-money-amount__fraction", ".ui-pdp-price .andes-money-amount__fraction"];
    let priceText = "";
    for (const s of priceSel) { const e = document.querySelector(s); if (e?.textContent) { priceText = e.textContent.trim(); break; } }
    const price = parseInt(priceText.replace(/\./g, ""), 10) || 0;
    const centsEl = document.querySelector(".ui-pdp-price__second-line .andes-money-amount__cents");
    const cents = centsEl ? parseInt(centsEl.textContent?.trim() || "0", 10) : 0;
    const origEl = document.querySelector(".ui-pdp-price__original-value .andes-money-amount__fraction");
    const originalPrice = origEl ? parseInt(origEl.textContent?.trim().replace(/\./g, "") || "0", 10) : undefined;

    const descSel = [".ui-pdp-description__content p", ".ui-pdp-description__content", ".ui-vpp-highlighted-specs__striped-specs"];
    let description = "";
    for (const s of descSel) { const e = document.querySelector(s); if (e?.textContent?.trim()) { description = e.textContent.trim(); break; } }

    const imgSet = new Set<string>();
    document.querySelectorAll(".ui-pdp-gallery__figure img, .ui-pdp-image").forEach((img) => {
      const src = (img as HTMLImageElement).dataset.zoom || (img as HTMLImageElement).src || "";
      if (src && !src.includes("data:") && src.includes("mlstatic") && !src.includes("logos-api") && !src.includes("vectorial")) imgSet.add(src.replace(/D_Q_NP_/, "D_NQ_NP_2X_").replace(/-[VRTS]\./, "-F."));
    });

    const condText = (document.querySelector(".ui-pdp-header__subtitle")?.textContent || "").toLowerCase();
    const soldMatch = condText.match(/(\+?\d[\d.]*)\s*(vendidos?)/i);
    const soldQuantity = soldMatch ? parseInt(soldMatch[1].replace(/\./g, ""), 10) : undefined;

    const shipText = (document.querySelector(".ui-pdp-media__title, .ui-pdp-color--GREEN")?.textContent || "").toLowerCase();
    const freeShipping = shipText.includes("gratis");

    const ratingEl = document.querySelector(".ui-pdp-review__rating");
    const rating = ratingEl ? parseFloat(ratingEl.textContent?.trim() || "0") || undefined : undefined;

    return { title, price: price + cents/100, originalPrice, description: description.slice(0,300), images: Array.from(imgSet).slice(0,5), freeShipping, rating, soldQuantity };
  });
}

async function main() {
  console.log(`\n🚀 Scraping ${PRODUCTS.length} Fase 2 products...\n`);
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox","--disable-blink-features=AutomationControlled"] });
  const page = await browser.newPage();
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36");
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
    const mlaMatch = url.match(/MLA(\d+)/);
    const id = mlaMatch ? `MLA${mlaMatch[1]}` : `scraped-${Date.now()}`;
    console.log(`[${i+1}/${PRODUCTS.length}] ${id}`);

    try {
      const data = await scrapePage(page, url);
      if (!data.title || data.price === 0) { console.log(`  ⚠️ Blocked — skipping`); continue; }

      const images = data.images.length > 0 ? data.images : [];
      const entry = `  {
    id: '${id}',
    title: ${JSON.stringify(data.title)},
    price: ${data.price},
    originalPrice: ${data.originalPrice ?? "undefined"},
    currency: 'ARS',
    image: '${images[0] || ""}',
    images: ${JSON.stringify(images, null, 6).replace(/\n\s*/g, "\n      ")},
    category: 'Cocina',
    categorySlug: 'cocina',
    permalink: '${url.split("#")[0]}',
    affiliateUrl: '${affiliateUrl}',
    condition: 'new',
    freeShipping: ${data.freeShipping},
    rating: ${data.rating ?? "undefined"},
    soldQuantity: ${data.soldQuantity ?? "undefined"},
    pastelColor: 'var(--pastel-coral)',
    description: ${JSON.stringify(data.description)},
  }`;

      results.push(entry);
      success++;
      console.log(`  ✅ ${data.title.slice(0, 55)}… — $${data.price}`);
      await delay(3000 + Math.random() * 3000);
    } catch (err) {
      console.log(`  ❌ ${err instanceof Error ? err.message : err}`);
    }
  }

  await browser.close();

  if (results.length > 0) {
    const filePath = path.resolve(__dirname, "../src/data/curated-products.ts");
    let content = fs.readFileSync(filePath, "utf-8");
    const insertPoint = content.lastIndexOf("];");
    content = content.slice(0, insertPoint) + results.join(",\n") + ",\n" + content.slice(insertPoint);
    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`\n✅ Appended ${results.length} products to curated-products.ts`);
  }

  console.log(`\n📊 ${success}/${PRODUCTS.length} success`);
}

main().catch(console.error);
