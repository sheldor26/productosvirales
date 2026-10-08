import type { MetadataRoute } from "next";

// Sin esto, Android/Chrome no ofrece "Agregar a pantalla de inicio" en modo
// standalone (sin barra de direcciones) — queda como un simple atajo de
// navegador. icon.svg escala sin pérdida a cualquier tamaño que pida el
// instalador; apple-icon.png (192x192, ya existe para el <link
// rel="apple-touch-icon"> de iOS) cubre el caso de un lector de manifest
// que todavía no soporte SVG.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ProductosVirales — Lo más trending de MercadoLibre",
    short_name: "ProductosVirales",
    description:
      "Descubrí los productos más virales y trending de MercadoLibre Argentina.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/apple-icon.png", sizes: "192x192", type: "image/png", purpose: "any" },
    ],
    // Menú al mantener presionado el ícono instalado (solo Android/Chrome —
    // iOS Safari no lo soporta, ahí no pasa nada). Android muestra como
    // mucho 3; el ícono tiene que ser PNG, no sirve el SVG de arriba.
    shortcuts: [
      {
        name: "Buscar",
        url: "/buscar",
        icons: [{ src: "/apple-icon.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Guardados",
        url: "/guardados",
        icons: [{ src: "/apple-icon.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Trending",
        url: "/trending",
        icons: [{ src: "/apple-icon.png", sizes: "192x192", type: "image/png" }],
      },
    ],
  };
}
