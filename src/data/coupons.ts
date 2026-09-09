import type { Coupon } from "@/lib/types";

// CyberFest: tres cupones vigentes a la vez, escalonados por monto.
// `getApplicableCoupon` se queda con el que más descuento da para cada
// precio, así que las franjas se resuelven solas:
//   >= $1.000.000  -> CYBERHOY ($100.000)
//   $500k a $1M    -> ARRANCOCYBER ($50.000)
//   $200k a $500k  -> FIESTACYBER ($15.000), y solo hasta las 18:00
//
// CYBERHOY y ARRANCOCYBER excluyen "venta directa de marcas" (Apple,
// Samsung, PlayStation, etc.). Eso apunta a las tiendas oficiales de esas
// marcas, no a la marca en sí: el mismo producto vendido por un tercero sí
// entra, y no guardamos qué vendedor es cada publicación. Filtrar por
// nombre de marca daría falsos negativos (esconder el cupón donde sí
// aplica), así que van sin restricción. FIESTACYBER no tiene ni esa
// salvedad: MELI aclara que incluye todas las marcas.
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
    // Segundo relámpago del día (el primero, ESHOYCYBER, venció a las
    // 13:00). Se apaga solo a las 18:00 y ahí los productos de $200k a
    // $500k se quedan sin cupón, que es lo correcto.
    code: "FIESTACYBER",
    discountAmount: 15000,
    minPurchase: 200000,
    validFrom: "2026-09-09T14:00:00-03:00",
    validUntil: "2026-09-09T18:00:00-03:00",
    active: true,
  },
];
