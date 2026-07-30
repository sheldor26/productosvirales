"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";
import { TikTokBadge } from "@/components/widgets/TikTokBadge";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface ProductGalleryProps {
  product: Product;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  // Build a deduped image list, falling back to the main image when the array is missing.
  const candidates = product.images && product.images.length > 0 ? product.images : [product.image];
  const images = Array.from(new Set(candidates.filter(Boolean)));
  const [activeIdx, setActiveIdx] = useState(0);
  const [failedIdx, setFailedIdx] = useState<Set<number>>(new Set());
  const activeImage = images[activeIdx] || product.image;
  const allFailed = images.length > 0 && images.every((_, i) => failedIdx.has(i));

  function handleImageError(idx: number) {
    setFailedIdx((prev) => {
      const next = new Set(prev).add(idx);
      // Si hay otra imagen sin probar, saltar automáticamente a la siguiente
      // en vez de mostrar un ícono de imagen rota.
      const nextUntried = images.findIndex((_, i) => !next.has(i));
      if (nextUntried !== -1 && idx === activeIdx) setActiveIdx(nextUntried);
      return next;
    });
  }

  return (
    <div>
      {/* Main image */}
      <div
        className="relative aspect-square rounded-[var(--radius-card)] overflow-hidden"
        style={{ backgroundColor: product.pastelColor || "#f8f8f6" }}
      >
        {allFailed ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[var(--text-muted)]">
            <ImageOff size={32} />
            <span className="text-xs text-center px-4">Imagen no disponible por el momento</span>
          </div>
        ) : (
          <Image
            key={activeImage}
            src={activeImage}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-8"
            preload
            onError={() => handleImageError(activeIdx)}
          />
        )}
        {product.tiktokViews && (
          <div className="absolute top-4 left-4">
            <TikTokBadge views={product.tiktokViews} />
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.slice(0, 10).map((src, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={src}
                type="button"
                onClick={() => setActiveIdx(idx)}
                onMouseEnter={() => setActiveIdx(idx)}
                aria-label={`Imagen ${idx + 1} de ${images.length}`}
                aria-current={isActive}
                className={cn(
                  "relative aspect-square rounded-[var(--radius-badge)] overflow-hidden border transition-all",
                  isActive
                    ? "border-[var(--text-primary)] ring-1 ring-[var(--text-primary)]"
                    : "border-[var(--border)] hover:border-[var(--text-secondary)] opacity-80 hover:opacity-100"
                )}
                style={{ backgroundColor: product.pastelColor || "#f8f8f6" }}
              >
                <Image
                  src={src}
                  alt={`${product.title} — imagen ${idx + 1}`}
                  fill
                  sizes="100px"
                  className="object-contain p-1.5"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
