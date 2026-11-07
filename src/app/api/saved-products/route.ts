import { NextResponse } from "next/server";
import { curatedProducts } from "@/data/curated-products";
import { toCardProduct } from "@/lib/products";

// Resuelve los ids guardados en localStorage del visitante (feature "Guardados",
// sin cuentas ni backend) a datos reales de producto. No persiste nada server-side:
// la lista de ids vive solo en el navegador del visitante.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get("ids") || "";
  const ids = idsParam
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 50);

  if (ids.length === 0) return NextResponse.json([]);

  // Normalizado a mayúsculas en los dos lados: los ids del catálogo son
  // siempre MLA.../MLAU... en mayúsculas, pero un id guardado en localStorage
  // hace tiempo (o escrito a mano en minúscula) no matcheaba y el producto
  // "desaparecía" de Guardados sin ningún error (hallazgo trio-auditor, 2026-11-07).
  const byId = new Map(curatedProducts.map((p) => [p.id.toUpperCase(), p]));
  const ordered = ids
    .map((id) => byId.get(id.toUpperCase()))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  return NextResponse.json(ordered.map(toCardProduct));
}
