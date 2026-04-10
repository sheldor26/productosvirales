import type { Product, MLItem, MLCategory, MLReviews } from "./types";

const ML_BASE = "https://api.mercadolibre.com";
const SITE_ID = "MLA";

function mlHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "User-Agent": "ProductosVirales/1.0" };
  if (process.env.ML_ACCESS_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.ML_ACCESS_TOKEN}`;
  }
  return headers;
}

// ─── Affiliate config ───
const AFFILIATE_TOOL_ID = "12465328";
const AFFILIATE_WORD = "productosvirales";

export function buildAffiliateUrl(permalink: string): string {
  try {
    const url = new URL(permalink);
    url.searchParams.set("matt_tool", AFFILIATE_TOOL_ID);
    url.searchParams.set("matt_word", AFFILIATE_WORD);
    return url.toString();
  } catch {
    return permalink;
  }
}

// ─── Extract MLA ID from various URL formats ───
export function extractMLAId(input: string): string | null {
  // Direct ID: "MLA850734153" or "MLA-850734153"
  const directMatch = input.match(/^(MLA[-]?\d+)/i);
  if (directMatch) {
    return directMatch[1].replace("-", "");
  }

  // Article URL: articulo.mercadolibre.com.ar/MLA-850734153-...
  const articuloMatch = input.match(/MLA[-]?(\d+)/i);
  if (articuloMatch) {
    return `MLA${articuloMatch[1]}`;
  }

  // Catalog URL: .../p/MLA26156003
  const catalogMatch = input.match(/\/p\/(MLA\d+)/i);
  if (catalogMatch) {
    return catalogMatch[1];
  }

  return null;
}

// ─── High-res image ───
export function getHighResImage(thumbnailUrl: string): string {
  return thumbnailUrl.replace(/-I\.jpg$/, "-O.jpg");
}

// ─── Category mapping ───
const CATEGORY_MAP: Record<string, { categorySlug: string; pastelColor: string }> = {
  "bazar-cocina": { categorySlug: "cocina", pastelColor: "var(--pastel-coral)" },
  cocina: { categorySlug: "cocina", pastelColor: "var(--pastel-coral)" },
  "pequenos-electrodomesticos": { categorySlug: "cocina", pastelColor: "var(--pastel-coral)" },
  "electrodomesticos-cocina": { categorySlug: "cocina", pastelColor: "var(--pastel-coral)" },
  mandolina: { categorySlug: "cocina", pastelColor: "var(--pastel-coral)" },
  cortador: { categorySlug: "cocina", pastelColor: "var(--pastel-coral)" },
  rallador: { categorySlug: "cocina", pastelColor: "var(--pastel-coral)" },
  picador: { categorySlug: "cocina", pastelColor: "var(--pastel-coral)" },
  "utensilios-de-preparacion": { categorySlug: "cocina", pastelColor: "var(--pastel-coral)" },
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

export function mapCategory(mlCategorySlug: string): { categorySlug: string; pastelColor: string } {
  for (const [key, value] of Object.entries(CATEGORY_MAP)) {
    if (mlCategorySlug.includes(key) || key.includes(mlCategorySlug)) {
      return value;
    }
  }
  return { categorySlug: "gadgets", pastelColor: "var(--pastel-blue)" };
}

// ─── API fetchers ───

export async function getTrends(categoryId?: string) {
  const url = categoryId
    ? `${ML_BASE}/trends/${SITE_ID}/${categoryId}`
    : `${ML_BASE}/trends/${SITE_ID}`;

  const res = await fetch(url, {
    headers: mlHeaders(),
    next: { revalidate: 86400 },
  });

  if (!res.ok) return [];
  return res.json();
}

export async function searchProducts(query: string, limit = 20) {
  const url = `${ML_BASE}/sites/${SITE_ID}/search?q=${encodeURIComponent(query)}&limit=${limit}`;
  const res = await fetch(url, {
    headers: mlHeaders(),
    next: { revalidate: 3600 },
  });

  if (!res.ok) return { results: [] };
  return res.json();
}

export async function getItem(itemId: string): Promise<MLItem> {
  const res = await fetch(`${ML_BASE}/items/${itemId}`, {
    headers: mlHeaders(),
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`ML API error: ${res.status} ${res.statusText} for item ${itemId}`);
  }

  return res.json();
}

export async function getCategoryName(
  categoryId: string
): Promise<{ name: string; slug: string }> {
  const res = await fetch(`${ML_BASE}/categories/${categoryId}`, {
    headers: mlHeaders(),
    next: { revalidate: 604800 },
  });

  if (!res.ok) {
    return { name: "General", slug: "general" };
  }

  const data: MLCategory = await res.json();
  const rootCategory = data.path_from_root?.[1] || data.path_from_root?.[0] || data;
  const slug = rootCategory.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return { name: rootCategory.name, slug };
}

export async function getItemReviews(
  itemId: string
): Promise<{ rating: number; total: number } | null> {
  try {
    const res = await fetch(`${ML_BASE}/reviews/item/${itemId}`, {
      headers: mlHeaders(),
      next: { revalidate: 86400 },
    });

    if (!res.ok) return null;

    const data: MLReviews = await res.json();
    return { rating: data.rating_average, total: data.total };
  } catch {
    return null;
  }
}

export async function getCategories() {
  const res = await fetch(`${ML_BASE}/sites/${SITE_ID}/categories`, {
    headers: mlHeaders(),
    next: { revalidate: 604800 },
  });

  if (!res.ok) return [];
  return res.json();
}

// ─── Import a product by MLA ID ───

export async function importProduct(mlaId: string): Promise<{
  product: Product;
  meta: {
    mlId: string;
    mlCategoryId: string;
    mlCategoryName: string;
    discount: string | null;
    status: string;
    availableQuantity: number;
    reviewCount: number;
  };
}> {
  const item = await getItem(mlaId);

  const [categoryInfo, reviews] = await Promise.all([
    getCategoryName(item.category_id),
    getItemReviews(mlaId),
  ]);

  const mainImage = getHighResImage(item.thumbnail);
  const allImages =
    item.pictures?.map((pic) => pic.secure_url || getHighResImage(pic.url)) || [mainImage];

  const mapped = mapCategory(categoryInfo.slug);

  const discount =
    item.original_price && item.original_price > item.price
      ? Math.round(((item.original_price - item.price) / item.original_price) * 100)
      : null;

  const product: Product = {
    id: item.id,
    title: item.title,
    price: item.price,
    originalPrice: item.original_price || undefined,
    currency: item.currency_id,
    image: mainImage,
    images: allImages,
    category: categoryInfo.name,
    categorySlug: mapped.categorySlug,
    permalink: item.permalink,
    affiliateUrl: buildAffiliateUrl(item.permalink),
    condition: item.condition === "new" ? "new" : "used",
    freeShipping: item.shipping?.free_shipping || false,
    rating: reviews?.rating,
    soldQuantity: item.sold_quantity,
    pastelColor: mapped.pastelColor,
    badge: undefined,
    tiktokViews: undefined,
    pros: [],
    cons: [],
    verdict: undefined,
    description: undefined,
  };

  return {
    product,
    meta: {
      mlId: mlaId,
      mlCategoryId: item.category_id,
      mlCategoryName: categoryInfo.name,
      discount: discount ? `${discount}%` : null,
      status: item.status,
      availableQuantity: item.available_quantity,
      reviewCount: reviews?.total || 0,
    },
  };
}
