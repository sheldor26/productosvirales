"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function HeroBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div
        className="relative overflow-hidden rounded-[var(--radius-card)] p-6 md:p-10"
        style={{ background: "linear-gradient(135deg, #fce7f3 0%, #e0f2fe 50%, #dcfce7 100%)" }}
      >
        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-[#111]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#111]/70">
              Lo más viral de la semana
            </span>
          </div>
          <h1
            className="text-2xl md:text-3xl font-extrabold text-[#111] leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Descubrí los productos que están volando en MercadoLibre
          </h1>
          <p className="mt-3 text-sm md:text-base text-[#111]/60 leading-relaxed">
            Tendencias de TikTok, ofertas imperdibles y lo que todos están comprando ahora mismo.
          </p>
          <Link
            href="/trending"
            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 text-sm font-medium rounded-[var(--radius-pill)] bg-[#111] text-white hover:bg-[#333] transition-colors"
          >
            Ver trending
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/20 blur-sm" />
        <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/30" />
      </div>
    </motion.div>
  );
}
