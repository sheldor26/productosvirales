import type { Coupon } from "@/lib/types";

export const activeCoupons: Coupon[] = [
  {
    code: "VACACIONES26",
    discountAmount: 20000,
    minPurchase: 250000,
    validFrom: "2026-07-16T09:00:00-03:00",
    validUntil: "2026-07-16T23:59:00-03:00",
    active: true,
  },
];
