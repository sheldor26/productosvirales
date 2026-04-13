"use client";

import { useRef } from "react";
import { MessageCircle } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap-config";

export function WhatsAppCTA() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".widget-whatsapp", {
        autoAlpha: 0,
        y: 30,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".widget-whatsapp",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".widget-whatsapp", { autoAlpha: 1, y: 0 });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      <div
        className="widget-whatsapp bg-[var(--cta-bg)] rounded-[var(--radius-card)] p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{ visibility: "hidden" }}
      >
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#25D366] text-white shrink-0 mt-0.5">
            <MessageCircle size={20} />
          </div>
          <div>
            <h3
              className="text-base font-bold text-[var(--cta-text)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Unite al canal de WhatsApp
            </h3>
            <p className="text-sm text-[var(--cta-text)]/60 mt-0.5">
              Ofertas diarias directo al celu
            </p>
          </div>
        </div>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="cta-shimmer inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-semibold rounded-[var(--radius-pill)] bg-[var(--cta-text)] text-[var(--cta-bg)] hover:opacity-90 transition-opacity shrink-0"
        >
          <span aria-hidden>🔥</span>
          Unirme gratis
        </a>
      </div>
    </div>
  );
}
