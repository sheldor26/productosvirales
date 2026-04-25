import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "viral" | "trending" | "discount" | "hot-deal" | "bestseller" | "summer-pick";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium",
        "rounded-[var(--radius-pill)] text-[10px] leading-none",
        variant === "default" &&
          "bg-[var(--bg-secondary)] text-[var(--text-secondary)] px-2.5 py-1.5",
        variant === "viral" &&
          "bg-[var(--viral-badge)] text-white px-2.5 py-1.5 backdrop-blur-sm",
        variant === "trending" &&
          "bg-[var(--viral-badge)] text-white px-2.5 py-1.5 backdrop-blur-sm",
        variant === "discount" &&
          "bg-[var(--color-discount)] text-white px-2 py-1.5",
        variant === "hot-deal" &&
          "bg-[var(--viral-badge)] text-white px-2.5 py-1.5 backdrop-blur-sm",
        variant === "bestseller" &&
          "bg-[var(--editorial-accent,#A67B3B)] text-white px-2.5 py-1.5 backdrop-blur-sm",
        variant === "summer-pick" &&
          "bg-amber-500 text-white px-2.5 py-1.5 backdrop-blur-sm",
        className
      )}
    >
      {children}
    </span>
  );
}
