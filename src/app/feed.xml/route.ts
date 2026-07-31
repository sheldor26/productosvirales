import { getPublishedGuides } from "@/data/guides";
import { guideUrl } from "@/lib/guide-url";
import { injectLivePrices } from "@/lib/price-token";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://productosvirales.com.ar";
const MAX_ITEMS = 30;

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00Z`).toUTCString();
}

export async function GET() {
  const guides = getPublishedGuides()
    .slice()
    .sort((a, b) => b.publishedDate.localeCompare(a.publishedDate))
    .slice(0, MAX_ITEMS);

  const items = guides
    .map((guide) => {
      const url = guideUrl(guide);
      const description = injectLivePrices(guide.metaDescription);
      return `    <item>
      <title>${escapeXml(guide.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${toRfc822(guide.publishedDate)}</pubDate>
      <description>${escapeXml(description)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>ProductosVirales — Guías nuevas</title>
    <link>${SITE_URL}</link>
    <description>Guías de compra honestas de productos virales de MercadoLibre Argentina.</description>
    <language>es-AR</language>
    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
