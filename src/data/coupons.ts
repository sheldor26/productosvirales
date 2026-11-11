import type { Coupon } from "@/lib/types";

// Fecha doble 11.11 (miércoles 11/11): los tres escalones del día, más ONCEDELONCE
// que llegó a la tarde y se SUMA (no reemplaza). `getApplicableCoupon` se queda
// con el que más descuento da para cada precio:
//   >= $500.000      -> MELIDOBLEON ($45.000)
//   $250k a $500k    -> 11FECHADOBLE26 ($20.000)
//   $150k a $250k    -> 11X11MELI ($10.000)
//   $100k a $150k    -> ONCEDELONCE ($10.000), solo de 14:30 a 16:45
//   menos de $100k   -> sin badge
//
// ONCEDELONCE tiene la misma plata que 11X11MELI pero una mínima más baja
// ($100.000) y una ventana corta. Entre $150.000 y $250.000 empatan en monto y
// el badge muestra el que figura primero en este arreglo (11X11MELI).
//
// Los tres escalones no dan hora de cierre: se asume 23:59 de hoy, el corte de
// siempre. Si el 11.11 se extiende a mañana, subir validUntil.
export const activeCoupons: Coupon[] = [
  {
    code: "11X11MELI",
    discountAmount: 10000,
    minPurchase: 150000,
    validFrom: "2026-11-11T00:00:00-03:00",
    validUntil: "2026-11-11T23:59:00-03:00",
    active: true,
  },
  {
    code: "11FECHADOBLE26",
    discountAmount: 20000,
    minPurchase: 250000,
    validFrom: "2026-11-11T00:00:00-03:00",
    validUntil: "2026-11-11T23:59:00-03:00",
    active: true,
  },
  {
    code: "MELIDOBLEON",
    discountAmount: 45000,
    minPurchase: 500000,
    validFrom: "2026-11-11T00:00:00-03:00",
    validUntil: "2026-11-11T23:59:00-03:00",
    active: true,
  },
  {
    code: "ONCEDELONCE",
    discountAmount: 10000,
    minPurchase: 100000,
    validFrom: "2026-11-11T14:30:00-03:00",
    validUntil: "2026-11-11T16:45:00-03:00",
    active: true,
  },
];
