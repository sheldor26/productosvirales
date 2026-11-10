import type { Coupon } from "@/lib/types";

// Previa del Doble 11.11, martes 10/11: tres escalones nuevos, mas chicos que los del Cyber Monday.
// Se sacan los cupones vencidos del 9/11.
// `getApplicableCoupon` se queda con el que mas descuento da para cada precio:
//   >= $500.000      -> MELIONCE ($45.000)
//   $250k a $500k    -> DOBLECHANCE11 ($20.000)
//   $150k a $250k    -> 1111ACTIVO ($10.000)
//   menos de $150k   -> sin badge
// Vigencia: el mensaje dice "desde las 00 Hs ya van a estar activos" y no da hora de cierre;
// se asume hoy 00:00 a 23:59 (regla del runbook: el badge se baja de mas antes que prometer de mas).
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
