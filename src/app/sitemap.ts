import type { MetadataRoute } from "next";
import { categories } from "@/data/categories";
import { getSitemapProducts } from "@/lib/products";
import { getPublishedGuides } from "@/data/guides";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://productosvirales.com.ar";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/trending`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/guias`, changeFrequency: "weekly", priority: 0.8 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories
    .filter((c) => !c.isSpecial)
    .map((cat) => ({
      url: `${SITE_URL}/categoria/${cat.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const productPages: MetadataRoute.Sitemap = getSitemapProducts().map(({ product, priority }) => ({
    url: `${SITE_URL}/producto/${product.id}`,
    changeFrequency: "weekly" as const,
    priority,
  }));

  const guidePages: MetadataRoute.Sitemap = getPublishedGuides().map((guide) => ({
    url: `${SITE_URL}/guias/${guide.slug}`,
    lastModified: new Date(guide.updatedDate),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...productPages, ...guidePages];
}
