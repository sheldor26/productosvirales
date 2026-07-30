import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";

// Persistencia: guarda el email en la tabla `subscribers` (Postgres/Neon).
// Si no hay DATABASE_URL configurada (ej. local sin storage), cae a un
// console.warn y responde OK igual — no se manda ningún mail todavía.

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 3;

// In-memory rate-limit bucket. Keyed by IP, stores recent request
// timestamps. Resets on cold start, which is fine as a cheap first line
// of defense — the real limit lives at the edge / WAF when we add one.
const rateBucket = new Map<string, number[]>();

function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  );
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  const recent = (rateBucket.get(ip) ?? []).filter((ts) => ts > cutoff);

  if (recent.length >= RATE_LIMIT_MAX) {
    const oldest = recent[0];
    const retryAfterMs = oldest + RATE_LIMIT_WINDOW_MS - now;
    return { allowed: false, retryAfterSec: Math.max(1, Math.ceil(retryAfterMs / 1000)) };
  }

  recent.push(now);
  rateBucket.set(ip, recent);
  return { allowed: true, retryAfterSec: 0 };
}

export async function POST(request: Request) {
  const ip = getClientIp(request);

  const { allowed, retryAfterSec } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Me llegaron varios intentos juntos. Probá de nuevo en unos minutos." },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfterSec) },
      }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "No pude procesar el formulario. Probá de nuevo." },
      { status: 400 }
    );
  }

  const email =
    typeof body === "object" && body !== null && "email" in body
      ? (body as { email: unknown }).email
      : undefined;

  if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    return NextResponse.json(
      { error: "Revisá el mail: parece que quedó mal escrito." },
      { status: 400 }
    );
  }

  const normalized = email.trim().toLowerCase();

  // De qué guía/página vino la suscripción (ruta), para mandar contenido
  // relacionado. Opcional: si no viene o es inválido, queda null.
  const rawRef =
    typeof body === "object" && body !== null && "ref" in body
      ? (body as { ref: unknown }).ref
      : undefined;
  const sourceDetail =
    typeof rawRef === "string" && rawRef.trim() !== ""
      ? rawRef.trim().slice(0, 200)
      : null;

  // Fuente de la suscripción (whitelist). Sirve para segmentar después:
  // "price-alert" = pidió alerta de bajas de precio; "newsletter" = genérico.
  const rawSource =
    typeof body === "object" && body !== null && "source" in body
      ? (body as { source: unknown }).source
      : undefined;
  const source = rawSource === "price-alert" ? "price-alert" : "newsletter";

  const sql = getSql();
  if (!sql) {
    // Sin DB configurada: dejamos rastro y seguimos sin romper.
    console.warn(
      `[subscribe] sin DATABASE_URL — no se guardó: ${normalized} (ip=${ip}, ref=${sourceDetail ?? "-"})`
    );
    return NextResponse.json({
      success: true,
      message: "Te avisaremos cuando publiquemos algo nuevo.",
    });
  }

  try {
    // Si el mail ya existe, no es error. Además promovemos el `source` a
    // "price-alert" si esta suscripción lo pide (un suscriptor de newsletter que
    // ahora quiere alertas de precio queda bien segmentado); nunca lo degradamos.
    await sql`
      INSERT INTO subscribers (email, source, ip, source_detail)
      VALUES (${normalized}, ${source}, ${ip}, ${sourceDetail})
      ON CONFLICT (email) DO UPDATE
        SET source = CASE
          WHEN EXCLUDED.source = 'price-alert' THEN 'price-alert'
          ELSE subscribers.source
        END,
        -- Re-suscribirse reactiva: si se había dado de baja y vuelve a pedir
        -- alertas, lo volvemos a incluir en los envíos.
        unsubscribed = CASE
          WHEN EXCLUDED.source = 'price-alert' THEN false
          ELSE subscribers.unsubscribed
        END
    `;
  } catch (err) {
    console.error("[subscribe] error al guardar:", err);
    return NextResponse.json(
      { error: "No pudimos guardar tu email. Probá de nuevo en un rato." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Te avisaremos cuando publiquemos algo nuevo.",
  });
}
