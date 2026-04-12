import type { MetadataRoute } from "next";
import { categories } from "@/data/categories";
import { getSitemapProducts } from "@/lib/products";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://productosvirales.com.ar";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/trending`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories
    .filter((c) => !c.isSpecial)
    .map((cat) => ({
      url: `${SITE_URL}/categoria/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  // Product URLs stay indexable (even deprioritized ones), but visibility
  // determines the sitemap priority: featured 0.9 / normal 0.7 / deprioritized 0.3.
  const productPages: MetadataRoute.Sitemap = getSitemapProducts().map(({ product, priority }) => ({
    url: `${SITE_URL}/producto/${product.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
