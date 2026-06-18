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
      { error: "Demasiadas solicitudes. Probá de nuevo en unos minutos." },
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
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const email =
    typeof body === "object" && body !== null && "email" in body
      ? (body as { email: unknown }).email
      : undefined;

  if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  const normalized = email.trim().toLowerCase();

  const sql = getSql();
  if (!sql) {
    // Sin DB configurada: dejamos rastro y seguimos sin romper.
    console.warn(
      `[subscribe] sin DATABASE_URL — no se guardó: ${normalized} (ip=${ip})`
    );
    return NextResponse.json({
      success: true,
      message: "Te avisaremos cuando publiquemos algo nuevo.",
    });
  }

  try {
    // ON CONFLICT DO NOTHING: si el mail ya existe, no es error (idempotente).
    await sql`
      INSERT INTO subscribers (email, source, ip)
      VALUES (${normalized}, ${"newsletter"}, ${ip})
      ON CONFLICT (email) DO NOTHING
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
