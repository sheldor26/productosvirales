import type { Coupon } from "@/lib/types";

// Cyber Monday día 3 (4/11), arrancan 10:00 y vencen 23:59. Los tres escalones
// de siempre, más FAMILIA que llegó a la tarde y se SUMA (no reemplaza):
// `getApplicableCoupon` se queda con el que más descuento da para cada precio:
//   >= $1.000.000    -> CYBERENCENDIDO ($80.000)
//   $500k a $1.000k  -> MELIROMPETODO ($45.000)
//   $250k a $500k    -> CYBERALMAX ($20.000)
//   $80k a $250k     -> FAMILIA ($8.000), solo hasta las 15:30
//   menos de $80k    -> sin badge
//
// FAMILIA es "exclusivo pagando con Mercado Pago" y vence 15:30. El tipo
// Coupon no tiene campo para medio de pago, así que el badge no aclara esa
// condición: se muestra igual que el resto. Si más adelante pasa seguido,
// conviene sumar un campo (ej. `paymentMethod`) y una leyenda en el badge.
export const activeCoupons: Coupon[] = [
  {
    code: "CYBERALMAX",
    discountAmount: 20000,
    minPurchase: 250000,
    validFrom: "2026-11-04T10:00:00-03:00",
    validUntil: "2026-11-04T23:59:00-03:00",
    active: true,
  },
  {
    code: "MELIROMPETODO",
    discountAmount: 45000,
    minPurchase: 500000,
    validFrom: "2026-11-04T10:00:00-03:00",
    validUntil: "2026-11-04T23:59:00-03:00",
    active: true,
  },
  {
    code: "CYBERENCENDIDO",
    discountAmount: 80000,
    minPurchase: 1000000,
    validFrom: "2026-11-04T10:00:00-03:00",
    validUntil: "2026-11-04T23:59:00-03:00",
    active: true,
  },
  {
    code: "FAMILIA",
    discountAmount: 8000,
    minPurchase: 80000,
    validFrom: null,
    validUntil: "2026-11-04T15:30:00-03:00",
    active: true,
  },
];
