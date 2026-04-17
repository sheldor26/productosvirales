import Link from "next/link";
import type { Guide, GuideSection } from "@/lib/types";
import { calcReadingTime } from "@/lib/reading-time";

interface ArticleHeaderProps {
  guide: Guide;
}

function formatCategory(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.toUpperCase())
    .join(" ");
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function extractHero(guide: Guide): GuideSection | null {
  const first = guide.sections[0];
  if (first && first.type === "image" && first.imageSize === "hero") return first;
  return null;
}

export function ArticleHeader({ guide }: ArticleHeaderProps) {
  const hero = extractHero(guide);
  const readingTime = calcReadingTime(guide);
  const standfirst = guide.standfirst || guide.intro[0];
  const categoryLabel = formatCategory(guide.category);
  const hasUpdate = guide.updatedDate && guide.updatedDate !== guide.publishedDate;

  return (
    <header className="mb-8 md:mb-10">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-5"
      >
        <Link href="/" className="hover:text-[var(--text-secondary)] transition-colors">
          Inicio
        </Link>
        <span aria-hidden="true">→</span>
        <Link
          href="/guias"
          className="hover:text-[var(--text-secondary)] transition-colors"
        >
          Guías
        </Link>
      </nav>

      {/* Eyebrow */}
      <p
        className="text-[11px] md:text-xs font-semibold tracking-[0.14em] mb-4"
        style={{ color: "var(--editorial-accent)" }}
      >
        GUÍAS · {categoryLabel}
      </p>

      {/* H1 */}
      <h1
        className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] leading-[1.08] tracking-tight mb-5"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {guide.h1}
      </h1>

      {/* Standfirst */}
      {standfirst && (
        <p className="text-lg md:text-xl leading-[1.55] text-[var(--text-secondary)] mb-6 max-w-[640px]">
          {standfirst}
        </p>
      )}

      {/* Byline */}
      <div className="flex flex-wrap items-center gap-3 pt-5 pb-5 border-t border-b border-[var(--border)] text-sm">
        {/* Avatar (initials) */}
        <div
          aria-hidden="true"
          className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-semibold text-white"
          style={{ backgroundColor: "var(--editorial-accent)" }}
        >
          PV
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[var(--text-muted)]">
          <span className="text-[var(--text-secondary)] font-medium">
            Por Equipo productosvirales
          </span>
          <span aria-hidden="true" className="text-[var(--text-muted)]">
            ·
          </span>
          <time dateTime={guide.publishedDate}>
            {hasUpdate ? "Actualizado " : "Publicado "}
            {formatDate(hasUpdate ? guide.updatedDate : guide.publishedDate)}
          </time>
          <span aria-hidden="true" className="text-[var(--text-muted)]">
            ·
          </span>
          <span>{readingTime} min de lectura</span>
        </div>
      </div>

      {/* Hero image (breakout) */}
      {hero && (
        <figure className="editorial-hero-wrap mt-6 md:mt-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={hero.src}
            alt={hero.alt || ""}
            width={1200}
            height={630}
            loading="eager"
            className="w-full h-auto aspect-[1200/630] object-cover"
          />
          {hero.alt && (
            <figcaption className="px-4 md:px-6 mt-2 text-xs text-[var(--text-muted)] italic max-w-[640px]">
              {hero.alt}
            </figcaption>
          )}
        </figure>
      )}
    </header>
  );
}
