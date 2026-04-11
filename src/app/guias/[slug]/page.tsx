import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { guides } from "@/data/guides";
import { GuideRenderer } from "@/components/guides/GuideRenderer";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) return { title: "Guía no encontrada" };

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
    },
    twitter: {
      card: "summary_large_image",
      title: guide.ogTitle || guide.seoTitle,
      description: guide.ogDescription || guide.metaDescription,
    },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);

  if (!guide) {
    notFound();
  }

  // Article structured data
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.metaDescription,
    datePublished: guide.publishedDate,
    dateModified: guide.updatedDate,
    author: {
      "@type": "Organization",
      name: "Productos Virales",
      url: "https://productosvirales.com.ar",
    },
    publisher: {
      "@type": "Organization",
      name: "Productos Virales",
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
      <GuideRenderer guide={guide} />
    </>
  );
}
