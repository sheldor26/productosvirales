import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { RelatedGuideLink } from "@/lib/related-guides";

/**
 * Bloque "próximo paso" de enlazado interno. Presentacional puro: recibe los
 * links ya resueltos (título, href, si es pilar) y los renderiza. Refuerza el
 * hub-and-spoke destacando la guía pilar. Se usa al final de guías y fichas.
 */
export function RelatedGuides({
  heading,
  subtitle,
  links,
  className = "",
}: {
  heading: string;
  subtitle?: string;
  links: RelatedGuideLink[];
  className?: string;
}) {
  if (links.length === 0) return null;

  return (
    <section className={`not-prose ${className}`}>
      <div className="mb-4">
        <h2
          className="text-xl md:text-2xl font-bold text-[var(--text-primary)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {heading}
        </h2>
        {subtitle && <p className="mt-1 text-sm text-[var(--text-muted)]">{subtitle}</p>}
      </div>

      <ul className="grid gap-2.5 sm:grid-cols-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="group flex h-full items-center justify-between gap-3 rounded-[10px] border border-[var(--border)] bg-[var(--bg-primary)] p-4 transition-colors hover:bg-[var(--bg-secondary)]"
            >
              <span className="min-w-0">
                {l.isPillar && (
                  <span
                    className="mb-0.5 block text-[11px] font-bold uppercase tracking-wide"
                    style={{ color: "var(--editorial-accent)" }}
                  >
                    Guía principal
                  </span>
                )}
                <span className="block font-semibold leading-snug text-[var(--text-primary)]">
                  {l.title}
                </span>
                {l.subtitle && (
                  <span className="mt-0.5 block text-[12.5px] leading-snug text-[var(--text-muted)] line-clamp-1">
                    {l.subtitle}
                  </span>
                )}
              </span>
              <ArrowRight
                size={16}
                className="shrink-0 text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
