import type { Guide } from "@/lib/types";
import { guideOgImage } from "@/lib/guide-image";

/**
 * Elemento de la imagen OpenGraph de una guía (1200x630), compartido por las
 * rutas plana (`/guias/[slug]`) y de silo (`/guias/[slug]/[sub]`). Una sola
 * fuente de diseño. Si la guía tiene imagen (propia o del primer producto
 * destacado), la compone sobre el fondo de marca; si no, cae al layout de texto.
 */
export function guideOgElement(guide: Guide) {
  const title = guide.ogTitle || guide.title;
  const image = guideOgImage(guide);

  if (image) {
    return (
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
            src={image}
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
    );
  }

  return (
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
  );
}
