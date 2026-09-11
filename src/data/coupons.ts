import type { Coupon } from "@/lib/types";

export const activeCoupons: Coupon[] = [
  {
    // El tope de $20.000 muerde a partir de $200.000; entre $100.000 y
    // $200.000 el descuento real es el 10% del precio.
    //
    // MELI lo acota a las landings del CyberFest (productos con precio
    // tachado). Eso no es una categoría sino un contenedor promocional de
    // MELI, y no guardamos qué productos están adentro, así que va sin
    // `categories` — mismo criterio que CYBERKILLER el 7/9. En plena
    // semana de CyberFest esas landings son enormes, así que la
    // superposición con el catálogo es alta, pero no es total.
    code: "MODOFEST",
    discountPercent: 10,
    maxDiscount: 20000,
    minPurchase: 100000,
    validFrom: "2026-09-11T09:00:00-03:00",
    validUntil: "2026-09-11T23:59:00-03:00",
    active: true,
  },
];
