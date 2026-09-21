import type { Coupon } from "@/lib/types";

export const activeCoupons: Coupon[] = [
  {
    // Cupón de la tarde: arranca 16:00. El tope de $10.000 muerde a partir
    // de $100.000; por debajo el badge muestra el 10% real. Con mínimo de
    // $30.000 califica casi todo el catálogo.
    //
    // MELI dice "Incluye productos 1P" (los que vende Mercado Libre en
    // forma directa, no "un solo pago"). No guardamos el vendedor de cada
    // publicación, así que va sin restricción — mismo criterio que
    // MELIMASYA el 18/9.
    code: "HOLAPLUS2",
    discountPercent: 10,
    maxDiscount: 10000,
    minPurchase: 30000,
    validFrom: "2026-09-21T16:00:00-03:00",
    validUntil: "2026-09-21T23:59:00-03:00",
    active: true,
  },
];
