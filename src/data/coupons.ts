import type { Coupon } from "@/lib/types";

export const activeCoupons: Coupon[] = [
  {
    // El tope de $30.000 muerde a partir de $300.000; por debajo el
    // descuento real es el 10% del precio.
    //
    // Va sin `categories`: el título habla de "ofertas destacadas", pero
    // el mensaje no nombra ninguna categoría ni landing concreta, a
    // diferencia de CYBERELECTRO. Se toma como site-wide.
    code: "CYBERKILLER",
    discountPercent: 10,
    maxDiscount: 30000,
    minPurchase: 40000,
    validFrom: "2026-09-07T09:00:00-03:00",
    validUntil: "2026-09-07T23:59:00-03:00",
    active: true,
  },
];
