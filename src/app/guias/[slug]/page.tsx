import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { guides, getPublishedGuides } from "@/data/guides";
import { GuideRenderer } from "@/components/guides/GuideRenderer";

// Revalidate daily so scheduled guides go live on their publishedDate
export const revalidate = 86400;

// Allow routes not pre-built at deploy time to be generated on first visit
export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPublishedGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getPublishedGuides().find((g) => g.slug === slug);
  if (!guide) return { title: "Guía no encontrada" };

  const ogImage = `https://productosvirales.com.ar/guias/${guide.slug}/opengraph-image`;

  return {
    title: guide.seoTitle,
    description: guide.metaDescription,
    alternates: {
      canonical: `https://productosvirales.com.ar/guias/${guide.slug}`,
    },
    openGraph: {
      type: "article",
      title: guide.ogTitle || guide.seoTitle,
      description: guide.ogDescription || guide.metaDescription,
      url: `https://productosvirales.com.ar/guias/${guide.slug}`,
      siteName: "Productos Virales",
      locale: "es_AR",
      publishedTime: guide.publishedDate,
      modifiedTime: guide.updatedDate,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.ogTitle || guide.seoTitle,
      description: guide.ogDescription || guide.metaDescription,
      images: [ogImage],
    },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getPublishedGuides().find((g) => g.slug === slug);

  if (!guide) {
    notFound();
  }

  // Pick first image section as the article image (hero), fall back to dynamic OG
  const heroSection = guide.sections.find((s) => s.type === "image" && s.imageSize === "hero");
  const fallbackImage = guide.sections.find((s) => s.type === "image" && s.src);
  const articleImage = heroSection?.src || fallbackImage?.src
    ? `https://productosvirales.com.ar${heroSection?.src || fallbackImage?.src}`
    : `https://productosvirales.com.ar/guias/${guide.slug}/opengraph-image`;

  // Article structured data
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.metaDescription,
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
      "@id": `https://productosvirales.com.ar/guias/${guide.slug}`,
    },
  };

  // FAQ structured data
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
              text: item.answer,
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
                item: `https://productosvirales.com.ar/guias/${guide.slug}`,
              },
            ],
          }),
        }}
      />
      <GuideRenderer guide={guide} />
    </>
  );
}
