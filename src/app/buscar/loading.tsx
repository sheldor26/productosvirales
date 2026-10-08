import { Skeleton, ProductCardSkeleton } from "@/components/ui/Skeleton";

// `/buscar` lee `searchParams` (`await searchParams` en page.tsx), lo que la
// vuelve dinámica en Next 16: sin este fallback, el salto desde el buscador
// del Header (router.push a /buscar?q=...) se siente trabado un instante en
// redes lentas, justo después de la acción con más intención del sitio.
export default function BuscarLoading() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-5 md:py-8 space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-8 w-2/3 max-w-[420px]" />
        <Skeleton className="h-10 w-full rounded-[var(--radius-pill)]" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-[var(--radius-pill)]" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
