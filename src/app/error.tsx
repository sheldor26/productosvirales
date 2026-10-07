"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-10 md:py-14">
      <div className="text-center max-w-lg mx-auto">
        <p
          className="text-[11px] font-semibold tracking-[0.14em] mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          ALGO SALIÓ MAL
        </p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]">
          Esta página tuvo un problema
        </h1>
        <p className="mt-3 text-sm text-[var(--text-secondary)]">
          No es algo que hayas hecho vos. Probá de nuevo, o volvé al inicio
          mientras lo revisamos.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => unstable_retry()}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-[6px] transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--cta-bg)", color: "var(--cta-text)" }}
          >
            Reintentar
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-[6px] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--border)] transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
