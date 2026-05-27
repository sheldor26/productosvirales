import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";
import type { Guide, GuideSection } from "@/lib/types";
import { getProductById, getVisibleProducts } from "@/lib/products";

const publicDir = path.join(process.cwd(), "public");
const existenceCache = new Map<string, boolean>();

function fileExistsInPublic(src: string): boolean {
  if (!src.startsWith("/")) return true;
  const cached = existenceCache.get(src);
  if (cached !== undefined) return cached;
  const onDisk = existsSync(path.join(publicDir, src.slice(1)));
  existenceCache.set(src, onDisk);
  return onDisk;
}

function isUsableImageSection(s: GuideSection): boolean {
  if (s.type !== "image" || !s.src) return false;
  return fileExistsInPublic(s.src);
}

function hashSlug(slug: string): number {
  let h = 5381;
  for (let i = 0; i < slug.length; i++) {
    h = ((h << 5) + h + slug.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function getGuideThumbnail(guide: Guide): {
  src: string;
  alt: string;
  width: number;
  height: number;
} | null {
  const editorialImage = guide.sections.find(isUsableImageSection);
  if (editorialImage?.src) {
    return {
      src: editorialImage.src,
      alt: editorialImage.alt || editorialImage.caption || guide.title,
      width: editorialImage.width || 200,
      height: editorialImage.height || 200,
    };
  }

  const candidateProductIds: string[] = [];
  for (const pick of guide.quickPicks || []) {
    if (pick.productMlaId) candidateProductIds.push(pick.productMlaId);
  }
  for (const section of guide.sections) {
    if (section.type === "product-card" && section.productMlaId) {
      candidateProductIds.push(section.productMlaId);
    }
  }
  const mlaRegex = /\/producto\/(MLAU?\d+)/gi;
  const stringPool: string[] = [
    ...guide.intro,
    ...guide.sections.flatMap((s) => {
      const out: string[] = [];
      if (s.content) out.push(s.content);
      if (s.rows) for (const row of s.rows) out.push(...row);
      if (Array.isArray(s.items)) {
        for (const item of s.items) {
          if (typeof item === "string") out.push(item);
        }
      }
      return out;
    }),
  ];
  for (const text of stringPool) {
    for (const match of text.matchAll(mlaRegex)) {
      candidateProductIds.push(match[1].toUpperCase());
    }
  }

  for (const id of candidateProductIds) {
    const product = getProductById(id);
    if (product?.image) {
      return {
        src: product.image,
        alt: product.title || guide.title,
        width: 200,
        height: 200,
      };
    }
  }

  const CATEGORY_KEYWORDS: Record<string, string> = {
    "freidoras-de-aire": "freidora",
    "pavas-electricas": "pava",
    "perfumes-arabes": "perfume",
    masajeadores: "masajeador",
  };
  const keyword = CATEGORY_KEYWORDS[guide.category];
  if (keyword) {
    const matches = getVisibleProducts().filter((p) =>
      p.title.toLowerCase().includes(keyword)
    );
    if (matches.length > 0) {
      const pick = matches[hashSlug(guide.slug) % matches.length];
      if (pick.image) {
        return {
          src: pick.image,
          alt: pick.title || guide.title,
          width: 200,
          height: 200,
        };
      }
    }
  }

  return null;
}
