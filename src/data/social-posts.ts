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
  {
    title: "Harman Kardon Aura Studio 4 Parlante Bluetooth",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_895512-MLA100039550147_122025-O.webp",
    affiliateUrl: "https://meli.la/2d6Bi3h",
    newPrice: "415.479",
    oldPrice: "699.999",
    offPct: "40",
    postedAt: "2026-08-14T08:19:30-03:00",
  },
  {
    title: "Moto Cross a Bateria Niños 6V con Luces y Sonido",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_878421-MLA99450345866_112025-O.webp",
    affiliateUrl: "https://meli.la/25hyabT",
    newPrice: "294.999",
    oldPrice: "389.564",
    offPct: "24",
    postedAt: "2026-08-14T11:50:08-03:00",
  },
  {
    title: "Bicicleta Mtb Overtech R29 Q3 Con Suspension",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_738744-MLA114427070924_082026-O.webp",
    affiliateUrl: "https://meli.la/2xJ3czS",
    newPrice: "207.589",
    oldPrice: "449.999",
    offPct: "53",
    postedAt: "2026-08-14T11:50:08-03:00",
  },
  {
    title: "Cama Elastica 1,8 metros Saltarina con Red Protectora",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_636995-MLA109768878311_032026-O.webp",
    affiliateUrl: "https://meli.la/2eocPfM",
    newPrice: "242.499",
    oldPrice: "359.999",
    offPct: "32",
    postedAt: "2026-08-14T11:50:08-03:00",
  },
  {
    title: "Bloques Magneticos Para Armar Estilo Minecraft 154 Piezas",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_754294-MLA89909183767_082025-O.webp",
    affiliateUrl: "https://meli.la/1qRyKmT",
    newPrice: "50.160",
    oldPrice: "114.000",
    offPct: "56",
    postedAt: "2026-08-14T11:50:08-03:00",
  },
  {
    title: "Juego De Mesa Monopoly Classic Tokens De Metal Hasbro",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_619179-MLA108762963803_032026-O.webp",
    affiliateUrl: "https://meli.la/1uJvSG1",
    newPrice: "54.330",
    oldPrice: "109.990",
    offPct: "50",
    postedAt: "2026-08-14T11:50:08-03:00",
  },
  {
    title: "Auto A Bateria Infantil Blanco Wmt-918",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_637056-MLA95832811397_102025-O.webp",
    affiliateUrl: "https://meli.la/2JYtsPc",
    newPrice: "261.790",
    oldPrice: "499.990",
    offPct: "47",
    postedAt: "2026-08-14T11:50:08-03:00",
  },
  {
    title: "Sony PlayStation DualSense Joystick Inalambrico PS5",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_759059-MLA99508283678_112025-O.webp",
    affiliateUrl: "https://meli.la/2eXut3S",
    newPrice: "109.999",
    oldPrice: "139.999",
    offPct: "21",
    postedAt: "2026-08-14T18:44:29-03:00",
  },
  {
    title: "Auriculares JBL Quantum 100M2 Headset Gamer",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_964214-MLA99991757979_112025-O.webp",
    affiliateUrl: "https://meli.la/1BjK1z9",
    newPrice: "73.759",
    oldPrice: "97.999",
    offPct: "24",
    postedAt: "2026-08-15T08:00:22-03:00",
  },
  {
    title: "Nebulizador Mesh San-Up VitaAir 8ml",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_947381-MLA115018617495_072026-O.webp",
    affiliateUrl: "https://meli.la/1PkWyk6",
    newPrice: "66.419",
    oldPrice: "155.199",
    offPct: "57",
    postedAt: "2026-08-15T11:22:28-03:00",
  },
  {
    title: "Lego Classic Caja De Ladrillos Creativos Mediana 484 Piezas",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_711582-MLA100016729245_122025-O.webp",
    affiliateUrl: "https://meli.la/2AUNzC1",
    newPrice: "116.390",
    oldPrice: "229.990",
    offPct: "49",
    postedAt: "2026-08-15T19:53:04-03:00",
  },
  {
    title: "Pista Hot Wheels Multi-Loop Race Off",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_622203-MLA99948530295_112025-O.webp",
    affiliateUrl: "https://meli.la/1k6yYzY",
    newPrice: "96.990",
    oldPrice: "179.990",
    offPct: "46",
    postedAt: "2026-08-15T19:53:04-03:00",
  },
  {
    title: "Casco Bicicleta Dakota Regulable Liviano Con Visera",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_621113-MLA115664225985_082026-O.webp",
    affiliateUrl: "https://meli.la/2LqxHEx",
    newPrice: "21.412",
    oldPrice: "32.990",
    offPct: "35",
    postedAt: "2026-08-16T12:27:24-03:00",
  },
  {
    title: "Blocky Pixeland La Invasion 263 Piezas",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_865832-MLA99951941953_112025-O.webp",
    affiliateUrl: "https://meli.la/2dZwPLm",
    newPrice: "57.000",
    oldPrice: "79.400",
    offPct: "28",
    postedAt: "2026-08-16T12:27:24-03:00",
  },
  {
    title: "Set de 2 Camiones Duravit Volcador y Grua",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_977111-MLA96095502293_102025-O.webp",
    affiliateUrl: "https://meli.la/2ieVa2R",
    newPrice: "20.902",
    oldPrice: "26.184",
    offPct: "20",
    postedAt: "2026-08-16T17:34:16-03:00",
  },
  {
    title: "Dylan Blue EDT 200ml Versace para Hombre",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_606364-MLA89551235651_082025-O.webp",
    affiliateUrl: "https://meli.la/1mbLEBv",
    newPrice: "180.119",
    oldPrice: "354.000",
    offPct: "49",
    postedAt: "2026-08-17T10:38:59-03:00",
  },
  {
    title: "Aspiradora Robot Trapeadora Gadnic Navegacion Laser",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_724942-MLA106375069086_022026-O.webp",
    affiliateUrl: "https://meli.la/2ch8hdt",
    newPrice: "272.999",
    oldPrice: "678.749",
    offPct: "59",
    postedAt: "2026-08-17T10:38:59-03:00",
  },
  {
    title: "Maquina Depiladora Care by Gadnic D12",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_738903-MLA97019239613_112025-O.jpg",
    affiliateUrl: "https://meli.la/2BTGCn1",
    newPrice: "73.570",
    oldPrice: "156.799",
    offPct: "53",
    postedAt: "2026-08-18T11:43:29-03:00",
  },
  {
    title: "Humidificador de Ambiente Gadnic HM20B 2.2L",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_2X_959929-MLA91555372060_092025-F.webp",
    affiliateUrl: "https://meli.la/25VU32H",
    newPrice: "71.049",
    oldPrice: "133.349",
    offPct: "46",
    postedAt: "2026-08-18T11:43:29-03:00",
  },
  {
    title: "Teclado HyperX Alloy Core RGB",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_694227-MLA99961920045_112025-F.jpg",
    affiliateUrl: "https://meli.la/12X3kBR",
    newPrice: "78.999",
    oldPrice: "139.999",
    offPct: "43",
    postedAt: "2026-08-18T11:43:29-03:00",
  },
  {
    title: "Samsung Galaxy Buds3 Pro Grafito",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_652688-MLA96099645533_102025-F.jpg",
    affiliateUrl: "https://meli.la/1yLBjSp",
    newPrice: "299.999",
    oldPrice: "399.999",
    offPct: "25",
    postedAt: "2026-08-18T16:42:50-03:00",
  },
  {
    title: "PC Gamer AMD Ryzen 7 5700G 16GB 480GB SSD",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_877130-MLA105315029264_012026-O.webp",
    affiliateUrl: "https://meli.la/23NLQnq",
    newPrice: "743.019",
    oldPrice: "1.284.452",
    offPct: "42",
    postedAt: "2026-08-18T17:09:29-03:00",
  },
  {
    title: "Heladera Conservadora Termolar SUV 20L",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_831093-MLA99997914339_112025-O.webp",
    affiliateUrl: "https://meli.la/2gnBknm",
    newPrice: "43.369",
    oldPrice: "69.950",
    offPct: "38",
    postedAt: "2026-08-18T19:58:35-03:00",
  },
  {
    title: "Heladera No Frost Whirlpool WRM42HB 386L",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_769731-MLA89993556970_082025-O.webp",
    affiliateUrl: "https://meli.la/1xiSyY8",
    newPrice: "950.899",
    oldPrice: "1.099.999",
    offPct: "13",
    postedAt: "2026-08-18T19:58:35-03:00",
  },
  {
    title: "Monitor Gamer Gigabyte GS34WQC 34 Curvo UWQHD",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_699006-MLA99442569860_112025-F.jpg",
    affiliateUrl: "https://meli.la/2bxB7q3",
    newPrice: "919.559",
    oldPrice: "1.099.999",
    offPct: "16",
    postedAt: "2026-08-19T08:23:17-03:00",
  },
];
