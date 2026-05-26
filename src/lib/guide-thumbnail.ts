import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";
import type { Guide, GuideSection } from "@/lib/types";

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

export function getGuideThumbnail(guide: Guide): {
  src: string;
  alt: string;
  width: number;
  height: number;
} | null {
  const firstImage = guide.sections.find(isUsableImageSection);
  if (!firstImage?.src) return null;
  return {
    src: firstImage.src,
    alt: firstImage.alt || firstImage.caption || guide.title,
    width: firstImage.width || 200,
    height: firstImage.height || 200,
  };
}
