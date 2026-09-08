import type { Coupon } from "@/lib/types";

export const activeCoupons: Coupon[] = [
  {
    // Site-wide y monto fijo: sin `categories`, así que también aparece
    // en /enlaces.
    code: "YALLEGACYBER",
    discountAmount: 15000,
    minPurchase: 200000,
    validFrom: "2026-09-08T09:00:00-03:00",
    validUntil: "2026-09-08T23:59:00-03:00",
    active: true,
  },
];
