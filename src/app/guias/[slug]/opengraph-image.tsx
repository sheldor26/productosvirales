import { ImageResponse } from "next/og";
import { findGuideByPath } from "@/data/guides";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = findGuideByPath([slug]);
  if (!guide) {
    return new Response("Not found", { status: 404 });
  }

  const title = guide.ogTitle || guide.title;

  // Si la guía define una foto de producto, la componemos sobre el fondo de marca.
  if (guide.ogImage) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "56px",
            width: "100%",
            height: "100%",
            padding: "60px",
            background: "linear-gradient(135deg, #f97316 0%, #ec4899 100%)",
            fontFamily: "sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "440px",
              height: "510px",
              flexShrink: 0,
              padding: "32px",
              background: "#ffffff",
              borderRadius: "28px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={guide.ogImage}
              width={376}
              height={446}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              alt=""
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, color: "white" }}>
            <div style={{ fontSize: 30, opacity: 0.9, fontWeight: 600, marginBottom: "24px" }}>
              ProductosVirales.com.ar
            </div>
            <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.1, display: "flex" }}>
              {title}
            </div>
            <div style={{ display: "flex", fontSize: 26, opacity: 0.9, marginTop: "28px" }}>
              {`Guía actualizada · ${guide.updatedDate}`}
            </div>
          </div>
        </div>
      ),
      { ...size }
    );
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
        <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1, display: "flex" }}>
          {title}
        </div>
        <div style={{ display: "flex", fontSize: 28, opacity: 0.9 }}>
          {`Guía actualizada · ${guide.updatedDate}`}
        </div>
      </div>
    ),
    { ...size }
  );
}
