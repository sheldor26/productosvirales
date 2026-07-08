import type { Coupon } from "@/lib/types";

export const activeCoupons: Coupon[] = [
  {
    code: "PREVACAS",
    discountAmount: 35000,
    minPurchase: 500000,
    validUntil: "2026-07-08T23:59:00-03:00",
    active: true,
  },
];
