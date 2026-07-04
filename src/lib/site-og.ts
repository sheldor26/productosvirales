import type { Metadata } from "next";

/**
 * Campos de Open Graph que el layout raíz define pero que se pierden si una
 * página setea su propio `openGraph` (Next.js mergea metadata a nivel de
 * campo top-level, no hace deep-merge dentro de `openGraph`). Spreadear esto
 * evita perder `images`/`locale`/`siteName`/`type` en páginas sin imagen OG propia.
 */
export const baseOpenGraph: NonNullable<Metadata["openGraph"]> = {
  type: "website",
  locale: "es_AR",
  siteName: "ProductosVirales",
  images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
};
