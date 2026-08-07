import type { Metadata } from "next";
import type { Guide } from "./types";
import { guideUrl } from "./guide-url";
import { injectLivePrices } from "./price-token";

/** Metadata compartida por las rutas de guía (plana `[slug]` y en silo `[slug]/[sub]`). */
export function buildGuideMetadata(guide: Guide | undefined): Metadata {
  if (!guide) return { title: "Guía no encontrada" };

  const url = guideUrl(guide);
  const ogImage = `${url}/opengraph-image`;

  const metaDesc = injectLivePrices(guide.metaDescription);
  const ogDesc = injectLivePrices(guide.ogDescription || guide.metaDescription);

  return {
    // `absolute` saltea el template `%s | ProductosVirales` del layout raíz.
    // Ese sufijo comía 19 de los ~60 caracteres que Google muestra en la SERP
    // y, sin reconocimiento de marca todavía, no aporta clicks: los caracteres
    // rinden mucho más para la keyword. Las fichas de producto ya lo hacían.
    title: { absolute: guide.seoTitle },
    description: metaDesc,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      title: guide.ogTitle || guide.seoTitle,
      description: ogDesc,
      url,
      siteName: "Productos Virales",
      locale: "es_AR",
      publishedTime: guide.publishedDate,
      modifiedTime: guide.updatedDate,
      images: [{ url: ogImage, width: 1200, height: 630, alt: guide.h1 || guide.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.ogTitle || guide.seoTitle,
      description: ogDesc,
      images: [ogImage],
    },
  };
}
