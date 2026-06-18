import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

// Conexión a Postgres (Neon, vía el storage de Vercel).
//
// La connection string vive en DATABASE_URL (la inyecta la integración de
// Neon en Vercel). Si no está seteada — por ejemplo en local sin storage —
// getSql() devuelve null y el que llama decide el fallback (loguear y seguir),
// así el sitio nunca se cae por falta de DB.

let cached: NeonQueryFunction<false, false> | null = null;

export function getSql(): NeonQueryFunction<false, false> | null {
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  if (!url) return null;
  if (!cached) cached = neon(url);
  return cached;
}
