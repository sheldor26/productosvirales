import type { Coupon } from "@/lib/types";

export const activeCoupons: Coupon[] = [
  {
    code: "SIETESIETE",
    discountAmount: 10000,
    minPurchase: 150000,
    validUntil: "2026-07-05T23:59:00-03:00",
    active: true,
  },
];
