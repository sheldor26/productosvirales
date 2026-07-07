import type { Coupon } from "@/lib/types";

export const activeCoupons: Coupon[] = [
  {
    code: "LLEGO77",
    discountAmount: 20000,
    minPurchase: 250000,
    validUntil: "2026-07-07T23:59:00-03:00",
    active: true,
  },
];
