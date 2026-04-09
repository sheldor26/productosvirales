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
