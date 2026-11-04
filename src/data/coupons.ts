import type { Coupon } from "@/lib/types";

// Cyber Monday día 3 (4/11), arrancan 10:00 y vencen 23:59. Los tres escalones
// de siempre, más cupones que fueron llegando durante la tarde y se SUMAN (no
// reemplazan): `getApplicableCoupon` se queda con el que más descuento da para
// cada precio:
//   >= $1.000.000    -> CYBERENCENDIDO ($80.000)
//   $500k a $1.000k  -> MELIROMPETODO ($45.000)
//   $250k a $500k    -> CYBERALMAX ($20.000)
//   $80k a $250k     -> FAMILIA ($8.000) hasta las 15:30; después y hasta las
//                       23:59, CYBERMONDAY / CYBERLUNES ($7.500)
//   menos de $80k    -> sin badge
//
// CYBERMONDAY y CYBERLUNES son idénticos (mismo monto y mínima, otro código):
// van los dos porque Juan los pasó así. Mientras FAMILIA esté vigente gana ella
// por $500; con empate, el badge muestra el que figura primero en este arreglo.
//
// FAMILIA es "exclusivo pagando con Mercado Pago". El tipo Coupon no tiene
// campo para medio de pago, así que el badge no aclara esa condición. Si pasa
// seguido, conviene sumar un campo (ej. `paymentMethod`) y una leyenda.
//
// CYBERMONDAY y CYBERLUNES no traen vigencia en el mensaje: se asume hoy 23:59.
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
  {
    code: "CYBERMONDAY",
    discountAmount: 7500,
    minPurchase: 80000,
    validFrom: null,
    validUntil: "2026-11-04T23:59:00-03:00",
    active: true,
  },
  {
    code: "CYBERLUNES",
    discountAmount: 7500,
    minPurchase: 80000,
    validFrom: null,
    validUntil: "2026-11-04T23:59:00-03:00",
    active: true,
  },
];
