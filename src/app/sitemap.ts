import type { MetadataRoute } from "next";
import { categories } from "@/data/categories";
import { getSitemapProducts } from "@/lib/products";
import { productHref } from "@/lib/product-url";
import { getPublishedGuides } from "@/data/guides";
import { guideHref } from "@/lib/guide-url";
import type { Guide } from "@/lib/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://productosvirales.com.ar";

/**
 * Sitemap de imágenes (extensión de Google, soportada por MetadataRoute.Sitemap).
 *
 * Por qué: hasta ahora el sitemap no declaraba una sola imagen, así que Google
 * las descubría únicamente crawleando el HTML. Aun así, en 28 días el sitio juntó
 * 35.275 impresiones en Google Imágenes (medibles desde que `gsc.py` soporta
 * `--type image`), pero el 98% de esas impresiones caen en posición 20 a 70 de la
 * grilla. Declarar qué imagen pertenece a cada página es la única palanca de
 * descubrimiento que Google documenta para esto, y es gratis.
 *
 * Se declaran tanto las imágenes propias (`/images/...`, `/guias/...`) como las
 * fotos de producto alojadas en el CDN de MercadoLibre: la extensión sirve para
 * asociar una imagen a una página, no para reclamar su autoría, y el dato ya
 * confirma que esas fotos se indexan atribuidas a nuestras URLs (248 fichas sin
 * ninguna imagen propia suman 10.759 impresiones en Imágenes).
 */
const toAbsolute = (src: string) => (src.startsWith("http") ? src : `${SITE_URL}${src}`);

/** Imágenes de una guía: la de Open Graph más las de sus bloques `image` / `image-grid`. */
function guideImages(guide: Guide): string[] {
  const found: string[] = [];
  if (guide.ogImage) found.push(guide.ogImage);
  for (const section of guide.sections) {
    if (section.src) found.push(section.src);
    for (const item of section.gridImages || []) {
      if (item.src) found.push(item.src);
    }
  }
  // Sin duplicados: el hero suele repetirse como ogImage.
  return [...new Set(found.map(toAbsolute))];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/trending`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/guias`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/indice-precios/perfumes-arabes`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/sobre-nosotros`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contacto`, changeFrequency: "yearly", priority: 0.4 },
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
    // La ficha usa la foto principal; `images` trae el resto de la galería.
    const fotos = [...new Set([product.image, ...(product.images || [])].filter(Boolean))];
    return {
      url: `${SITE_URL}${productHref(product)}`,
      ...(lastmod ? { lastModified: new Date(lastmod) } : {}),
      changeFrequency: "weekly" as const,
      priority,
      ...(fotos.length ? { images: fotos.map(toAbsolute) } : {}),
    };
  });

  const guidePages: MetadataRoute.Sitemap = getPublishedGuides().map((guide) => {
    // La más reciente entre la actualización editorial y el lastmod de sitemap
    // (cambios menores tipo links internos que ameritan re-crawl).
    const dates = [guide.updatedDate, guide.sitemapLastmod].filter(Boolean) as string[];
    const lastmod = dates.sort().pop() as string;
    const imagenes = guideImages(guide);
    return {
      url: `${SITE_URL}${guideHref(guide)}`,
      lastModified: new Date(lastmod),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      ...(imagenes.length ? { images: imagenes } : {}),
    };
  });

  return [...staticPages, ...categoryPages, ...productPages, ...guidePages];
}
