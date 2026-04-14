#!/usr/bin/env npx tsx
import puppeteer, { type Page } from "puppeteer";
import * as fs from "fs";
import * as path from "path";

const PRODUCTS = [
  { url: "https://www.mercadolibre.com.ar/freidora-de-aire-atma-fr248ap-1750w-8l-y-control-tactil/p/MLA39861162", affiliateUrl: "https://meli.la/2UfmcVY" },
  { url: "https://www.mercadolibre.com.ar/freidora-de-aire-digital-sin-aceite-atma-pro-fr60ar-65l-color-blanco/p/MLA27351841", affiliateUrl: "https://meli.la/2H5RRoD" },
  { url: "https://www.mercadolibre.com.ar/freidora-de-aire-y-grill-digital-atma-fr901dp-63-litros/p/MLA37004216", affiliateUrl: "https://meli.la/1gGXWsc" },
  { url: "https://www.mercadolibre.com.ar/freidora-de-aire-atma-pro-doble-canasta-85-litros-2200w-frd248a/p/MLA40161710", affiliateUrl: "https://meli.la/2aw3uVJ" },
  { url: "https://www.mercadolibre.com.ar/freidora-de-aire-peabody-pe-afd650n-65l-visor-7-programas-color-negro/p/MLA44703897", affiliateUrl: "https://meli.la/2zaHWZ2" },
  { url: "https://www.mercadolibre.com.ar/freidora-de-aire-peabody-pe-afd720n-72l-visor-360-11-prog-color-negro/p/MLA41829394", affiliateUrl: "https://meli.la/1tZqZqD" },
  { url: "https://www.mercadolibre.com.ar/freidora-doble-piso-pe-afdl102n-capacidad-10-l-peabody-negro/p/MLA53776810", affiliateUrl: "https://meli.la/2vwo31u" },
  { url: "https://www.mercadolibre.com.ar/freidora-de-aire-peabody-con-grill-6-litros-1600-watts-pe-afg01ix-color-plateado/p/MLA23318618", affiliateUrl: "https://meli.la/1afZm1r" },
  { url: "https://www.mercadolibre.com.ar/freidora-de-aire-philips-na12000-negra-42l-negro/p/MLA61393261", affiliateUrl: "https://meli.la/2gU6JZ1" },
  { url: "https://www.mercadolibre.com.ar/freidora-de-aire-philips-canasta-doble-9-litros-phna35100-negro/p/MLA55779230", affiliateUrl: "https://meli.la/15VAU5a" },
  { url: "https://www.mercadolibre.com.ar/freidora-de-aire-philips-phna23100-13-en-1-62-l-negra/p/MLA53675940", affiliateUrl: "https://meli.la/2LJBpLs" },
  { url: "https://www.mercadolibre.com.ar/airfryer-hd928090-essential-xl-color-negro-philips/p/MLA19630913", affiliateUrl: "https://meli.la/15xe1UZ" },
  { url: "https://www.mercadolibre.com.ar/freidora-de-aire-62-litros-philips-essential-hd927091-negro/p/MLA19630911", affiliateUrl: "https://meli.la/2q6aiV8" },
  { url: "https://www.mercadolibre.com.ar/freidora-de-aire-oster-airfryer-dual-76l-diamondforce-6-fun-color-negro/p/MLA28709303", affiliateUrl: "https://meli.la/1rwaoYB" },
  { url: "https://www.mercadolibre.com.ar/freidora-de-aire-digital-oster-con-ventana-4-litros/p/MLA41041543", affiliateUrl: "https://meli.la/1s4Hmke" },
  { url: "https://www.mercadolibre.com.ar/freidora-de-aire-52-l-ninja-crispi/p/MLA62320294", affiliateUrl: "https://meli.la/2uHHEk7" },
  { url: "https://www.mercadolibre.com.ar/freidora-de-aire-powerxl-38l-10-funciones-af-e4001-ar-color-negro/p/MLA36974228", affiliateUrl: "https://meli.la/1Z6YNuK" },
  { url: "https://www.mercadolibre.com.ar/freidora-de-aire-kanji-home-8-litros-10-funciones-canasta-antiadherente-kjh-1700dc-1700w-lh-color-negro/p/MLA42113760", affiliateUrl: "https://meli.la/2pFTX5c" },
  { url: "https://www.mercadolibre.com.ar/freidora-de-aire-gadnic-65-l-1400w-220-240v-temperatura-80-a-200-c-temporizador-60-minutos-pinza-incluida/p/MLA44142280", affiliateUrl: "https://meli.la/1AMQ3m9" },
  { url: "https://www.mercadolibre.com.ar/airfryer-suono-digital-y-doble-resistencia-12-programas-10l-negro/p/MLA54106293", affiliateUrl: "https://meli.la/1hCBwJ3" },
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
  console.log(`\n🚀 Scraping ${PRODUCTS.length} airfryers...\n`);
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
    const mlaMatch = url.match(/MLA[U]?(\d+)/);
    const prefix = url.includes("MLAU") ? "MLAU" : "MLA";
    const id = mlaMatch ? `${prefix}${mlaMatch[1]}` : `scraped-${Date.now()}`;
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
