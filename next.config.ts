import type { NextConfig } from "next";
// Import relativo (no `@/`): el alias de tsconfig no se resuelve al compilar
// este archivo. `product-url` no importa nada, así que entra solo.
import { curatedProducts } from "./src/data/curated-products";
import { productSlug } from "./src/lib/product-url";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "http2.mlstatic.com",
      },
      {
        protocol: "https",
        hostname: "*.mlstatic.com",
      },
      {
        protocol: "https",
        hostname: "*.mitiendanube.com",
      },
    ],
    // Las fotos de ML casi no cambian de URL una vez importadas: cache largo
    // evita que las páginas de cola larga (poco tráfico) repaguen el costo de
    // re-optimizar la imagen cada vez que expira el cache (default: 4h).
    minimumCacheTTL: 2678400, // 31 días
  },
  // 308 de verdad para la URL legacy `/producto/MLA123` → la canónica con slug.
  //
  // La ficha ya redirige sola, pero como la ruta está prerenderizada ese
  // redirect sale como `<meta http-equiv="refresh">` adentro de un HTTP 200:
  // para un crawler no es un redirect, es una página más, sin H1. Resolviéndolo
  // acá el redirect ocurre en el borde, antes de renderizar nada.
  //
  // Los links internos ya apuntan todos a la canónica
  // (scripts/check-canonical-product-links.cjs lo verifica); esto cubre los
  // links viejos de afuera y lo que Google ya tenga indexado.
  async redirects() {
    return curatedProducts.map((product) => ({
      source: `/producto/${product.id}`,
      destination: `/producto/${productSlug(product)}`,
      permanent: true, // 308
    }));
  },

  async rewrites() {
    return [
      // Proxy first-party del ENVÍO de Google Analytics. El navegador manda el
      // hit a nuestro propio dominio (/_ga/...) y Vercel lo reenvía a Google
      // desde su servidor. Esquiva el 503/bloqueo que sufre google-analytics.com
      // pegado directo (redes que interfieren, adblockers). La librería gtag.js
      // sigue cargando normal de googletagmanager; esto solo mueve el /g/collect.
      {
        source: "/_ga/:path*",
        destination: "https://www.google-analytics.com/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://www.googletagmanager.com https://*.clarity.ms; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.mlstatic.com https://http2.mlstatic.com https://*.mitiendanube.com https://www.googletagmanager.com https://www.google-analytics.com https://*.clarity.ms; font-src 'self' data:; connect-src 'self' https://*.mercadolibre.com.ar https://vitals.vercel-insights.com https://va.vercel-scripts.com https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://*.clarity.ms https://c.bing.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
