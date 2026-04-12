"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
};

export function HeroBanner() {
  return (
    <div
      className="hero-noise relative overflow-hidden rounded-[var(--radius-card)] p-6 md:p-12"
      style={{
        background:
          "linear-gradient(135deg, #f9a8d4 0%, #c4b5fd 38%, #93c5fd 68%, #86efac 100%)",
      }}
    >
      <motion.div
        className="relative z-10 max-w-xl"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div className="flex items-center gap-2 mb-3" variants={itemVariants}>
          <Sparkles size={16} className="text-[#111]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#111]/75">
            Lo más viral de la semana
          </span>
        </motion.div>

        <motion.h1
          className="text-3xl md:text-5xl font-extrabold text-[#111] leading-[1.05] tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
          variants={itemVariants}
        >
          Los productos que explotan en Internet
        </motion.h1>

        <motion.p
          className="mt-4 text-sm md:text-base text-[#111]/70 leading-relaxed"
          variants={itemVariants}
        >
          Tendencias de TikTok, ofertas imperdibles y lo que todos están comprando ahora mismo.
        </motion.p>

        <motion.div variants={itemVariants}>
          <Link
            href="/trending"
            className="cta-shimmer inline-flex items-center gap-2 mt-6 px-5 py-3 text-sm font-semibold rounded-[var(--radius-pill)] bg-[#111] text-white hover:bg-[#222] transition-colors"
          >
            Ver trending
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </motion.div>

      {/* Decorative blobs amorfos */}
      <div
        className="absolute -top-16 -right-12 w-56 h-56 bg-white/25 blur-md"
        style={{ borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" }}
      />
      <div
        className="absolute -bottom-10 right-16 w-32 h-32 bg-white/30"
        style={{ borderRadius: "63% 37% 54% 46% / 55% 48% 52% 45%" }}
      />
      <div
        className="absolute top-12 right-40 w-20 h-20 bg-white/20 blur-sm hidden md:block"
        style={{ borderRadius: "40% 60% 65% 35% / 50% 45% 55% 50%" }}
      />
    </div>
  );
}
