import type { Coupon } from "@/lib/types";

// Previa del doble 11.11 (martes 10/11): tres escalones, uno más chico que los
// del Cyber. Se sacan los cupones vencidos del 9/11.
// `getApplicableCoupon` se queda con el que más descuento da para cada precio:
//   >= $500.000      -> MELIONCE ($45.000)
//   $250k a $500k    -> DOBLECHANCE11 ($20.000)
//   $150k a $250k    -> 1111ACTIVO ($10.000)
//   menos de $150k   -> sin badge
//
// Ojo con la fecha: el mensaje dice "arranca la previa" y "desde las 00 hs ya
// van a estar activos", sin aclarar si es el 10/11 o el 11/11. Se asumió hoy
// (10/11) porque la previa es el día anterior al doble 11. Tampoco trae hora de
// cierre: se asume 23:59. Si en realidad siguen mañana, extender validUntil.
export const activeCoupons: Coupon[] = [
  {
    code: "1111ACTIVO",
    discountAmount: 10000,
    minPurchase: 150000,
    validFrom: "2026-11-10T00:00:00-03:00",
    validUntil: "2026-11-10T23:59:00-03:00",
    active: true,
  },
  {
    code: "DOBLECHANCE11",
    discountAmount: 20000,
    minPurchase: 250000,
    validFrom: "2026-11-10T00:00:00-03:00",
    validUntil: "2026-11-10T23:59:00-03:00",
    active: true,
  },
  {
    code: "MELIONCE",
    discountAmount: 45000,
    minPurchase: 500000,
    validFrom: "2026-11-10T00:00:00-03:00",
    validUntil: "2026-11-10T23:59:00-03:00",
    active: true,
  },
];
