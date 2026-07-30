import { Skeleton } from "@/components/ui/Skeleton";

// Fallback de Suspense de Next.js mientras se resuelve la ficha de producto.
// Es la página que más convierte (CTA de afiliado), así que la sensación de
// velocidad acá importa más que en cualquier otra ruta del sitio.
export default function ProductoLoading() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-5 md:py-8 space-y-10">
      <Skeleton className="h-4 w-1/3 max-w-[300px]" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Skeleton className="aspect-square rounded-[var(--radius-card)]" />
        <div className="space-y-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-full" />
          <Skeleton className="h-7 w-2/3" />
          <Skeleton className="h-9 w-40 mt-2" />
          <Skeleton className="h-12 w-full max-w-[280px] rounded-full mt-4" />
        </div>
      </div>
    </div>
  );
}
