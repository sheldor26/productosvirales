#!/usr/bin/env npx tsx
/**
 * MercadoLibre product importer — API-first, scraper as fallback.
 *
 * Catalog products (MLA cortos, URLs /p/) and user-products (MLAU, URLs /up/)
 * are imported via the official API (no browser, no CAPTCHA risk).
 * Individual listings (articulo.mercadolibre.com.ar/MLA-...) are not readable
 * via API (403 PA_UNAUTHORIZED) and fall back to the Puppeteer scraper.
 *
 * Requires ML_APP_ID and ML_SECRET in .env (already set up).
 *
 * Run:
 *   npx tsx scripts/ml-product-importer.ts "https://www.mercadolibre.com.ar/p/MLA39861162"
 *   npx tsx scripts/ml-product-importer.ts MLA39861162
 *   npx tsx scripts/ml-product-importer.ts --search "cafetera express"
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { buildAffiliateUrl, mapCategory } from "../src/lib/mercadolibre";

const ML_BASE = "https://api.mercadolibre.com";
const SITE_URL = "https://www.mercadolibre.com.ar";

// ─── .env loader (tsx no carga .env solo) ───

function loadEnv(): Record<string, string> {
  const envPath = path.resolve(".env");
  const out: Record<string, string> = {};
  try {
    for (const line of readFileSync(envPath, "utf8").split("\n")) {
      const eq = line.indexOf("=");
      if (eq > 0 && !line.startsWith("#")) {
        out[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
      }
    }
  } catch {
    // sin .env: getToken avisa abajo
  }
  return out;
}

async function getToken(): Promise<string> {
  const env = loadEnv();
  const appId = env.ML_APP_ID || process.env.ML_APP_ID;
  const secret = env.ML_SECRET || process.env.ML_SECRET;
  if (!appId || !secret) {
    throw new Error("Faltan ML_APP_ID / ML_SECRET en .env (ver developers.mercadolibre.com.ar)");
  }
  const res = await fetch(`${ML_BASE}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=client_credentials&client_id=${appId}&client_secret=${secret}`,
  });
  const data = await res.json();
  if (!data.access_token) {
    throw new Error(`No se pudo obtener token de ML: ${JSON.stringify(data).slice(0, 200)}`);
  }
  return data.access_token;
}

// Tipos mínimos de las respuestas de la API que usamos
interface MlOffer {
  item_id: string;
  price: number;
  original_price?: number;
  currency_id?: string;
  condition?: string;
  category_id: string;
  shipping?: { free_shipping?: boolean };
}

interface MlAttribute {
  id: string;
  value_name?: string;
}

interface MlSearchResult {
  id: string;
  name: string;
  attributes?: MlAttribute[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function api(token: string, pathname: string): Promise<any | null> {
  const res = await fetch(`${ML_BASE}${pathname}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
}

// ─── Resolución de input ───

type Target =
  | { kind: "catalog"; id: string }
  | { kind: "article"; url: string };

function resolveInput(input: string): Target {
  const trimmed = input.trim();

  // URL de publicación individual → solo scraper
  if (/articulo\.mercadolibre/i.test(trimmed)) return { kind: "article", url: trimmed };

  // URL /p/ o /up/ → catálogo o user-product, ambos via API
  const urlMatch = trimmed.match(/\/(?:p|up)\/(MLAU?\d+)/i);
  if (urlMatch) return { kind: "catalog", id: urlMatch[1].toUpperCase() };

  // Otra URL de ML que no podemos mapear a ID → scraper
  if (/^https?:\/\//i.test(trimmed)) return { kind: "article", url: trimmed };

  // ID pelado
  const idMatch = trimmed.match(/^(MLAU?)-?(\d+)$/i);
  if (idMatch) {
    const id = `${idMatch[1].toUpperCase()}${idMatch[2]}`;
    // MLA de 10+ dígitos = publicación individual, no catálogo
    if (idMatch[1].toUpperCase() === "MLA" && idMatch[2].length >= 10) {
      return { kind: "article", url: `https://articulo.mercadolibre.com.ar/MLA-${idMatch[2]}` };
    }
    return { kind: "catalog", id };
  }

  throw new Error(`No se pudo resolver "${input}" a un producto de MercadoLibre`);
}

// ─── Import via API ───

interface ApiProduct {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  currency: string;
  image: string;
  images: string[];
  category: string;
  categorySlug: string;
  permalink: string;
  affiliateUrl: string;
  condition: string;
  freeShipping: boolean;
  rating?: number;
  reviewCount?: number;
  pastelColor: string;
  description?: string;
  offersCount: number;
}

async function importFromApi(token: string, id: string): Promise<ApiProduct> {
  // Precio: /products/{id}/items — funciona para MLA y MLAU
  const itemsRes = await api(token, `/products/${id}/items?limit=50`);
  const offers: MlOffer[] = itemsRes?.results || [];
  if (!offers.length) {
    throw new Error(`/products/${id}/items no devolvió ofertas — ¿producto pausado o ID inválido?`);
  }
  const newOffers = offers.filter((o) => o.condition === "new");
  const pool = newOffers.length ? newOffers : offers;
  const cheapest = pool.reduce((a, b) => (b.price < a.price ? b : a));

  // Metadata: /products/{id} — 403 para MLAU (queda null y avisamos)
  const meta = await api(token, `/products/${id}`);

  // Rating: probar con item ganador + catalog_product_id
  const reviews =
    (await api(token, `/reviews/item/${cheapest.item_id}?catalog_product_id=${id}`)) ||
    (await api(token, `/reviews/item/${id}`));

  // Categoría del sitio a partir de la categoría ML del item más barato
  let categoryName = "General";
  let categorySlugMl = "general";
  const cat = await api(token, `/categories/${cheapest.category_id}`);
  if (cat) {
    const root = cat.path_from_root?.[1] || cat.path_from_root?.[0] || cat;
    categoryName = root.name;
    categorySlugMl = root.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
  const mapped = mapCategory(categorySlugMl);

  const images: string[] = (meta?.pictures || []).map((p: { url?: string }) => p.url).filter(Boolean);
  const permalink =
    meta?.permalink || `${SITE_URL}/${id.startsWith("MLAU") ? "up" : "p"}/${id}`;

  const price = Math.round(cheapest.price);
  const originalPrice = cheapest.original_price
    ? Math.round(cheapest.original_price)
    : undefined;

  return {
    id,
    title: meta?.name || "(completar a mano: metadata no disponible para este ID)",
    price,
    originalPrice: originalPrice && originalPrice > price ? originalPrice : undefined,
    currency: cheapest.currency_id || "ARS",
    image: images[0] || "",
    images,
    category: categoryName,
    categorySlug: mapped.categorySlug,
    permalink,
    affiliateUrl: buildAffiliateUrl(permalink),
    condition: cheapest.condition || "new",
    freeShipping: Boolean(cheapest.shipping?.free_shipping),
    rating: reviews?.rating_average || undefined,
    reviewCount: reviews?.paging?.total || undefined,
    pastelColor: mapped.pastelColor,
    description: meta?.short_description?.content?.slice(0, 300) || undefined,
    offersCount: offers.length,
  };
}

// ─── Búsqueda de catálogo ───

async function searchCatalog(token: string, query: string) {
  const data = await api(
    token,
    `/products/search?status=active&site_id=MLA&q=${encodeURIComponent(query)}&limit=10`
  );
  const results: MlSearchResult[] = data?.results || [];
  if (!results.length) {
    console.log(`Sin resultados de catálogo para "${query}"`);
    return;
  }
  console.log(`\n${data.paging?.total ?? "?"} productos de catálogo para "${query}". Top 10:\n`);
  for (const r of results) {
    const items = await api(token, `/products/${r.id}/items?limit=10`);
    const offers: MlOffer[] = items?.results || [];
    const cheapest = offers.length
      ? offers.reduce((a, b) => (b.price < a.price ? b : a))
      : null;
    const brand = r.attributes?.find((a) => a.id === "BRAND")?.value_name || "";
    const priceStr = cheapest
      ? `$${Math.round(cheapest.price).toLocaleString("es-AR")} (${offers.length} ofertas)`
      : "sin ofertas activas";
    console.log(`  ${r.id}  ${priceStr}`);
    console.log(`    ${r.name}${brand ? ` [${brand}]` : ""}`);
  }
  console.log(`\nPara importar: npx tsx scripts/ml-product-importer.ts <ID>\n`);
}

// ─── Salida ───

function printProduct(p: ApiProduct) {
  const today = new Date().toISOString().slice(0, 10);

  console.log("═══════════════════════════════════════");
  console.log("PRODUCTO IMPORTADO (via API oficial)");
  console.log("═══════════════════════════════════════");
  console.log(`ID:              ${p.id}`);
  console.log(`Título:          ${p.title}`);
  console.log(`Precio:          $${p.price.toLocaleString("es-AR")} ${p.currency} (más barato de ${p.offersCount} ofertas)`);
  if (p.originalPrice) console.log(`Precio original: $${p.originalPrice.toLocaleString("es-AR")}`);
  console.log(`Condición:       ${p.condition}`);
  console.log(`Envío gratis:    ${p.freeShipping ? "SÍ" : "NO"}`);
  console.log(`Rating:          ${p.rating || "N/A"}`);
  console.log(`Reviews:         ${p.reviewCount || "N/A"}`);
  console.log(`Categoría sitio: ${p.categorySlug}`);
  console.log(`Permalink:       ${p.permalink}`);
  console.log(`Affiliate URL:   ${p.affiliateUrl}`);
  console.log(`Total imágenes:  ${p.images.length}`);
  if (!p.images.length) {
    console.log(`AVISO: sin imágenes via API — completar a mano o scrapear este producto.`);
  }
  console.log("");
  console.log("─── Para curated-products.ts ───");
  console.log("");

  console.log(`{
  id: '${p.id}',
  title: '${p.title.replace(/'/g, "\\'")}',
  price: ${p.price},
  originalPrice: ${p.originalPrice || "undefined"},
  currency: '${p.currency}',
  image: '${p.image}',
  images: ${JSON.stringify(p.images, null, 4)},
  category: '${p.category}',
  categorySlug: '${p.categorySlug}',
  permalink: '${p.permalink}',
  affiliateUrl: '${p.affiliateUrl}',
  condition: '${p.condition}',
  freeShipping: ${p.freeShipping},
  rating: ${p.rating || "undefined"},
  reviewCount: ${p.reviewCount || "undefined"},
  soldQuantity: undefined,
  tiktokViews: undefined,
  badge: undefined,
  pastelColor: '${p.pastelColor}',
  priceUpdated: "${today}",
  priceLastChecked: "${today}",
  priceStatus: "fresh",
  pros: [],
  cons: [],
  verdict: undefined,
  description: ${p.description ? `'${p.description.replace(/'/g, "\\'")}'` : "undefined"},
},`);
}

// ─── Fallback scraper (publicaciones individuales) ───

async function importViaScraper(url: string) {
  console.log("Este ID/URL es una publicación individual: la API la bloquea (403).");
  console.log("Usando el scraper Puppeteer (correr local desde Argentina)...\n");
  const { scrapeProduct, scrapedToProduct } = await import("../src/lib/scraper");
  const scraped = await scrapeProduct(url);
  const product = scrapedToProduct(scraped);
  printProduct({
    ...product,
    images: product.images || [],
    offersCount: 1,
    description: product.description,
  } as ApiProduct);
}

// ─── Main ───

async function main() {
  const args = process.argv.slice(2);
  if (!args.length) {
    console.log("Uso:");
    console.log('  npx tsx scripts/ml-product-importer.ts <MLA_ID o URL>');
    console.log('  npx tsx scripts/ml-product-importer.ts --search "cafetera express"');
    process.exit(1);
  }

  if (args[0] === "--search") {
    const query = args.slice(1).join(" ").trim();
    if (!query) throw new Error("--search necesita un término de búsqueda");
    const token = await getToken();
    await searchCatalog(token, query);
    return;
  }

  const target = resolveInput(args[0]);

  if (target.kind === "article") {
    await importViaScraper(target.url);
    return;
  }

  console.log(`\nImportando ${target.id} via API oficial...\n`);
  const token = await getToken();
  const product = await importFromApi(token, target.id);
  printProduct(product);
}

main().catch((error) => {
  console.error("Error:", error instanceof Error ? error.message : error);
  process.exit(1);
});
