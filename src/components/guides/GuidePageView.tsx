import { GuideRenderer } from "./GuideRenderer";
import { guideUrl } from "@/lib/guide-url";
import { injectLivePrices } from "@/lib/price-token";
import { toPlainText } from "@/lib/parse-inline-links";
import type { Guide } from "@/lib/types";

/**
 * Cuerpo compartido de la página de guía (JSON-LD + render), usado por la ruta
 * plana `[slug]` y por la ruta en silo `[slug]/[sub]`. La URL se calcula con
 * `guideUrl`, que respeta si la guía vive en un silo o no.
 */
export function GuidePageView({ guide }: { guide: Guide }) {
  const url = guideUrl(guide);

  // Imagen del artículo (hero), con OG dinámico como fallback.
  const heroSection = guide.sections.find((s) => s.type === "image" && s.imageSize === "hero");
  const fallbackImage = guide.sections.find((s) => s.type === "image" && s.src);
  const rawImageSrc = heroSection?.src || fallbackImage?.src;
  const articleImage = rawImageSrc
    ? rawImageSrc.startsWith("/")
      ? `https://productosvirales.com.ar${rawImageSrc}`
      : rawImageSrc
    : `${url}/opengraph-image`;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: injectLivePrices(guide.metaDescription),
    image: articleImage,
    datePublished: guide.publishedDate,
    dateModified: guide.updatedDate,
    articleSection: guide.category,
    inLanguage: "es-AR",
    author: {
      "@type": "Person",
      name: "Equipo ProductosVirales",
      url: "https://productosvirales.com.ar/sobre-nosotros",
    },
    publisher: {
      "@type": "Organization",
      name: "Productos Virales",
      url: "https://productosvirales.com.ar",
      logo: {
        "@type": "ImageObject",
        url: "https://productosvirales.com.ar/icon.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  const faqLd =
    guide.faq && guide.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: guide.faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: toPlainText(item.answer),
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Inicio",
                item: "https://productosvirales.com.ar",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Guías",
                item: "https://productosvirales.com.ar/guias",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: guide.title,
                item: url,
              },
            ],
          }),
        }}
      />
      <GuideRenderer guide={guide} />
    </>
  );
}
