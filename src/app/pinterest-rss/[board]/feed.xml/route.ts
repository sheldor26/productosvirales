import { releasedForBoard } from "@/lib/pinterest-drip";

// El calendario de goteo depende de la fecha: no puede congelarse en el build.
export const dynamic = "force-dynamic";

// Feed RSS 2.0 para el auto-publish de Pinterest (Settings → Auto-publish).
// Un feed por tablero: /pinterest-rss/cocina/feed.xml → tablero "Cocina".
// Solo expone los Pins que ya "vencieron" en el calendario de goteo
// (src/lib/pinterest-drip.ts), así Pinterest publica de a poco y no de golpe.
// Pinterest toma la imagen de <enclosure>/<media:content>, y el título y la
// descripción de <title>/<description>. Los links están en el dominio reclamado.

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://productosvirales.com.ar"
).replace(/\/$/, "");

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(_req: Request, { params }: { params: Promise<{ board: string }> }) {
  const { board } = await params;
  const pins = releasedForBoard(board);

  const items = pins
    .map(
      (pin) => `    <item>
      <title>${escapeXml(pin.title)}</title>
      <link>${escapeXml(pin.link)}</link>
      <guid isPermaLink="false">${escapeXml(pin.media)}</guid>
      <pubDate>${pin.releaseAt.toUTCString()}</pubDate>
      <description>${escapeXml(pin.description)}</description>
      <enclosure url="${escapeXml(pin.media)}" type="image/jpeg" length="0" />
      <media:content url="${escapeXml(pin.media)}" medium="image" type="image/jpeg" />
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ProductosVirales — Pinterest (${escapeXml(board)})</title>
    <link>${SITE_URL}</link>
    <description>Guías y fichas de productos de MercadoLibre Argentina.</description>
    <language>es-AR</language>
    <atom:link href="${SITE_URL}/pinterest-rss/${escapeXml(board)}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=900, s-maxage=900",
    },
  });
}
