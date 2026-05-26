import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getPublishedGuides, guideCategories } from "@/data/guides";
import { getGuideThumbnail } from "@/lib/guide-thumbnail";
import { calcReadingTime } from "@/lib/reading-time";
import type { Guide } from "@/lib/types";

// Revalidate daily so scheduled guides appear on their publishedDate
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Guías de compra — Productos Virales",
  description:
    "Comparativas honestas y guías de compra para elegir bien en MercadoLibre Argentina. Masajeadores, gadgets virales y más.",
  alternates: {
    canonical: "https://productosvirales.com.ar/guias",
  },
  openGraph: {
    title: "Guías de compra — Productos Virales",
    description:
      "Comparativas honestas y guías de compra para elegir bien en MercadoLibre Argentina.",
    url: "https://productosvirales.com.ar/guias",
  },
  twitter: {
    card: "summary_large_image",
    title: "Guías de compra — Productos Virales",
    description:
      "Comparativas honestas y guías de compra para elegir bien en MercadoLibre Argentina.",
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

function formatRelativeDate(iso: string): string {
  const days = daysSince(iso);
  if (days <= 0) return "Hoy";
  if (days === 1) return "Ayer";
  if (days < 7) return `Hace ${days} días`;
  if (days < 14) return "Hace 1 semana";
  if (days < 30) return `Hace ${Math.floor(days / 7)} semanas`;
  if (days < 60) return "Hace 1 mes";
  if (days < 90) return "Hace 2 meses";
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(date)
    .replace(/\./g, "");
}

export default function GuiasIndexPage() {
  const published = [...getPublishedGuides()].sort(compareGuidesByNewest);
  const grouped = published.reduce<Record<string, typeof published>>((acc, guide) => {
    if (!acc[guide.category]) acc[guide.category] = [];
    acc[guide.category].push(guide);
    return acc;
  }, {});

  const categoriesForNav = Object.entries(grouped).map(([slug, items]) => ({
    slug,
    name: guideCategories[slug]?.name || slug,
    count: items.length,
  }));

  return (
    <div className="max-w-[1100px] mx-auto px-4 md:px-6 py-8 md:py-12">
      <h1
        className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Guías de compra
      </h1>
      <p className="text-base md:text-lg text-[var(--text-secondary)] mb-6">
        Comparativas honestas para elegir bien en MercadoLibre Argentina.
      </p>

      <nav
        aria-label="Categorías de guías"
        className="sticky top-14 md:top-16 z-40 -mx-4 md:-mx-6 px-4 md:px-6 py-3 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border)] mb-8"
      >
        <ul className="flex flex-wrap gap-2">
          {categoriesForNav.map((cat) => (
            <li key={cat.slug}>
              <a
                href={`#cat-${cat.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <span>{cat.name}</span>
                <span className="text-xs text-[var(--text-muted)]">{cat.count}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {Object.entries(grouped).map(([categorySlug, categoryGuides]) => {
        const cat = guideCategories[categorySlug];
        return (
          <section
            key={categorySlug}
            id={`cat-${categorySlug}`}
            className="mb-12 scroll-mt-32 md:scroll-mt-36"
          >
            <h2
              className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {cat?.name || categorySlug}
            </h2>
            {cat?.description && (
              <p className="text-[var(--text-secondary)] mb-5">{cat.description}</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryGuides.map((guide) => {
                const thumbnail = getGuideThumbnail(guide);
                const isFresh = daysSince(guide.updatedDate) <= 7;
                const readingMinutes = calcReadingTime(guide);
                return (
                  <Link
                    key={guide.slug}
                    href={`/guias/${guide.slug}`}
                    className="group relative flex gap-4 p-4 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    {isFresh && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-[var(--color-discount)]/10 text-[var(--color-discount)] border border-[var(--color-discount)]/30">
                        Recién actualizada
                      </span>
                    )}
                    {thumbnail && (
                      <div className="shrink-0 w-24 h-24 md:w-32 md:h-32 overflow-hidden rounded-[calc(var(--radius-card)-4px)] bg-[var(--bg-secondary)]">
                        <Image
                          src={thumbnail.src}
                          alt={thumbnail.alt}
                          width={thumbnail.width}
                          height={thumbnail.height}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-base md:text-lg font-bold leading-snug mb-1.5 text-[var(--text-primary)] pr-24"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {guide.title}
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2 mb-2">
                        {guide.metaDescription}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {formatRelativeDate(guide.updatedDate)} · {readingMinutes} min de lectura
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
