import type { Coupon } from "@/lib/types";

export const activeCoupons: Coupon[] = [
  {
    // CyberFest, site-wide y monto fijo: sin `categories`, así que también
    // aparece en /enlaces.
    code: "CYBERMAX",
    discountAmount: 15000,
    minPurchase: 200000,
    validFrom: "2026-09-06T10:00:00-03:00",
    validUntil: "2026-09-06T23:59:00-03:00",
    active: true,
  },
];
