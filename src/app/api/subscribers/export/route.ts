import { NextResponse } from "next/server";
import { requireSecret } from "@/lib/api-auth";
import { getSql } from "@/lib/db";

// Descarga la lista de emails en CSV. Protegido con x-pv-secret (igual que
// el resto de las rutas internas). No manda nada: solo exporta lo guardado.
//
// Uso:  curl -H "x-pv-secret: <PV_API_SECRET>" \
//         https://productosvirales.com.ar/api/subscribers/export -o subs.csv

// Escapa un valor para CSV (comillas, comas, saltos de línea).
function csvCell(value: unknown): string {
  const s = value === null || value === undefined ? "" : String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET(request: Request) {
  const denied = requireSecret(request);
  if (denied) return denied;

  const sql = getSql();
  if (!sql) {
    return NextResponse.json(
      { error: "Base de datos no configurada (falta DATABASE_URL)." },
      { status: 503 }
    );
  }

  const rows = (await sql`
    SELECT email, source, created_at
    FROM subscribers
    ORDER BY created_at DESC
  `) as { email: string; source: string; created_at: string }[];

  const header = "email,source,created_at";
  const body = rows
    .map((r) => [csvCell(r.email), csvCell(r.source), csvCell(r.created_at)].join(","))
    .join("\n");
  const csv = `${header}\n${body}\n`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="subscribers.csv"',
      "Cache-Control": "no-store",
    },
  });
}
