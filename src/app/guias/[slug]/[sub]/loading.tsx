import { GuideLoadingSkeleton } from "@/components/ui/Skeleton";

// Mismo fallback que /guias/[slug]/loading.tsx, para las guías en silo
// (/guias/{silo}/{slug}).
export default function GuiaSiloLoading() {
  return <GuideLoadingSkeleton />;
}
