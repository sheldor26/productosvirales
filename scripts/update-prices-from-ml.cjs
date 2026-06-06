#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Update product prices from MercadoLibre product pages without the official API.
 *
 * Examples:
 *   node scripts/update-prices-from-ml.cjs --dry-run --match freidora --limit 5
 *   node scripts/update-prices-from-ml.cjs --apply --match freidora --limit 20
 *   node scripts/update-prices-from-ml.cjs --apply --id MLA39861162 --id MLA27351841
 *   ML_SCRAPER_HEADFUL=true node scripts/update-prices-from-ml.cjs --apply --stale-only --all
 *
 * The script uses Puppeteer so MercadoLibre can run its JS challenge. It keeps
 * a persistent browser profile by default in `.cache/ml-scraper-profile`.
 */

const fs = require("fs");
const path = require("path");

let puppeteer;
try {
  puppeteer = require("puppeteer");
} catch {
  console.error("Missing dependency: puppeteer. Run npm install first.");
  process.exit(1);
}

const CATALOG_PATH = path.resolve("src/data/curated-products.ts");
const RESULTS_PATH = path.resolve("scripts/price-update-results.json");
const TODAY = new Date().toISOString().slice(0, 10);

// Solo Chrome: el navegador real es Chromium, anunciar Firefox/Safari delata el bot.
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

function usage() {
  console.log(`Usage:
  node scripts/update-prices-from-ml.cjs [options]

Options:
  --apply                 Write changes to src/data/curated-products.ts
  --dry-run               Only report changes (default)
  --all                   Do not apply the default limit
  --limit N               Max products to check (default: 20 unless --all)
  --id MLA123             Check one id. Can be repeated
  --match TEXT            Filter by id, title or permalink
  --category SLUG         Filter by categorySlug
  --stale-only            Only products with priceStatus: "stale"
  --mark-failed-stale     On --apply, mark failed checks as stale
  --min-ratio N           Suspicious lower ratio guard (default: 0.2)
  --max-ratio N           Suspicious upper ratio guard (default: 5)
  --product-timeout-ms N   Hard timeout per product (default: 120000)
`);
}

function parseArgs(argv) {
  const opts = {
    apply: false,
    all: false,
    limit: 20,
    ids: [],
    match: "",
    category: "",
    staleOnly: false,
    markFailedStale: false,
    minRatio: 0.2,
    maxRatio: 5,
    productTimeoutMs: 120000,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      usage();
      process.exit(0);
    } else if (arg === "--apply") opts.apply = true;
    else if (arg === "--dry-run") opts.apply = false;
    else if (arg === "--all") opts.all = true;
    else if (arg === "--stale-only") opts.staleOnly = true;
    else if (arg === "--mark-failed-stale") opts.markFailedStale = true;
    else if (arg === "--limit") opts.limit = Number(argv[++i]);
    else if (arg === "--id") opts.ids.push(String(argv[++i] || "").toUpperCase());
    else if (arg === "--match") opts.match = String(argv[++i] || "").toLowerCase();
    else if (arg === "--category") opts.category = String(argv[++i] || "");
    else if (arg === "--min-ratio") opts.minRatio = Number(argv[++i]);
    else if (arg === "--max-ratio") opts.maxRatio = Number(argv[++i]);
    else if (arg === "--product-timeout-ms") opts.productTimeoutMs = Number(argv[++i]);
    else {
      console.error(`Unknown option: ${arg}`);
      usage();
      process.exit(1);
    }
  }

  if (opts.all) opts.limit = Number.POSITIVE_INFINITY;
  return opts;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function withTimeout(promise, ms, label) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(label)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutId));
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function randomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function extractQuotedProp(block, prop) {
  const match = block.match(new RegExp(`\\n\\s+${prop}:\\s*(['"\`])([\\s\\S]*?)\\1\\s*,`));
  return match ? match[2] : "";
}

function extractNumericProp(block, prop) {
  const match = block.match(new RegExp(`\\n\\s+${prop}:\\s*(\\d+(?:\\.\\d+)?)\\s*,`));
  return match ? Number(match[1]) : undefined;
}

function extractProducts(src) {
  const products = [];
  const blockRe = /^  \{\n[\s\S]*?^  \},/gm;
  let match;

  while ((match = blockRe.exec(src)) !== null) {
    const block = match[0];
    const id = extractQuotedProp(block, "id");
    const permalink = extractQuotedProp(block, "permalink");
    const title = extractQuotedProp(block, "title");
    const categorySlug = extractQuotedProp(block, "categorySlug");
    const priceStatus = extractQuotedProp(block, "priceStatus") || "normal";
    const price = extractNumericProp(block, "price");

    if (!id || !permalink || !price) continue;
    products.push({
      id,
      permalink,
      title,
      categorySlug,
      priceStatus,
      storedPrice: price,
      block,
      start: match.index,
    });
  }

  return products;
}

function filterProducts(products, opts) {
  let selected = products;
  if (opts.ids.length > 0) {
    const wanted = new Set(opts.ids);
    selected = selected.filter((p) => wanted.has(p.id.toUpperCase()));
  }
  if (opts.match) {
    selected = selected.filter((p) =>
      `${p.id} ${p.title} ${p.permalink}`.toLowerCase().includes(opts.match)
    );
  }
  if (opts.category) {
    selected = selected.filter((p) => p.categorySlug === opts.category);
  }
  if (opts.staleOnly) {
    selected = selected.filter((p) => p.priceStatus === "stale");
  }

  return selected.slice(0, opts.limit);
}

async function preparePage(browser) {
  const page = await browser.newPage();
  await page.setUserAgent(randomUserAgent());
  await page.setViewport({ width: 1440, height: 1100 });
  await page.setExtraHTTPHeaders({
    "Accept-Language": "es-AR,es;q=0.9,en;q=0.8",
    "Upgrade-Insecure-Requests": "1",
  });
  page.setDefaultNavigationTimeout(45000);
  page.setDefaultTimeout(45000);

  try {
    await page.emulateTimezone("America/Argentina/Buenos_Aires");
  } catch {
    // Ignore timezone support differences.
  }

  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
    window.chrome = { runtime: {} };
    Object.defineProperty(navigator, "plugins", { get: () => [1, 2, 3, 4, 5] });
    Object.defineProperty(navigator, "languages", { get: () => ["es-AR", "es", "en-US", "en"] });
    Object.defineProperty(navigator, "hardwareConcurrency", { get: () => 8 });
    Object.defineProperty(navigator, "deviceMemory", { get: () => 8 });
  });

  return page;
}

async function pageHasPrice(page) {
  return page.evaluate((selectors) => {
    return selectors.some((selector) => {
      const el = document.querySelector(selector);
      const content = el?.getAttribute("content") || el?.textContent || "";
      return /\d/.test(content);
    });
  }, PRICE_SELECTORS);
}

async function resolveInterstitial(page) {
  for (let attempt = 0; attempt < 4; attempt++) {
    if (await pageHasPrice(page)) return;

    const state = await page.evaluate(() => {
      const text = document.body?.innerText || "";
      return {
        hasContinue: Boolean(document.querySelector("#continue-button")),
        accountVerification: window.location.href.includes("/gz/account-verification"),
        suspiciousTraffic:
          /Verificaci.n de seguridad|No pudimos validar|suspicious-traffic/i.test(text) ||
          document.documentElement.innerHTML.includes("suspicious-traffic-frontend"),
      };
    });

    if (state.accountVerification || state.suspiciousTraffic) {
      throw new Error("ML_SECURITY_VERIFICATION");
    }

    if (state.hasContinue) {
      await page
        .waitForFunction(() => {
          const button = document.querySelector("#continue-button");
          return !button || !button.disabled;
        }, { timeout: 35000 })
        .catch(() => undefined);

      await delay(randomBetween(900, 2200));
      await page.click("#continue-button").catch(() => undefined);
      await page
        .waitForNavigation({ waitUntil: "domcontentloaded", timeout: 25000 })
        .catch(() => undefined);
      await delay(randomBetween(1400, 2800));
      continue;
    }

    await delay(randomBetween(1200, 2500));
  }
}

async function extractData(page) {
  return page.evaluate(() => {
    const parseMoneyText = (raw) => {
      if (!raw) return null;
      const cleaned = String(raw)
        .replace(/\s+/g, " ")
        .replace(/[^\d.,]/g, "")
        .trim();
      if (!cleaned) return null;
      const normalized = cleaned.includes(",")
        ? cleaned.replace(/\./g, "").replace(",", ".")
        : cleaned.replace(/\.(?=\d{3}(?:\D|$))/g, "");
      const value = Number.parseFloat(normalized);
      return Number.isFinite(value) && value > 0 ? value : null;
    };

    const readMoneyElement = (el) => {
      if (!el) return null;
      const content = el.getAttribute("content");
      const fromContent = parseMoneyText(content);
      if (fromContent) return Math.round(fromContent);
      // Solo la parte entera (__fraction). NO concatenar __cents: en ML Argentina
      // los precios de PDP son enteros y ese __cents (de cuotas/otro valor) producía
      // basura tipo $121.339,23.
      const fraction = el.querySelector(".andes-money-amount__fraction")?.textContent;
      const fromFraction = parseMoneyText(fraction);
      if (fromFraction) return Math.round(fromFraction);
      const fromOther = parseMoneyText(el.getAttribute("aria-label")) || parseMoneyText(el.textContent);
      return fromOther ? Math.round(fromOther) : null;
    };

    const isOriginalPriceContext = (el) => Boolean(el.closest(
      ".ui-pdp-price__original-value, .andes-money-amount--previous, [class*='original'], [class*='previous']"
    ));

    const findJsonLdPrice = () => {
      const scripts = Array.from(document.querySelectorAll("script[type='application/ld+json']"));
      const queue = [];
      for (const script of scripts) {
        try {
          const parsed = JSON.parse(script.textContent || "");
          if (Array.isArray(parsed)) queue.push(...parsed);
          else queue.push(parsed);
        } catch {
          // Ignore.
        }
      }
      while (queue.length) {
        const item = queue.shift();
        if (!item || typeof item !== "object") continue;
        const price = parseMoneyText(item.price);
        if (price) return price;
        for (const value of Object.values(item)) {
          if (Array.isArray(value)) queue.push(...value);
          else if (value && typeof value === "object") queue.push(value);
        }
      }
      return null;
    };

    const bodyText = document.body?.innerText || "";
    const blocked =
      window.location.href.includes("/gz/account-verification") ||
      /Verificaci.n de seguridad|No pudimos validar|suspicious-traffic/i.test(bodyText) ||
      Boolean(document.querySelector("#continue-button"));

    const selectors = [
      ".ui-pdp-price__second-line .andes-money-amount",
      "[data-testid='price-part'] .andes-money-amount",
      ".ui-vpp-price .andes-money-amount",
      ".ui-pdp-price .andes-money-amount",
      "meta[itemprop='price']",
      "meta[property='product:price:amount']",
    ];

    let price = findJsonLdPrice();
    for (const selector of selectors) {
      if (price) break;
      const candidates = Array.from(document.querySelectorAll(selector));
      for (const candidate of candidates) {
        if (isOriginalPriceContext(candidate)) continue;
        const value = readMoneyElement(candidate);
        if (value) {
          price = value;
          break;
        }
      }
    }

    if (!price) {
      const scriptsText = Array.from(document.scripts).map((script) => script.textContent || "").join("\n");
      for (const pattern of [
        /"price"\s*:\s*"?(\d+(?:[.,]\d+)?)"?/i,
        /"amount"\s*:\s*(\d+(?:[.,]\d+)?)/i,
        /"current_price"\s*:\s*(\d+(?:[.,]\d+)?)/i,
      ]) {
        const value = parseMoneyText(scriptsText.match(pattern)?.[1]);
        if (value) {
          price = value;
          break;
        }
      }
    }

    const originalPrice =
      readMoneyElement(document.querySelector(".ui-pdp-price__original-value .andes-money-amount")) ||
      readMoneyElement(document.querySelector(".andes-money-amount--previous"));

    const title = document.querySelector("h1.ui-pdp-title")?.textContent?.trim() || document.title.trim();
    const soldText = document.querySelector(".ui-pdp-header__subtitle, .ui-pdp-subtitle")?.textContent || "";
    const soldMatch = soldText.match(/(\+?\d[\d.]*)\s*(vendidos?|sold)/i);
    const soldQuantity = soldMatch ? Number(soldMatch[1].replace(/\./g, "")) : undefined;
    const rating = Number.parseFloat(
      document.querySelector(".ui-pdp-review__rating, .ui-pdp-reviews__rating__summary__average")?.textContent?.trim() || ""
    ) || undefined;
    const reviewText =
      document.querySelector(".ui-pdp-review__amount, .ui-pdp-reviews__amount, [class*='review'][class*='amount']")?.textContent || "";
    const reviewMatch = reviewText.match(/(\d[\d.]*)/);
    const reviewCount = reviewMatch ? Number(reviewMatch[1].replace(/\./g, "")) : undefined;
    const outOfStock = /sin stock|publicaci.n pausada|publicaci.n finalizada|no disponible/i.test(bodyText);

    return {
      title,
      price,
      originalPrice,
      soldQuantity,
      rating,
      reviewCount,
      outOfStock,
      blocked,
      finalUrl: window.location.href,
    };
  });
}

async function scrapeProduct(page, product) {
  await page.goto(product.permalink, { waitUntil: "domcontentloaded", timeout: 45000 });
  await resolveInterstitial(page);
  await page
    .waitForFunction((selectors) => {
      return selectors.some((selector) => {
        const el = document.querySelector(selector);
        const content = el?.getAttribute("content") || el?.textContent || "";
        return /\d/.test(content);
      });
    }, { timeout: 22000 }, PRICE_SELECTORS)
    .catch(() => undefined);
  await delay(randomBetween(700, 1600));

  const data = await extractData(page);
  if (data.blocked) throw new Error("ML_SECURITY_VERIFICATION");
  if (data.outOfStock && !data.price) return { status: "out_of_stock", ...data };
  if (!data.price) throw new Error("NO_PRICE");
  return { status: "fresh", ...data };
}

function upsertStringProp(block, prop, value, afterProp = "price") {
  const quoted = `${prop}: "${value}",`;
  const re = new RegExp(`(\\n\\s+${prop}:\\s*)['"][^'"]*['"](\\s*,)`);
  if (re.test(block)) {
    return block.replace(re, `$1"${value}"$2`);
  }

  const afterRe = new RegExp(`(\\n\\s+${afterProp}:\\s*[^,]+,)`);
  if (afterRe.test(block)) {
    return block.replace(afterRe, `$1\n    ${quoted}`);
  }
  return block;
}

function upsertNumericProp(block, prop, value, afterProp = "price") {
  if (!Number.isFinite(value)) return block;

  const re = new RegExp(`(\\n\\s+${prop}:\\s*)(?:undefined|\\d+(?:\\.\\d+)?)(\\s*,)`);
  if (re.test(block)) {
    return block.replace(re, `$1${value}$2`);
  }

  const afterRe = new RegExp(`(\\n\\s+${afterProp}:\\s*[^,]+,)`);
  if (afterRe.test(block)) {
    return block.replace(afterRe, `$1\n    ${prop}: ${value},`);
  }
  return block;
}

function updateProductBlock(block, result, opts) {
  let next = block;
  if (result.currentPrice) {
    next = next.replace(/(\n\s+price:\s*)\d+(?:\.\d+)?(\s*,)/, `$1${result.currentPrice}$2`);

    if (result.originalPrice && result.originalPrice > result.currentPrice) {
      if (/\n\s+originalPrice:\s*(?:undefined|\d+(?:\.\d+)?),/.test(next)) {
        next = next.replace(/(\n\s+originalPrice:\s*)(?:undefined|\d+(?:\.\d+)?)(\s*,)/, `$1${result.originalPrice}$2`);
      } else {
        next = next.replace(/(\n\s+price:\s*\d+(?:\.\d+)?,)/, `$1\n    originalPrice: ${result.originalPrice},`);
      }
    } else if (/\n\s+originalPrice:\s*\d+(?:\.\d+)?,/.test(next)) {
      next = next.replace(/(\n\s+originalPrice:\s*)\d+(?:\.\d+)?(\s*,)/, "$1undefined$2");
    }

    next = upsertStringProp(next, "priceUpdated", TODAY, "price");
    next = upsertStringProp(next, "priceLastChecked", TODAY, "priceUpdated");
    next = upsertStringProp(next, "priceStatus", "fresh", "priceLastChecked");
    next = upsertNumericProp(next, "rating", result.rating, "freeShipping");
    next = upsertNumericProp(next, "reviewCount", result.reviewCount, "rating");
    next = upsertNumericProp(next, "soldQuantity", result.soldQuantity, "reviewCount");
  } else if (result.status === "out_of_stock") {
    next = upsertStringProp(next, "priceLastChecked", TODAY, "price");
    next = upsertStringProp(next, "priceStatus", "out_of_stock", "priceLastChecked");
  } else if (opts.markFailedStale) {
    next = upsertStringProp(next, "priceLastChecked", TODAY, "price");
    next = upsertStringProp(next, "priceStatus", "stale", "priceLastChecked");
  }
  return next;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const src = fs.readFileSync(CATALOG_PATH, "utf8");
  const products = extractProducts(src);
  const selected = filterProducts(products, opts);

  if (selected.length === 0) {
    console.log("No products matched the filters.");
    return;
  }

  const profileDir = process.env.ML_SCRAPER_PROFILE_DIR || path.resolve(".cache/ml-scraper-profile");
  fs.mkdirSync(profileDir, { recursive: true });

  console.log(`${opts.apply ? "APPLY" : "DRY RUN"}: checking ${selected.length}/${products.length} products`);
  console.log(`Browser profile: ${profileDir}`);
  console.log("Tip: if ML asks for verification, rerun with ML_SCRAPER_HEADFUL=true once.\n");

  const browser = await puppeteer.launch({
    headless: process.env.ML_SCRAPER_HEADFUL === "true" ? false : true,
    userDataDir: profileDir,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--disable-infobars",
      "--window-size=1440,1100",
    ],
  });

  const results = [];
  let nextSrc = src;

  try {
    for (let i = 0; i < selected.length; i++) {
      const product = selected[i];
      let page;
      try {
        console.log(`[${i + 1}/${selected.length}] CHECK ${product.id} ${product.title.slice(0, 80)}`);
        page = await preparePage(browser);
        const data = await withTimeout(
          scrapeProduct(page, product),
          opts.productTimeoutMs,
          `PRODUCT_TIMEOUT_${opts.productTimeoutMs}ms`
        );
        const currentPrice = data.price ? Math.round(data.price) : null;
        const diff = currentPrice ? currentPrice - product.storedPrice : null;
        const ratio = currentPrice ? currentPrice / product.storedPrice : null;
        const suspicious =
          currentPrice &&
          (currentPrice < 500 || ratio < opts.minRatio || ratio > opts.maxRatio);

        const result = {
          id: product.id,
          title: product.title,
          url: product.permalink,
          finalUrl: data.finalUrl,
          storedPrice: product.storedPrice,
          currentPrice,
          originalPrice: data.originalPrice || null,
          soldQuantity: data.soldQuantity || null,
          rating: data.rating || null,
          reviewCount: data.reviewCount || null,
          diff,
          ratio,
          status: suspicious ? "suspicious" : data.status,
        };
        results.push(result);

        const tag = currentPrice && Math.abs(diff) >= 1 ? (diff > 0 ? "UP " : "DN ") : "OK ";
        const priceText = currentPrice ? `$${product.storedPrice.toLocaleString("es-AR")} -> $${currentPrice.toLocaleString("es-AR")}` : "no price";
        console.log(`[${i + 1}/${selected.length}] ${tag}    ${product.id} ${priceText}${suspicious ? " (suspicious, skipped)" : ""}`);

        if (opts.apply && !suspicious && (currentPrice || data.status === "out_of_stock")) {
          const updated = updateProductBlock(product.block, result, opts);
          nextSrc = nextSrc.replace(product.block, updated);
        }
      } catch (error) {
        const status = error && error.message === "ML_SECURITY_VERIFICATION" ? "blocked" : "failed";
        console.log(`[${i + 1}/${selected.length}] ${status.toUpperCase()} ${product.id}: ${error.message || error}`);
        const result = {
          id: product.id,
          title: product.title,
          url: product.permalink,
          storedPrice: product.storedPrice,
          currentPrice: null,
          status,
          error: error.message || String(error),
        };
        results.push(result);

        if (opts.apply && opts.markFailedStale) {
          const updated = updateProductBlock(product.block, result, opts);
          nextSrc = nextSrc.replace(product.block, updated);
        }
      } finally {
        if (page) await page.close().catch(() => undefined);
        fs.writeFileSync(RESULTS_PATH, JSON.stringify(results, null, 2));
        if (opts.apply && nextSrc !== src) {
          fs.writeFileSync(CATALOG_PATH, nextSrc);
        }
      }

      if (i < selected.length - 1) {
        await delay(randomBetween(3500, 7500));
      }
    }
  } finally {
    await browser.close();
  }

  fs.writeFileSync(RESULTS_PATH, JSON.stringify(results, null, 2));
  if (opts.apply && nextSrc !== src) {
    fs.writeFileSync(CATALOG_PATH, nextSrc);
  }

  const changed = results.filter((r) => r.currentPrice && Math.abs(r.currentPrice - r.storedPrice) >= 1 && r.status === "fresh");
  const failed = results.filter((r) => r.status === "failed" || r.status === "blocked");
  const suspicious = results.filter((r) => r.status === "suspicious");

  console.log("\nSummary:");
  console.log(`  checked:    ${results.length}`);
  console.log(`  changed:    ${changed.length}`);
  console.log(`  suspicious: ${suspicious.length}`);
  console.log(`  failed:     ${failed.length}`);
  console.log(`  wrote:      ${opts.apply ? "yes" : "no (dry run)"}`);
  console.log(`  results:    ${path.relative(process.cwd(), RESULTS_PATH)}`);
}

main().catch((error) => {
  console.error("Fatal:", error);
  process.exit(1);
});
