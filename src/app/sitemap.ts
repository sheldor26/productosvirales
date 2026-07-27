import type { MetadataRoute } from "next";
import { categories } from "@/data/categories";
import { getSitemapProducts } from "@/lib/products";
import { productHref } from "@/lib/product-url";
import { getPublishedGuides } from "@/data/guides";
import { guideHref } from "@/lib/guide-url";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://productosvirales.com.ar";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/trending`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/guias`, changeFrequency: "weekly", priority: 0.8 },
    // "/indice-precios/perfumes-arabes" queda afuera del sitemap hasta que
    // Juan confirme publicar (ver PUBLISHED en esa page.tsx).
    { url: `${SITE_URL}/sobre-nosotros`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/privacidad`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terminos`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories
    .filter((c) => !c.isSpecial)
    .map((cat) => ({
      url: `${SITE_URL}/categoria/${cat.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const productPages: MetadataRoute.Sitemap = getSitemapProducts().map(({ product, priority }) => {
    const lastmod = product.priceUpdated || product.priceLastChecked;
    return {
      url: `${SITE_URL}${productHref(product)}`,
      ...(lastmod ? { lastModified: new Date(lastmod) } : {}),
      changeFrequency: "weekly" as const,
      priority,
    };
  });

  const guidePages: MetadataRoute.Sitemap = getPublishedGuides().map((guide) => {
    // La más reciente entre la actualización editorial y el lastmod de sitemap
    // (cambios menores tipo links internos que ameritan re-crawl).
    const dates = [guide.updatedDate, guide.sitemapLastmod].filter(Boolean) as string[];
    const lastmod = dates.sort().pop() as string;
    return {
      url: `${SITE_URL}${guideHref(guide)}`,
      lastModified: new Date(lastmod),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    };
  });

  return [...staticPages, ...categoryPages, ...productPages, ...guidePages];
}
