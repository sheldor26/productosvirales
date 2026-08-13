import type { Metadata } from "next";
import Image from "next/image";
import { baseOpenGraph } from "@/lib/site-og";
import { AffiliateLink } from "@/components/affiliate/AffiliateLink";
import { socialPosts } from "@/data/social-posts";

// Página pensada como bio-link para Threads/X/Instagram: quien la abre viene
// de un celular, casi siempre. No hay build-time caching de la lista de
// productos — se recalcula en cada request para que "últimas 24hs" sea
// siempre real, no lo que era cierto en el último deploy.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Enlaces",
  description:
    "Los productos que posteamos en las últimas 24 horas en Threads, X e Instagram, más nuestros links.",
  alternates: {
    canonical: "https://productosvirales.com.ar/enlaces",
  },
  openGraph: {
    ...baseOpenGraph,
    title: "ProductosVirales — Enlaces",
    description: "Lo que posteamos hoy, en un solo lugar.",
    url: "https://productosvirales.com.ar/enlaces",
  },
  robots: {
    // Contenido rotativo de 24hs: no tiene sentido que Google la indexe y
    // muestre en resultados de búsqueda un snapshot que va a estar vacío
    // o desactualizado unas horas después.
    index: false,
    follow: true,
  },
};

const SOCIAL_LINKS = [
  { label: "Sitio", href: "https://productosvirales.com.ar" },
  { label: "Threads", href: "https://www.threads.com/@productosvirales.com.ar" },
  { label: "X", href: "https://x.com/productosvirale" },
];

// postedAt en el futuro (typo de zona horaria al cargar el dato a mano) no
// debe colar el producto antes de tiempo — hallazgo real de la auditoría
// (trio-auditor, Codex): Date.now() - futuro da negativo, que es < 24h.
function isWithinLast24h(isoDate: string): boolean {
  const diff = Date.now() - new Date(isoDate).getTime();
  return diff >= 0 && diff < 24 * 60 * 60 * 1000;
}

function hoursAgoLabel(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `Posteado hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return `Posteado hace ${hours} h`;
}

export default function EnlacesPage() {
  const recentPosts = socialPosts
    .filter((post) => isWithinLast24h(post.postedAt))
    .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());

  return (
    <div id="enlaces-page" className="max-w-[520px] mx-auto px-4 py-6 flex flex-col items-center">
      {/* Página bio-link: el header/footer/newsletter globales del sitio son
          ruido para alguien que llega desde Threads/X a buscar UN link — los
          ocultamos scoped a esta ruta (por #enlaces-page) en vez de tocar
          layout.tsx, para no afectar ninguna otra página. Hallazgo de los
          dos auditores externos (trio-auditor, Codex + Gemini). */}
      <style>{`
        body:has(#enlaces-page) header,
        body:has(#enlaces-page) footer,
        body:has(#enlaces-page) .newsletter-banner {
          display: none;
        }
      `}</style>

      <h1 className="flex flex-col items-center gap-1 mb-6">
        <span className="flex items-center gap-1">
          <span className="text-2xl font-extrabold text-[#8a76b8]">
            productos
          </span>
          <span className="text-2xl font-extrabold text-white bg-gradient-to-br from-[#f4b5a4] to-[#ef8f76] px-3 py-0.5 rounded-xl">
            virales
          </span>
        </span>
        <span className="text-sm italic font-semibold text-[#c9694f]">
          Lo que posteamos hoy
        </span>
      </h1>

      <div className="w-full flex flex-col gap-4">
        {recentPosts.length === 0 && (
          <p className="text-center text-sm text-[var(--text-secondary)] py-6">
            Todavía no posteamos nada en las últimas 24hs — volvé más tarde.
          </p>
        )}

        {recentPosts.map((post) => (
          <AffiliateLink
            key={post.affiliateUrl}
            href={post.affiliateUrl}
            ctaLocation="enlaces-linktree"
            ariaLabel={`${post.title}, antes $${post.oldPrice}, ahora $${post.newPrice}, ${post.offPct}% off`}
            className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] p-3 shadow-sm active:scale-[0.98] transition-transform"
          >
            <div className="relative w-20 h-20 shrink-0 rounded-xl bg-white overflow-hidden">
              <Image
                src={post.imageUrl}
                alt=""
                fill
                sizes="80px"
                className="object-contain p-1"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#c9694f]">
                {hoursAgoLabel(post.postedAt)}
              </p>
              <p className="text-sm font-bold text-[var(--text-primary)] line-clamp-2 leading-snug mt-0.5">
                {post.title}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs text-[var(--text-secondary)] line-through">
                  $ {post.oldPrice}
                </span>
                <span className="text-base font-extrabold text-[var(--text-primary)]">
                  $ {post.newPrice}
                </span>
                <span className="text-[11px] font-bold text-white bg-[#ef8f76] px-2 py-0.5 rounded-full">
                  -{post.offPct}%
                </span>
              </div>
            </div>
          </AffiliateLink>
        ))}
      </div>

      <div className="w-full flex flex-col gap-3 mt-10">
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noopener" : undefined}
            className="w-full text-center py-3 rounded-full font-bold text-sm text-[var(--text-secondary)] bg-[var(--bg-secondary)] active:bg-[#b8a9d4]/10 transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
