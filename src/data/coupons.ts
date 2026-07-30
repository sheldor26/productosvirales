import type { Coupon } from "@/lib/types";

export const activeCoupons: Coupon[] = [
  {
    code: "ALCOLEMELI",
    discountAmount: 35000,
    minPurchase: 500000,
    validFrom: "2026-07-30T14:00:00-03:00",
    validUntil: "2026-07-30T23:59:00-03:00",
    active: true,
  },
];
