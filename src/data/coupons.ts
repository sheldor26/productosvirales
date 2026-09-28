import type { Coupon } from "@/lib/types";

export const activeCoupons: Coupon[] = [
  {
    // Monto fijo pese al nombre "REGALO10OFF": no es porcentual, son
    // $15.000 planos desde $150.000 de compra (igual que MELI10OFF).
    //
    // El mensaje de MELI no trajo vigencia esta vez: ni horario de inicio
    // ni de fin. Va sin `validFrom` y vence hoy 23:59, que es como
    // vinieron todos los cupones hasta ahora. Si en realidad dura más,
    // se extiende la fecha; errar corto es preferible a mostrar un
    // cupón ya vencido.
    code: "REGALO10OFF",
    discountAmount: 15000,
    minPurchase: 150000,
    validUntil: "2026-09-28T23:59:00-03:00",
    active: true,
  },
];
