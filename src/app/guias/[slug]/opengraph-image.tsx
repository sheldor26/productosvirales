import { ImageResponse } from "next/og";
import { getPublishedGuides } from "@/data/guides";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: { slug: string };
}) {
  const guide = getPublishedGuides().find((g) => g.slug === params.slug);
  if (!guide) {
    return new Response("Not found", { status: 404 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "80px",
          background: "linear-gradient(135deg, #f97316 0%, #ec4899 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 32, opacity: 0.9, fontWeight: 600 }}>
          ProductosVirales.com.ar
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.1,
            display: "flex",
          }}
        >
          {guide.ogTitle || guide.title}
        </div>
        <div style={{ fontSize: 28, opacity: 0.9 }}>
          Guía actualizada · {guide.updatedDate}
        </div>
      </div>
    ),
    { ...size }
  );
}
