import { dripBoards } from "@/lib/pinterest-drip";

// El calendario de goteo depende de la fecha: no puede congelarse en el build.
export const dynamic = "force-dynamic";

// Índice de feeds para configurar Pinterest (texto plano, copiar y pegar):
// tablero → URL del feed + cuántos Pins hay en total y cuántos ya salieron.

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://productosvirales.com.ar"
).replace(/\/$/, "");

export async function GET() {
  const lines = dripBoards().map(
    (b) =>
      `${b.board}\n  ${SITE_URL}/pinterest-rss/${b.slug}/feed.xml\n  ${b.released} salieron / ${b.total} en total`
  );
  return new Response(lines.join("\n\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
