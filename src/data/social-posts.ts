import type { SocialPost } from "@/lib/types";

/**
 * Productos posteados hoy en Threads/X/Instagram, para la página /enlaces.
 * Sumar una entrada acá cada vez que se genera un post nuevo para redes —
 * `postedAt` es la hora real de publicación (no la de generación de la
 * imagen), y es lo único que decide si el producto sigue apareciendo: la
 * página filtra sola a las últimas 24hs en cada request, así que entradas
 * viejas no hay que borrarlas a mano, van cayendo solas.
 */
export const socialPosts: SocialPost[] = [
  {
    title: "Cafetera Expresso Cuk By Gadnic 20 Bar",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_743583-MLA113988329118_072026-O.webp",
    affiliateUrl: "https://meli.la/31WJtS1",
    newPrice: "448.899",
    oldPrice: "1.047.399",
    offPct: "57",
    postedAt: "2026-08-13T11:18:27-03:00",
  },
  {
    title: "JBL Boombox 3 Negro",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_955498-MLA99948623081_112025-O.webp",
    affiliateUrl:
      "https://www.mercadolibre.com.ar/jbl-boombox-3-color-negro-negro/p/MLA45498184",
    newPrice: "639.199",
    oldPrice: "1.259.999",
    offPct: "49",
    postedAt: "2026-08-13T08:15:24-03:00",
  },
];
