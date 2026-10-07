"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

const THEME_COLORS: Record<string, string> = {
  light: "#ffffff",
  dark: "#0c0c18",
};

/** Mantiene <meta name="theme-color"> sincronizado con el tema REAL
 * (data-theme), no con prefers-color-scheme del sistema: el sitio no sigue
 * al sistema operativo (enableSystem={false} en ThemeProvider), así que un
 * theme-color estático atado a esa media query mentiría para alguien con el
 * celular en modo oscuro pero el sitio cargado en claro (el caso por
 * defecto). El valor base en layout.tsx ya cubre ese default; esto solo
 * corrige en caliente cuando la persona togglea el tema a mano. */
export function ThemeColorSync() {
  const { theme } = useTheme();

  useEffect(() => {
    const color = THEME_COLORS[theme ?? "light"] ?? THEME_COLORS.light;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", color);
  }, [theme]);

  return null;
}
