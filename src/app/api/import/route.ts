import { NextResponse } from "next/server";
import { extractMLAId, importProduct } from "@/lib/mercadolibre";
import { requireSecret } from "@/lib/api-auth";
import { scrapeProduct, scrapedToProduct } from "@/lib/scraper";

function resolveInputToUrl(input: string, mlaId: string | null): string | null {
  if (/^https?:\/\//i.test(input)) return input;
  if (!mlaId) return null;

  if (mlaId.startsWith("MLAU")) {
    return `https://www.mercadolibre.com.ar/up/${mlaId}`;
  }

  const digits = mlaId.replace(/^MLA/i, "");
  return digits.length >= 10
    ? `https://articulo.mercadolibre.com.ar/MLA-${digits}`
    : `https://www.mercadolibre.com.ar/p/${mlaId}`;
}

function isMercadoLibreUrl(input: string): boolean {
  try {
    const host = new URL(input).hostname.toLowerCase();
    return host === "meli.la" || host.endsWith(".meli.la") || host.endsWith("mercadolibre.com.ar");
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const denied = requireSecret(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const { input } = body;

    if (!input || typeof input !== "string") {
      return NextResponse.json(
        { error: "Se requiere un MLA ID o URL de MercadoLibre" },
        { status: 400 }
      );
    }

    const trimmedInput = input.trim();
    const isUrl = /^https?:\/\//i.test(trimmedInput);
    const mlaId = extractMLAId(trimmedInput);
    if (isUrl && !isMercadoLibreUrl(trimmedInput)) {
      return NextResponse.json(
        { error: "La URL debe ser de MercadoLibre o meli.la" },
        { status: 400 }
      );
    }

    if (!mlaId && !isUrl) {
      return NextResponse.json(
        {
          error: `No se pudo extraer un MLA ID de: "${input}". Usá un ID (MLA850734153), MLAU o URL de ML.`,
        },
        { status: 400 }
      );
    }

    if (process.env.ML_IMPORT_SOURCE === "api") {
      if (!mlaId) {
        return NextResponse.json(
          { error: "ML_IMPORT_SOURCE=api requiere un MLA/MLAU, no solo una URL sin ID visible" },
          { status: 400 }
        );
      }

      const result = await importProduct(mlaId);

      return NextResponse.json({
        product: result.product,
        _meta: { ...result.meta, source: "mercadolibre-api" },
      });
    }

    const url = resolveInputToUrl(trimmedInput, mlaId);
    if (!url) {
      return NextResponse.json(
        { error: "Se requiere una URL de MercadoLibre o un MLA/MLAU valido" },
        { status: 400 }
      );
    }

    const scraped = await scrapeProduct(url);
    const product = scrapedToProduct(scraped);

    return NextResponse.json({
      product,
      raw: scraped,
      _meta: {
        source: "mercadolibre-page-scraper",
        mlId: product.id,
        status: "scraped",
        reviewCount: scraped.reviewCount || 0,
      },
    });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Error al importar producto",
      },
      { status: 500 }
    );
  }
}
