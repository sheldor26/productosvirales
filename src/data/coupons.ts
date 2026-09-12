import type { Coupon } from "@/lib/types";

export const activeCoupons: Coupon[] = [
  {
    // Site-wide y monto fijo: sin `categories`, así que también aparece
    // en /enlaces. Los destacados de climatización del mensaje son
    // sugerencias de qué recomendar, no una restricción del cupón.
    code: "CYBERBOOM",
    discountAmount: 15000,
    minPurchase: 200000,
    validFrom: "2026-09-12T09:00:00-03:00",
    validUntil: "2026-09-12T23:59:00-03:00",
    active: true,
  },
];
