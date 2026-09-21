"use client";

import { useEffect } from "react";
import { useRecentlyViewed } from "@/lib/use-recently-viewed";

interface RecentlyViewedRecorderProps {
  productId: string;
}

/** Registra la ficha en "visto recientemente" (localStorage) al montar. No
 * renderiza nada — es una isla cliente invisible dentro de ProductDetail
 * (server component), reemplaza el useEffect que antes vivía ahí. */
export function RecentlyViewedRecorder({ productId }: RecentlyViewedRecorderProps) {
  const { record } = useRecentlyViewed();
  useEffect(() => {
    record(productId);
  }, [productId, record]);

  return null;
}
