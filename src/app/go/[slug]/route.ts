import { NextResponse } from "next/server";
import { goLinks } from "@/data/go-links";

// Redirige /go/<slug> a un link de afiliado de Mercado Libre definido en src/data/go-links.ts.
// 302 (no 301) a propósito: el destino puede cambiar (otro producto, otro cupón) y no queremos
// que el navegador lo guarde. Sin caché y con noindex: no es contenido, es un enlace de campaña.
const NO_INDEX = { "X-Robots-Tag": "noindex, nofollow" };

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const destination = goLinks[slug.toLowerCase()];

  if (!destination) {
    return new NextResponse("No encontrado", { status: 404, headers: NO_INDEX });
  }

  return NextResponse.redirect(destination, {
    status: 302,
    headers: { ...NO_INDEX, "Cache-Control": "no-store" },
  });
}
