#!/usr/bin/env npx tsx
/**
 * Standalone ML Product Importer
 * Run: npx tsx scripts/ml-product-importer.ts MLA850734153
 *   or: npx tsx scripts/ml-product-importer.ts "https://articulo.mercadolibre.com.ar/MLA-850734153-..."
 */

const ML_BASE = "https://api.mercadolibre.com";

// ─── Types (inline to keep script standalone) ───

interface MLItem {
  id: string;
  title: string;
  price: number;
  original_price: number | null;
  currency_id: string;
  thumbnail: string;
  pictures: Array<{ id: string; url: string; secure_url: string; size: string; max_size: string }>;
  permalink: string;
  condition: string;
  shipping: { free_shipping: boolean };
  sold_quantity: number;
  category_id: string;
  status: string;
  available_quantity: number;
  initial_quantity: number;
  attributes: Array<{ id: string; name: string; value_name: string | null }>;
}

interface MLCategory {
  id: string;
  name: string;
  path_from_root: Array<{ id: string; name: string }>;
}

interface MLReviews {
  rating_average: number;
  total: number;
}

// ─── Helpers ───

const AFFILIATE_TOOL_ID = "12465328";
const AFFILIATE_WORD = "productosvirales";

function buildAffiliateUrl(permalink: string): string {
  try {
    const url = new URL(permalink);
    url.searchParams.set("matt_tool", AFFILIATE_TOOL_ID);
    url.searchParams.set("matt_word", AFFILIATE_WORD);
    return url.toString();
  } catch {
    return permalink;
  }
}

function extractMLAId(input: string): string | null {
  const directMatch = input.match(/^(MLA[-]?\d+)/i);
  if (directMatch) return directMatch[1].replace("-", "");
  const articuloMatch = input.match(/MLA[-]?(\d+)/i);
  if (articuloMatch) return `MLA${articuloMatch[1]}`;
  const catalogMatch = input.match(/\/p\/(MLA\d+)/i);
  if (catalogMatch) return catalogMatch[1];
  return null;
}

function getHighResImage(thumbnailUrl: string): string {
  return thumbnailUrl.replace(/-I\.jpg$/, "-O.jpg");
}

const CATEGORY_MAP: Record<string, { categorySlug: string; pastelColor: string }> = {
  "bazar-cocina": { categorySlug: "cocina", pastelColor: "var(--pastel-coral)" },
  cocina: { categorySlug: "cocina", pastelColor: "var(--pastel-coral)" },
  "pequenos-electrodomesticos": { categorySlug: "cocina", pastelColor: "var(--pastel-coral)" },
  "electrodomesticos-cocina": { categorySlug: "cocina", pastelColor: "var(--pastel-coral)" },
  "hogar-muebles-jardin": { categorySlug: "hogar", pastelColor: "var(--pastel-amber)" },
  "decoracion-hogar": { categorySlug: "hogar", pastelColor: "var(--pastel-amber)" },
  iluminacion: { categorySlug: "hogar", pastelColor: "var(--pastel-amber)" },
  organizacion: { categorySlug: "hogar", pastelColor: "var(--pastel-amber)" },
  limpieza: { categorySlug: "hogar", pastelColor: "var(--pastel-amber)" },
  electronica: { categorySlug: "tech", pastelColor: "var(--pastel-blue)" },
  "celulares-accesorios": { categorySlug: "tech", pastelColor: "var(--pastel-blue)" },
  computacion: { categorySlug: "tech", pastelColor: "var(--pastel-blue)" },
  "belleza-cuidado-personal": { categorySlug: "belleza", pastelColor: "var(--pastel-pink)" },
  "salud-belleza": { categorySlug: "belleza", pastelColor: "var(--pastel-pink)" },
  "deportes-fitness": { categorySlug: "fitness", pastelColor: "var(--pastel-green)" },
  "ropa-accesorios": { categorySlug: "moda", pastelColor: "var(--pastel-purple)" },
};

function mapCategory(slug: string): { categorySlug: string; pastelColor: string } {
  for (const [key, value] of Object.entries(CATEGORY_MAP)) {
    if (slug.includes(key) || key.includes(slug)) return value;
  }
  return { categorySlug: "gadgets", pastelColor: "var(--pastel-blue)" };
}

// ─── Fetch with auth ───

const ML_ACCESS_TOKEN = process.env.ML_ACCESS_TOKEN || "";

function mlFetch(url: string): Promise<Response> {
  const headers: Record<string, string> = {
    "User-Agent": "ProductosVirales/1.0",
  };
  if (ML_ACCESS_TOKEN) {
    headers["Authorization"] = `Bearer ${ML_ACCESS_TOKEN}`;
  }
  return fetch(url, { headers });
}

// ─── Main ───

async function main() {
  const input = process.argv[2];

  if (!input) {
    console.log("Uso: npx tsx scripts/ml-product-importer.ts <MLA_ID o URL>");
    console.log("Ejemplo: npx tsx scripts/ml-product-importer.ts MLA850734153");
    console.log('Ejemplo: npx tsx scripts/ml-product-importer.ts "https://articulo.mercadolibre.com.ar/MLA-850734153-..."');
    console.log("");
    console.log("Tip: set ML_ACCESS_TOKEN env var if you get 403 errors.");
    process.exit(1);
  }

  const mlaId = extractMLAId(input.trim());
  if (!mlaId) {
    console.error(`No se pudo extraer MLA ID de: "${input}"`);
    process.exit(1);
  }

  console.log(`\nImportando ${mlaId}...\n`);

  try {
    const itemRes = await mlFetch(`${ML_BASE}/items/${mlaId}`);
    if (!itemRes.ok) throw new Error(`Error ${itemRes.status}: ${itemRes.statusText}`);
    const item: MLItem = await itemRes.json();

    const catRes = await mlFetch(`${ML_BASE}/categories/${item.category_id}`);
    const category: MLCategory = catRes.ok
      ? await catRes.json()
      : { id: "", name: "General", path_from_root: [] };

    let reviews: MLReviews | null = null;
    try {
      const revRes = await mlFetch(`${ML_BASE}/reviews/item/${mlaId}`);
      if (revRes.ok) reviews = await revRes.json();
    } catch { /* ignore */ }

    const mainImage = getHighResImage(item.thumbnail);
    const allImages = item.pictures?.map((p) => p.secure_url || getHighResImage(p.url)) || [mainImage];

    const rootCat = category.path_from_root?.[1] || category.path_from_root?.[0] || category;
    const mapped = mapCategory(
      rootCat.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
    );

    const discount =
      item.original_price && item.original_price > item.price
        ? Math.round(((item.original_price - item.price) / item.original_price) * 100)
        : null;

    console.log("═══════════════════════════════════════");
    console.log("PRODUCTO IMPORTADO");
    console.log("═══════════════════════════════════════");
    console.log(`ID:              ${item.id}`);
    console.log(`Título:          ${item.title}`);
    console.log(`Precio:          $${item.price.toLocaleString("es-AR")} ${item.currency_id}`);
    if (item.original_price) {
      console.log(`Precio original: $${item.original_price.toLocaleString("es-AR")} (${discount}% OFF)`);
    }
    console.log(`Condición:       ${item.condition}`);
    console.log(`Envío gratis:    ${item.shipping?.free_shipping ? "SÍ" : "NO"}`);
    console.log(`Vendidos:        ${item.sold_quantity}`);
    console.log(`Rating:          ${reviews?.rating_average || "N/A"} (${reviews?.total || 0} reviews)`);
    console.log(`Categoría ML:    ${rootCat.name} (${item.category_id})`);
    console.log(`Categoría sitio: ${mapped.categorySlug} (${mapped.pastelColor})`);
    console.log(`Permalink:       ${item.permalink}`);
    console.log(`Affiliate URL:   ${buildAffiliateUrl(item.permalink)}`);
    console.log(`Imagen HD:       ${mainImage}`);
    console.log(`Total imágenes:  ${allImages.length}`);
    console.log(`Estado:          ${item.status}`);
    console.log(`Stock:           ${item.available_quantity}`);
    console.log("");
    console.log("─── Para curated-products.ts ───");
    console.log("");

    const productCode = `{
  id: '${item.id}',
  title: '${item.title.replace(/'/g, "\\'")}',
  price: ${item.price},
  originalPrice: ${item.original_price || "undefined"},
  currency: '${item.currency_id}',
  image: '${mainImage}',
  images: ${JSON.stringify(allImages, null, 4)},
  category: '${rootCat.name}',
  categorySlug: '${mapped.categorySlug}',
  permalink: '${item.permalink}',
  affiliateUrl: '${buildAffiliateUrl(item.permalink)}',
  condition: '${item.condition === "new" ? "new" : "used"}',
  freeShipping: ${item.shipping?.free_shipping || false},
  rating: ${reviews?.rating_average || "undefined"},
  soldQuantity: ${item.sold_quantity},
  tiktokViews: undefined,     // TODO: agregar
  badge: undefined,            // TODO: 'viral' | 'trending' | 'hot-deal'
  pastelColor: '${mapped.pastelColor}',
  pros: [],                    // TODO: escribir
  cons: [],                    // TODO: escribir
  verdict: undefined,          // TODO: escribir
  description: undefined,      // TODO: escribir
},`;

    console.log(productCode);
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
