import { NextResponse } from "next/server";
import { extractMLAId, importProduct } from "@/lib/mercadolibre";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { input } = body;

    if (!input || typeof input !== "string") {
      return NextResponse.json(
        { error: "Se requiere un MLA ID o URL de MercadoLibre" },
        { status: 400 }
      );
    }

    const mlaId = extractMLAId(input.trim());
    if (!mlaId) {
      return NextResponse.json(
        {
          error: `No se pudo extraer un MLA ID de: "${input}". Usá un ID (MLA850734153) o URL de ML.`,
        },
        { status: 400 }
      );
    }

    const result = await importProduct(mlaId);

    return NextResponse.json({
      product: result.product,
      _meta: result.meta,
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
