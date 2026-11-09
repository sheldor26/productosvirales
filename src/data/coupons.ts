import type { Coupon } from "@/lib/types";

// Cyber Monday del lunes 9/11, ultimo dia. Estan activos DOS juegos de codigos con los mismos
// montos y minimas: los tres originales (YATERMINA, CHAUCYBER, ULTIMACHANCE, del mensaje de
// "recta final" de ML) y los dos con sufijo 11 (CHAUCYBER11, ULTIMACHANCE11, que Juan paso como
// "los que funcionan"). Juan confirmo que los originales siguen activos, asi que se suman, no se
// reemplazan. Primero van los originales: si dos cupones dan el mismo descuento, el badge muestra
// el primero. `getApplicableCoupon` se queda con el que mas descuento da para cada precio:
//   >= $1.000.000    -> ULTIMACHANCE / ULTIMACHANCE11 ($80.000)
//   $500k a $1.000k  -> CHAUCYBER / CHAUCYBER11 ($45.000)
//   $250k a $500k    -> YATERMINA ($20.000)
//   menos de $250k   -> sin badge
// Vigencia: los mensajes no dicen nada, se asume hoy hasta las 23:59 (regla del runbook).
export const activeCoupons: Coupon[] = [
  {
    code: "YATERMINA",
    discountAmount: 20000,
    minPurchase: 250000,
    validFrom: null,
    validUntil: "2026-11-09T23:59:00-03:00",
    active: true,
  },
  {
    code: "CHAUCYBER",
    discountAmount: 45000,
    minPurchase: 500000,
    validFrom: null,
    validUntil: "2026-11-09T23:59:00-03:00",
    active: true,
  },
  {
    code: "ULTIMACHANCE",
    discountAmount: 80000,
    minPurchase: 1000000,
    validFrom: null,
    validUntil: "2026-11-09T23:59:00-03:00",
    active: true,
  },
  {
    code: "CHAUCYBER11",
    discountAmount: 45000,
    minPurchase: 500000,
    validFrom: null,
    validUntil: "2026-11-09T23:59:00-03:00",
    active: true,
  },
  {
    code: "ULTIMACHANCE11",
    discountAmount: 80000,
    minPurchase: 1000000,
    validFrom: null,
    validUntil: "2026-11-09T23:59:00-03:00",
    active: true,
  },
];
