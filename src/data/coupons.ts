import type { Coupon } from "@/lib/types";

export const activeCoupons: Coupon[] = [
  {
    // Cupón de la tarde: arranca 12:00. Site-wide y monto fijo, sin
    // `categories`, así que también aparece en /enlaces.
    code: "PALPITANDO10",
    discountAmount: 15000,
    minPurchase: 150000,
    validFrom: "2026-09-19T12:00:00-03:00",
    validUntil: "2026-09-19T23:59:00-03:00",
    active: true,
  },
];
