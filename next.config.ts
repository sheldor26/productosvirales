import type { NextConfig } from "next";

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
  // El 308 de `/producto/MLA123` (URL legacy) → la canónica con slug YA NO se
  // declara acá. Hasta 2026-11-07 esta función generaba un redirect estático
  // por producto (1.067, uno por cada uno del catálogo) y Vercel ya avisaba
  // en el build "total number of custom routes exceeds 1000, this can reduce
  // performance" — acercándose al límite real de la plataforma.
  // `src/proxy.ts` resuelve exactamente el mismo caso en el borde (real 308,
  // antes de renderizar nada) de forma dinámica, leyendo `product-slug-map.json`
  // en vez de 1.067 reglas fijas — y de paso cubre dos casos que esto no
  // cubría: slug viejo de una ficha renombrada, y 404 real para un ID que no
  // existe. Si `/producto/MLA123` alguna vez deja de redirigir bien, el lugar
  // para mirar es `src/proxy.ts`, no acá.

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
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://www.googletagmanager.com https://*.clarity.ms; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.mlstatic.com https://http2.mlstatic.com https://*.mitiendanube.com https://www.googletagmanager.com https://www.google-analytics.com https://*.clarity.ms https://www.google.com https://www.google.com.ar https://c.bing.com; font-src 'self' data:; connect-src 'self' https://*.mercadolibre.com.ar https://vitals.vercel-insights.com https://va.vercel-scripts.com https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://stats.g.doubleclick.net https://www.google.com https://www.google.com.ar https://*.clarity.ms https://c.bing.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
