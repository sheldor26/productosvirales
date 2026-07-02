import { NextResponse } from "next/server";
import { buildPins, pinsToCsv } from "@/lib/pinterest-feed";

// Descarga en el navegador el CSV que pide el importador "Cargá un archivo CSV
// o TXT" de Pinterest (Bulk Create Pins). La lógica vive en @/lib/pinterest-feed
// (compartida con scripts/pinterest-csv.ts). No manda nada: solo arma el archivo.
//
// Uso:
//   /api/pinterest-feed                      -> todo (fichas + guías visibles)
//   /api/pinterest-feed?tipo=productos       -> solo fichas
//   /api/pinterest-feed?tipo=guias           -> solo guías
//   /api/pinterest-feed?categoria=cocina     -> solo esa categoría (por tandas)
//   /api/pinterest-feed?board=Cocina         -> forzar un solo tablero para todo
//   /api/pinterest-feed?porDia=10            -> escalona fechas: 10 Pins/día
//
// Recordatorio: los tableros ("Pinterest board") tienen que EXISTIR en tu cuenta
// o Pinterest descarta esa fila. Por defecto usa el nombre de la categoría.

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pins = buildPins({
    tipo: searchParams.get("tipo"),
    categoria: searchParams.get("categoria"),
    board: searchParams.get("board"),
  });
  const csv = pinsToCsv(pins, Number(searchParams.get("porDia")) || 0);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="pinterest-pins.csv"',
      "Cache-Control": "no-store",
    },
  });
}
