import { NextResponse } from "next/server";
import { requireSecret } from "@/lib/api-auth";
import { getSql } from "@/lib/db";

// Descarga la lista de emails en CSV. Protegido con x-pv-secret (igual que
// el resto de las rutas internas). No manda nada: solo exporta lo guardado.
//
// Uso:  curl -H "x-pv-secret: <PV_API_SECRET>" \
//         https://productosvirales.com.ar/api/subscribers/export -o subs.csv

// Escapa un valor para CSV (comillas, comas, saltos de línea) y neutraliza
// CSV/formula injection: si el valor empieza con =, +, -, @ (o tab/CR), Excel
// y Google Sheets lo pueden interpretar como fórmula al abrir el archivo.
// `email` y sobre todo `source_detail` (el campo `ref` de /api/subscribe, sin
// validar) vienen de input externo — un POST directo a la API podría mandar
// algo tipo `=HYPERLINK(...)`. Se antepone un apóstrofe, el mitigation
// estándar de OWASP para esto.
function csvCell(value: unknown): string {
  let s = value === null || value === undefined ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(s)) {
    s = `'${s}`;
  }
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
    SELECT email, source, source_detail, created_at
    FROM subscribers
    ORDER BY created_at DESC
  `) as {
    email: string;
    source: string;
    source_detail: string | null;
    created_at: string;
  }[];

  const header = "email,source,source_detail,created_at";
  const body = rows
    .map((r) =>
      [
        csvCell(r.email),
        csvCell(r.source),
        csvCell(r.source_detail),
        csvCell(r.created_at),
      ].join(",")
    )
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
