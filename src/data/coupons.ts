import type { Coupon } from "@/lib/types";

// Tercer día seguido con UN SOLO cupón, y vuelve a mover el piso:
//   >= $150.000     -> MELIMODO ($15.000)
//   menos de $150k  -> sin badge
// Ayer la mínima era $250.000 (MELIPOWER) y hoy baja a $150.000, así que hoy
// entran más productos pero los de ticket alto cobran $10.000 menos que ayer.
// Es lo que dice el mensaje del día, no un bug.
export const activeCoupons: Coupon[] = [
  {
    code: "MELIMODO",
    discountAmount: 15000,
    minPurchase: 150000,
    validFrom: "2026-10-20T09:00:00-03:00",
    validUntil: "2026-10-20T23:59:00-03:00",
    active: true,
  },
];
