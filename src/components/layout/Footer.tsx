import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-primary)]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-10 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-0.5 mb-3">
              <span
                className="text-lg font-bold tracking-tight text-[var(--text-primary)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                pick
              </span>
              <span className="text-lg font-bold tracking-tight bg-[var(--cta-bg)] text-[var(--cta-text)] px-1.5 py-0.5 rounded-md">
                viral
              </span>
            </Link>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Los productos más virales y trending de MercadoLibre Argentina, en un solo lugar.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4
              className="text-sm font-semibold text-[var(--text-primary)] mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Categorías
            </h4>
            <ul className="space-y-2">
              {["Belleza", "Tech", "Hogar", "Fitness", "Moda", "Cocina"].map(
                (cat) => (
                  <li key={cat}>
                    <Link
                      href={`/categoria/${cat.toLowerCase()}`}
                      className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      {cat}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4
              className="text-sm font-semibold text-[var(--text-primary)] mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Descubrí
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/trending"
                  className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Trending
                </Link>
              </li>
              <li>
                <Link
                  href="/guias"
                  className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Guías
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4
              className="text-sm font-semibold text-[var(--text-primary)] mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-[var(--text-muted)]">
                  Sitio afiliado a MercadoLibre
                </span>
              </li>
              <li>
                <span className="text-sm text-[var(--text-muted)]">
                  No somos vendedores
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--border)] text-center">
          <p className="text-xs text-[var(--text-muted)]">
            &copy; {new Date().getFullYear()} ProductosVirales. Todos los precios son de
            MercadoLibre Argentina y pueden variar.
          </p>
        </div>
      </div>
    </footer>
  );
}
