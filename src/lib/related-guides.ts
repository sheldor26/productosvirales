import type { Guide, Product } from "@/lib/types";
import { getPublishedGuides, getRelatedGuides } from "@/data/guides";
import { guideHref } from "@/lib/guide-url";
import { injectLivePrices } from "@/lib/price-token";

// Enlazado interno automático (hub-and-spoke). Con DA1 la autoridad se gana
// concentrando enlaces internos en los pilares, no dispersándolos: cada guía y
// cada ficha apunta al pilar de SU categoría + hermanas. Todo se deriva de data
// que ya existe (category, pillar, quickPicks, ids MLA en las secciones); no se
// inventa nada. Se agrupa por `category` (tema fino) y NO por `silo` (cajón
// amplio que mezclaría, ej., una cafetera con un masajeador). El silo se usa
// SOLO como red: 47 de las 70 categorías tienen una sola guía publicada y ahí
// la agrupación fina no devolvía nada, así que el bloque entero desaparecía y
// la guía quedaba sin ninguna salida interna visible.

export interface RelatedGuideLink {
  title: string;
  href: string;
  isPillar: boolean;
  subtitle?: string;
}

// El standfirst de muchas guías arranca con un token de precio ("arranca en
// {{precio:...}}"). Hay que RESOLVERLO, no borrarlo: borrarlo dejaba frases
// rotas en las tarjetas de enlazado ("arranca en (dos cámaras WiFi)"). El
// segundo replace queda como red de seguridad para un token que no resuelva.
function cleanTokens(s: string | undefined): string {
  return injectLivePrices(s || "")
    .replace(/\{\{[^}]*\}\}/g, "")
    .replace(/\s+/g, " ")
    .trim();
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

  // Red por silo: si la categoría no llegó a completar, se sigue con las guías
  // del mismo silo. Sin esto, una categoría de una sola guía devolvía [] y
  // RelatedGuides se rendereaba como null, dejando la guía sin salida.
  if (links.length < limit && guide.silo) {
    const delSilo = getPublishedGuides()
      .filter((g) => g.silo === guide.silo && !seen.has(g.slug))
      .sort((a, b) => b.publishedDate.localeCompare(a.publishedDate));
    for (const g of delSilo) {
      links.push(toLink(g, false));
      seen.add(g.slug);
      if (links.length >= limit) break;
    }
  }

  return links;
}

/**
 * Título del bloque "seguí leyendo". Usa la categoría cuando tiene hermanas
 * publicadas; si no, cae al silo, que es de donde salen los links en ese caso.
 */
export function nextStepHeadingForGuide(guide: Guide): string {
  const hayHermanas = getPublishedGuides().some(
    (g) => g.category === guide.category && g.slug !== guide.slug
  );
  if (hayHermanas) return `Más sobre ${categoryLabel(guide.category)}`;
  return guide.silo ? `Más sobre ${categoryLabel(guide.silo)}` : "Más guías";
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
