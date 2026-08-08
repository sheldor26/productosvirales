import type { Coupon } from "@/lib/types";

export const activeCoupons: Coupon[] = [
  {
    code: "HOYJUEGA8",
    discountAmount: 20000,
    minPurchase: 250000,
    validFrom: "2026-08-08T09:00:00-03:00",
    validUntil: "2026-08-08T23:59:00-03:00",
    active: true,
  },
];
