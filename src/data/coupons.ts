import type { Coupon } from "@/lib/types";

// Segundo día seguido con UN SOLO cupón, y esta vez el de ticket alto:
//   >= $250.000     -> MELIPOWER ($25.000)
//   menos de $250k  -> sin badge
// O sea que hoy todo lo que esté abajo de $250.000 no muestra nada, ni
// siquiera lo que entre el 1/10 y el 16/10 llevaba el de $8.000 o $15.000.
// Es lo que dice el mensaje del día, no un bug.
export const activeCoupons: Coupon[] = [
  {
    code: "MELIPOWER",
    discountAmount: 25000,
    minPurchase: 250000,
    validFrom: "2026-10-19T09:00:00-03:00",
    validUntil: "2026-10-19T23:59:00-03:00",
    active: true,
  },
];
