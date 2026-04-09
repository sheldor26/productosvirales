"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors duration-200 cursor-pointer",
          "rounded-[var(--radius-pill)]",
          variant === "primary" &&
            "bg-[var(--cta-bg)] text-[var(--cta-text)] hover:bg-[var(--cta-hover)]",
          variant === "secondary" &&
            "bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--border)]",
          variant === "ghost" &&
            "bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]",
          size === "sm" && "px-3 py-1.5 text-xs gap-1.5",
          size === "md" && "px-5 py-2.5 text-sm gap-2",
          size === "lg" && "px-7 py-3 text-base gap-2.5",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
