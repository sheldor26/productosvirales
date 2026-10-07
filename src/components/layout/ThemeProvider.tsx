"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeColorSync } from "./ThemeColorSync";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="data-theme" defaultTheme="light" enableSystem={false}>
      <ThemeColorSync />
      {children}
    </NextThemesProvider>
  );
}
