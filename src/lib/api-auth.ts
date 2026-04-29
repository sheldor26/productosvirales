import { NextResponse } from "next/server";

/**
 * Guard for internal API routes.
 *
 * - In production: requires `x-pv-secret` header to match
 *   `process.env.PV_API_SECRET`. If `PV_API_SECRET` is unset in prod,
 *   the route is disabled (503).
 * - In development: open if `PV_API_SECRET` is unset; otherwise the
 *   header is required.
 *
 * Returns null when the request is allowed; a NextResponse to short-circuit
 * when it must be rejected.
 */
export function requireSecret(req: Request): NextResponse | null {
  const isProd = process.env.NODE_ENV === "production";
  const secret = process.env.PV_API_SECRET;

  if (isProd && !secret) {
    return NextResponse.json(
      { error: "api disabled" },
      { status: 503 }
    );
  }

  if (!secret) return null; // dev fallthrough

  const got = req.headers.get("x-pv-secret");
  if (got !== secret) {
    return NextResponse.json(
      { error: "unauthorized" },
      { status: 401 }
    );
  }
  return null;
}
