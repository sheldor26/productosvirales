import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export function HeroBanner() {
  return (
    <div
      className="hero-noise relative overflow-hidden rounded-[var(--radius-card)] p-6 md:p-12"
      style={{
        background:
          "linear-gradient(135deg, #f9a8d4 0%, #c4b5fd 38%, #93c5fd 68%, #86efac 100%)",
      }}
    >
      <div className="relative z-10 max-w-xl">
        <div
          className="hero-rise flex items-center gap-2 mb-3"
          style={{ animationDelay: "0ms" }}
        >
          <Sparkles size={16} className="text-[#111]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#111]/75">
            Lo más viral de la semana
          </span>
        </div>

        <h1
          className="hero-rise text-3xl md:text-5xl font-extrabold text-[#111] leading-[1.05] tracking-tight"
          style={{ fontFamily: "var(--font-display)", animationDelay: "120ms" }}
        >
          Los productos que explotan en Internet
        </h1>

        <p
          className="hero-rise mt-4 text-sm md:text-base text-[#111]/70 leading-relaxed"
          style={{ animationDelay: "240ms" }}
        >
          Tendencias de TikTok, ofertas imperdibles y lo que todos están comprando ahora mismo.
        </p>

        <div className="hero-rise" style={{ animationDelay: "360ms" }}>
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
