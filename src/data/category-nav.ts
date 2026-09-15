import {
  Home,
  ChefHat,
  Smartphone,
  Gamepad2,
  Headphones,
  Music,
  Heart,
  Thermometer,
  HeartPulse,
  Shield,
  Trophy,
  type LucideIcon,
} from "lucide-react";

/** Lista liviana de hubs de categoría para navegación (header, footer, etc.).
 * Deliberadamente NO importa `categories.ts` para no arrastrar los `buyersGuide`
 * (HTML pesado) al bundle del cliente. Solo lo mínimo para linkear los hubs.
 * "viral" se omite a propósito: vive en /trending, ya linkeado como "Trending". */
export interface CategoryNavItem {
  slug: string;
  label: string;
  icon: LucideIcon;
}

export const CATEGORY_NAV: CategoryNavItem[] = [
  { slug: "hogar", label: "Hogar", icon: Home },
  { slug: "cocina", label: "Cocina", icon: ChefHat },
  { slug: "tech", label: "Tech", icon: Smartphone },
  { slug: "gaming", label: "Gaming", icon: Gamepad2 },
  { slug: "audio", label: "Audio", icon: Headphones },
  { slug: "musica", label: "Música", icon: Music },
  { slug: "belleza", label: "Belleza", icon: Heart },
  { slug: "climatizacion", label: "Climatización", icon: Thermometer },
  { slug: "salud-bienestar", label: "Salud y Bienestar", icon: HeartPulse },
  { slug: "seguridad", label: "Seguridad", icon: Shield },
  { slug: "coleccionables", label: "Coleccionables", icon: Trophy },
];
