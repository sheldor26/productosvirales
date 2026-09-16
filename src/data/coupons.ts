import type { Coupon } from "@/lib/types";

export const activeCoupons: Coupon[] = [
  {
    // Post-CyberFest, el más chico hasta ahora: 5% con tope de $10.000.
    // El tope muerde a partir de $200.000; por debajo el badge muestra el
    // 5% real. El mínimo de $25.000 hace que califique casi todo el
    // catálogo. Site-wide: sin `categories`, aparece también en /enlaces.
    code: "PROBAMELI",
    discountPercent: 5,
    maxDiscount: 10000,
    minPurchase: 25000,
    validFrom: "2026-09-16T09:00:00-03:00",
    validUntil: "2026-09-16T23:59:00-03:00",
    active: true,
  },
];
