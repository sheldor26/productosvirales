import { NextResponse } from "next/server";

// TODO: hook this up to real persistence (Vercel KV / Resend audience /
// Supabase). Today the handler only validates, rate-limits, and logs —
// no email is stored or notified.

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

  console.warn(
    `[subscribe] queued: ${email.trim()} at ${new Date().toISOString()} (ip=${ip})`
  );

  return NextResponse.json({
    success: true,
    message: "Te avisaremos cuando esté listo el sistema de alertas.",
  });
}
