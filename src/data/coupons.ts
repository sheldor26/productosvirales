import type { Coupon } from "@/lib/types";

// Un solo cupón, y el piso vuelve a subir al tramo alto:
//   >= $250.000     -> MELIBONUS ($25.000)
//   menos de $250k  -> sin badge
// Ayer la mínima era $80.000 (MELIFLASH) y hoy sube a $250.000, así que hoy
// entran bastantes menos productos pero el de ticket alto cobra el triple.
// El mensaje arranca con "ya les avisé hace un ratito": si llegó otro cupón
// antes que este el mismo día, hay que sumarlo acá como segunda entrada.
export const activeCoupons: Coupon[] = [
  {
    code: "MELIBONUS",
    discountAmount: 25000,
    minPurchase: 250000,
    validFrom: "2026-10-22T09:00:00-03:00",
    validUntil: "2026-10-22T23:59:00-03:00",
    active: true,
  },
];
