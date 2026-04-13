"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap-config";

const faqItems = [
  {
    q: "¿Qué es ProductosVirales?",
    a: "Somos un sitio que recopila los productos más virales y trending de MercadoLibre Argentina. Te mostramos lo que todos están comprando, con precios actualizados y enlaces directos.",
  },
  {
    q: "¿Los precios son reales?",
    a: "Sí, todos los precios se obtienen directamente de MercadoLibre Argentina y se actualizan periódicamente. El precio final lo ves al hacer clic en el producto.",
  },
  {
    q: "¿Cómo compro un producto?",
    a: 'Hacé clic en el botón de flecha o en "Ver en MercadoLibre" y te llevamos directo al producto en ML para que compres con todas las garantías de la plataforma.',
  },
  {
    q: '¿Por qué un producto es "viral"?',
    a: "Marcamos como viral a los productos que tienen alto volumen de ventas, están en tendencia en redes sociales (especialmente TikTok) o tienen un crecimiento inusual en búsquedas.",
  },
];

export function HomeFAQ() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".faq-item", {
        autoAlpha: 0,
        y: 16,
        stagger: 0.06,
        duration: 0.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".faq-item", { autoAlpha: 1, y: 0 });
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef}>
      <h2
        className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-5"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Preguntas frecuentes
      </h2>
      <div className="space-y-3">
        {faqItems.map((item) => (
          <details
            key={item.q}
            className="faq-item group rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--bg-primary)] overflow-hidden"
            style={{ visibility: "hidden" }}
          >
            <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors">
              {item.q}
              <span className="ml-2 text-[var(--text-muted)] group-open:rotate-45 transition-transform text-lg">
                +
              </span>
            </summary>
            <div className="px-5 pb-4 text-sm text-[var(--text-secondary)] leading-relaxed">
              {item.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
