"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, ChevronRight, Truck, Shield, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { TikTokBadge } from "@/components/widgets/TikTokBadge";
import { formatPrice, formatDiscount } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const discount = product.originalPrice
    ? formatDiscount(product.originalPrice, product.price)
    : null;

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-6">
        <Link href="/" className="hover:text-[var(--text-secondary)] transition-colors">
          Inicio
        </Link>
        <ChevronRight size={12} />
        <Link
          href={`/categoria/${product.categorySlug}`}
          className="hover:text-[var(--text-secondary)] transition-colors"
        >
          {product.category}
        </Link>
        <ChevronRight size={12} />
        <span className="text-[var(--text-secondary)] truncate max-w-[200px]">
          {product.title}
        </span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        {/* Left: Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div
            className="relative aspect-square rounded-[var(--radius-card)] overflow-hidden"
            style={{ backgroundColor: product.pastelColor || "#f8f8f6" }}
          >
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-8"
              priority
              unoptimized
            />
            {product.tiktokViews && (
              <div className="absolute top-4 left-4">
                <TikTokBadge views={product.tiktokViews} />
              </div>
            )}
          </div>
        </motion.div>

        {/* Right: Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col"
        >
          <Link
            href={`/categoria/${product.categorySlug}`}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors mb-2"
          >
            {product.category}
          </Link>

          <h1
            className="text-xl md:text-2xl font-bold text-[var(--text-primary)] leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {product.title}
          </h1>

          {product.badge && (
            <div className="mt-3">
              <Badge variant={product.badge}>
                {product.badge === "viral" ? "VIRAL" : product.badge === "trending" ? "TRENDING" : "HOT DEAL"}
              </Badge>
            </div>
          )}

          {/* Price */}
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[var(--text-primary)]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-base text-[var(--text-muted)] line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-sm font-semibold text-[var(--color-discount)]">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          {/* Shipping & condition */}
          <div className="mt-4 flex flex-wrap gap-3">
            {product.freeShipping && (
              <div className="flex items-center gap-1.5 text-xs text-[var(--color-trending-up)]">
                <Truck size={14} />
                Envío gratis
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <Shield size={14} />
              {product.condition === "new" ? "Nuevo" : "Usado"}
            </div>
            {product.soldQuantity && (
              <div className="text-xs text-[var(--text-muted)]">
                +{product.soldQuantity.toLocaleString("es-AR")} vendidos
              </div>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="mt-5 text-sm text-[var(--text-secondary)] leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Pros / Cons */}
          {(product.pros || product.cons) && (
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.pros && (
                <div>
                  <h4 className="text-xs font-semibold text-[var(--text-primary)] mb-2 uppercase tracking-wider">
                    A favor
                  </h4>
                  <ul className="space-y-1.5">
                    {product.pros.map((pro) => (
                      <li key={pro} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                        <Check size={14} className="text-[var(--color-trending-up)] shrink-0 mt-0.5" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {product.cons && (
                <div>
                  <h4 className="text-xs font-semibold text-[var(--text-primary)] mb-2 uppercase tracking-wider">
                    En contra
                  </h4>
                  <ul className="space-y-1.5">
                    {product.cons.map((con) => (
                      <li key={con} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                        <X size={14} className="text-[var(--color-discount)] shrink-0 mt-0.5" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Verdict */}
          {product.verdict && (
            <div className="mt-5 p-4 rounded-[var(--radius-badge)] bg-[var(--bg-secondary)] border border-[var(--border)]">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                💬 {product.verdict}
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-[var(--radius-pill)] bg-[var(--cta-bg)] text-[var(--cta-text)] hover:bg-[var(--cta-hover)] transition-colors"
            >
              Ver en MercadoLibre
              <ExternalLink size={14} />
            </a>
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-[var(--radius-pill)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
            >
              Ir a la oferta
              <ArrowRight size={14} />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
