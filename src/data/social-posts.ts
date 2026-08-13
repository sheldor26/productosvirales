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
    affiliateUrl: "https://meli.la/1ZwU3v2",
    newPrice: "639.199",
    oldPrice: "1.259.999",
    offPct: "49",
    postedAt: "2026-08-13T08:15:24-03:00",
  },
  {
    title: "Aspiradora Robot Fika Trapeadora Swift",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_688787-MLA107372121884_032026-O.webp",
    affiliateUrl: "https://meli.la/2GH7YcV",
    newPrice: "339.499",
    oldPrice: "750.000",
    offPct: "54",
    postedAt: "2026-08-13T12:21:36-03:00",
  },
  {
    title: "Nintendo Switch OLED + Mario Bros Wonder",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_656472-MLA98119452619_112025-O.webp",
    affiliateUrl: "https://meli.la/27Ky4i7",
    newPrice: "699.999",
    oldPrice: "999.999",
    offPct: "30",
    postedAt: "2026-08-13T12:21:36-03:00",
  },
  {
    title: "Impresora Multifuncional HP Smart Tank 580",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_912590-MLA114382596649_072026-O.webp",
    affiliateUrl: "https://meli.la/2dEcZm3",
    newPrice: "420.421",
    oldPrice: "770.000",
    offPct: "45",
    postedAt: "2026-08-13T14:54:59-03:00",
  },
  {
    title: "Silla Gamer Alpina Ergonómica",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_665062-MLA100000173305_112025-O.webp",
    affiliateUrl: "https://meli.la/1PZmsVB",
    newPrice: "147.052",
    oldPrice: "250.000",
    offPct: "41",
    postedAt: "2026-08-13T14:54:59-03:00",
  },
  {
    title: "Barra de Sonido Gadnic Bluetooth 2.1 Canales Subwoofer",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_845956-MLA110761138734_052026-O.webp",
    affiliateUrl: "https://meli.la/2gC5yLR",
    newPrice: "185.149",
    oldPrice: "399.699",
    offPct: "53",
    postedAt: "2026-08-13T16:38:17-03:00",
  },
  {
    title: "Masajeador Cervical Eléctrico Portatil Femmto",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_965769-MLA110594813506_052026-O.webp",
    affiliateUrl: "https://meli.la/11F4Zws",
    newPrice: "41.999",
    oldPrice: "100.000",
    offPct: "58",
    postedAt: "2026-08-13T16:38:17-03:00",
  },
];
