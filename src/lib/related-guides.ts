import type { Guide, Product } from "@/lib/types";
import { getPublishedGuides, getRelatedGuides } from "@/data/guides";
import { guideHref } from "@/lib/guide-url";

// Enlazado interno automático (hub-and-spoke). Con DA1 la autoridad se gana
// concentrando enlaces internos en los pilares, no dispersándolos: cada guía y
// cada ficha apunta al pilar de SU categoría + hermanas. Todo se deriva de data
// que ya existe (category, pillar, quickPicks, ids MLA en las secciones); no se
// inventa nada. Se agrupa por `category` (tema fino) y NO por `silo` (cajón
// amplio que mezclaría, ej., una cafetera con un masajeador).

export interface RelatedGuideLink {
  title: string;
  href: string;
  isPillar: boolean;
  subtitle?: string;
}

function cleanTokens(s: string | undefined): string {
  return (s || "").replace(/\{\{[^}]*\}\}/g, "").replace(/\s+/g, " ").trim();
}

function toLink(g: Guide, isPillar: boolean): RelatedGuideLink {
  return {
    title: cleanTokens(g.title) || g.title,
    href: guideHref(g),
    isPillar,
    subtitle: cleanTokens(g.standfirst || g.metaDescription).slice(0, 110) || undefined,
  };
}

/** Etiqueta legible de una categoría (slug → texto). Ej: "freidoras-de-aire" → "freidoras de aire". */
export function categoryLabel(category: string): string {
  return category.replace(/-/g, " ");
}

/** Guía pilar (hub/ranking) publicada de una categoría. */
export function getCategoryPillar(category: string, excludeSlug?: string): Guide | undefined {
  return getPublishedGuides().find(
    (g) => g.category === category && g.pillar && g.slug !== excludeSlug
  );
}

/**
 * "Próximo paso" de una guía: primero el pilar de su categoría (si la actual no
 * es el pilar), después las hermanas de la misma categoría. Solo publicadas,
 * orden determinístico, sin repetir.
 */
export function nextStepLinksForGuide(guide: Guide, limit = 4): RelatedGuideLink[] {
  const links: RelatedGuideLink[] = [];
  const seen = new Set<string>([guide.slug]);

  if (!guide.pillar) {
    const pillar = getCategoryPillar(guide.category, guide.slug);
    if (pillar) {
      links.push(toLink(pillar, true));
      seen.add(pillar.slug);
    }
  }

  for (const g of getRelatedGuides(guide, limit + 2)) {
    if (seen.has(g.slug)) continue;
    links.push(toLink(g, false));
    seen.add(g.slug);
    if (links.length >= limit) break;
  }

  return links;
}

// ── Índice inverso producto → guías que lo mencionan (se calcula una sola vez) ──
let _productGuideIndex: Map<string, Guide[]> | null = null;

function productGuideIndex(): Map<string, Guide[]> {
  if (_productGuideIndex) return _productGuideIndex;
  const map = new Map<string, Guide[]>();
  for (const g of getPublishedGuides()) {
    const ids = new Set<string>();
    g.quickPicks?.forEach((q) => ids.add(q.productMlaId));
    // Cualquier id MLA que aparezca en secciones, FAQ, intro o respuesta
    // directa (tokens {{precio:MLA…}} y links a fichas cuentan como mención
    // real). Antes solo se miraban las secciones y un producto citado solo en
    // el FAQ de una guía quedaba fuera del índice.
    const haystack = JSON.stringify({
      sections: g.sections ?? [],
      faq: g.faq ?? [],
      intro: g.intro ?? [],
      directAnswer: g.directAnswer ?? "",
    });
    haystack.match(/MLA[UF]?\d+/g)?.forEach((id) => ids.add(id));
    ids.forEach((id) => {
      const arr = map.get(id) ?? [];
      arr.push(g);
      map.set(id, arr);
    });
  }
  _productGuideIndex = map;
  return map;
}

/** Guías publicadas que mencionan/recomiendan este producto. */
export function guidesForProduct(productId: string): Guide[] {
  return productGuideIndex().get(productId) ?? [];
}

/**
 * "Próximo paso" de una ficha: el pilar de la categoría donde aparece el
 * producto + las guías que lo mencionan. Le da a la ficha (hoy huérfana) un
 * camino de vuelta al hub. Si el producto no está en ninguna guía, devuelve
 * vacío (no inventa enlaces).
 */
export function nextStepLinksForProduct(product: Product, limit = 4): RelatedGuideLink[] {
  const featuring = guidesForProduct(product.id);
  if (featuring.length === 0) return [];

  const links: RelatedGuideLink[] = [];
  const seen = new Set<string>();

  const pillar = getCategoryPillar(featuring[0].category);
  if (pillar) {
    links.push(toLink(pillar, true));
    seen.add(pillar.slug);
  }

  for (const g of featuring) {
    if (seen.has(g.slug)) continue;
    links.push(toLink(g, false));
    seen.add(g.slug);
    if (links.length >= limit) break;
  }

  return links;
}
