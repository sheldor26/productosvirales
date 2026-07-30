import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getPublishedGuides, guideCategories, guideSilos, getDisplaySilo } from "@/data/guides";
import { guideHref, guideUrl } from "@/lib/guide-url";
import { getGuideThumbnail } from "@/lib/guide-thumbnail";
import { getGuideCardSignals } from "@/lib/guide-card-signals";
import { baseOpenGraph } from "@/lib/site-og";
import type { Guide } from "@/lib/types";

// Revalidate daily so scheduled guides appear on their publishedDate
export const revalidate = 86400;

export const metadata: Metadata = {
  title:
    "Guías de compra 2026: mejores productos en MercadoLibre Argentina",
  description:
    "Comparativas honestas para elegir bien en MercadoLibre Argentina: precios reales, opiniones de compradores y los contras que nadie te cuenta.",
  alternates: {
    canonical: "https://productosvirales.com.ar/guias",
  },
  openGraph: {
    ...baseOpenGraph,
    title:
      "Guías de compra 2026: mejores productos en MercadoLibre Argentina",
    description:
      "Comparativas honestas para elegir bien en MercadoLibre Argentina: precios reales, opiniones de compradores y los contras que nadie te cuenta.",
    url: "https://productosvirales.com.ar/guias",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Guías de compra 2026: mejores productos en MercadoLibre Argentina",
    description:
      "Comparativas honestas para elegir bien en MercadoLibre Argentina: precios reales, opiniones de compradores y los contras que nadie te cuenta.",
  },
};

function mostRecentDate(g: Guide): string {
  return g.updatedDate > g.publishedDate ? g.updatedDate : g.publishedDate;
}

function compareGuidesByNewest(a: Guide, b: Guide): number {
  return (
    mostRecentDate(b).localeCompare(mostRecentDate(a)) ||
    a.title.localeCompare(b.title, "es-AR")
  );
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function daysSince(iso: string): number {
  const target = new Date(iso + "T00:00:00Z").getTime();
  const todayUtc = Date.UTC(
    new Date().getUTCFullYear(),
    new Date().getUTCMonth(),
    new Date().getUTCDate()
  );
  return Math.floor((todayUtc - target) / MS_PER_DAY);
}

/** Chips renderizados de una guía, en el mismo orden para pilar y satélites. */
function CardChips({ guide, compact }: { guide: Guide; compact?: boolean }) {
  const signals = getGuideCardSignals(guide);
  const isFresh = daysSince(guide.updatedDate) <= 7;
  const base = compact
    ? "text-[11px] px-[7px] py-[2px]"
    : "text-xs px-[9px] py-[3px]";
  const chip = `inline-flex items-center font-semibold rounded-[8px] border whitespace-nowrap ${base}`;

  return (
    <div className="flex flex-wrap gap-1.5 my-2">
      {signals.productCount > 1 && (
        <span
          className={`${chip} text-[var(--text-secondary)] bg-[var(--bg-secondary)] border-[var(--border)]`}
        >
          Comparamos {signals.productCount}
        </span>
      )}
      {signals.totalReviews && signals.totalReviews > 1000 && (
        <span
          className={`${chip} text-[#5a3a72] bg-[#efe7f4] border-[#ddc9e8]`}
        >
          +{signals.totalReviews.toLocaleString("es-AR")} opiniones
        </span>
      )}
      {signals.topPick && (
        <span
          className={`${chip} text-[#1e4f1e] bg-[#e8f1e4] border-[#cfe3c6]`}
        >
          Elección: {signals.topPick}
        </span>
      )}
      {signals.fromPrice && (
        <span
          className={`${chip} text-[var(--text-secondary)] bg-[var(--bg-secondary)] border-[var(--border)]`}
        >
          Desde ${signals.fromPrice}
        </span>
      )}
      {typeof signals.topRating === "number" && (
        <span
          className={`${chip} text-[#A8842E] bg-[var(--bg-secondary)] border-[var(--border)]`}
        >
          ★ {signals.topRating.toLocaleString("es-AR")}
        </span>
      )}
      {isFresh && (
        <span
          className={`${chip} text-[#155e75] bg-[#e0f2f5] border-[#bae3ec]`}
        >
          Actualizada esta semana
        </span>
      )}
    </div>
  );
}

function GuideThumb({
  guide,
  variant,
  priority,
}: {
  guide: Guide;
  variant: "pillar" | "card";
  priority?: boolean;
}) {
  const thumbnail = getGuideThumbnail(guide);
  if (!thumbnail) return null;
  const box =
    variant === "pillar"
      ? "w-full md:w-[230px] h-[180px] md:h-[200px]"
      : "w-[108px] h-[108px]";
  return (
    <div
      className={`shrink-0 ${box} overflow-hidden rounded-[12px] border border-[var(--border)] bg-white flex items-center justify-center`}
    >
      <Image
        src={thumbnail.src}
        alt={thumbnail.alt}
        width={thumbnail.width}
        height={thumbnail.height}
        preload={priority}
        className={`max-w-full max-h-full ${
          thumbnail.fit === "contain" ? "object-contain p-2.5" : "object-cover w-full h-full"
        }`}
      />
    </div>
  );
}

function PillarCard({ guide }: { guide: Guide }) {
  const title = guide.ogTitle || guide.title;
  const dek = guide.ogDescription || guide.metaDescription;
  return (
    <Link
      href={guideHref(guide)}
      className="group flex flex-col md:flex-row gap-5 md:gap-[22px] mb-4 p-5 rounded-[var(--radius-card)] border-[1.5px] border-[var(--text-primary)] bg-[var(--bg-primary)] shadow-[0_10px_30px_rgba(0,0,0,0.09)] transition-transform duration-150 hover:-translate-y-0.5"
    >
      <GuideThumb guide={guide} variant="pillar" priority />
      <div className="flex-1 min-w-0 flex flex-col">
        <span className="self-start mb-2.5 text-[10.5px] font-extrabold tracking-[0.08em] uppercase rounded-[6px] px-2.5 py-1 bg-[var(--cta-bg)] text-[var(--cta-text)]">
          ★ Guía principal
        </span>
        <h3
          className="text-xl md:text-[25px] font-extrabold leading-[1.15] mb-2 text-[var(--text-primary)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h3>
        <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed">
          {dek}
        </p>
        <CardChips guide={guide} />
        <span className="self-start mt-3 inline-flex items-center gap-2 font-extrabold text-sm rounded-full px-[19px] py-[11px] bg-[var(--cta-bg)] text-[var(--cta-text)] transition-opacity group-hover:opacity-90">
          Ver guía completa →
        </span>
      </div>
    </Link>
  );
}

function SatelliteCard({ guide }: { guide: Guide }) {
  const title = guide.ogTitle || guide.title;
  const dek = guide.ogDescription || guide.metaDescription;
  return (
    <Link
      href={guideHref(guide)}
      className="group flex gap-3.5 p-3.5 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--bg-primary)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.07)]"
    >
      <GuideThumb guide={guide} variant="card" />
      <div className="flex-1 min-w-0 flex flex-col">
        <h3
          className="text-[15.5px] font-bold leading-[1.25] mb-1 text-[var(--text-primary)] line-clamp-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h3>
        <p className="text-[13px] text-[var(--text-secondary)] leading-snug line-clamp-1">
          {dek}
        </p>
        <CardChips guide={guide} compact />
        <span className="mt-auto inline-flex items-center gap-1 font-bold text-[13px] text-[var(--text-primary)] group-hover:underline">
          Ver guía →
        </span>
      </div>
    </Link>
  );
}

export default function GuiasIndexPage() {
  const published = [...getPublishedGuides()].sort(compareGuidesByNewest);

  // Nivel 1: categoría (necesario para separar pilar de satélites dentro de cada una).
  const byCategory = published.reduce<Record<string, typeof published>>((acc, guide) => {
    if (!acc[guide.category]) acc[guide.category] = [];
    acc[guide.category].push(guide);
    return acc;
  }, {});

  // Nivel 2: silo. Agrupa categorías por su silo real (o el fallback de categorías
  // legacy sin `silo`, solo para esta vista — no afecta URLs, ver categorySiloFallback).
  const bySilo: Record<string, { slug: string; guides: typeof published }[]> = {};
  for (const [categorySlug, categoryGuides] of Object.entries(byCategory)) {
    const silo = getDisplaySilo(categoryGuides[0]);
    if (!bySilo[silo]) bySilo[silo] = [];
    bySilo[silo].push({ slug: categorySlug, guides: categoryGuides });
  }

  // Silos y categorías ordenados por cantidad de guías, de mayor a menor.
  const siloEntries = Object.entries(bySilo)
    .map(([siloSlug, categories]) => ({
      slug: siloSlug,
      name: guideSilos[siloSlug]?.name || siloSlug,
      description: guideSilos[siloSlug]?.description,
      categories: categories
        .map((c) => ({ ...c, count: c.guides.length }))
        .sort((a, b) => b.count - a.count),
      count: categories.reduce((sum, c) => sum + c.guides.length, 0),
    }))
    .sort((a, b) => b.count - a.count);

  const categoriesForNav = siloEntries.map((s) => ({
    slug: s.slug,
    name: s.name,
    count: s.count,
  }));

  const totalProducts = published.reduce((sum, g) => {
    const ids = new Set<string>();
    for (const pick of g.quickPicks || []) {
      if (pick.productMlaId) ids.add(pick.productMlaId);
    }
    for (const s of g.sections) {
      if (s.type === "product-card" && s.productMlaId) ids.add(s.productMlaId);
    }
    return sum + ids.size;
  }, 0);

  // Fecha de modificación más reciente entre todas las guías publicadas.
  const dateModified = published.reduce(
    (latest, g) => (mostRecentDate(g) > latest ? mostRecentDate(g) : latest),
    published[0] ? mostRecentDate(published[0]) : ""
  );

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Guías de compra para MercadoLibre Argentina",
    description:
      "Comparativas honestas para elegir bien en MercadoLibre Argentina: precios reales, opiniones de compradores y los contras que nadie te cuenta.",
    url: "https://productosvirales.com.ar/guias",
    inLanguage: "es-AR",
    ...(dateModified ? { dateModified } : {}),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: published.map((g, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: guideUrl(g),
        name: g.ogTitle || g.title,
      })),
    },
  };

  const breadcrumbLd = {
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
    ],
  };

  return (
    <div className="max-w-[1040px] mx-auto px-4 md:px-6 py-6 md:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <h1
        className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--text-primary)] mb-2"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Guías de compra para MercadoLibre Argentina
      </h1>
      <p className="text-base md:text-[15.5px] text-[var(--text-secondary)] mb-2 max-w-[680px]">
        Comparativas honestas para elegir bien: precios reales, opiniones de
        compradores y los contras que nadie te cuenta.
      </p>
      <div className="flex flex-wrap gap-x-3.5 gap-y-1.5 text-[12.5px] text-[var(--text-muted)] mb-4">
        <span>
          <strong className="text-[var(--text-primary)] font-bold">
            {categoriesForNav.length} temas
          </strong>
        </span>
        <span>
          <strong className="text-[var(--text-primary)] font-bold">
            +{Math.floor(totalProducts / 10) * 10}
          </strong>{" "}
          productos analizados
        </span>
        <span>
          <strong className="text-[var(--text-primary)] font-bold">miles</strong>{" "}
          de opiniones leídas
        </span>
        <span>precios verificados automáticamente</span>
      </div>

      <nav
        aria-label="Silos de guías"
        className="sticky top-14 md:top-16 z-40 -mx-4 md:-mx-6 px-4 md:px-6 py-2.5 bg-[var(--bg-primary)]/90 backdrop-blur-xl border-b border-[var(--border)] mb-6"
      >
        <ul className="flex flex-wrap gap-[7px] overflow-x-auto">
          {categoriesForNav.map((silo) => (
            <li key={silo.slug}>
              <a
                href={`#silo-${silo.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors whitespace-nowrap"
              >
                <span>{silo.name}</span>
                <span className="text-[11.5px] text-[var(--text-muted)]">
                  {silo.count}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {siloEntries.map((silo) => (
        <section
          key={silo.slug}
          id={`silo-${silo.slug}`}
          className="mb-14 md:mb-16 scroll-mt-32 md:scroll-mt-36"
        >
          <h2
            className="text-[28px] md:text-[32px] font-extrabold text-[var(--text-primary)] mb-1"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {silo.name}
          </h2>
          {silo.description && (
            <p className="text-[15px] text-[var(--text-secondary)] mb-6 max-w-[680px]">
              {silo.description}
            </p>
          )}

          {silo.categories.map(({ slug: categorySlug, guides: categoryGuides }) => {
            const cat = guideCategories[categorySlug];
            const pillar = categoryGuides.find((g) => g.pillar);
            const satellites = pillar
              ? categoryGuides.filter((g) => g.slug !== pillar.slug)
              : categoryGuides;
            return (
              <div
                key={categorySlug}
                id={`cat-${categorySlug}`}
                className="mb-10 md:mb-[42px] scroll-mt-32 md:scroll-mt-36 last:mb-0"
              >
                {silo.categories.length > 1 && (
                  <h3
                    className="text-lg md:text-xl font-extrabold text-[var(--text-primary)] mb-1"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {cat?.name || categorySlug}
                  </h3>
                )}
                {cat?.description && (
                  <p className="text-[14.5px] text-[var(--text-secondary)] mb-3.5 max-w-[680px]">
                    {cat.description}
                  </p>
                )}

                {pillar && <PillarCard guide={pillar} />}

                {satellites.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {satellites.map((guide) => (
                      <SatelliteCard key={guide.slug} guide={guide} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}
