import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://productosvirales.com.ar";

  return {
    rules: [
      // Bots de búsqueda de IA: permitidos explícitamente (nos citan y traen tráfico).
      {
        userAgent: ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "PerplexityBot"],
        allow: "/",
        disallow: ["/api/"],
      },
      // Bots de entrenamiento: bloqueados (usan el contenido para entrenar modelos,
      // no generan citas ni tráfico). No afecta a Googlebot ni a los AI Overviews.
      {
        userAgent: ["CCBot", "Google-Extended"],
        disallow: "/",
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
