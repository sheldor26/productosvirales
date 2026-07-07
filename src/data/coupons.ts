import type { Coupon } from "@/lib/types";

export const activeCoupons: Coupon[] = [
  {
    code: "LLEGO77",
    discountAmount: 20000,
    minPurchase: 250000,
    validUntil: "2026-07-07T23:59:00-03:00",
    active: true,
  },
  {
    // Cupón "de la tarde" 07-jul: activo de 17:00 a 23:59.
    code: "SUBITEAL77",
    discountAmount: 35000,
    minPurchase: 500000,
    validUntil: "2026-07-07T23:59:00-03:00",
    active: true,
  },
];
