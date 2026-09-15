import { getPublishedGuides } from "@/data/guides";
import { guideUrl } from "@/lib/guide-url";
import { injectLivePrices } from "@/lib/price-token";
import type { Guide } from "@/lib/types";

// El archivo se genera en build time (igual que sitemap.xml) leyendo las guías
// publicadas, así nunca queda desincronizado con el catálogo real.
export const dynamic = "force-static";

const SITE = "https://productosvirales.com.ar";

/** Nombre legible de cada cluster. Si falta, se prettifica el slug. */
const CATEGORY_NAMES: Record<string, string> = {
  "freidoras-de-aire": "Freidoras de aire",
  "perfumes-arabes": "Perfumes árabes",
  "pavas-electricas": "Pavas eléctricas",
  masajeadores: "Masajeadores",
  cafeteras: "Cafeteras",
  gaming: "Gaming",
  "aspiradoras-robot": "Robots aspiradora",
  audio: "Audio",
  cocina: "Cocina",
  licuadoras: "Licuadoras",
  "cuidado-personal": "Cuidado personal",
  climatizacion: "Climatización",
};

function categoryName(slug: string): string {
  if (CATEGORY_NAMES[slug]) return CATEGORY_NAMES[slug];
  const pretty = slug.replace(/-/g, " ");
  return pretty.charAt(0).toUpperCase() + pretty.slice(1);
}

function guideLine(g: Guide): string {
  // metaDescription lleva tokens de precio en varias guías: hay que resolverlos
  // acá, si no el crawler de IA se lleva "{{precio:MLA…}}" en vez del número.
  // injectLivePrices no se aplica por dato sino por superficie de render, y
  // esta superficie no estaba conectada (ver MISTAKES.md, 2026-08-17).
  return `- [${g.title}](${guideUrl(g)}): ${injectLivePrices(g.metaDescription)}`;
}

export function GET(): Response {
  const guides = getPublishedGuides();

  // Agrupar por cluster; dentro de cada cluster, la guía pilar primero.
  const byCategory = new Map<string, Guide[]>();
  for (const g of guides) {
    const list = byCategory.get(g.category) ?? [];
    list.push(g);
    byCategory.set(g.category, list);
  }
  const clusters = [...byCategory.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .map(([slug, list]) => {
      const sorted = [...list].sort(
        (a, b) => Number(b.pillar ?? false) - Number(a.pillar ?? false) || a.title.localeCompare(b.title, "es"),
      );
      return `## ${categoryName(slug)}\n\n${sorted.map(guideLine).join("\n")}`;
    });

  const lastUpdated = guides
    .map((g) => g.updatedDate)
    .sort()
    .at(-1);

  const text = `# ProductosVirales

> Curador independiente de productos virales de MercadoLibre Argentina. Publicamos guías de compra honestas (con contras, no solo pros) y fichas de producto con precios reales en ARS actualizados periódicamente. Monetizamos con links de afiliado; toda guía incluye disclosure. Idioma: español (Argentina). Última actualización de contenido: ${lastUpdated}.

## Sobre el sitio

- [Sobre nosotros y metodología](${SITE}/sobre-nosotros): quiénes somos, cómo seleccionamos productos y cómo ganamos dinero
- [Sitemap completo](${SITE}/sitemap.xml): todas las guías, productos y categorías

${clusters.join("\n\n")}

## Optional

- [Términos y condiciones](${SITE}/terminos)
- [Política de privacidad](${SITE}/privacidad)

## Contact

- Email: hola@productosvirales.com.ar
- Web: ${SITE}
`;

  return new Response(text, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
