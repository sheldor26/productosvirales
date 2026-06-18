"use client";

import { useEffect, useState } from "react";

// Banner de captación de emails. Aparece deslizándose desde abajo cuando el
// visitante scrolleó buena parte de la página (señal de interés real). Se
// descarta con la ✕ y no vuelve a molestar (queda en localStorage). Si se
// suscribe, tampoco reaparece. Reusa /api/subscribe (mismo endpoint que el
// form de las guías).

const STORAGE_KEY = "pv_newsletter_banner"; // valor: "dismissed" | "subscribed"

// Mostrar recién cuando scrolleó ~50% del alto scrolleable, y solo en páginas
// lo bastante largas como para que el 50% signifique algo.
function pastTrigger(): boolean {
  const scrolled = window.scrollY + window.innerHeight;
  const total = document.documentElement.scrollHeight;
  if (total < window.innerHeight * 2) return false; // página corta: no aparece
  return scrolled / total > 0.5;
}

export function NewsletterBanner() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Si ya lo descartó o ya se suscribió, ni enganchamos el scroll.
    if (localStorage.getItem(STORAGE_KEY)) return;

    const onScroll = () => {
      if (pastTrigger()) {
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
        // Se cierra solo después de mostrar el agradecimiento.
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
      role="dialog"
      aria-label="Suscripción al newsletter"
      className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 sm:px-4 sm:pb-4 pointer-events-none"
    >
      <div
        className="newsletter-banner pointer-events-auto mx-auto w-full max-w-2xl rounded-[20px] border p-4 sm:p-5"
        style={{
          background: "color-mix(in srgb, var(--bg-primary) 80%, transparent)",
          borderColor: "var(--border)",
          boxShadow: "0 12px 40px rgba(17,17,17,0.16), inset 0 1px 0 rgba(255,255,255,0.5)",
          backdropFilter: "blur(20px) saturate(160%)",
          WebkitBackdropFilter: "blur(20px) saturate(160%)",
        }}
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Cerrar"
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-lg leading-none transition-opacity hover:opacity-100 opacity-60"
          style={{ color: "var(--text-muted)" }}
        >
          ×
        </button>

        <div className="pr-6">
          <p
            className="text-base sm:text-lg font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Te paso los que valen la pena
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            Un mail cada tanto con lo que reviso y recomiendo. Sin spam, sin vender humo.
          </p>

          <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              required
              aria-label="Email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "submitting" || status === "ok"}
              className="flex-1 rounded-[10px] border px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{
                background: "var(--bg-primary)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
              }}
            />
            <button
              type="submit"
              disabled={status === "submitting" || status === "ok"}
              className="rounded-[var(--radius-pill)] px-6 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: "var(--cta-bg)", color: "var(--cta-text)" }}
            >
              {status === "submitting" ? "Enviando…" : "Avisame"}
            </button>
          </form>

          {message && (
            <p
              className="mt-2 text-xs"
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
