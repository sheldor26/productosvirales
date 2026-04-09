const ML_BASE = "https://api.mercadolibre.com";
const SITE_ID = "MLA";

export async function getTrends(categoryId?: string) {
  const url = categoryId
    ? `${ML_BASE}/trends/${SITE_ID}/${categoryId}`
    : `${ML_BASE}/trends/${SITE_ID}`;

  const res = await fetch(url, {
    headers: process.env.ML_ACCESS_TOKEN
      ? { Authorization: `Bearer ${process.env.ML_ACCESS_TOKEN}` }
      : {},
    next: { revalidate: 86400 },
  });

  if (!res.ok) return [];
  return res.json();
}

export async function searchProducts(query: string, limit = 20) {
  const url = `${ML_BASE}/sites/${SITE_ID}/search?q=${encodeURIComponent(query)}&limit=${limit}`;
  const res = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return { results: [] };
  return res.json();
}

export async function getItem(itemId: string) {
  const res = await fetch(`${ML_BASE}/items/${itemId}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return null;
  return res.json();
}

export async function getCategories() {
  const res = await fetch(`${ML_BASE}/sites/${SITE_ID}/categories`, {
    next: { revalidate: 604800 },
  });

  if (!res.ok) return [];
  return res.json();
}

export function buildAffiliateUrl(permalink: string): string {
  return permalink;
}

export function getFullSizeImage(thumbnail: string): string {
  return thumbnail.replace(/-I\.jpg$/, "-O.jpg");
}
