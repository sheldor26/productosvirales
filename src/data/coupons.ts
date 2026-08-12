import type { Coupon } from "@/lib/types";

export const activeCoupons: Coupon[] = [
  {
    code: "REGALON",
    discountAmount: 35000,
    minPurchase: 500000,
    validFrom: "2026-08-12T09:00:00-03:00",
    validUntil: "2026-08-12T23:59:00-03:00",
    active: true,
  },
];
