import type { Coupon } from "@/lib/types";

// Tres cupones de Cyber Monday, los tres del 2/11, vigentes 00:00 a 23:59 (hoy).
// `getApplicableCoupon` se queda con el que más descuento da para cada precio:
//   $500k a $1.000k  -> CYBERARRANCA ($45.000)
//   $250k a $500k    -> MELICYBER26 ($25.000)
//   menos de $250k   -> sin badge
//
// Verificado en el carrito real 2026-11-02 (regla cupones-activos-chequear-
// al-postear): MELICYBER26 era en realidad $25.000 OFF, no $20.000 como
// decía el mensaje original de ML — corregido acá. NOVIEMBREON ($80.000, min
// $1.000.000) dio "El cupón se agotó" al intentar aplicarlo: se desactiva.
// CYBERARRANCA mostró el tag "¡Por agotarse!" en el mismo chequeo — vigente
// por ahora, pero puede agotarse en cualquier momento del día.
export const activeCoupons: Coupon[] = [
  {
    code: "MELICYBER26",
    discountAmount: 25000,
    minPurchase: 250000,
    validFrom: "2026-11-02T00:00:00-03:00",
    validUntil: "2026-11-02T23:59:00-03:00",
    active: true,
  },
  {
    code: "CYBERARRANCA",
    discountAmount: 45000,
    minPurchase: 500000,
    validFrom: "2026-11-02T00:00:00-03:00",
    validUntil: "2026-11-02T23:59:00-03:00",
    active: true,
  },
  {
    code: "NOVIEMBREON",
    discountAmount: 80000,
    minPurchase: 1000000,
    validFrom: "2026-11-02T00:00:00-03:00",
    validUntil: "2026-11-02T23:59:00-03:00",
    active: false, // agotado, verificado en vivo 2026-11-02
  },
];
