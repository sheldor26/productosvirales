import type { Coupon } from "@/lib/types";

export const activeCoupons: Coupon[] = [
  {
    // "Horas Locas" de la mañana: se apaga solo a las 13:00. El tope de
    // $10.000 muerde a partir de $125.000; por debajo el badge muestra el
    // 8% real. Con mínimo de $30.000 califica casi todo el catálogo.
    //
    // MELI dice "Incluye: Productos 1P" (los que vende Mercado Libre en
    // forma directa). No guardamos el vendedor de cada publicación, así
    // que no hay forma de filtrar por eso — mismo criterio que con la
    // exclusión de tiendas oficiales de ARRANCOCYBER: va sin restricción.
    code: "MELIMASYA",
    discountPercent: 8,
    maxDiscount: 10000,
    minPurchase: 30000,
    validFrom: "2026-09-18T09:00:00-03:00",
    validUntil: "2026-09-18T13:00:00-03:00",
    active: true,
  },
];
