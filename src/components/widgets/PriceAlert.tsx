"use client";

import { useRef, useState } from "react";
import { Bell, ArrowRight } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap-config";

export function PriceAlert() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".widget-price-alert", {
        autoAlpha: 0,
        y: 30,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".widget-price-alert",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".widget-price-alert", { autoAlpha: 1, y: 0 });
    });
  }, { scope: containerRef });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div ref={containerRef}>
      <div
        className="widget-price-alert rounded-[var(--radius-card)] border border-[var(--border)] p-5 md:p-8"
        style={{
          background:
            "linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)",
          visibility: "hidden",
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
              Alertas de precio
            </h3>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">
              Recibí las mejores ofertas y productos virales en tu mail
            </p>
          </div>
        </div>

        {submitted ? (
          <p className="text-sm font-medium text-[var(--color-trending-up)]">
            ¡Listo! Te vamos a avisar cuando haya ofertas imperdibles.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="flex-1 px-4 py-2.5 text-sm bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-[var(--radius-pill)] border border-[var(--border)] outline-none focus:border-[var(--text-muted)] transition-colors placeholder:text-[var(--text-muted)]"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium rounded-[var(--radius-pill)] bg-[var(--cta-bg)] text-[var(--cta-text)] hover:bg-[var(--cta-hover)] transition-colors shrink-0 cursor-pointer"
            >
              Suscribirme
              <ArrowRight size={14} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
