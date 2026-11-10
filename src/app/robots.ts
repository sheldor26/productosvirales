import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://productosvirales.com.ar";

  return {
    rules: [
      // Bots de búsqueda/citación de IA: permitidos explícitamente (nos citan y traen tráfico).
      {
        userAgent: ["OAI-SearchBot", "ChatGPT-User", "PerplexityBot"],
        allow: "/",
        disallow: ["/api/"],
      },
      // Bots de entrenamiento: bloqueados (usan el contenido para entrenar modelos,
      // no generan citas ni tráfico). No afecta a Googlebot ni a los AI Overviews
      // (Google-Extended solo controla el entrenamiento de Gemini/Vertex AI, no el
      // índice de Search). GPTBot y ClaudeBot son los bots de ENTRENAMIENTO de OpenAI
      // y Anthropic (las citas en vivo las traen OAI-SearchBot/ChatGPT-User y
      // PerplexityBot, ya permitidos arriba) — antes quedaban mal clasificados como
      // "búsqueda" y permitidos por error; Ahrefs lo marcó como política inconsistente
      // porque solo bloqueábamos 2 de los ~7 bots de entrenamiento reales.
      // anthropic-ai (Anthropic) y xAI-Bot (Grok) sumados el 10/11 porque Ahrefs
      // empezó a trackearlos recién en el crawl de esa fecha y quedaron afuera de
      // la lista original, generando el mismo tipo de inconsistencia de nuevo.
      {
        userAgent: [
          "CCBot",
          "Google-Extended",
          "GPTBot",
          "ClaudeBot",
          "DeepseekBot",
          "Meta-ExternalAgent",
          "Applebot-Extended",
          "anthropic-ai",
          "xAI-Bot",
        ],
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
