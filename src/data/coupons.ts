import type { Coupon } from "@/lib/types";

export const activeCoupons: Coupon[] = [
  {
    // Cupón de primavera, de la tarde: arranca 12:00. Site-wide y monto
    // fijo, sin `categories`, así que también aparece en /enlaces.
    code: "PRIMAVERA10",
    discountAmount: 8000,
    minPurchase: 80000,
    validFrom: "2026-09-20T12:00:00-03:00",
    validUntil: "2026-09-20T23:59:00-03:00",
    active: true,
  },
];
