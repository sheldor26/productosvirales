import type { Coupon } from "@/lib/types";

export const activeCoupons: Coupon[] = [
  {
    // Cyber Fest: primer cupón porcentual, y el primero limitado por
    // categoría. El tope de $100.000 recién muerde a partir de $1.000.000
    // (10% de ese precio); por debajo, el descuento real es el 10%.
    code: "CYBERPLAY",
    discountPercent: 10,
    maxDiscount: 100000,
    minPurchase: 200000,
    categories: ["tech", "gaming"],
    validFrom: "2026-09-01T09:00:00-03:00",
    validUntil: "2026-09-01T23:59:00-03:00",
    active: true,
  },
];
