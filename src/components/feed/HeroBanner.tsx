"use client";

import { useRef } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap-config";

export function HeroBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(".hero-label", { opacity: 1, y: 0, duration: 0.4 })
        .to(".hero-title", { opacity: 1, y: 0, duration: 0.5 }, "-=0.15")
        .to(".hero-desc", { opacity: 1, y: 0, duration: 0.4 }, "-=0.2")
        .to(".hero-cta", { opacity: 1, y: 0, duration: 0.4 }, "-=0.15");
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".hero-label, .hero-title, .hero-desc, .hero-cta", { opacity: 1, y: 0 });
    });
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="hero-noise relative overflow-hidden rounded-[var(--radius-card)] p-6 md:p-12"
      style={{
        background:
          "linear-gradient(135deg, #f9a8d4 0%, #c4b5fd 38%, #93c5fd 68%, #86efac 100%)",
      }}
    >
      <div className="relative z-10 max-w-xl">
        <div className="hero-label flex items-center gap-2 mb-3 opacity-0">
          <Sparkles size={16} className="text-[#111]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#111]/75">
            Lo más viral de la semana
          </span>
        </div>

        <h1
          className="hero-title text-3xl md:text-5xl font-extrabold text-[#111] leading-[1.05] tracking-tight opacity-0"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Los productos que explotan en Internet
        </h1>

        <p
          className="hero-desc mt-4 text-sm md:text-base text-[#111]/70 leading-relaxed opacity-0"
        >
          Tendencias de TikTok, ofertas imperdibles y lo que todos están comprando ahora mismo.
        </p>

        <div className="hero-cta opacity-0">
          <Link
            href="/trending"
            className="cta-shimmer inline-flex items-center gap-2 mt-6 px-5 py-3 text-sm font-semibold rounded-[var(--radius-pill)] bg-[#111] text-white hover:bg-[#222] transition-colors"
          >
            Ver trending
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Decorative blobs amorfos */}
      <div
        className="hero-blob absolute -top-16 -right-12 w-56 h-56 bg-white/25 blur-md"
        style={{ borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" }}
      />
      <div
        className="hero-blob absolute -bottom-10 right-16 w-32 h-32 bg-white/30"
        style={{ borderRadius: "63% 37% 54% 46% / 55% 48% 52% 45%" }}
      />
      <div
        className="hero-blob absolute top-12 right-40 w-20 h-20 bg-white/20 blur-sm hidden md:block"
        style={{ borderRadius: "40% 60% 65% 35% / 50% 45% 55% 50%" }}
      />
    </div>
  );
}
