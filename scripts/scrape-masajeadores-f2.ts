#!/usr/bin/env npx tsx
import puppeteer, { type Page } from "puppeteer";
import * as fs from "fs";
import * as path from "path";

const PRODUCTS = [
  { url: "https://articulo.mercadolibre.com.ar/MLA-1841302022-masajeador-facial-energy-golden-bar-electroestimulante-_JM", affiliateUrl: "https://meli.la/13fYLhg" },
  { url: "https://www.mercadolibre.com.ar/kit-masajeador-facial-jade-rodillo-piedra-guasha-natural-color-verde/p/MLA24518712", affiliateUrl: "https://meli.la/1rDGvYf" },
  { url: "https://www.mercadolibre.com.ar/equipo-de-alta-frecuencia-gadnic-lf60-antienvejecimiento-antiacne-reafirmante-facial-4-electrodos/p/MLA26522167", affiliateUrl: "https://meli.la/2a6LCX1" },
  { url: "https://www.mercadolibre.com.ar/asiento-masajeador-cervical-espalda-calor-vibracion-shiatsu/p/MLA28420339", affiliateUrl: "https://meli.la/1zRo95J" },
  { url: "https://www.mercadolibre.com.ar/masajeador-de-espalda-asiento-cuello-auto-silla-vibra-calor/up/MLAU274288377", affiliateUrl: "https://meli.la/1ZW9A5Y" },
  { url: "https://www.mercadolibre.com.ar/pistola-masajeadora-bateria-recargable-motor-brushless-corporal-pro-usb-masajeador-electrico-massage-gun-cabezales-intercambiables-femmto/p/MLA37908577", affiliateUrl: "https://meli.la/1cUYmpY" },
  { url: "https://www.mercadolibre.com.ar/masajeador-caliber-doble-cabezal-percutor-infrarrojo-premium/p/MLA25263767", affiliateUrl: "https://meli.la/2gqPvgW" },
  { url: "https://www.mercadolibre.com.ar/masajeador-de-pies-con-calor-compresion-y-rodillos-alivio-del-dolor-relajacion-muscular-y-mejora-circulacion/p/MLA23131501", affiliateUrl: "https://meli.la/2d7VKT6" },
  { url: "https://www.mercadolibre.com.ar/masajeador-de-pies-san-up-reflexwave-3-niveles-de-calor-y-modos-masaje-2-niveles-de-intensidad-gris/p/MLA47148409", affiliateUrl: "https://meli.la/1Goq57P" },
  { url: "https://www.mercadolibre.com.ar/masajeador-cervical-electrico-portatil-inalambrico-bateria-recargable-usb-femmto-relajacion-cuello-espalda-lumbar/p/MLA24127896", affiliateUrl: "https://meli.la/1VsNQ2J" },
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
  console.log(`\n🚀 Scraping ${PRODUCTS.length} masajeadores Fase 2...\n`);
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
    category: 'Belleza',
    categorySlug: 'belleza',
    permalink: '${url.split("#")[0]}',
    affiliateUrl: '${affiliateUrl}',
    condition: 'new',
    freeShipping: ${data.freeShipping},
    rating: ${data.rating ?? "undefined"},
    soldQuantity: ${data.soldQuantity ?? "undefined"},
    pastelColor: 'var(--pastel-pink)',
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
