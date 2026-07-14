import { ImageResponse } from "next/og";
import { curatedProducts } from "@/data/curated-products";
import { parseProductSlug } from "@/lib/product-url";
import { productOgElement } from "@/components/og/product-og";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { id } = parseProductSlug(slug);
  const product = id ? curatedProducts.find((p) => p.id === id) : undefined;
  if (!product) {
    return new Response("Not found", { status: 404 });
  }

  return new ImageResponse(productOgElement(product), { ...size });
}
