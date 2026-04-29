import { NextResponse } from "next/server";
import {
  scrapeProduct,
  scrapeSearch,
  scrapedToProduct,
} from "@/lib/scraper";
import { requireSecret } from "@/lib/api-auth";

export async function POST(request: Request) {
  const denied = requireSecret(request);
  if (denied) return denied;

  if (process.env.NODE_ENV === "production" && process.env.ENABLE_SCRAPE !== "true") {
    return NextResponse.json(
      { error: "scrape is dev-only" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { url, query, limit } = body;

    // Mode 1: Scrape a single product by URL
    if (url) {
      if (typeof url !== "string" || !url.includes("mercadolibre")) {
        return NextResponse.json(
          { error: "URL inválida. Debe ser una URL de MercadoLibre." },
          { status: 400 }
        );
      }

      const scraped = await scrapeProduct(url);
      const product = scrapedToProduct(scraped);

      return NextResponse.json({
        product,
        raw: scraped,
      });
    }

    // Mode 2: Search and scrape multiple products
    if (query) {
      const scraped = await scrapeSearch(query, limit || 5);
      const products = scraped.map(scrapedToProduct);

      return NextResponse.json({
        products,
        raw: scraped,
        total: scraped.length,
      });
    }

    return NextResponse.json(
      {
        error:
          'Se requiere "url" (URL de producto) o "query" (búsqueda). Ejemplo: { "url": "https://articulo.mercadolibre.com.ar/MLA-..." }',
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Scrape error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Error al scrapear producto",
      },
      { status: 500 }
    );
  }
}
