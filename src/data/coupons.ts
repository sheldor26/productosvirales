import type { Coupon } from "@/lib/types";

export const activeCoupons: Coupon[] = [
  {
    // Acotado a productos 1P (los que vende Mercado Libre en forma
    // directa). No guardamos el vendedor de cada publicación, así que va
    // sin restricción — mismo criterio que MELIMASYA y HOLAPLUS2.
    code: "SPRING10",
    discountAmount: 15000,
    minPurchase: 150000,
    validFrom: "2026-09-22T09:00:00-03:00",
    validUntil: "2026-09-22T23:59:00-03:00",
    active: true,
  },
];
