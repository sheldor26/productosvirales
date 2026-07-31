import { Skeleton, ProductCardSkeleton } from "@/components/ui/Skeleton";

// Mismo patrón que /categoria/[slug]/loading.tsx: fallback de Suspense
// mientras se resuelve /trending (link directo desde el Header/nav).
export default function TrendingLoading() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-5 md:py-8 space-y-8">
      <Skeleton className="h-8 w-1/2 max-w-[360px]" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
