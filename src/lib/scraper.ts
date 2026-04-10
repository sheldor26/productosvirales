import puppeteer, { type Browser, type Page } from "puppeteer";
import { buildAffiliateUrl, mapCategory } from "./mercadolibre";
import type { Product } from "./types";

// ─── Random User-Agent rotation ───
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
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
  return puppeteer.launch({
    headless: true,
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
  });

  return page;
}

// ─── Extract product data from a ML product page ───
async function extractProductData(page: Page, url: string): Promise<ScrapedProduct> {
  // Wait for critical content
  await page.waitForSelector("h1", { timeout: 15000 });
  await delay(1500); // Let dynamic content load

  const data = await page.evaluate(() => {
    // ── Title ──
    const titleEl = document.querySelector("h1.ui-pdp-title");
    const title = titleEl?.textContent?.trim() || "";

    // ── Price ──
    // Try multiple selectors for price (ML changes layout often)
    const priceSelectors = [
      ".ui-pdp-price__second-line .andes-money-amount__fraction",
      ".ui-pdp-price .andes-money-amount__fraction",
      "[class*='price'] .andes-money-amount__fraction",
    ];
    let priceText = "";
    for (const sel of priceSelectors) {
      const el = document.querySelector(sel);
      if (el?.textContent) {
        priceText = el.textContent.trim();
        break;
      }
    }
    const price = parseInt(priceText.replace(/\./g, ""), 10) || 0;

    // ── Cents ──
    const centsEl = document.querySelector(
      ".ui-pdp-price__second-line .andes-money-amount__cents"
    );
    const cents = centsEl ? parseInt(centsEl.textContent?.trim() || "0", 10) : 0;

    // ── Original price ──
    const origPriceEl = document.querySelector(
      ".ui-pdp-price__original-value .andes-money-amount__fraction"
    );
    const originalPrice = origPriceEl
      ? parseInt(origPriceEl.textContent?.trim().replace(/\./g, "") || "0", 10)
      : undefined;

    // ── Currency ──
    const currencyEl = document.querySelector(
      ".ui-pdp-price__second-line .andes-money-amount__currency-symbol"
    );
    const currencySymbol = currencyEl?.textContent?.trim() || "$";
    const currency = currencySymbol === "U$S" ? "USD" : "ARS";

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
      price: price + cents / 100,
      originalPrice,
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
    };
  });

  return { ...data, url };
}

// ─── Click "Ver descripción completa" if available ───
async function expandDescription(page: Page): Promise<void> {
  try {
    const descButton = await page.$(
      'a[href*="description"], button:has-text("Ver descripción"), .ui-pdp-collapsable__action'
    );
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

    // Scroll to trigger lazy loading
    await autoScroll(page);
    await expandDescription(page);

    return await extractProductData(page, url);
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
        await autoScroll(page);
        await expandDescription(page);

        const data = await extractProductData(page, url);
        results.push(data);

        // Random delay between requests (2-5 seconds)
        const waitTime = 2000 + Math.random() * 3000;
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
        await autoScroll(page);
        await expandDescription(page);

        const data = await extractProductData(page, link);
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

  // Generate a stable ID from the URL
  const mlaMatch = scraped.url.match(/MLA[-]?(\d+)/i);
  const id = mlaMatch ? `MLA${mlaMatch[1]}` : `scraped-${Date.now()}`;

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
    soldQuantity: scraped.soldQuantity,
    pastelColor: mapped.pastelColor,
    description: scraped.description || undefined,
  };
}
