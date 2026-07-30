import { Skeleton, ProductCardSkeleton } from "@/components/ui/Skeleton";

// Next.js App Router usa este archivo automáticamente como fallback de
// Suspense mientras se resuelve la página de categoría (navegación desde el
// dropdown del Header, las CategoryTabs o un link directo). Sin esto, la
// navegación se sentía "trabada" un instante entre el click y el render real.
export default function CategoriaLoading() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-5 md:py-8 space-y-8">
      <div className="rounded-[var(--radius-card)] p-6 md:p-10 bg-[var(--bg-secondary)]">
        <Skeleton className="h-8 w-2/3 max-w-[420px]" />
        <Skeleton className="h-4 w-1/2 max-w-[320px] mt-3" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
