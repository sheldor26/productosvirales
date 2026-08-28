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
    title: "Auriculares Gamer Razer Blackshark V2 X Classic Black",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_640861-MLA99990155459_112025-O.webp",
    affiliateUrl: "https://meli.la/2eMU81J",
    newPrice: "108.675",
    oldPrice: "120.500",
    offPct: "9",
    postedAt: "2026-08-28T18:04:51-03:00",
  },
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
  {
    title: "Balanza Digital Bluetooth Femmto 180kg",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_845343-MLA114064454295_072026-O.webp",
    affiliateUrl: "https://meli.la/2NHBE7F",
    newPrice: "13.774",
    oldPrice: "27.999",
    offPct: "50",
    postedAt: "2026-08-20T08:25:22-03:00",
  },
  {
    title: "Masajeador de Pies Shiatsu San-Up ReflexWave",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_2X_923793-MLA87078278911_072025-F.webp",
    affiliateUrl: "https://meli.la/1UxsxZo",
    newPrice: "209.999",
    oldPrice: "375.999",
    offPct: "44",
    postedAt: "2026-08-20T08:25:22-03:00",
  },
  {
    title: "Smartwatch JD Venecia Sport",
    imageUrl:
      "https://http2.mlstatic.com/D_Q_NP_956541-MLA109309748244_042026-F.webp",
    affiliateUrl: "https://meli.la/18gQkfQ",
    newPrice: "39.999",
    oldPrice: "49.999",
    offPct: "20",
    postedAt: "2026-08-20T08:25:22-03:00",
  },
  {
    title: "Cargador Portátil Gadnic 25000mAh",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_781826-MLA81270222720_122024-F.jpg",
    affiliateUrl: "https://meli.la/1qmUGMT",
    newPrice: "44.999",
    oldPrice: "64.999",
    offPct: "30",
    postedAt: "2026-08-20T08:25:22-03:00",
  },
  {
    title: "Consola Nintendo Switch 2 256GB",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_788400-MLA99958400949_112025-O.webp",
    affiliateUrl: "https://meli.la/2TqsLsm",
    newPrice: "1.482.626",
    oldPrice: "1.699.999",
    offPct: "12",
    postedAt: "2026-08-20T11:02:56-03:00",
  },
  {
    title: "Bloques Magnéticos estilo Minecraft 60 Piezas",
    imageUrl:
      "https://http2.mlstatic.com/D_Q_NP_794124-MLA99258855342_112025-F.webp",
    affiliateUrl: "https://meli.la/1tiWjKH",
    newPrice: "29.999",
    oldPrice: "59.999",
    offPct: "50",
    postedAt: "2026-08-20T16:59:16-03:00",
  },
  {
    title: "Muñeca Mattel Monster High Draculaura",
    imageUrl:
      "https://http2.mlstatic.com/D_Q_NP_753432-MLA96402199741_102025-F.webp",
    affiliateUrl: "https://meli.la/2pZHtuK",
    newPrice: "89.990",
    oldPrice: "149.990",
    offPct: "40",
    postedAt: "2026-08-20T16:59:16-03:00",
  },
  {
    title: "Freidora de Aire Philips Canasta Doble 9L",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_2X_755248-MLA99988665433_112025-F.webp",
    affiliateUrl: "https://meli.la/155LXzo",
    newPrice: "249.143",
    oldPrice: "377.490",
    offPct: "34",
    postedAt: "2026-08-24T10:49:31-03:00",
  },
  {
    title: "Bicicleta MTB Overtech R29",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_793841-MLA85365577803_052025-O.webp",
    affiliateUrl: "https://meli.la/1CadcbV",
    newPrice: "241.999",
    oldPrice: "499.999",
    offPct: "51",
    postedAt: "2026-08-24T10:49:31-03:00",
  },
  {
    title: "Casco Bicicleta Dakota",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_925226-MLA91141039893_082025-O.webp",
    affiliateUrl: "https://meli.la/2EgBexp",
    newPrice: "23.211",
    oldPrice: "32.990",
    offPct: "29",
    postedAt: "2026-08-24T10:49:31-03:00",
  },
  {
    title: "Notebook Asus TUF Gaming A15 RTX 3050",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_749137-MLA110076990586_042026-O.webp",
    affiliateUrl: "https://meli.la/1ihg8Za",
    newPrice: "1.840.199",
    oldPrice: "2.801.999",
    offPct: "34",
    postedAt: "2026-08-24T10:49:31-03:00",
  },
  {
    title: "Silla Gamer Alpina Ergonómica",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_929992-MLA100025507743_122025-F.jpg",
    affiliateUrl: "https://meli.la/2y3NTbJ",
    newPrice: "183.330",
    oldPrice: "280.000",
    offPct: "34",
    postedAt: "2026-08-24T10:49:31-03:00",
  },
  {
    title: "Caloventor Liliana Blacksun",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_694331-MLA99496642372_112025-F.jpg",
    affiliateUrl: "https://meli.la/2yR3JAN",
    newPrice: "54.415",
    oldPrice: "61.999",
    offPct: "12",
    postedAt: "2026-08-24T10:49:31-03:00",
  },
  {
    title: "Monitor Samsung Odyssey G3 G30D 24 180Hz",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_651661-MLA101215783396_122025-O.webp",
    affiliateUrl: "https://meli.la/2jHNRpN",
    newPrice: "263.199",
    oldPrice: "379.999",
    offPct: "30",
    postedAt: "2026-08-24T17:38:03-03:00",
  },
  {
    title: "Microondas Atma 20L MATDB20UAP",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_852430-MLA99447789936_112025-O.webp",
    affiliateUrl: "https://meli.la/18Sm8zA",
    newPrice: "224.089",
    oldPrice: "499.999",
    offPct: "55",
    postedAt: "2026-08-24T17:38:03-03:00",
  },
  {
    title: "Teclado Gamer Redragon K622 Horus TKL",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_805662-MLA99443113410_112025-O.webp",
    affiliateUrl: "https://meli.la/2FFddS8",
    newPrice: "88.835",
    oldPrice: "97.999",
    offPct: "9",
    postedAt: "2026-08-25T12:41:22-03:00",
  },
  {
    title: "Monitor Noblex NXSM2200 22 100Hz",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_656487-MLA99941666533_112025-O.webp",
    affiliateUrl: "https://meli.la/24VQhMv",
    newPrice: "133.499",
    oldPrice: "226.599",
    offPct: "41",
    postedAt: "2026-08-25T12:55:17-03:00",
  },
  {
    title: "Freidora de Aire y Grill Digital Atma FR901DP 6.3L",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_727889-MLA99464081972_112025-O.webp",
    affiliateUrl: "https://meli.la/2288aRk",
    newPrice: "214.209",
    oldPrice: "309.999",
    offPct: "30",
    postedAt: "2026-08-25T12:55:17-03:00",
  },
  {
    title: "Smart TV Noblex 50\" 4K Google TV",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_863179-MLA110194542346_052026-O.webp",
    affiliateUrl: "https://meli.la/2GTtgFh",
    newPrice: "634.500",
    oldPrice: "795.313",
    offPct: "20",
    postedAt: "2026-08-25T13:16:55-03:00",
  },
  {
    title: "Licuadora Atma Pro LI8450AP",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_654240-MLA99514945598_112025-O.webp",
    affiliateUrl: "https://meli.la/2Cb43gM",
    newPrice: "83.599",
    oldPrice: "149.999",
    offPct: "44",
    postedAt: "2026-08-25T18:20:06-03:00",
  },
  {
    title: "Consola PS5 Digital + Astro Bot + Gran Turismo 7",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_762299-MLA96673496657_102025-O.webp",
    affiliateUrl: "https://meli.la/2uDAPvb",
    newPrice: "1.499.999",
    oldPrice: "1.939.999",
    offPct: "22",
    postedAt: "2026-08-25T20:06:04-03:00",
  },
  {
    title: "Parlante JBL Charge 5",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_886635-MLA100077802831_122025-O.webp",
    affiliateUrl: "https://meli.la/2wzqeGq",
    newPrice: "307.199",
    oldPrice: "349.999",
    offPct: "12",
    postedAt: "2026-08-26T08:13:40-03:00",
  },
  {
    title: "Sillón Masajeador Gadnic Titanium",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_628524-MLA114964176713_072026-O.webp",
    affiliateUrl: "https://meli.la/22pyuhT",
    newPrice: "1.162.080",
    oldPrice: "2.080.849",
    offPct: "44",
    postedAt: "2026-08-26T12:12:47-03:00",
  },
  {
    title: "Aire Acondicionado Portátil Sansei Frío/Calor",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_887291-MLA112253413180_062026-O.webp",
    affiliateUrl: "https://meli.la/1N368W9",
    newPrice: "529.999",
    oldPrice: "659.999",
    offPct: "19",
    postedAt: "2026-08-26T13:31:22-03:00",
  },
  {
    title: "Cámara de Seguridad TP-Link Tapo C210",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_725717-MLA99943629485_112025-O.webp",
    affiliateUrl: "https://meli.la/163zVTJ",
    newPrice: "52.699",
    oldPrice: "80.000",
    offPct: "34",
    postedAt: "2026-08-26T18:12:34-03:00",
  },
  {
    title: "Teclado Gamer Redragon Kumara K552",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_649437-MLA99937224833_112025-O.webp",
    affiliateUrl: "https://meli.la/1zgaW6F",
    newPrice: "70.353",
    oldPrice: "87.941",
    offPct: "20",
    postedAt: "2026-08-27T09:35:06-03:00",
  },
  {
    title: "Freidora de Aire Atma Pro FR60AR 6.5L",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_704928-MLA99450647716_112025-O.webp",
    affiliateUrl: "https://meli.la/1NYzyF1",
    newPrice: "117.934",
    oldPrice: "147.497",
    offPct: "20",
    postedAt: "2026-08-27T09:35:06-03:00",
  },
  {
    title: "Nebulizador San-Up ClearBreath",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_972088-MLA89662926705_082025-O.webp",
    affiliateUrl: "https://meli.la/1kgZM8w",
    newPrice: "61.749",
    oldPrice: "126.899",
    offPct: "51",
    postedAt: "2026-08-27T09:35:06-03:00",
  },
  {
    title: "Set de Mesas Ratonas Nórdicas Boomerang",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_639006-MLA102830949280_012026-O.webp",
    affiliateUrl: "https://meli.la/2FVeLbX",
    newPrice: "41.061",
    oldPrice: "84.990",
    offPct: "51",
    postedAt: "2026-08-27T09:35:06-03:00",
  },
  {
    title: "Auriculares Gamer Razer Blackshark V2 X",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_640861-MLA99990155459_112025-O.webp",
    affiliateUrl: "https://meli.la/2eMU81J",
    newPrice: "108.675",
    oldPrice: "120.500",
    offPct: "9",
    postedAt: "2026-08-28T08:38:46-03:00",
  },
  {
    title: "Auriculares JBL Quantum 360P Inalámbricos",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_709254-MLA99444648236_112025-O.webp",
    affiliateUrl: "https://meli.la/1116zLn",
    newPrice: "149.967",
    oldPrice: "248.999",
    offPct: "39",
    postedAt: "2026-08-28T09:22:46-03:00",
  },
  {
    title: "Cafetera Nespresso Essenza Mini",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_936786-MLA95729072378_102025-O.webp",
    affiliateUrl: "https://meli.la/2BL6EDJ",
    newPrice: "264.846",
    oldPrice: "441.410",
    offPct: "40",
    postedAt: "2026-08-28T09:52:51-03:00",
  },
  {
    title: "Microondas BGH Quick Chef 20L",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_893583-MLA98164786504_112025-O.webp",
    affiliateUrl: "https://meli.la/1jXrzPY",
    newPrice: "169.199",
    oldPrice: "279.999",
    offPct: "39",
    postedAt: "2026-08-28T10:23:16-03:00",
  },
  {
    title: "Smartwatch Xiaomi Redmi 5 Lite 1.96",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_661173-MLA99926131065_112025-O.webp",
    affiliateUrl: "https://meli.la/1zuT4jC",
    newPrice: "83.499",
    oldPrice: "104.999",
    offPct: "20",
    postedAt: "2026-08-28T10:52:52-03:00",
  },
  {
    title: "Smartwatch Amazfit Bip 6 Amoled",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_622879-MLA99965332573_112025-O.webp",
    affiliateUrl: "https://meli.la/2eTZSJx",
    newPrice: "175.200",
    oldPrice: "230.526",
    offPct: "23",
    postedAt: "2026-08-28T11:23:55-03:00",
  },
  {
    title: "Pava Eléctrica Vintage Peabody 2200W",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_786211-MLA109752518549_032026-O.webp",
    affiliateUrl: "https://meli.la/1h5c9zR",
    newPrice: "74.099",
    oldPrice: "99.999",
    offPct: "25",
    postedAt: "2026-08-28T11:52:59-03:00",
  },
  {
    title: "Licuadora de Mano Peabody 800W",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_994881-MLA99490288888_112025-O.webp",
    affiliateUrl: "https://meli.la/2JgxVog",
    newPrice: "111.899",
    oldPrice: "149.999",
    offPct: "25",
    postedAt: "2026-08-28T12:54:21-03:00",
  },
  {
    title: "Tostadora Atma Dos Rebanadas",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_686726-MLA94802541032_102025-O.webp",
    affiliateUrl: "https://meli.la/2e12DnC",
    newPrice: "45.699",
    oldPrice: "59.999",
    offPct: "23",
    postedAt: "2026-08-28T12:58:07-03:00",
  },
  {
    title: "Consola PS5 Slim Digital + Astro Bot + GT7",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_926948-MLA96423004168_102025-O.webp",
    affiliateUrl: "https://meli.la/1ASwNL2",
    newPrice: "1.693.619",
    oldPrice: "2.399.999",
    offPct: "29",
    postedAt: "2026-08-28T17:30:19-03:00",
  },
  {
    title: "Control DualSense PS5 Perla Chroma",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_837232-MLA85723989332_062025-O.webp",
    affiliateUrl: "https://meli.la/18GRRfv",
    newPrice: "203.299",
    oldPrice: "213.999",
    offPct: "5",
    postedAt: "2026-08-28T18:24:04-03:00",
  },
  {
    title: "Monitor Gamer ViewSonic 27\" VX2729 200Hz",
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_635708-MLA99414885660_112025-O.webp",
    affiliateUrl: "https://meli.la/15AWXst",
    newPrice: "250.680",
    oldPrice: "278.534",
    offPct: "10",
    postedAt: "2026-08-28T19:23:17-03:00",
  },
];
