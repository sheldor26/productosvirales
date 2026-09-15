import type { Metadata } from "next";
import Link from "next/link";
import { getPerfumePriceIndex } from "@/lib/perfume-price-index";
import { curatedProducts } from "@/data/curated-products";
import { productHref } from "@/lib/product-url";
import { formatPrice } from "@/lib/utils";
import { baseOpenGraph } from "@/lib/site-og";
import { PriceMoversChart, PriceMoversTable } from "@/components/products/PriceMoversChart";
import { notFound } from "next/navigation";

// Publicada 2026-07-27 (OK de Juan). Sin pitch a periodistas por ahora
// (Juan prefirió no mandar mails) — distribución vía Threads en su lugar.
const PUBLISHED = true;

const PAGE_URL = "https://productosvirales.com.ar/indice-precios/perfumes-arabes";
const TITLE = "Índice de precios: perfumes árabes en Argentina";
const DESCRIPTION =
  "Cuánto subieron o bajaron de precio los perfumes árabes en Mercado Libre Argentina, con datos reales relevados a lo largo de varios meses de 2026.";

// Mientras no esté publicada, no exportar metadata real: evita que el título/
// descripción reales queden en el <head> para un crawler que pegue directo a
// la URL, aunque el body haga notFound().
export const metadata: Metadata = PUBLISHED
  ? {
      // `absolute`: sin el sufijo ` | ProductosVirales` del layout raíz, que
      // dejaba el título en 67 caracteres (la SERP corta cerca de 60).
      title: { absolute: TITLE },
      description: DESCRIPTION,
      alternates: { canonical: PAGE_URL },
      openGraph: {
        ...baseOpenGraph,
        title: TITLE,
        description: DESCRIPTION,
        url: PAGE_URL,
      },
      twitter: {
        card: "summary_large_image",
        title: TITLE,
        description: DESCRIPTION,
      },
    }
  : { robots: { index: false, follow: false } };

function fmtDateLong(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  return `${d} de ${meses[(m ?? 1) - 1]} de ${y}`;
}

export default function PerfumesArabesPriceIndexPage() {
  if (!PUBLISHED) notFound();

  const index = getPerfumePriceIndex();
  if (!index) notFound();

  const { movers, avgPct, risenCount, fallenCount, rangeStart, rangeEnd, topGainer, topLoser, usable } = index;
  const topGainers = movers.slice(0, 8);
  const topLosers = [...movers].slice(-8).reverse();
  const productById = new Map(curatedProducts.map((p) => [p.id, p]));

  return (
    <div className="max-w-[900px] mx-auto px-4 md:px-6 py-5 md:py-8 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: TITLE,
            description: DESCRIPTION,
            url: PAGE_URL,
            temporalCoverage: `${rangeStart}/${rangeEnd}`,
            spatialCoverage: { "@type": "Place", name: "Argentina" },
            creator: { "@type": "Organization", name: "ProductosVirales", url: "https://productosvirales.com.ar" },
            variableMeasured: "Precio de venta en Mercado Libre Argentina (ARS)",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: "https://productosvirales.com.ar" },
              { "@type": "ListItem", position: 2, name: "Índice de precios", item: "https://productosvirales.com.ar/indice-precios" },
              { "@type": "ListItem", position: 3, name: "Perfumes árabes", item: PAGE_URL },
            ],
          }),
        }}
      />

      <div>
        <p className="text-xs uppercase tracking-wide text-[var(--text-muted)] font-semibold mb-2">
          Índice de precios · datos reales
        </p>
        <h1
          className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {TITLE}
        </h1>
        <p className="mt-3 text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
          Seguimos el precio real de {index.totalTracked} perfumes árabes en Mercado Libre Argentina,
          verificado en vivo a lo largo del tiempo. Esto es lo que pasó con {usable} de ellos
          entre {fmtDateLong(rangeStart)} y {fmtDateLong(rangeEnd)}: no es una encuesta ni una
          estimación, es el precio de venta real capturado en cada chequeo.
        </p>
      </div>

      <div className="rounded-[var(--radius-card)] border border-[var(--border)] p-5 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">Variación promedio</div>
            <div className="text-2xl font-extrabold text-[var(--text-primary)] tabular-nums">
              {avgPct >= 0 ? "+" : ""}
              {avgPct}%
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">Subieron de precio</div>
            <div className="text-2xl font-extrabold text-[#16a34a] tabular-nums">{risenCount} de {usable}</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">Bajaron de precio</div>
            <div className="text-2xl font-extrabold text-[#ef4444] tabular-nums">{fallenCount} de {usable}</div>
          </div>
        </div>
        <p className="mt-5 text-sm text-[var(--text-primary)] leading-relaxed">
          El promedio esconde una dispersión enorme: el que más subió fue el{" "}
          <Link href={productHref(productById.get(topGainer.id) ?? { id: topGainer.id, title: topGainer.title })} prefetch={false} className="font-semibold underline decoration-[var(--border)] underline-offset-2">
            {topGainer.title}
          </Link>{" "}
          con un <strong>+{topGainer.pct}%</strong> ({formatPrice(topGainer.firstPrice)} a {formatPrice(topGainer.lastPrice)}),
          mientras el{" "}
          <Link href={productHref(productById.get(topLoser.id) ?? { id: topLoser.id, title: topLoser.title })} prefetch={false} className="font-semibold underline decoration-[var(--border)] underline-offset-2">
            {topLoser.title}
          </Link>{" "}
          bajó <strong>{topLoser.pct}%</strong> en el mismo período.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PriceMoversChart movers={topGainers} title="Los que más subieron" />
        <PriceMoversChart movers={topLosers} title="Los que más bajaron" />
      </div>

      <div>
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3" style={{ fontFamily: "var(--font-display)" }}>
          Los {usable} perfumes, con precio inicial y final
        </h2>
        <PriceMoversTable movers={movers} />
      </div>

      <div className="rounded-[var(--radius-card)] bg-[var(--bg-secondary)] p-5 text-sm text-[var(--text-secondary)] leading-relaxed">
        <p className="font-semibold text-[var(--text-primary)] mb-2">Cómo se armó este índice</p>
        <p>
          Cada precio es el que mostraba la publicación real en Mercado Libre Argentina en el momento
          del chequeo, relevado a lo largo de varios meses. Solo entran acá los perfumes con al menos
          4 chequeos registrados, para no sacar conclusiones de una curva con 1 o 2 puntos. La variación
          es precio inicial vs. precio del último chequeo (no el promedio del período). Este índice se
          sigue actualizando; esta página refleja el corte del {fmtDateLong(rangeEnd)}.
        </p>
        <p className="mt-3">
          Si buscás cuál perfume árabe comprar (no solo cómo evolucionó el precio), la{" "}
          <Link href="/guias/perfumes-arabes" className="underline decoration-[var(--border)] underline-offset-2">
            guía completa de perfumes árabes
          </Link>{" "}
          compara marcas, familias olfativas y duración real reportada por compradores.
        </p>
      </div>
    </div>
  );
}
