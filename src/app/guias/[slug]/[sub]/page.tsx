import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublishedGuides, findGuideByPath } from "@/data/guides";
import { buildGuideMetadata } from "@/lib/guide-metadata";
import { GuidePageView } from "@/components/guides/GuidePageView";

// Revalidate daily so scheduled guides go live on their publishedDate
export const revalidate = 86400;

// Allow routes not pre-built at deploy time to be generated on first visit
export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string; sub: string }>;
}

export async function generateStaticParams() {
  // Guías en silo: slug = silo (ej. "climatizacion"), sub = slug de la guía.
  return getPublishedGuides().flatMap((g) =>
    g.silo ? [{ slug: g.silo, sub: g.slug }] : []
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, sub } = await params;
  return buildGuideMetadata(findGuideByPath([slug, sub]));
}

export default async function SiloGuidePage({ params }: Props) {
  const { slug, sub } = await params;
  const guide = findGuideByPath([slug, sub]);
  if (!guide) notFound();
  return <GuidePageView guide={guide} />;
}
