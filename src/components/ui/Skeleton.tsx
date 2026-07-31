import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-[var(--border)] rounded-[var(--radius-badge)]",
        className
      )}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-[var(--radius-card)] overflow-hidden border border-[var(--border)]">
      <Skeleton className="aspect-[10/9] rounded-none" />
      <div className="p-3 space-y-2.5">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/** Fallback de Suspense compartido por las dos rutas de guía (plana y en
 * silo): breadcrumb, kicker, título de 2 líneas, standfirst y unas líneas de
 * cuerpo, para que la navegación a una guía no se sienta trabada mientras
 * Next resuelve la página. Es el activo de tráfico más importante del sitio
 * (guías = SEO), así que la sensación de velocidad acá importa mucho. */
export function GuideLoadingSkeleton() {
  return (
    <div className="max-w-[720px] mx-auto px-4 md:px-6 py-8 md:py-12">
      <Skeleton className="h-3 w-1/3 max-w-[220px] mb-6" />
      <Skeleton className="h-3 w-24 mb-4" />
      <Skeleton className="h-9 w-full mb-2" />
      <Skeleton className="h-9 w-3/4 mb-5" />
      <Skeleton className="h-5 w-full max-w-[520px] mb-8" />
      <Skeleton className="aspect-video w-full rounded-[var(--radius-card)] mb-8" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
