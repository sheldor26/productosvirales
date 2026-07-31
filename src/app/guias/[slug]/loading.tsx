import { GuideLoadingSkeleton } from "@/components/ui/Skeleton";

// Next.js App Router usa este archivo automáticamente como fallback de
// Suspense mientras se resuelve la guía. Antes de esto no existía ningún
// loading.tsx para guías (el activo de tráfico más importante del sitio),
// así que la navegación desde un link quedaba "trabada" sin feedback.
export default function GuiaLoading() {
  return <GuideLoadingSkeleton />;
}
