#!/usr/bin/env npx tsx
/**
 * Batch ML Scraper — ONLY the 48 remaining products (PROD_38 to PROD_85)
 *
 * Reads existing curated-products.ts, scrapes only missing products,
 * and appends them to the file.
 *
 * Usage: npx tsx scripts/batch-scrape-remaining.ts
 */

import puppeteer, { type Page } from "puppeteer";
import * as fs from "fs";
import * as path from "path";

// ─── Only the 48 that failed ───
interface ProductInput {
  id: string;
  url: string;
  affiliateUrl: string;
}

const REMAINING: ProductInput[] = [
  { id: "PROD_38", url: "https://articulo.mercadolibre.com.ar/MLA-2351761364-especiero-organizador-triple-giratorio-alacena-cocina-bano-_JM", affiliateUrl: "https://meli.la/1TgQago" },
  { id: "PROD_39", url: "https://www.mercadolibre.com.ar/organizador-mesada-alacena-cocina-bano-escritorio-giratorio-color-transparente/p/MLA62559448", affiliateUrl: "https://meli.la/1Lzw2J3" },
  { id: "PROD_40", url: "https://www.mercadolibre.com.ar/carrito-multiuso-organizador-3-estantes-metalico-con-ruedas/up/MLAU3692700236", affiliateUrl: "https://meli.la/1YGS6Z8" },
  { id: "PROD_41", url: "https://articulo.mercadolibre.com.ar/MLA-1100090508-gancho-giratorio-organizador-alacena-cocina-bano-utensillos-_JM", affiliateUrl: "https://meli.la/12R3uKy" },
  { id: "PROD_42", url: "https://articulo.mercadolibre.com.ar/MLA-705286189-aromatizador-ultrasonico-usb-led-rgb-6228-_JM", affiliateUrl: "https://meli.la/2QdWdwH" },
  { id: "PROD_43", url: "https://articulo.mercadolibre.com.ar/MLA-841529901-humificador-electrico-aromaterapia-luces-led-vapor-tren-_JM", affiliateUrl: "https://meli.la/1KGdERH" },
  { id: "PROD_44", url: "https://www.mercadolibre.com.ar/difusor-aromatico-humidificador-aceites-relax-luz-led-300-ml/up/MLAU231395761", affiliateUrl: "https://meli.la/2bqzDDr" },
  { id: "PROD_45", url: "https://www.mercadolibre.com.ar/humidificador-difusor-vaporizador-perfumero-usb-luz-led/up/MLAU210122868", affiliateUrl: "https://meli.la/1W7dAYq" },
  { id: "PROD_46", url: "https://articulo.mercadolibre.com.ar/MLA-886877609-humidificador-difusor-vaporizador-purificador-de-ambiente-_JM", affiliateUrl: "https://meli.la/2eeBETs" },
  { id: "PROD_47", url: "https://www.mercadolibre.com.ar/lampara-velador-vl040-led-doble-dakota-plegable-mesa-escritorio-flexible-tactil-recargable-lapicero-color-blanco/p/MLA38663276", affiliateUrl: "https://meli.la/2YUrCmM" },
  { id: "PROD_48", url: "https://www.mercadolibre.com.ar/lampara-velador-led-dakota-plegable-mesa-escritorio-flexible-tactil-recargable-lapicero-color-rosa/p/MLA47263010", affiliateUrl: "https://meli.la/194ZNBV" },
  { id: "PROD_49", url: "https://articulo.mercadolibre.com.ar/MLA-1454279831-velador-centro-de-mesa-recargable-usb-c-tactil-dimmerizable-_JM", affiliateUrl: "https://meli.la/1efXq81" },
  { id: "PROD_50", url: "https://www.mercadolibre.com.ar/lampara-velador-led-dakota-mesa-escritorio-flexible-dimerizable-tactil-recargable-lapicero/p/MLA38663195", affiliateUrl: "https://meli.la/2UBdw1h" },
  { id: "PROD_51", url: "https://www.mercadolibre.com.ar/lampara-luna-velador-led-tactil-recargable-usb-moonlamp/up/MLAU156843560", affiliateUrl: "https://meli.la/24XwvhU" },
  { id: "PROD_52", url: "https://www.mercadolibre.com.ar/lampara-velador-led-recargable-usb-cristal-dimmer-tactil-bar-color-de-la-estructura-transparente/p/MLA23486209", affiliateUrl: "https://meli.la/2GwL5yi" },
  { id: "PROD_53", url: "https://www.mercadolibre.com.ar/velador-gadnic-luz-de-noche-led-tactil-recargable-usb-7-colores-control-tactil-ni70/p/MLA26853638", affiliateUrl: "https://meli.la/1taPifq" },
  { id: "PROD_54", url: "https://www.mercadolibre.com.ar/velador-tactil-led-recargable-practiled-usb-para-botella-mesa-luz-regulable/p/MLA57493486", affiliateUrl: "https://meli.la/19aMEFF" },
  { id: "PROD_55", url: "https://www.mercadolibre.com.ar/velador-lampara-led-recargable-usb-dimmer-3-luces-fria-calida-neutra-tactil-touch-ideal-bar-velador-moderno-elegante-velador-de-mesa-levys-bazar-color-plateado/p/MLA52016063", affiliateUrl: "https://meli.la/2s7uq9c" },
  { id: "PROD_56", url: "https://www.mercadolibre.com.ar/lampara-tactil-led-inalambrica-electroland-escritorio-blanco-usb-plegable/p/MLA24314471", affiliateUrl: "https://meli.la/2DXR2oY" },
  { id: "PROD_57", url: "https://www.mercadolibre.com.ar/mopa-plana-suono-de-microfibra-limpieza-pisos-lavable-reforzada-con-rociador-tanque-300ml-color-crema-41x14cm/p/MLA22894851", affiliateUrl: "https://meli.la/1FHPDa8" },
  { id: "PROD_58", url: "https://www.mercadolibre.com.ar/mopa-blue-clair-mopa-spray-negro/p/MLA45107869", affiliateUrl: "https://meli.la/2j2oHbo" },
  { id: "PROD_59", url: "https://www.mercadolibre.com.ar/mopa-iberia-pronto-magic-mop-blanco/p/MLA23571779", affiliateUrl: "https://meli.la/1WCfo81" },
  { id: "PROD_60", url: "https://www.mercadolibre.com.ar/mopa-doble-con-rociador-y-trapeador-pearl-spray-limpia-facil/up/MLAU3514734808", affiliateUrl: "https://meli.la/1TeUiyj" },
  { id: "PROD_61", url: "https://articulo.mercadolibre.com.ar/MLA-1360766060-spray-mopa-trapeador-rociador-microfibra-limpiador-piso-_JM", affiliateUrl: "https://meli.la/1fFZj1x" },
  { id: "PROD_62", url: "https://www.mercadolibre.com.ar/vileda-promist-max-mopa-plana-microfibra-con-spray/p/MLA20032873", affiliateUrl: "https://meli.la/2cjV3LF" },
  { id: "PROD_63", url: "https://www.mercadolibre.com.ar/aspiradora-robot-trapeadora-fika-nexos-giroscopica-pelos-mascotas-app-wifi-color-negro/p/MLA63784269", affiliateUrl: "https://meli.la/2P2DXaC" },
  { id: "PROD_64", url: "https://www.mercadolibre.com.ar/aspiradora-robot-gadnic-3-modos-limpieza-poder-de-succion-negro/p/MLA42045783", affiliateUrl: "https://meli.la/2WGATBu" },
  { id: "PROD_65", url: "https://www.mercadolibre.com.ar/aspiradora-robot-trapeadora-gadnic-aspirob-recargable-inteligente-detecta-obstaculos-mapeo-app/p/MLA36838658", affiliateUrl: "https://meli.la/2mPhJwy" },
  { id: "PROD_66", url: "https://www.mercadolibre.com.ar/aspiradora-y-trapeadora-robot-fika-sense-antichoque-con-app-wifi-color-negro/p/MLA54522658", affiliateUrl: "https://meli.la/2L3rk3G" },
  { id: "PROD_67", url: "https://www.mercadolibre.com.ar/aspiradora-robot-con-wifi-smart-115w-midow-3-modos-con-base-negro/p/MLA48378491", affiliateUrl: "https://meli.la/1ZQQnmr" },
  { id: "PROD_68", url: "https://www.mercadolibre.com.ar/aspiradora-robot-gadnic-5-modos-limpieza-trapeo-inteligente-deposito-de-agua-polvo-control-app-conexion-inalambrica-sensores-anticolision-anticaida/p/MLA45951645", affiliateUrl: "https://meli.la/2kRauwY" },
  { id: "PROD_69", url: "https://www.mercadolibre.com.ar/aspiradora-robot-gadnic-5000-pa-lidar-360-base-autolimpiante-bolsa-32-litros-140-min-autonomia-3200-mah-app-tuya/p/MLA62126950", affiliateUrl: "https://meli.la/2UjN3FV" },
  { id: "PROD_70", url: "https://www.mercadolibre.com.ar/aspiradora-robot-xiaomi-vacuum-s40c-e101-blanco/p/MLA61420449", affiliateUrl: "https://meli.la/16WtjsG" },
  { id: "PROD_71", url: "https://www.mercadolibre.com.ar/cepillo-electrico-limpieza-piso-pared-recargable-usb-8-en-1/up/MLAU3372015976", affiliateUrl: "https://meli.la/1vzYS3u" },
  { id: "PROD_72", url: "https://www.mercadolibre.com.ar/aspiradora-inalambrica-yelmo-as-3244-395ml-recargable-usb-celestenaranja-filtro-hepa/p/MLA44863825", affiliateUrl: "https://meli.la/2Eur6DD" },
  { id: "PROD_73", url: "https://www.mercadolibre.com.ar/multi-cepillo-9-en-1-rotativo-450-rpm-para-limpieza-de-casa-auto-vidrios-con-mango-extensible-y-bateria-recargable-mts-powerbrushpro-amitosai/p/MLA43422049", affiliateUrl: "https://meli.la/1SefDq3" },
  { id: "PROD_74", url: "https://www.mercadolibre.com.ar/cepillo-electrico-recargable-para-limpieza-de-piso-lineal-jt080350-blanco-unidad-1/p/MLA23532244", affiliateUrl: "https://meli.la/17LA34g" },
  { id: "PROD_75", url: "https://www.mercadolibre.com.ar/mini-proyector-portatil-4k-fika-p8-hd-720p-8000-lumens-170-ansi-android-wifi-4k-cine-color-blanco/p/MLA52661526", affiliateUrl: "https://meli.la/2SE2D2R" },
  { id: "PROD_76", url: "https://www.mercadolibre.com.ar/mini-proyector-portatil-4k-fika-b2-full-hd-1080p-14000-lumens-300-ansi-lumens-android-wifi-cine-color-blanco/p/MLA52364259", affiliateUrl: "https://meli.la/2RMfJnH" },
  { id: "PROD_77", url: "https://www.mercadolibre.com.ar/mini-proyector-portatil-4k-fika-p8-hd-720p-8000-lumens-170-ansi-android-wifi-cine-color-negro/p/MLA52018443", affiliateUrl: "https://meli.la/2X4c4V9" },
  { id: "PROD_78", url: "https://www.mercadolibre.com.ar/proyector-portatil-4k-hy300-full-hd-wifi-hdmi-android-11-bt-50/p/MLA42238146", affiliateUrl: "https://meli.la/1MtgG5J" },
  { id: "PROD_79", url: "https://www.mercadolibre.com.ar/proyector-mini-ultrahd-hy-300-8000lm-blanco/p/MLA43932163", affiliateUrl: "https://meli.la/1h76Rbw" },
  { id: "PROD_80", url: "https://www.mercadolibre.com.ar/proyector-portatil-led-dakota-8500lm-wifi-1080p-mirrorlink-color-negro/p/MLA24692647", affiliateUrl: "https://meli.la/1XNEyWg" },
  { id: "PROD_81", url: "https://www.mercadolibre.com.ar/proyector-generica-proyector-android-9000lm-blanco/p/MLA43926951", affiliateUrl: "https://meli.la/1rYKE5Q" },
  { id: "PROD_82", url: "https://www.mercadolibre.com.ar/proyector-portatil-gadnic-p-3129-fhd-soporta-4k-bt-multi-conexion-5000-lumenes-control-remoto-40-a-150/p/MLA43928643", affiliateUrl: "https://meli.la/1keA7kg" },
  { id: "PROD_83", url: "https://www.mercadolibre.com.ar/mini-proyector-led-portatil-1200-lumens-color-blanco/p/MLA22975097", affiliateUrl: "https://meli.la/2UNEksE" },
  { id: "PROD_84", url: "https://www.mercadolibre.com.ar/proyector-led-smart-android-11-fhd-4500-lumenes-wifi-bt-color-blanco/p/MLA28251222", affiliateUrl: "https://meli.la/13EBUyg" },
  { id: "PROD_85", url: "https://www.mercadolibre.com.ar/proyector-portatil-long-xing-mini-hy300-android-11-wi-fi-bluetooth-4k-blanco/p/MLA42796008", affiliateUrl: "https://meli.la/1Q9Gwjq" },
];

// ─── Helpers (same as batch-scrape.ts) ───
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
  "electrodomesticos-cocina": "cocina", mandolina: "cocina", cortador: "cocina",
  rallador: "cocina", picador: "cocina", "utensilios-de-preparacion": "cocina",
  sarten: "cocina", "corta-papas": "cocina", cortadora: "cocina", dispensador: "cocina",
  dispenser: "cocina", especiero: "cocina", sellador: "cocina", mezclador: "cocina",
  helado: "cocina", huevera: "cocina",
  "hogar-muebles-jardin": "hogar", "decoracion-hogar": "hogar",
  iluminacion: "hogar", organizacion: "hogar", limpieza: "hogar",
  organizador: "hogar", carrito: "hogar", gancho: "hogar",
  mopa: "hogar", aspiradora: "hogar", cepillo: "hogar", "limpia-vidrio": "hogar",
  "limpia-ventana": "hogar", robot: "hogar",
  electronica: "tech", "celulares-accesorios": "tech", computacion: "tech",
  proyector: "tech", "mini-proyector": "tech",
  "belleza-cuidado-personal": "belleza", "salud-belleza": "belleza",
  aromatizador: "belleza", humidificador: "belleza", humificador: "belleza",
  difusor: "belleza", vaporizador: "belleza",
  "deportes-fitness": "fitness", "ropa-accesorios": "moda",
  lampara: "hogar", velador: "hogar", led: "hogar", tira: "hogar",
  manguera: "hogar", ventilador: "hogar", astronauta: "hogar",
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
  freeShipping: boolean; rating?: number; reviewCount?: number;
  soldQuantity?: number; categoryBreadcrumb: string[];
}

async function scrapePage(page: Page, url: string): Promise<ScrapedData> {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let total = 0;
      const timer = setInterval(() => { window.scrollBy(0, 400); total += 400; if (total >= document.body.scrollHeight) { clearInterval(timer); resolve(); } }, 100);
    });
  });
  await page.waitForSelector("h1", { timeout: 15000 });
  await delay(1200);

  return page.evaluate(() => {
    const title = document.querySelector("h1.ui-pdp-title")?.textContent?.trim() || "";
    const priceSelectors = [".ui-pdp-price__second-line .andes-money-amount__fraction", ".ui-pdp-price .andes-money-amount__fraction", "[class*='price'] .andes-money-amount__fraction"];
    let priceText = "";
    for (const s of priceSelectors) { const e = document.querySelector(s); if (e?.textContent) { priceText = e.textContent.trim(); break; } }
    const price = parseInt(priceText.replace(/\./g, ""), 10) || 0;
    const centsEl = document.querySelector(".ui-pdp-price__second-line .andes-money-amount__cents");
    const cents = centsEl ? parseInt(centsEl.textContent?.trim() || "0", 10) : 0;
    const origEl = document.querySelector(".ui-pdp-price__original-value .andes-money-amount__fraction");
    const originalPrice = origEl ? parseInt(origEl.textContent?.trim().replace(/\./g, "") || "0", 10) : undefined;
    const currEl = document.querySelector(".ui-pdp-price__second-line .andes-money-amount__currency-symbol");
    const currency = (currEl?.textContent?.trim() || "$") === "U$S" ? "USD" : "ARS";
    const descSelectors = [".ui-pdp-description__content p", ".ui-pdp-description__content", ".ui-pdp-description p", ".ui-vpp-highlighted-specs__striped-specs"];
    let description = "";
    for (const s of descSelectors) { const e = document.querySelector(s); if (e?.textContent?.trim()) { description = e.textContent.trim(); break; } }
    if (!description) {
      const feats = document.querySelectorAll(".ui-vpp-highlighted-specs__features-list li, .ui-pdp-features__item");
      if (feats.length) { const items: string[] = []; feats.forEach(f => { if (f.textContent?.trim()) items.push(f.textContent.trim()); }); description = items.join(". "); }
    }
    const imgsSet = new Set<string>();
    document.querySelectorAll(".ui-pdp-gallery__figure img, .ui-pdp-image.ui-pdp-image--gallery").forEach(img => {
      const src = (img as HTMLImageElement).dataset.zoom || (img as HTMLImageElement).src || "";
      if (src && !src.includes("data:") && !src.includes("placeholder")) imgsSet.add(src.replace(/-[A-Z]\.jpg/, "-O.jpg"));
    });
    document.querySelectorAll(".ui-pdp-thumbnail__picture img").forEach(img => {
      const src = (img as HTMLImageElement).src || "";
      if (src && !src.includes("data:")) imgsSet.add(src.replace(/-[A-Z]\.jpg/, "-O.jpg"));
    });
    const condEl = document.querySelector(".ui-pdp-header__subtitle, .ui-pdp-subtitle");
    const condText = condEl?.textContent?.toLowerCase() || "";
    const condition: "new" | "used" = condText.includes("usado") ? "used" : "new";
    const soldMatch = condText.match(/(\+?\d[\d.]*)\s*(vendidos?|sold)/i);
    const soldQuantity = soldMatch ? parseInt(soldMatch[1].replace(/\./g, ""), 10) : undefined;
    const shipEl = document.querySelector(".ui-pdp-media__title, .ui-pdp-color--GREEN");
    const freeShipping = (shipEl?.textContent?.toLowerCase() || "").includes("gratis");
    const ratEl = document.querySelector(".ui-pdp-review__rating, .ui-pdp-reviews__rating__summary__average");
    const rating = ratEl ? parseFloat(ratEl.textContent?.trim() || "0") || undefined : undefined;
    const revEl = document.querySelector(".ui-pdp-review__amount, .ui-pdp-reviews__rating__summary__label");
    const revMatch = (revEl?.textContent?.trim() || "").match(/(\d+)/);
    const reviewCount = revMatch ? parseInt(revMatch[1], 10) : undefined;
    const bcEls = document.querySelectorAll(".andes-breadcrumb__item a, .andes-breadcrumb__link");
    const categoryBreadcrumb: string[] = [];
    bcEls.forEach(el => { const t = el.textContent?.trim(); if (t && t !== "..." && t !== "\u2026") categoryBreadcrumb.push(t); });
    return { title, price: price + cents / 100, originalPrice, currency, description, images: Array.from(imgsSet), condition, freeShipping, rating, reviewCount, soldQuantity, categoryBreadcrumb };
  });
}

// ─── Main ───
async function main() {
  const curatedPath = path.join(__dirname, "..", "src", "data", "curated-products.ts");
  const existingContent = fs.readFileSync(curatedPath, "utf-8");

  console.log(`\nScraping ${REMAINING.length} remaining products...\n`);

  // Collect new product entries as strings
  const newEntries: string[] = [];
  const errors: string[] = [];
  let successCount = 0;

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-blink-features=AutomationControlled", "--window-size=1920,1080"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "webdriver", { get: () => false });
      Object.defineProperty(navigator, "languages", { get: () => ["es-AR", "es", "en-US", "en"] });
    });

    for (let i = 0; i < REMAINING.length; i++) {
      const prod = REMAINING[i];
      const progress = `[${i + 1}/${REMAINING.length}]`;

      try {
        if (i % 10 === 0) await page.setUserAgent(randomUA());

        console.log(`${progress} Scraping: ${prod.url.substring(0, 80)}...`);
        const data = await scrapePage(page, prod.url);

        if (!data.title || data.price === 0) {
          console.log(`${progress} ⚠️  Empty data, skipping`);
          errors.push(`${prod.id}: empty data`);
          continue;
        }

        const mlaMatch = prod.url.match(/MLA[-U]?(\d+)/i);
        const id = mlaMatch ? `MLA${mlaMatch[1]}` : prod.id;
        const catInput = [...data.categoryBreadcrumb, data.title].join(" ");
        const categorySlug = mapCategory(catInput);
        const imgs = data.images.slice(0, 5);
        const desc = data.description ? data.description.replace(/'/g, "\\'").replace(/\n/g, " ").substring(0, 300) : "";

        const entry = [
          "  {",
          `    id: '${id}',`,
          `    title: '${data.title.replace(/'/g, "\\'")}',`,
          `    price: ${data.price},`,
          `    originalPrice: ${data.originalPrice || "undefined"},`,
          `    currency: '${data.currency}',`,
          `    image: '${imgs[0] || ""}',`,
          `    images: [`,
          ...imgs.map(img => `      '${img}',`),
          `    ],`,
          `    category: '${(data.categoryBreadcrumb[0] || "General").replace(/'/g, "\\'")}',`,
          `    categorySlug: '${categorySlug}',`,
          `    permalink: '${prod.url}',`,
          `    affiliateUrl: '${prod.affiliateUrl}',`,
          `    condition: '${data.condition}',`,
          `    freeShipping: ${data.freeShipping},`,
          `    rating: ${data.rating || "undefined"},`,
          `    soldQuantity: ${data.soldQuantity || "undefined"},`,
          `    pastelColor: '${PASTEL_MAP[categorySlug] || "var(--pastel-blue)"}',`,
          ...(desc ? [`    description: '${desc}',`] : []),
          "  },",
        ].join("\n");

        newEntries.push(entry);
        successCount++;
        console.log(`${progress} ✅ ${data.title.substring(0, 50)}... — $${data.price.toLocaleString("es-AR")}`);

        const waitMs = 1500 + Math.random() * 2000;
        await delay(waitMs);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.log(`${progress} ❌ Error: ${msg.substring(0, 80)}`);
        errors.push(`${prod.id}: ${msg.substring(0, 100)}`);
      }
    }
  } finally {
    await browser.close();
  }

  if (newEntries.length > 0) {
    // Insert new entries before the closing "];"
    const insertPoint = existingContent.lastIndexOf("];");
    const before = existingContent.substring(0, insertPoint);
    const after = existingContent.substring(insertPoint);
    const newContent = before + newEntries.join("\n") + "\n" + after;
    fs.writeFileSync(curatedPath, newContent, "utf-8");
  }

  console.log(`\n════════════════════════════════════`);
  console.log(`✅ Done! ${successCount} new products appended (total now: ${38 + successCount})`);
  if (errors.length > 0) {
    console.log(`⚠️  ${errors.length} still failed:`);
    errors.forEach((e) => console.log(`   - ${e}`));
  }
  console.log(`════════════════════════════════════\n`);
}

main().catch((err) => { console.error("Fatal:", err); process.exit(1); });
