#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Update product prices from MercadoLibre — API-first, scraper as fallback.
 *
 * Catalog products (MLA cortos) and user-products (MLAU) go through the
 * official API (/products/{id}/items, needs ML_APP_ID/ML_SECRET in .env):
 * fast, parallel, no browser. Individual listings (articulo.mercadolibre...,
 * MLA ids with 10+ digits) are blocked by the API and fall back to Puppeteer.
 *
 * Examples:
 *   node scripts/update-prices-from-ml.cjs --dry-run --match freidora --limit 5
 *   node scripts/update-prices-from-ml.cjs --apply --match freidora --limit 20
 *   node scripts/update-prices-from-ml.cjs --apply --id MLA39861162 --id MLA27351841
 *   node scripts/update-prices-from-ml.cjs --apply --all
 */

const fs = require("fs");
const path = require("path");

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
  --api-only              Skip products that need the Puppeteer scraper
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
    else if (arg === "--api-only") opts.apiOnly = true;
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

// ─── Official API engine (catalog MLA + MLAU products) ───

const ML_API = "https://api.mercadolibre.com";
const API_CONCURRENCY = 8;

// El tipo real del producto sale del permalink (hay fichas con el prefijo
// MLA/MLAU mal guardado en el id): /p/ y /up/ van por API, articulo... por
// scraper. Sin permalink reconocible, MLA de 10+ dígitos = publicación
// individual (la API la bloquea).
function resolveApiId(id, permalink) {
  const up = (permalink || "").match(/\/up\/(MLAU\d+)/i);
  if (up) return up[1].toUpperCase();
  const cat = (permalink || "").match(/\/p\/(MLA\d+)/i);
  if (cat) return cat[1].toUpperCase();
  if (/articulo\.mercadolibre/i.test(permalink || "")) return null;
  if (id.startsWith("MLAU")) return id;
  return id.replace(/^MLA-?/, "").length < 10 ? id : null;
}

function loadDotEnv() {
  const out = {};
  try {
    for (const line of fs.readFileSync(path.resolve(".env"), "utf8").split("\n")) {
      const eq = line.indexOf("=");
      if (eq > 0 && !line.startsWith("#")) {
        out[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
      }
    }
  } catch {
    // Sin .env: getMlToken avisa
  }
  return out;
}

async function getMlToken() {
  const env = loadDotEnv();
  const appId = env.ML_APP_ID || process.env.ML_APP_ID;
  const secret = env.ML_SECRET || process.env.ML_SECRET;
  if (!appId || !secret) return null;
  const res = await fetch(`${ML_API}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=client_credentials&client_id=${appId}&client_secret=${secret}`,
  });
  const data = await res.json().catch(() => ({}));
  return data.access_token || null;
}

async function fetchApiProduct(token, id) {
  const headers = { Authorization: `Bearer ${token}` };
  const res = await fetch(`${ML_API}/products/${id}/items?limit=50`, { headers });
  // 404 en /items = el producto de catalogo no tiene ningun vendedor activo
  // (verificado: sigue apareciendo en /products/search como "sin ofertas")
  if (res.status === 404) return { status: "out_of_stock", price: null };
  if (!res.ok) throw new Error(`API_HTTP_${res.status}`);
  const data = await res.json();
  const offers = (data.results || []).filter((o) => o.condition === "new");
  if (!offers.length) return { status: "out_of_stock", price: null };

  const best = offers.reduce((a, b) => (b.price < a.price ? b : a));
  let rating;
  let reviewCount;
  try {
    const rev = await fetch(
      `${ML_API}/reviews/item/${best.item_id}?catalog_product_id=${id}`,
      { headers }
    );
    if (rev.ok) {
      const rj = await rev.json();
      rating = rj.rating_average || undefined;
      reviewCount = (rj.paging && rj.paging.total) || undefined;
    }
  } catch {
    // Rating es opcional; el precio es lo que importa
  }

  return {
    status: "fresh",
    price: Math.round(best.price),
    originalPrice: best.original_price ? Math.round(best.original_price) : null,
    rating,
    reviewCount,
  };
}

async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
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
      // Headful: parar y esperar a que un humano resuelva la verificación
      // (captcha/login). La sesión queda guardada en el perfil persistente.
      if (process.env.ML_SCRAPER_HEADFUL === "true") {
        const waitMs = Number(process.env.ML_HUMAN_WAIT_MS || 180000);
        console.log(`    >> VERIFICACION DE ML. Resolvela en la ventana de Chrome (login/captcha). Esperando hasta ${Math.round(waitMs / 1000)}s...`);
        const deadline = Date.now() + waitMs;
        while (Date.now() < deadline) {
          await delay(3000);
          if (await pageHasPrice(page)) { console.log("    >> Verificacion superada, sigo."); return; }
        }
      }
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

  for (const p of selected) p.apiId = resolveApiId(p.id, p.permalink);
  let apiTargets = selected.filter((p) => p.apiId);
  let scrapeTargets = selected.filter((p) => !p.apiId);
  if (opts.apiOnly && scrapeTargets.length) {
    console.log(`--api-only: salteando ${scrapeTargets.length} productos que requieren scraper.`);
    scrapeTargets = [];
  }

  console.log(`${opts.apply ? "APPLY" : "DRY RUN"}: checking ${selected.length}/${products.length} products`);
  console.log(`  via API oficial: ${apiTargets.length} | via scraper: ${scrapeTargets.length}\n`);

  const results = [];
  let nextSrc = src;

  // Resultado exitoso o fallido → log, results[], y update del bloque si aplica
  function recordResult(product, data, error, index, total, engine) {
    if (error) {
      const status = error.message === "ML_SECURITY_VERIFICATION" ? "blocked" : "failed";
      console.log(`[${engine} ${index}/${total}] ${status.toUpperCase()} ${product.id}: ${error.message || error}`);
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
        nextSrc = nextSrc.replace(product.block, updateProductBlock(product.block, result, opts));
      }
      return;
    }

    const currentPrice = data.price ? Math.round(data.price) : null;
    const diff = currentPrice ? currentPrice - product.storedPrice : null;
    const ratio = currentPrice ? currentPrice / product.storedPrice : null;
    const suspicious =
      currentPrice && (currentPrice < 500 || ratio < opts.minRatio || ratio > opts.maxRatio);

    const result = {
      id: product.id,
      title: product.title,
      url: product.permalink,
      finalUrl: data.finalUrl || null,
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
    const priceText = currentPrice
      ? `$${product.storedPrice.toLocaleString("es-AR")} -> $${currentPrice.toLocaleString("es-AR")}`
      : data.status === "out_of_stock"
        ? "sin ofertas activas"
        : "no price";
    console.log(`[${engine} ${index}/${total}] ${tag}    ${product.id} ${priceText}${suspicious ? " (suspicious, skipped)" : ""}`);

    if (opts.apply && !suspicious && (currentPrice || data.status === "out_of_stock")) {
      nextSrc = nextSrc.replace(product.block, updateProductBlock(product.block, result, opts));
    }
  }

  // ── Fase 1: API oficial (paralelo, sin navegador) ──
  if (apiTargets.length > 0) {
    const token = await getMlToken();
    if (!token) {
      console.log("AVISO: sin ML_APP_ID/ML_SECRET en .env (o token rechazado) — esos productos pasan al scraper.\n");
      scrapeTargets = apiTargets.concat(scrapeTargets);
      apiTargets = [];
    } else {
      let done = 0;
      await mapWithConcurrency(apiTargets, API_CONCURRENCY, async (product) => {
        try {
          const data = await fetchApiProduct(token, product.apiId);
          recordResult(product, data, null, ++done, apiTargets.length, "API");
        } catch (error) {
          recordResult(product, null, error, ++done, apiTargets.length, "API");
        }
      });
      fs.writeFileSync(RESULTS_PATH, JSON.stringify(results, null, 2));
      if (opts.apply && nextSrc !== src) {
        fs.writeFileSync(CATALOG_PATH, nextSrc);
      }
    }
  }

  // ── Fase 2: scraper Puppeteer (solo publicaciones individuales) ──
  if (scrapeTargets.length > 0) {
    let puppeteer;
    try {
      puppeteer = require("puppeteer");
    } catch {
      console.error("Missing dependency: puppeteer. Run npm install first.");
      process.exit(1);
    }

    const profileDir = process.env.ML_SCRAPER_PROFILE_DIR || path.resolve(".cache/ml-scraper-profile");
    fs.mkdirSync(profileDir, { recursive: true });
    console.log(`\nScraper para ${scrapeTargets.length} publicaciones individuales (la API las bloquea).`);
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

    try {
      for (let i = 0; i < scrapeTargets.length; i++) {
        const product = scrapeTargets[i];
        let page;
        try {
          console.log(`[SCRAPER ${i + 1}/${scrapeTargets.length}] CHECK ${product.id} ${product.title.slice(0, 80)}`);
          page = await preparePage(browser);
          const data = await withTimeout(
            scrapeProduct(page, product),
            opts.productTimeoutMs,
            `PRODUCT_TIMEOUT_${opts.productTimeoutMs}ms`
          );
          recordResult(product, data, null, i + 1, scrapeTargets.length, "SCRAPER");
        } catch (error) {
          recordResult(product, null, error, i + 1, scrapeTargets.length, "SCRAPER");
        } finally {
          if (page) await page.close().catch(() => undefined);
          fs.writeFileSync(RESULTS_PATH, JSON.stringify(results, null, 2));
          if (opts.apply && nextSrc !== src) {
            fs.writeFileSync(CATALOG_PATH, nextSrc);
          }
        }

        if (i < scrapeTargets.length - 1) {
          await delay(randomBetween(3500, 7500));
        }
      }
    } finally {
      await browser.close();
    }
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
