import type { Product } from "@/lib/types";

// Ni next/og (Satori) ni el importador de Pinterest renderizan .webp. ML sirve
// la misma imagen en jpg cambiando la extensión, así que la normalizamos.
function toJpg(url: string): string {
  return url.replace(/\.webp(\?|$)/i, ".jpg$1");
}

/**
 * Elemento de la imagen OpenGraph de una ficha de producto (1200x630). La
 * foto de ML viene cuadrada o vertical: si se usa cruda como og:image,
 * Threads/Facebook la recortan al centro (zoom sobre una parte del producto).
 * Acá se centra con `object-fit: contain` sobre fondo blanco para que el
 * producto entero quede visible, sin texto encima.
 */
export function productOgElement(product: Product) {
  const image = toJpg(product.image);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding: "48px",
        background: "#ffffff",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        width={1104}
        height={534}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
        alt=""
      />
    </div>
  );
}
