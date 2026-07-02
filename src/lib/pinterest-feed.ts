import { categories } from "@/data/categories";
import { getVisibleProducts } from "@/lib/products";
import { productHref } from "@/lib/product-url";
import { getPublishedGuides } from "@/data/guides";
import { guideHref } from "@/lib/guide-url";
import { guideOgImage } from "@/lib/guide-image";

// Lógica compartida para armar el CSV del importador "Cargá un CSV o TXT" de
// Pinterest (Bulk Create Pins). La usan tanto la ruta `/api/pinterest-feed`
// (descarga en el navegador) como el script `scripts/pinterest-csv.ts`
// (genera todos los CSV de un comando). Una sola fuente de verdad.
//
// Columnas exactas que espera Pinterest (2026):
//   Title (<=100) | Media URL (.jpg/.png público) | Pinterest board |
//   Description (<=500, única) | Link | Keywords (coma) | Publish date (opcional)

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://productosvirales.com.ar"
).replace(/\/$/, "");

const MAX_TITLE = 100;
const MAX_DESC = 500;

// Nombre de tablero por defecto según la categoría del contenido.
const categoryName = new Map(categories.map((c) => [c.slug, c.name]));

export interface Pin {
  title: string;
  media: string;
  board: string;
  description: string;
  link: string;
  keywords: string;
}

export interface FeedOptions {
  /** "productos" | "guias" | undefined (todo). */
  tipo?: string | null;
  /** Filtra por slug de categoría (ej. "cocina"). */
  categoria?: string | null;
  /** Fuerza un único tablero para todas las filas. */
  board?: string | null;
}

// Escapa un valor para CSV (comillas, comas, saltos de línea).
export function csvCell(value: unknown): string {
  const s = value === null || value === undefined ? "" : String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

// Corta a `max` caracteres sin partir una palabra ni dejar guión colgando.
function clamp(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s\-–—]+$/, "");
}

// Pinterest solo acepta media URL que termine en jpg/jpeg/png/mp4 (rechaza
// webp). MercadoLibre sirve la MISMA imagen en jpg cambiando la extensión, así
// que normalizamos los .webp de mlstatic a .jpg y no perdemos esos Pins.
function normalizeMedia(url: string | undefined): string | undefined {
  if (!url) return url;
  return url.replace(/\.webp(\?|$)/i, ".jpg$1");
}

function usableMedia(url: string | undefined): url is string {
  return !!url && /\.(jpe?g|png|mp4)(\?|$)/i.test(url);
}

/** Construye los Pins (fichas + guías visibles) según los filtros. */
export function buildPins({ tipo, categoria, board }: FeedOptions = {}): Pin[] {
  const pins: Pin[] = [];

  if (tipo !== "guias") {
    for (const p of getVisibleProducts()) {
      if (categoria && p.categorySlug !== categoria) continue;
      const media = normalizeMedia(p.image);
      if (!usableMedia(media)) continue;
      const cat = categoryName.get(p.categorySlug) || p.category;
      pins.push({
        title: clamp(p.title, MAX_TITLE),
        media,
        board: board || cat,
        description: clamp(p.description || p.title, MAX_DESC),
        link: `${SITE_URL}${productHref(p)}`,
        keywords: [cat, "MercadoLibre", "Argentina"].join(", "),
      });
    }
  }

  if (tipo !== "productos") {
    for (const g of getPublishedGuides()) {
      if (categoria && g.category !== categoria) continue;
      const media = normalizeMedia(guideOgImage(g));
      if (!usableMedia(media)) continue;
      const cat = categoryName.get(g.category) || g.category;
      pins.push({
        title: clamp(g.h1 || g.title, MAX_TITLE),
        media,
        board: board || cat,
        description: clamp(g.standfirst || g.metaDescription, MAX_DESC),
        link: `${SITE_URL}${guideHref(g)}`,
        keywords: [cat, "guía", "cuál comprar"].join(", "),
      });
    }
  }

  return pins;
}

/**
 * Serializa los Pins al CSV de Pinterest. Si `porDia > 0`, escalona las fechas
 * de publicación (N Pins por día desde mañana) para no saturar.
 */
export function pinsToCsv(pins: Pin[], porDia = 0): string {
  const header = "Title,Media URL,Pinterest board,Description,Link,Keywords,Publish date";
  const body = pins
    .map((pin, i) => {
      let publish = "";
      if (porDia > 0) {
        const day = Math.floor(i / porDia) + 1; // arranca mañana
        const slot = i % porDia;
        const d = new Date();
        d.setUTCDate(d.getUTCDate() + day);
        d.setUTCHours(9 + slot, 0, 0, 0); // 09:00, 10:00, ... UTC
        publish = d.toISOString().slice(0, 19);
      }
      return [
        csvCell(pin.title),
        csvCell(pin.media),
        csvCell(pin.board),
        csvCell(pin.description),
        csvCell(pin.link),
        csvCell(pin.keywords),
        csvCell(publish),
      ].join(",");
    })
    .join("\n");
  return `${header}\n${body}\n`;
}
