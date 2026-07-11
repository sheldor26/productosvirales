"use client";

import { useRef, useState } from "react";
import { Bell, ArrowRight } from "lucide-react";

interface PriceAlertProps {
  /** Si viene, el lead queda atado a este producto (`ref` -> source_detail).
   * Sirve para la ficha sin stock ("avisame cuando vuelva"). */
  productId?: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  doneLabel?: string;
}

export function PriceAlert({
  productId,
  title = "Alertas de precio",
  subtitle = "Te avisamos de las bajas de precio más fuertes de la tienda. Las alertas por producto puntual, en camino.",
  ctaLabel = "Activar alerta",
  doneLabel = "¡Alerta activada! Atentos a tu mail — te chiflamos las mejores bajas primero.",
}: PriceAlertProps = {}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  // Lock inmediato: evita doble submit por carrera antes de que renderice `disabled`.
  const inFlight = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || inFlight.current) return;
    inFlight.current = true;
    setStatus("loading");
    setErrorMsg("");

    // Timeout defensivo: si el fetch queda colgado, no dejamos la UI trabada.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          source: "price-alert",
          ...(productId ? { ref: productId } : {}),
        }),
        signal: controller.signal,
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setErrorMsg(data.error || "No pudimos guardar tu email. Probá de nuevo.");
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setErrorMsg("No pudimos guardar tu email. Probá de nuevo en un rato.");
      setStatus("error");
    } finally {
      clearTimeout(timer);
      inFlight.current = false;
    }
  };

  return (
    <div>
      <div
        className="rounded-[var(--radius-card)] border border-[var(--border)] p-5 md:p-8"
        style={{
          background:
            "linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)",
        }}
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-pastel-amber)] shrink-0">
            <Bell size={18} className="text-[#111] bell-ring" />
          </div>
          <div>
            <h3
              className="text-base font-bold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {title}
            </h3>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>

        {status === "done" ? (
          <p
            role="status"
            aria-live="polite"
            className="text-sm font-medium text-[var(--color-trending-up)]"
          >
            {doneLabel}
          </p>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                aria-label="Tu email"
                required
                disabled={status === "loading"}
                className="flex-1 px-4 py-2.5 text-sm bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-[var(--radius-pill)] border border-[var(--border)] outline-none focus:border-[var(--text-muted)] transition-colors placeholder:text-[var(--text-muted)] disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium rounded-[var(--radius-pill)] bg-[var(--cta-bg)] text-[var(--cta-text)] hover:bg-[var(--cta-hover)] transition-colors shrink-0 cursor-pointer disabled:opacity-70 disabled:cursor-default"
              >
                {status === "loading" ? "Activando…" : ctaLabel}
                {status !== "loading" && <ArrowRight size={14} />}
              </button>
            </form>
            {status === "error" && (
              <p role="alert" className="mt-2 text-xs text-[#ef4444]">
                {errorMsg}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
