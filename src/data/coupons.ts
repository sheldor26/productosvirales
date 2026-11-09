import type { Coupon } from "@/lib/types";

// Cyber Monday del lunes 9/11, ultimo dia. Corrección de las 09:45: Juan pasó "los cupones que
// funcionan son" ULTIMACHANCE11 y CHAUCYBER11, mismos montos y mínimas que ULTIMACHANCE y CHAUCYBER
// de la mañana, así que se reemplazan los códigos. YATERMINA ($20.000 desde $250.000) NO vino en
// este mensaje: se saca hasta que Juan confirme que funciona (otras cuentas lo mostraron activo,
// pero la regla es no prometer un cupón que el carrito pueda rechazar).
// `getApplicableCoupon` se queda con el que mas descuento da para cada precio:
//   >= $1.000.000    -> ULTIMACHANCE11 ($80.000)
//   $500k a $1.000k  -> CHAUCYBER11 ($45.000)
//   menos de $500k   -> sin badge
// Vigencia: el mensaje no dice nada, se asume hoy hasta las 23:59 (regla del runbook).
export const activeCoupons: Coupon[] = [
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
