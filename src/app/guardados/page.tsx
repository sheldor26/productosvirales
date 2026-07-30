import type { Metadata } from "next";
import { SavedProductsView } from "@/components/products/SavedProductsView";

// Contenido 100% personal (localStorage del visitante): no hay nada genérico
// para indexar acá, así que queda fuera del índice de Google.
export const metadata: Metadata = {
  title: "Tus guardados",
  description: "Los productos que guardaste para comparar o decidir más tarde.",
  robots: { index: false, follow: true },
};

export default function GuardadosPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-5 md:py-8 space-y-6">
      <div>
        <h1
          className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Tus guardados
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Se guardan en este navegador, sin necesidad de cuenta. Si cambiás de dispositivo o
          borrás los datos del sitio, se pierden.
        </p>
      </div>
      <SavedProductsView />
    </div>
  );
}
