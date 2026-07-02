import { NextResponse } from "next/server";
import { categories } from "@/data/categories";
import { getVisibleProducts } from "@/lib/products";
import { productHref } from "@/lib/product-url";
import { getPublishedGuides } from "@/data/guides";
import { guideHref } from "@/lib/guide-url";

// Genera el CSV que pide el importador "Cargá un archivo CSV o TXT" de Pinterest
// (Bulk Create Pins). Cada fila es un Pin de imagen que apunta a una URL del
// sitio (ficha o guía). No manda nada: solo arma el archivo listo para arrastrar.
//
// Columnas exactas que espera Pinterest (2026):
//   Title (<=100) | Media URL (.jpg/.png público) | Pinterest board |
//   Description (<=500, única) | Link | Keywords (coma) | Publish date (opcional)
//
// Uso (en el navegador, logueado no hace falta):
//   /api/pinterest-feed                      -> todo (fichas + guías visibles)
//   /api/pinterest-feed?tipo=productos       -> solo fichas
//   /api/pinterest-feed?tipo=guias           -> solo guías
//   /api/pinterest-feed?categoria=cocina     -> solo esa categoría (por tandas)
//   /api/pinterest-feed?board=Cocina         -> forzar un solo tablero para todo
//   /api/pinterest-feed?porDia=10            -> escalona las fechas: 10 Pins/día
//
// Recordatorio: los tableros ("Pinterest board") tienen que EXISTIR en tu cuenta
// o Pinterest descarta esa fila. Por defecto usa el nombre de la categoría.

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://productosvirales.com.ar"
).replace(/\/$/, "");

const MAX_TITLE = 100;
const MAX_DESC = 500;

// Nombre de tablero por defecto según la categoría del contenido.
const categoryName = new Map(categories.map((c) => [c.slug, c.name]));

function csvCell(value: unknown): string {
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

// Solo Pinterest acepta media URL que termine en jpg/jpeg/png/mp4.
function usableMedia(url: string | undefined): url is string {
  return !!url && /\.(jpe?g|png|mp4)(\?|$)/i.test(url);
}

interface Pin {
  title: string;
  media: string;
  board: string;
  description: string;
  link: string;
  keywords: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tipo = searchParams.get("tipo"); // productos | guias | (todo)
  const categoria = searchParams.get("categoria");
  const boardOverride = searchParams.get("board");
  const porDia = Number(searchParams.get("porDia")) || 0;

  const pins: Pin[] = [];

  if (tipo !== "guias") {
    for (const p of getVisibleProducts()) {
      if (categoria && p.categorySlug !== categoria) continue;
      if (!usableMedia(p.image)) continue;
      const cat = categoryName.get(p.categorySlug) || p.category;
      pins.push({
        title: clamp(p.title, MAX_TITLE),
        media: p.image,
        board: boardOverride || cat,
        description: clamp(p.description || p.title, MAX_DESC),
        link: `${SITE_URL}${productHref(p)}`,
        keywords: [cat, "MercadoLibre", "Argentina"].join(", "),
      });
    }
  }

  if (tipo !== "productos") {
    for (const g of getPublishedGuides()) {
      if (categoria && g.category !== categoria) continue;
      if (!usableMedia(g.ogImage)) continue;
      const cat = categoryName.get(g.category) || g.category;
      pins.push({
        title: clamp(g.h1 || g.title, MAX_TITLE),
        media: g.ogImage,
        board: boardOverride || cat,
        description: clamp(g.standfirst || g.metaDescription, MAX_DESC),
        link: `${SITE_URL}${guideHref(g)}`,
        keywords: [cat, "guía", "cuál comprar"].join(", "),
      });
    }
  }

  const header = "Title,Media URL,Pinterest board,Description,Link,Keywords,Publish date";
  const body = pins
    .map((pin, i) => {
      // Escalonado opcional: reparte los Pins a futuro para no saturar.
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

  const csv = `${header}\n${body}\n`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="pinterest-pins.csv"',
      "Cache-Control": "no-store",
    },
  });
}
