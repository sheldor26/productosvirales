"use client";

import { useEffect, useState } from "react";

// Popup de captación de emails. Aparece centrado en la pantalla (modal con
// fondo oscurecido) apenas el visitante arranca a scrollear. Se cierra con la
// ✕, con Esc o clickeando el fondo, y no vuelve a molestar (queda en
// localStorage). Si se suscribe, tampoco reaparece. Reusa /api/subscribe.

const STORAGE_KEY = "pv_newsletter_banner"; // valor: "dismissed" | "subscribed"

// Aparece apenas empezó a scrollear. Distancia fija (no porcentaje) porque las
// guías son muy largas. En páginas cortas que no llegan a este scroll, no se
// dispara.
const TRIGGER_PX = 400;

export function NewsletterBanner() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Si ya lo descartó o ya se suscribió, ni enganchamos el scroll.
    if (localStorage.getItem(STORAGE_KEY)) return;

    const onScroll = () => {
      if (window.scrollY > TRIGGER_PX) {
        setShow(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // por si carga ya scrolleado
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function dismiss() {
    setShow(false);
    try {
      localStorage.setItem(STORAGE_KEY, "dismissed");
    } catch {
      // localStorage puede fallar (modo privado); no es crítico.
    }
  }

  // Cerrar con Escape mientras está abierto.
  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("submitting");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("ok");
        setMessage("Listo. Te escribo cuando tenga algo que valga la pena.");
        setEmail("");
        try {
          localStorage.setItem(STORAGE_KEY, "subscribed");
        } catch {}
        window.setTimeout(() => setShow(false), 3500);
      } else {
        setStatus("error");
        setMessage(data.error || "Hubo un error. Probá de nuevo.");
      }
    } catch {
      setStatus("error");
      setMessage("Hubo un error. Probá de nuevo.");
    }
  }

  if (!show) return null;

  return (
    <div
      className="newsletter-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={dismiss}
      style={{ background: "rgba(10,10,20,0.55)" }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Suscripción al newsletter"
        onClick={(e) => e.stopPropagation()}
        className="newsletter-popup relative w-full max-w-md rounded-[24px] border p-6 sm:p-7"
        style={{
          background: "color-mix(in srgb, var(--bg-primary) 88%, transparent)",
          borderColor: "var(--border)",
          boxShadow: "0 24px 70px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.5)",
          backdropFilter: "blur(28px) saturate(160%)",
          WebkitBackdropFilter: "blur(28px) saturate(160%)",
        }}
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Cerrar"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-xl leading-none opacity-60 transition-opacity hover:opacity-100"
          style={{ color: "var(--text-muted)" }}
        >
          ×
        </button>

        <div className="pr-4">
          <p
            className="text-xl sm:text-2xl font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Te paso los que valen la pena
          </p>
          <p className="mt-2 text-sm sm:text-base" style={{ color: "var(--text-secondary)" }}>
            Un mail cada tanto con lo que reviso y recomiendo. Sin spam, sin vender humo.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-2">
            <input
              type="email"
              required
              aria-label="Email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "submitting" || status === "ok"}
              className="w-full rounded-[12px] border px-4 py-3 text-sm focus:outline-none focus:ring-2"
              style={{
                background: "var(--bg-primary)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
              }}
            />
            <button
              type="submit"
              disabled={status === "submitting" || status === "ok"}
              className="w-full rounded-[var(--radius-pill)] px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: "var(--cta-bg)", color: "var(--cta-text)" }}
            >
              {status === "submitting" ? "Enviando…" : "Avisame"}
            </button>
          </form>

          {message && (
            <p
              className="mt-3 text-xs"
              style={{ color: status === "error" ? "var(--text-secondary)" : "var(--text-primary)" }}
              aria-live="polite"
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
