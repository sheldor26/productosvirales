import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * Token de baja firmado (HMAC-SHA256 del email con `UNSUBSCRIBE_SECRET`). No
 * necesita columna en la DB: el link de cada mail lleva `?email=X&token=...`
 * y /api/unsubscribe lo verifica. El mismo esquema se replica en
 * scripts/notify-price-drops-email.cjs para generar los links.
 */
const SECRET = process.env.UNSUBSCRIBE_SECRET || "";

export function unsubscribeToken(email: string): string {
  return createHmac("sha256", SECRET)
    .update(email.trim().toLowerCase())
    .digest("hex")
    .slice(0, 32);
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  if (!SECRET || !token) return false;
  const expected = unsubscribeToken(email);
  if (expected.length !== token.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(token));
}
