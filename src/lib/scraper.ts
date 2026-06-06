import puppeteer, { type Browser, type Page } from "puppeteer";
import { buildAffiliateUrl, mapCategory } from "./mercadolibre";
import type { Product } from "./types";

// ─── Random User-Agent rotation ───
// SOLO User-Agents de Chrome: el navegador real es Chromium (Puppeteer), así que
// anunciar Firefox/Safari es una incoherencia que los anti-bot detectan al instante.
// La versión debe ir cerca del Chromium que trae Puppeteer (146.x en Puppeteer 24).
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
];

const PRICE_SELECTORS = [
  ".ui-pdp-price__second-line .andes-money-amount__fraction",
  ".ui-pdp-price .andes-money-amount__fraction",
  "[data-testid='price-part'] .andes-money-amount__fraction",
  ".ui-vpp-price .andes-money-amount__fraction",
  ".andes-money-amount__fraction",
  "meta[itemprop='price']",
  "meta[property='product:price:amount']",
];

function randomUA(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Scraped data shape (raw, before mapping to Product) ───
export interface ScrapedProduct {
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

// ─── Launch browser with anti-detection ───
async function launchBrowser(): Promise<Browser> {
  // Reusar siempre un perfil persistente: la sesión "bendecida" (cookies tras
  // pasar una verificación) baja muchísimo la chance de que ML pida CAPTCHA.
  const userDataDir =
    process.env.ML_SCRAPER_PROFILE_DIR || ".cache/ml-scraper-profile";

  return puppeteer.launch({
    headless: process.env.ML_SCRAPER_HEADFUL === "true" ? false : true,
    userDataDir,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--disable-infobars",
      "--window-size=1920,1080",
    ],
  });
}

async function setupPage(browser: Browser): Promise<Page> {
  const page = await browser.newPage();
  const ua = randomUA();

  await page.setUserAgent(ua);
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setExtraHTTPHeaders({
    "Accept-Language": "es-AR,es;q=0.9,en;q=0.8",
    "Upgrade-Insecure-Requests": "1",
  });

  try {
    await page.emulateTimezone("America/Argentina/Buenos_Aires");
  } catch {
    // Some Chromium builds do not ship every ICU timezone.
  }

  // NO BORRAR: shim de __name. tsx/esbuild (keepNames) reescribe las funciones
  // de este archivo a __name(fn, "nombre"). Cuando Puppeteer serializa esos
  // callbacks a page.evaluate, __name no existe en el navegador y tira
  // "ReferenceError: __name is not defined". Definirlo acá (corre antes que
  // cualquier page.evaluate) hace que el importer .ts vía tsx funcione.
  await page.evaluateOnNewDocument(() => {
    // @ts-expect-error -- shim para el helper que inyecta esbuild/tsx
    if (typeof globalThis.__name === "undefined") globalThis.__name = (fn) => fn;
  });

  // Override navigator.webdriver to avoid detection
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
    // @ts-expect-error -- overriding chrome detection
    window.chrome = { runtime: {} };
    Object.defineProperty(navigator, "plugins", {
      get: () => [1, 2, 3, 4, 5],
    });
    Object.defineProperty(navigator, "languages", {
      get: () => ["es-AR", "es", "en-US", "en"],
    });
    Object.defineProperty(navigator, "hardwareConcurrency", { get: () => 8 });
    Object.defineProperty(navigator, "deviceMemory", { get: () => 8 });
  });

  return page;
}

async function pageHasPrice(page: Page): Promise<boolean> {
  return page.evaluate((selectors) => {
    return selectors.some((selector) => {
      const el = document.querySelector(selector);
      const content =
        el?.getAttribute("content") || el?.textContent || "";
      return /\d/.test(content);
    });
  }, PRICE_SELECTORS);
}

const HEADFUL = process.env.ML_SCRAPER_HEADFUL === "true";
// En headful, cuánto esperar a que un humano resuelva la verificación (ms).
const HUMAN_WAIT_MS = Number(process.env.ML_HUMAN_WAIT_MS || 180000);

async function resolveMercadoLibreInterstitial(page: Page): Promise<void> {
  let verificationHits = 0;

  for (let attempt = 0; attempt < 6; attempt++) {
    if (await pageHasPrice(page)) return;

    const state = await page.evaluate(() => {
      const text = document.body?.innerText || "";
      const hasContinue = Boolean(document.querySelector("#continue-button"));
      const isAccountVerification = window.location.href.includes("/gz/account-verification");
      const isSuspiciousTraffic =
        text.includes("Verificación de seguridad") ||
        text.includes("suspicious-traffic") ||
        text.includes("No pudimos validar");

      return { hasContinue, isAccountVerification, isSuspiciousTraffic };
    });

    if (state.isAccountVerification || state.isSuspiciousTraffic) {
      // Headful: parar y darle tiempo al humano a resolver (login/captcha).
      // La sesión queda guardada en el perfil persistente para las próximas.
      if (HEADFUL) {
        const deadline = Date.now() + HUMAN_WAIT_MS;
        while (Date.now() < deadline) {
          await delay(3000);
          if (await pageHasPrice(page)) return;
        }
        throw new Error(
          "Verificación de MercadoLibre no resuelta a tiempo en la ventana de Chrome."
        );
      }

      // Headless: no abortar al toque. Esperar más (backoff) y reintentar la
      // navegación un par de veces antes de rendirse. A veces el challenge cede.
      verificationHits += 1;
      if (verificationHits >= 3) {
        throw new Error(
          "MercadoLibre pidió verificación de seguridad. Reintentá con ML_SCRAPER_HEADFUL=true (resolvés el CAPTCHA una vez y la sesión queda guardada en el perfil)."
        );
      }
      await delay(15000 + Math.random() * 15000); // 15-30s de backoff
      await page.reload({ waitUntil: "domcontentloaded", timeout: 30000 }).catch(() => undefined);
      continue;
    }

    if (state.hasContinue) {
      await page
        .waitForFunction(() => {
          const button = document.querySelector<HTMLButtonElement>("#continue-button");
          return !button || !button.disabled;
        }, { timeout: 35000 })
        .catch(() => undefined);

      await delay(800 + Math.random() * 1400);
      await page.click("#continue-button").catch(() => undefined);
      await page
        .waitForNavigation({ waitUntil: "domcontentloaded", timeout: 20000 })
        .catch(() => undefined);
      await delay(1200 + Math.random() * 1800);
      continue;
    }

    await delay(1200 + Math.random() * 1800);
  }
}

async function waitForProductContent(page: Page): Promise<void> {
  await resolveMercadoLibreInterstitial(page);
  await page
    .waitForFunction((selectors) => {
      return selectors.some((selector: string) => {
        const el = document.querySelector(selector);
        const content =
          el?.getAttribute("content") || el?.textContent || "";
        return /\d/.test(content);
      });
    }, { timeout: 20000 }, PRICE_SELECTORS)
    .catch(() => undefined);
}

// ─── Extract product data from a ML product page ───
async function extractProductData(page: Page, url: string): Promise<ScrapedProduct> {
  // Wait for critical content
  await page.waitForSelector("h1", { timeout: 15000 });
  await delay(1500); // Let dynamic content load

  const data = await page.evaluate(() => {
    const parseMoneyText = (raw: string | null | undefined): number | undefined => {
      if (!raw) return undefined;
      const cleaned = raw
        .replace(/\s+/g, " ")
        .replace(/[^\d.,]/g, "")
        .trim();
      if (!cleaned) return undefined;

      const normalized = cleaned.includes(",")
        ? cleaned.replace(/\./g, "").replace(",", ".")
        : cleaned.replace(/\.(?=\d{3}(?:\D|$))/g, "");
      const value = Number.parseFloat(normalized);
      return Number.isFinite(value) && value > 0 ? value : undefined;
    };

    const readMoneyElement = (el: Element | null): number | undefined => {
      if (!el) return undefined;
      const content = el.getAttribute("content");
      const fromContent = parseMoneyText(content);
      if (fromContent) return Math.round(fromContent);

      // Solo la parte entera (__fraction). NO concatenar __cents: en ML
      // Argentina los precios de PDP son enteros y ese __cents suele ser de
      // cuotas u otro valor → producía basura tipo $121.339,23.
      const fraction = el.querySelector(".andes-money-amount__fraction")?.textContent;
      const fromFraction = parseMoneyText(fraction);
      if (fromFraction) return Math.round(fromFraction);

      const aria = el.getAttribute("aria-label");
      const fromAria = parseMoneyText(aria);
      if (fromAria) return Math.round(fromAria);

      const fromText = parseMoneyText(el.textContent);
      return fromText ? Math.round(fromText) : undefined;
    };

    const isOriginalPriceContext = (el: Element): boolean => {
      const context = el.closest(
        ".ui-pdp-price__original-value, .andes-money-amount--previous, [class*='original'], [class*='previous']"
      );
      return Boolean(context);
    };

    const jsonLdScripts = Array.from(
      document.querySelectorAll<HTMLScriptElement>("script[type='application/ld+json']")
    );
    const jsonLdObjects: unknown[] = [];
    for (const script of jsonLdScripts) {
      const text = script.textContent?.trim();
      if (!text) continue;
      try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) jsonLdObjects.push(...parsed);
        else jsonLdObjects.push(parsed);
      } catch {
        // Ignore malformed JSON-LD blocks.
      }
    }

    const findJsonLdPrice = (): number | undefined => {
      const stack = [...jsonLdObjects] as Array<Record<string, unknown>>;
      while (stack.length > 0) {
        const current = stack.shift();
        if (!current || typeof current !== "object") continue;
        const price = parseMoneyText(String(current.price || ""));
        if (price) return price;
        for (const value of Object.values(current)) {
          if (Array.isArray(value)) {
            stack.push(...(value as Array<Record<string, unknown>>));
          } else if (value && typeof value === "object") {
            stack.push(value as Record<string, unknown>);
          }
        }
      }
      return undefined;
    };

    // ── Title ──
    const titleEl = document.querySelector("h1.ui-pdp-title");
    const title = titleEl?.textContent?.trim() || document.title?.trim() || "";

    // ── Price ──
    const priceSelectors = [
      ".ui-pdp-price__second-line .andes-money-amount",
      "[data-testid='price-part'] .andes-money-amount",
      ".ui-vpp-price .andes-money-amount",
      ".ui-pdp-price .andes-money-amount",
      "meta[itemprop='price']",
      "meta[property='product:price:amount']",
    ];
    let price = findJsonLdPrice();
    for (const selector of priceSelectors) {
      if (price) break;
      const candidates = Array.from(document.querySelectorAll(selector));
      for (const candidate of candidates) {
        if (candidate instanceof Element && isOriginalPriceContext(candidate)) continue;
        const value = readMoneyElement(candidate);
        if (value) {
          price = value;
          break;
        }
      }
    }
    if (!price) {
      const scriptsText = Array.from(document.scripts)
        .map((script) => script.textContent || "")
        .join("\n");
      const fallbackPatterns = [
        /"price"\s*:\s*"?(\d+(?:[.,]\d+)?)"?/i,
        /"amount"\s*:\s*(\d+(?:[.,]\d+)?)/i,
        /"current_price"\s*:\s*(\d+(?:[.,]\d+)?)/i,
      ];
      for (const pattern of fallbackPatterns) {
        const match = scriptsText.match(pattern);
        const value = parseMoneyText(match?.[1]);
        if (value) {
          price = value;
          break;
        }
      }
    }

    // ── Original price ──
    const originalPrice =
      readMoneyElement(document.querySelector(".ui-pdp-price__original-value .andes-money-amount")) ||
      readMoneyElement(document.querySelector(".andes-money-amount--previous")) ||
      undefined;

    // ── Currency ──
    const currencyEl = document.querySelector(
      ".ui-pdp-price__second-line .andes-money-amount__currency-symbol"
    );
    const currencySymbol = currencyEl?.textContent?.trim() || "$";
    const currency = currencySymbol === "U$S" ? "USD" : "ARS";
    const bodyText = document.body?.innerText || "";
    const blocked =
      window.location.href.includes("/gz/account-verification") ||
      bodyText.includes("Verificación de seguridad") ||
      bodyText.includes("No pudimos validar") ||
      Boolean(document.querySelector("#continue-button"));

    // ── Description (multiple selectors for article vs catalog pages) ──
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
    if (!description) {
      const features = document.querySelectorAll(".ui-vpp-highlighted-specs__features-list li, .ui-pdp-features__item");
      if (features.length > 0) {
        const items: string[] = [];
        features.forEach((f) => { if (f.textContent?.trim()) items.push(f.textContent.trim()); });
        description = items.join(". ");
      }
    }

    // ── Images ──
    const imageElements = document.querySelectorAll(
      ".ui-pdp-gallery__figure img, .ui-pdp-image.ui-pdp-image--gallery"
    );
    const imagesSet = new Set<string>();
    imageElements.forEach((img) => {
      const src =
        (img as HTMLImageElement).dataset.zoom ||
        (img as HTMLImageElement).src ||
        "";
      if (src && !src.includes("data:") && !src.includes("placeholder")) {
        // Convert to high-res
        const highRes = src.replace(/-[A-Z]\.jpg/, "-O.jpg");
        imagesSet.add(highRes);
      }
    });

    // Also try the thumbnail strip
    const thumbs = document.querySelectorAll(
      ".ui-pdp-thumbnail__picture img"
    );
    thumbs.forEach((img) => {
      const src = (img as HTMLImageElement).src || "";
      if (src && !src.includes("data:")) {
        const highRes = src.replace(/-[A-Z]\.jpg/, "-O.jpg");
        imagesSet.add(highRes);
      }
    });

    const images = Array.from(imagesSet);

    // ── Condition ──
    const conditionEl = document.querySelector(
      ".ui-pdp-header__subtitle, .ui-pdp-subtitle"
    );
    const conditionText = conditionEl?.textContent?.toLowerCase() || "";
    const condition: "new" | "used" = conditionText.includes("usado")
      ? "used"
      : "new";

    // ── Sold quantity ──
    const soldMatch = conditionText.match(
      /(\+?\d[\d.]*)\s*(vendidos?|sold)/i
    );
    const soldQuantity = soldMatch
      ? parseInt(soldMatch[1].replace(/\./g, ""), 10)
      : undefined;

    // ── Shipping ──
    const shippingEl = document.querySelector(
      ".ui-pdp-media__title, .ui-pdp-color--GREEN"
    );
    const shippingText = shippingEl?.textContent?.toLowerCase() || "";
    const freeShipping =
      shippingText.includes("gratis") || shippingText.includes("free");

    // ── Rating ──
    const ratingEl = document.querySelector(
      ".ui-pdp-review__rating, .ui-pdp-reviews__rating__summary__average"
    );
    const rating = ratingEl
      ? parseFloat(ratingEl.textContent?.trim() || "0")
      : undefined;

    const reviewCountEl = document.querySelector(
      ".ui-pdp-review__amount, .ui-pdp-reviews__rating__summary__label"
    );
    const reviewText = reviewCountEl?.textContent?.trim() || "";
    const reviewMatch = reviewText.match(/(\d+)/);
    const reviewCount = reviewMatch ? parseInt(reviewMatch[1], 10) : undefined;

    // ── Seller ──
    const sellerEl = document.querySelector(
      ".ui-pdp-seller__link-trigger, .ui-pdp-action__title"
    );
    const sellerName = sellerEl?.textContent?.trim() || undefined;

    const reputationEl = document.querySelector(
      ".ui-pdp-seller__status-info .ui-pdp-color--GREEN"
    );
    const sellerReputation = reputationEl?.textContent?.trim() || undefined;

    // ── Category breadcrumb (filter "..." from catalog pages) ──
    const breadcrumbEls = document.querySelectorAll(
      ".andes-breadcrumb__item a, .andes-breadcrumb__link"
    );
    const categoryBreadcrumb: string[] = [];
    breadcrumbEls.forEach((el) => {
      const text = el.textContent?.trim();
      if (text && text !== "..." && text !== "\u2026") categoryBreadcrumb.push(text);
    });
    // Fallback: infer category from title keywords
    if (categoryBreadcrumb.length === 0) {
      const titleLower = title.toLowerCase();
      const catKeywords: Record<string, string> = {
        "cocina": "Cocina", "mandolina": "Cocina", "cortador": "Cocina", "rallador": "Cocina",
        "picador": "Cocina", "sart\u00e9n": "Cocina", "olla": "Cocina", "sellador": "Cocina",
        "organizador": "Hogar", "l\u00e1mpara": "Hogar", "led": "Hogar", "ventilador": "Hogar",
        "proyector": "Tech", "auricular": "Tech", "parlante": "Tech", "cargador": "Tech",
      };
      for (const [kw, cat] of Object.entries(catKeywords)) {
        if (titleLower.includes(kw)) { categoryBreadcrumb.push(cat); break; }
      }
    }

    // ── Attributes / specs ──
    const attrRows = document.querySelectorAll(
      ".ui-pdp-specs__table tr, .andes-table__row"
    );
    const attributes: Array<{ name: string; value: string }> = [];
    attrRows.forEach((row) => {
      const cells = row.querySelectorAll("th, td");
      if (cells.length >= 2) {
        attributes.push({
          name: cells[0].textContent?.trim() || "",
          value: cells[1].textContent?.trim() || "",
        });
      }
    });

    return {
      title,
      price: price ? Math.round(price) : 0,
      originalPrice: originalPrice ? Math.round(originalPrice) : undefined,
      currency,
      description,
      images,
      condition,
      freeShipping,
      rating: rating || undefined,
      reviewCount,
      soldQuantity,
      sellerName,
      sellerReputation,
      categoryBreadcrumb,
      attributes,
      blocked,
    };
  });

  if (data.blocked) {
    throw new Error("MercadoLibre devolvió una pantalla de verificación en lugar del producto.");
  }

  if (!data.price || data.price <= 0) {
    throw new Error(`No se pudo extraer precio válido para ${url}`);
  }

  return { ...data, url };
}

// ─── Click "Ver descripción completa" if available ───
async function expandDescription(page: Page): Promise<void> {
  try {
    // `button:has-text(...)` es sintaxis de Playwright, NO es CSS válido y hacía
    // fallar todo el selector en silencio. Usamos selectores CSS reales + un
    // fallback que busca el botón por su texto.
    let descButton = await page.$(
      'a[href*="description"], .ui-pdp-collapsable__action'
    );
    if (!descButton) {
      const handle = await page.evaluateHandle(() => {
        const els = Array.from(document.querySelectorAll("button, a"));
        return els.find((el) => /ver descripci[oó]n|ver m[aá]s/i.test(el.textContent || "")) || null;
      });
      const el = handle.asElement();
      if (el) descButton = el as Awaited<ReturnType<Page["$"]>>;
    }
    if (descButton) {
      await descButton.click();
      await delay(1000);
    }
  } catch {
    // Description might already be visible
  }
}

// ─── Scroll to load lazy content ───
async function autoScroll(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 150);
    });
  });
}

// ─── Main: Scrape a single ML product URL ───
export async function scrapeProduct(url: string): Promise<ScrapedProduct> {
  const browser = await launchBrowser();

  try {
    const page = await setupPage(browser);

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    await waitForProductContent(page);

    // Scroll to trigger lazy loading
    await autoScroll(page);
    await expandDescription(page);
    await waitForProductContent(page);

    return await extractProductData(page, page.url() || url);
  } finally {
    await browser.close();
  }
}

// ─── Scrape multiple products ───
export async function scrapeProducts(
  urls: string[]
): Promise<ScrapedProduct[]> {
  const browser = await launchBrowser();
  const results: ScrapedProduct[] = [];

  try {
    const page = await setupPage(browser);

    for (const url of urls) {
      try {
        console.log(`Scraping: ${url}`);
        await page.goto(url, {
          waitUntil: "domcontentloaded",
          timeout: 30000,
        });
        await waitForProductContent(page);
        await autoScroll(page);
        await expandDescription(page);
        await waitForProductContent(page);

        const data = await extractProductData(page, page.url() || url);
        results.push(data);

        // Delay aleatorio entre requests (8-20s): el ritmo humano es la segunda
        // palanca anti-bloqueo más fuerte después de la IP residencial.
        const waitTime = 8000 + Math.random() * 12000;
        console.log(`  Esperando ${Math.round(waitTime / 1000)}s...`);
        await delay(waitTime);
      } catch (error) {
        console.error(
          `  Error scraping ${url}:`,
          error instanceof Error ? error.message : error
        );
      }
    }
  } finally {
    await browser.close();
  }

  return results;
}

// ─── Search ML and scrape results ───
export async function scrapeSearch(
  query: string,
  limit = 10
): Promise<ScrapedProduct[]> {
  const browser = await launchBrowser();
  const results: ScrapedProduct[] = [];

  try {
    const page = await setupPage(browser);

    const searchUrl = `https://listado.mercadolibre.com.ar/${encodeURIComponent(query).replace(/%20/g, "-")}`;
    await page.goto(searchUrl, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    await delay(2000);

    // Get product links from search results
    const productLinks = await page.evaluate((max: number) => {
      const links = document.querySelectorAll(
        "a.ui-search-link, a.ui-search-item__group__element, .ui-search-result__wrapper a[href*='articulo.mercadolibre']"
      );
      const urls = new Set<string>();
      links.forEach((a) => {
        const href = (a as HTMLAnchorElement).href;
        if (
          href &&
          href.includes("mercadolibre") &&
          href.includes("MLA") &&
          !href.includes("/noindex/")
        ) {
          urls.add(href.split("#")[0].split("?")[0]);
        }
      });
      return Array.from(urls).slice(0, max);
    }, limit);

    console.log(
      `Encontrados ${productLinks.length} productos para "${query}"`
    );

    for (const link of productLinks) {
      try {
        console.log(`Scraping: ${link}`);
        await page.goto(link, {
          waitUntil: "domcontentloaded",
          timeout: 30000,
        });
        await waitForProductContent(page);
        await autoScroll(page);
        await expandDescription(page);
        await waitForProductContent(page);

        const data = await extractProductData(page, page.url() || link);
        results.push(data);

        const waitTime = 2000 + Math.random() * 3000;
        await delay(waitTime);
      } catch (error) {
        console.error(
          `  Error:`,
          error instanceof Error ? error.message : error
        );
      }
    }
  } finally {
    await browser.close();
  }

  return results;
}

// ─── Convert scraped data to Product type ───
export function scrapedToProduct(scraped: ScrapedProduct): Product {
  const today = new Date().toISOString().slice(0, 10);

  // Use breadcrumb + title for better category matching
  const breadcrumbSlugs = scraped.categoryBreadcrumb.map((bc) =>
    bc
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  );
  const titleSlug = scraped.title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-");
  const categorySlug = [...breadcrumbSlugs, titleSlug].join(" ");

  const mapped = mapCategory(categorySlug);

  // Generate a stable ID from the URL. Catalog URLs may be MLA... or MLAU...
  let id = `scraped-${Date.now()}`;
  const productIdMatch = scraped.url.match(/\b(MLAU?\d+)\b/i);
  const articleIdMatch = scraped.url.match(/\bMLA-(\d+)\b/i);
  if (productIdMatch) {
    id = productIdMatch[1].toUpperCase();
  } else if (articleIdMatch) {
    id = `MLA${articleIdMatch[1]}`;
  }

  return {
    id,
    title: scraped.title,
    price: scraped.price,
    originalPrice: scraped.originalPrice,
    currency: scraped.currency,
    image: scraped.images[0] || "",
    images: scraped.images,
    category: scraped.categoryBreadcrumb[0] || "General",
    categorySlug: mapped.categorySlug,
    permalink: scraped.url,
    affiliateUrl: buildAffiliateUrl(scraped.url),
    condition: scraped.condition,
    freeShipping: scraped.freeShipping,
    rating: scraped.rating,
    reviewCount: scraped.reviewCount,
    soldQuantity: scraped.soldQuantity,
    pastelColor: mapped.pastelColor,
    priceUpdated: today,
    priceLastChecked: today,
    priceStatus: "fresh",
    description: scraped.description || undefined,
  };
}
