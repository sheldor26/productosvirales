import type { Guide } from "@/lib/types";

export function getGuideThumbnail(guide: Guide): {
  src: string;
  alt: string;
  width: number;
  height: number;
} | null {
  const firstImage = guide.sections.find((s) => s.type === "image");
  if (!firstImage?.src) return null;
  return {
    src: firstImage.src,
    alt: firstImage.alt || firstImage.caption || guide.title,
    width: firstImage.width || 200,
    height: firstImage.height || 200,
  };
}
