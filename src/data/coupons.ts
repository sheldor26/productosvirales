import type { Coupon } from "@/lib/types";

// Arranque del CyberFest: tres cupones vigentes a la vez, escalonados por
// monto. `getApplicableCoupon` se queda con el que más descuento da para
// cada precio, así que las franjas se resuelven solas:
//   >= $1.000.000  -> CYBERHOY ($100.000)
//   $500k a $1M    -> ARRANCOCYBER ($50.000)
//   $250k a $500k  -> ESHOYCYBER ($20.000), y solo hasta las 13:00
//
// ARRANCOCYBER y CYBERHOY excluyen "venta directa de marcas" (Apple,
// Samsung, PlayStation, etc.). Eso apunta a las tiendas oficiales de esas
// marcas, no a la marca en sí: el mismo monitor vendido por un tercero sí
// entra, y no guardamos qué vendedor es cada publicación. Filtrar por
// nombre de marca daría falsos negativos (esconder el cupón donde sí
// aplica), así que van sin restricción. En el catálogo son 3 productos
// los que podrían quedar afuera, de 67 en esas dos franjas.
export const activeCoupons: Coupon[] = [
  {
    code: "CYBERHOY",
    discountAmount: 100000,
    minPurchase: 1000000,
    validFrom: "2026-09-09T09:00:00-03:00",
    validUntil: "2026-09-09T23:59:00-03:00",
    active: true,
  },
  {
    code: "ARRANCOCYBER",
    discountAmount: 50000,
    minPurchase: 500000,
    validFrom: "2026-09-09T09:00:00-03:00",
    validUntil: "2026-09-09T23:59:00-03:00",
    active: true,
  },
  {
    // Relámpago: se apaga solo a las 13:00. A partir de ahí los productos
    // de $250k a $500k se quedan sin cupón, que es lo correcto.
    code: "ESHOYCYBER",
    discountAmount: 20000,
    minPurchase: 250000,
    validFrom: "2026-09-09T09:00:00-03:00",
    validUntil: "2026-09-09T13:00:00-03:00",
    active: true,
  },
];
