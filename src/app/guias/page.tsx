import Link from "next/link";
import type { Metadata } from "next";
import { guides, guideCategories } from "@/data/guides";

export const metadata: Metadata = {
  title: "Guías de compra — Productos Virales",
  description:
    "Comparativas honestas y guías de compra para elegir bien en MercadoLibre Argentina. Masajeadores, gadgets virales y más.",
  alternates: {
    canonical: "https://productosvirales.com.ar/guias",
  },
};

export default function GuiasIndexPage() {
  // Group guides by category
  const grouped = guides.reduce<Record<string, typeof guides>>((acc, guide) => {
    if (!acc[guide.category]) acc[guide.category] = [];
    acc[guide.category].push(guide);
    return acc;
  }, {});

  return (
    <div className="max-w-[900px] mx-auto px-4 md:px-6 py-8 md:py-12">
      <h1
        className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Guías de compra
      </h1>
      <p className="text-base md:text-lg text-[var(--text-secondary)] mb-10">
        Comparativas honestas para elegir bien en MercadoLibre Argentina.
      </p>

      {Object.entries(grouped).map(([categorySlug, categoryGuides]) => {
        const cat = guideCategories[categorySlug];
        return (
          <section key={categorySlug} className="mb-12">
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
              {categoryGuides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guias/${guide.slug}`}
                  className="block p-5 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <h3
                    className="text-lg font-bold text-[var(--text-primary)] mb-2 leading-snug"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {guide.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                    {guide.metaDescription}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-3">
                    Actualizado{" "}
                    {new Date(guide.updatedDate).toLocaleDateString("es-AR", {
                      year: "numeric",
                      month: "long",
                    })}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
