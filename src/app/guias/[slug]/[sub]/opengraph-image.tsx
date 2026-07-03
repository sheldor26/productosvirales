import { ImageResponse } from "next/og";
import { findGuideByPath } from "@/data/guides";
import { guideOgElement } from "@/components/og/guide-og";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string; sub: string }>;
}) {
  const { slug, sub } = await params;
  const guide = findGuideByPath([slug, sub]);
  if (!guide) {
    return new Response("Not found", { status: 404 });
  }

  return new ImageResponse(guideOgElement(guide), { ...size });
}
