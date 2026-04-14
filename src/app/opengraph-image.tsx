import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ProductosVirales — Lo más trending de MercadoLibre";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f97316 0%, #ec4899 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: "-0.03em" }}>
          ProductosVirales
        </div>
        <div style={{ fontSize: 36, marginTop: 16, opacity: 0.95 }}>
          Lo más trending de MercadoLibre
        </div>
      </div>
    ),
    size
  );
}
