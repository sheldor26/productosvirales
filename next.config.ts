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
    ],
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
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://www.googletagmanager.com https://*.clarity.ms; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.mlstatic.com https://http2.mlstatic.com https://www.googletagmanager.com https://www.google-analytics.com https://*.clarity.ms; font-src 'self' data:; connect-src 'self' https://*.mercadolibre.com.ar https://vitals.vercel-insights.com https://va.vercel-scripts.com https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://*.clarity.ms https://c.bing.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
