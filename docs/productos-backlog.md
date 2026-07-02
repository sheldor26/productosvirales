# Backlog de productos (inventario para guías futuras)

## ⚠️ Pendientes pre-publish (detectados por el vigía de stock, 2026-07-01)

- **Stromberg Mega Twin — RESUELTO (2026-07-02):** el catálogo original /p/MLA47305608 murió, pero Juan encontró el MISMO producto en un catálogo alternativo vivo (/up/MLAU4175865451, $167.143, envío gratis). Ficha re-apuntada (permalink + afiliado meli.la/32q5dMs nuevos, precio actualizado, `visibility: normal`). Links originales comentados en la ficha como respaldo: **si /p/MLA47305608 se rehabilita, volver a esos y descartar el alternativo**. Las guías staged de audio ya no tienen pendientes.
- **RESUELTOS por re-apunte a variante viva (2026-07-02):** la Smartlife SL-EC8501 (→ catálogo gris MLA22761858, 1.665 reseñas) y la pistola Femmto (→ variante MLA37705965, 6.927 reseñas). Las guías quedaron intactas. **Links de afiliado nuevos instalados (2026-07-02)**: Juan pasó los links extensos del panel (equivalentes al meli.la) y quedaron en las fichas. Comisión restaurada.
- **Electrolux ECM25 (2026-07-02):** Juan generó un link de afiliado nuevo para la misma cafetera y quedó instalado (guía intacta). El link viejo (meli.la/1y5nrwc, catálogo MLA72187457) quedó comentado en la ficha: **si ese catálogo revive, restaurarlo**. Ojo: el permalink de la ficha sigue apuntando al catálogo viejo, así que el vigía puede volver a marcarla "sin stock"; verificar contra esta nota antes de actuar.
- **Asad Negro (2026-07-02):** Juan generó un link de afiliado nuevo para el mismo perfume y quedó instalado (las 3 guías árabes intactas). El link viejo (meli.la/2t9EpWq) quedó comentado en la ficha: **si el catálogo MLAU3562485598 revive, restaurarlo**. Mismo aviso que la ECM25: el vigía puede re-marcarla; verificar contra esta nota antes de actuar.
- Con esto, TODOS los muertos-en-guías-vivas del reporte 2026-07-01 quedaron resueltos. Único pendiente: **Stromberg Mega Twin** en las guías STAGED de audio (fix pre-publish, ver arriba). Correr `node scripts/stock-watchdog.cjs` para el estado actual.
- **Protocolo aprendido:** ante un catálogo muerto, ANTES de cirugía editorial revisar `parent_id` → `children_ids` por variantes de color vivas: las reseñas viajan a nivel familia, así que el re-apunte conserva todo el social proof.

> Holding de productos de MercadoLibre que Juan ya curó (con su `meli.la` de afiliado generado) pero que **todavía no están en una guía**. Sirve para no perder los links de afiliado y para tener munición lista cuando armemos guías o satélites nuevos.

## Reglas

- Cuando Juan pasa una tanda de productos, **TODOS** se registran acá (los que entran a una guía y los que no).
- Estado: `usado` (ya está en una guía, con el slug) o `pendiente` (guardado para futuro).
- Si un producto pendiente se usa después, cambiar su estado a `usado` + slug.
- El `meli.la` es lo valioso: nunca borrar una fila aunque el producto se descarte de una guía puntual; puede servir para otra.
- Datos: reviewCount = proxy de ventas (reseñas reales de ML); precio de junio 2026.

---

## Gaming — Auriculares gamer

> Sub-hub planeado: guía principal "auriculares gamer: cuál comprar" + satélites futuros (inalámbricos, económicos, por marca: HyperX / Logitech / Redragon).

| Producto | MLA ID | Marca | Reseñas | Precio | meli.la | Estado / ángulo futuro |
| :-- | :-- | :-- | --: | --: | :-- | :-- |
| Kotion Each G9000 | MLA9406415 | Kotion | 9026 | $40.927 | meli.la/21XciT1 | **usado** en `auriculares-gamer` (#1) |
| Logitech G435 inalámbrico | MLA18651915 | Logitech G | 4544 | $149.999 | meli.la/1X17nvS | **usado** en `auriculares-gamer` (#3) |
| Razer BlackShark V2 X negro | MLA16280514 | Razer | 1817 | $100.000 | meli.la/1eMqyZ5 | **usado** en `auriculares-gamer` (#2) |
| Logitech G733 inalámbrico | MLA16269737 | Logitech G | 1681 | $210.422 | meli.la/1erBB4P | **usado** en `auriculares-gamer` (#6) |
| Redragon Ire Pro H848 (inalámbrico) | MLA58836044 | Redragon | 1489 | $83.999 | meli.la/1EmVgFD | **usado** en `auriculares-gamer` (#5) |
| HyperX Cloud (cable) | MLA8732921 | HyperX | 696 | $82.646 | meli.la/2E5hHez | **usado** en `auriculares-gamer` (#4) |
| Kotion G9000 7.1 rojo | MLA58835028 | Kotion | 9026 | $40.927 | meli.la/2RZ5sHV | pendiente — variante color del #1 |
| Alpina F40 Pro (inalámbrico BT) | MLA61986399 | Alpina | 2576 | $10.390 | meli.la/2rs1atK | pendiente — **económicos** (el más barato) / inalámbricos baratos |
| Redragon Lamia RGB | MLA15558829 | Redragon | 1660 | $86.499 | meli.la/2sZEw5q | pendiente — **marca Redragon** / RGB |
| JBL Quantum 100M2 | MLA47138768 | JBL | 1364 | $72.154 | meli.la/22nTPgP | pendiente — **marca JBL** / con cable |
| Redragon Zeus X H510 (rosa) | MLA19053089 | Redragon | 1123 | $90.000 | meli.la/33Tq8S1 | pendiente — marca Redragon / color |
| Havit H2230d (cable) | MLA27001424 | Havit | 1015 | $37.829 | meli.la/2cS33gY | pendiente — **económicos** con cable |
| Razer BlackShark V2 X blanco | MLA21785266 | Razer | 903 | $107.269 | meli.la/26RzXDL | pendiente — variante color del #2 |
| Redragon Zeus 2 H510 | MLA16159706 | Redragon | 538 | $124.612 | (sin link aún) | pendiente — marca Redragon |
| Corsair Void RGB Elite Wireless | MLA15393127 | Corsair | 368 | $225.999 | meli.la/22fRUA6 | pendiente — **inalámbricos premium** / marca Corsair |
| Logitech H390 USB (oficina, NO gamer) | MLA24524629 | Logitech | 334 | $75.990 | meli.la/1WdzXpF | pendiente — OJO: auricular de oficina, no gamer; sirve para guía de auriculares con cancelación/trabajo |
| Razer Barracuda X (inalámbrico) | MLA18536633 | Razer | 331 | $267.469 | meli.la/2hg5hMi | pendiente — **inalámbricos premium** / Razer |
| Xtrike Me GH-512W (inalámbrico) | MLA52990881 | Xtrike | 241 | $58.999 | meli.la/2MLBMvS | pendiente — inalámbricos económicos |
| Razer BlackShark V2 X (otra publicación) | MLA22809126 | Razer | 236 | $108.199 | meli.la/1we8e2F | pendiente — variante/listing del #2 |
| HyperX Cloud Alpha Wireless | MLA24604276 | HyperX | 212 | $143.818 | meli.la/1ZE8Jui | pendiente — **inalámbricos** / marca HyperX |
| Lenovo GM2 Pro (inalámbrico) | MLA28757043 | Lenovo | 203 | $26.990 | meli.la/1mpdGeo | pendiente — **económicos** inalámbricos |
| HyperX Cloud Jet Dual Wireless | MLA61758911 | HyperX | 48 | $72.020 | meli.la/1N4Z38U | pendiente — inalámbricos / HyperX (modelo nuevo) |

**Ángulos de satélite que ya tienen munición guardada:**
- **Inalámbricos gamer:** HyperX Cloud Alpha Wireless, HyperX Cloud Jet, Corsair Void Wireless, Razer Barracuda X, Alpina F40 Pro, Lenovo GM2, Xtrike GH-512W (+ los usados G435, G733, Redragon Ire Pro).
- **Económicos / baratos:** Alpina F40 Pro ($10k), Lenovo GM2 ($27k), Havit ($38k), Xtrike ($59k), Kotion ($41k).
- **Por marca:** HyperX (Cloud Alpha, Jet), Razer (Barracuda X, BlackShark blanco), Redragon (Lamia, Zeus X, Zeus 2), Corsair (Void), JBL (Quantum 100M2).

---

## Gaming — Teclados gamer

| Producto | MLA ID | Marca | Reseñas | Precio | meli.la | Estado / ángulo futuro |
| :-- | :-- | :-- | --: | --: | :-- | :-- |
| Redragon Kumara K552 (mecánico TKL) | MLA16369071 | Redragon | 15395 | $62.799 | meli.la/1WJcMxC | **usado** en `teclado-gamer` (#1) |
| HyperX Alloy Core (membrana) | MLA14075573 | HyperX | 1489 | $63.999 | meli.la/21e4ujZ | **usado** en `teclado-gamer` (#2) |
| Logitech G213 Prodigy (membrana) | MLA8906508 | Logitech G | 869 | $75.599 | meli.la/11qvS6t | **usado** en `teclado-gamer` (#4) |
| Aula F75 negro (mecánico 75% red) | MLA57380272 | Aula | 397 | $62.349 | meli.la/1MgoaV2 | **usado** en `teclado-gamer` (#3) |
| Redragon Horus K622 (mecánico TKL red) | MLA19893399 | Redragon | 378 | $87.990 | meli.la/19edjTZ | **usado** en `teclado-gamer` (#5) |
| Razer Huntsman Mini mercury (60% óptico) | MLA16085611 | Razer | 316 | $138.000 | meli.la/2cJvkJf | **usado** en `teclado-gamer` (#6) |
| Teclado mecánico 60% genérico (switch blue) | MLA58811447 | (genérico) | 1240 | $41.974 | meli.la/1kKiztD | pendiente — 60% económico / "teclado mecánico barato" |
| Redragon Ziggs K669 (mecánico) | MLA38834031 | Redragon | 417 | $63.001 | meli.la/1PfeDU9 | pendiente — marca Redragon |
| Aula F75 blanco | MLA58573558 | Aula | 397 | $62.349 | meli.la/2VS9zQo | pendiente — variante color del #3 |
| Razer Huntsman Mini negro | MLA16085609 | Razer | 316 | $189.699 | meli.la/2nuj7GH | pendiente — variante color del #6 (más caro) |
| Corsair K65 Mini (60%) | MLA21361481 | Corsair | 23 | $154.514 | meli.la/2DMph9S | pendiente — premium 60% / marca Corsair (pocas reseñas) |
| HyperX Alloy Origins 60 (MLAU) | MLAU121305368 | HyperX | 16 | $135.399 | meli.la/1yVuKEE | pendiente — premium 60% / HyperX (pocas reseñas) |

## Gaming — Mouse gamer

> Guía `mouse-gamer` creada (STAGED 2026-09-01). Hallazgo del research: en mouse, Logitech domina las ventas reales de ML AR por paliza (Razer/Corsair/HyperX casi sin reseñas en catálogos activos). **Pendiente al publicar el resto del silo gaming: restaurar los internalLinks de `silla-gamer`** (se quitaron al publicarla el 2026-07-01 para no enlazar a guías ocultas).

| Producto | MLA ID | Marca | Reseñas | Precio | meli.la | Estado / ángulo futuro |
| :-- | :-- | :-- | --: | --: | :-- | :-- |
| Logitech G203 Lightsync | MLA44849297 | Logitech G | 16416 | $38.599 | meli.la/2EEbq8S | **usado** en `mouse-gamer` (#1) |
| Logitech G305 Lightspeed negro | MLA11259955 | Logitech G | 12362 | $56.099 | meli.la/1dDyCA3 | **usado** en `mouse-gamer` (#2) |
| Redragon Centrophorus M601-RGB | MLA17743447 | Redragon | 2685 | $26.500 | meli.la/2rXZqbu | **usado** en `mouse-gamer` (#3) |
| Logitech G309 Lightspeed | MLA40568693 | Logitech G | 263 | $73.399 | meli.la/26ynmBo | **usado** en `mouse-gamer` (#4) |
| Logitech G Pro Wireless | MLA14428767 | Logitech G | 185 | $140.923 | meli.la/2HqvQqv | **usado** en `mouse-gamer` (#5) |
| Logitech PRO X Superlight 2 | MLA28598537 | Logitech G | 101 | $288.469 | meli.la/2ZRDxvS | **usado** en `mouse-gamer` (#6) |
| Logitech G305 menta (variante) | MLA35719376 | Logitech G | 640 | $60.493 | (sin link aún) | pendiente — variante color del #2 |

## Gaming — Monitores gamer

> Guía `monitor-gamer` creada (STAGED 2026-09-01), cierra el contenido core del silo gaming. Specs verificadas contra fabricante (Samsung/Noblex/Philips/Xiaomi/Gigabyte). Hallazgos: varios modelos dan sus Hz máximos SOLO por DisplayPort (HDMI topea); el G3 viene en 60 Hz de fábrica; el Philips 24 (el monitor más vendido del país) es 75 Hz de oficina, no gamer (presentado honesto en la guía).

| Producto | MLA ID | Marca | Reseñas | Precio | meli.la | Estado / ángulo futuro |
| :-- | :-- | :-- | --: | --: | :-- | :-- |
| Philips 241V8L 24" 75Hz | MLA43960948 | Philips | 2546 | $159.099 | meli.la/2LPpSwK | **usado** en `monitor-gamer` (#4) |
| Samsung Odyssey CRG5 24" curvo 144Hz | MLA43961816 | Samsung | 1557 | $365.999 | meli.la/21rUoNn | **usado** en `monitor-gamer` (#2) |
| Noblex NXSM2200 22" 100Hz | MLA45717136 | Noblex | 842 | $141.899 | meli.la/2AMGgvB | **usado** en `monitor-gamer` (#5) |
| Noblex NXSM2700 27" IPS 100Hz | MLA45717120 | Noblex | 739 | $223.199 | meli.la/17HaY3a | **usado** en `monitor-gamer` (#3) |
| Gigabyte GS34WQC 34" UW curvo | MLA28853185 | Gigabyte | 127 | $919.599 | meli.la/2VotvC2 | **usado** en `monitor-gamer` (#8) |
| Samsung Odyssey G3 G30D 24" 180Hz | MLA63267892 | Samsung | 107 | $244.361 | meli.la/2NmTqzr | **usado** en `monitor-gamer` (#1) |
| Xiaomi G34WQi 34" UW curvo 180Hz | MLA43960787 | Xiaomi | 57 | $629.999 | meli.la/1MQkxTt | **usado** en `monitor-gamer` (#7) |
| Samsung Odyssey G5 27" QHD 165Hz (G55A) | MLA43960827 | Samsung | 25 | $554.413 | meli.la/11Frg3T | **usado** en `monitor-gamer` (#6) |

## Gaming — Joystick PC

> Guía `joystick-pc` creada (STAGED 2026-09-01), primera del sub-silo `joystick` dentro de gaming (`docs/clusters/joystick/plan.md`). Eje editorial: XInput vs DirectInput (compatibilidad real con Steam/juegos) y cable vs inalámbrico. Todos los 6 links de afiliado ya generados por Juan desde el arranque.

| Producto | MLA ID | Marca | Reseñas | Precio | meli.la | Estado / ángulo futuro |
| :-- | :-- | :-- | --: | --: | :-- | :-- |
| Redragon Saturn G807 negro | MLA15152700 | Redragon | 7016 | $31.900 | meli.la/1M6Lx4q | **usado** en `joystick-pc` (#1) |
| Redragon Harrow G808 inalámbrico negro | MLA15086696 | Redragon | 6944 | $59.012 | meli.la/1MSzrYd | **usado** en `joystick-pc` (#2) |
| Redragon Harrow Pro G808 Pro wireless | MLA27921678 | Redragon | 4394 | $54.990 | meli.la/2rjwF15 | **usado** en `joystick-pc` (#3) |
| Logitech F310 | MLA15152152 | Logitech | 1623 | $37.999 | meli.la/2xNerho | **usado** en `joystick-pc` (#4) |
| Logitech G F710 inalámbrico | MLA15108369 | Logitech | 1057 | $57.000 | meli.la/2NRYRqV | **usado** en `joystick-pc` (#5) |
| Redragon Juno G818 wireless PS4/PC | MLA34724207 | Redragon | 1312 | $69.950 | meli.la/2Vg7eLP | **usado** en `joystick-pc` (#6) |

## Gaming — Joystick Xbox

> Guía `joystick-xbox` creada (STAGED 2026-09-01), 4ta guía del sub-silo joystick (plan.md actualizado por Juan). Solo 2 productos: Xbox es consola minoritaria en AR y no se encontraron compatibles de terceros con reseñas suficientes para verificar honestamente. El control oficial (MLA12384031) también se usa en `joystick-pc` como pick premium (doble uso, según el plan).

| Producto | MLA ID | Marca | Reseñas | Precio | meli.la | Estado / ángulo futuro |
| :-- | :-- | :-- | --: | --: | :-- | :-- |
| Xbox Wireless Controller (oficial) | MLA12384031 | Microsoft | 468 | $120.000 | meli.la/2YMk7Ec | **usado** en `joystick-xbox` (#1) y en `joystick-pc` (#7, doble uso) |
| Xbox Elite Series 2 (versión Core) | MLA19627127 | Microsoft | 69 | $329.999 | meli.la/1a7BDjN | **usado** en `joystick-xbox` (#2) |

## Gaming — Joystick para celular

> Guía `joystick-para-celular` creada (STAGED 2026-09-01), 3ra guía ejecutada del sub-silo joystick (orden real de ejecución: pc → xbox → celular; queda pendiente `joystick-xbox`→listo, y el flagship `joystick-ps5` al final). Ángulo honesto central: el producto más vendido de los 4 (T-Dagger Scorpio) NO tiene compatibilidad con celular confirmada por su fabricante (solo PS4/PC) — se decidió con Juan incluirlo igual, marcando el límite de frente en vez de sacarlo o inventar la compatibilidad.

| Producto | MLA ID | Marca | Reseñas | Precio | meli.la | Estado / ángulo futuro |
| :-- | :-- | :-- | --: | --: | :-- | :-- |
| T-Dagger Scorpio T-TGP802 | MLA23214606 | T-Dagger | 1594 | $55.444 | meli.la/1ymyheA | **usado** en `joystick-para-celular` (#1, sin compat. celular confirmada) |
| Genérico X3 (soporte incluido) | MLA24044240 | Genérica | 1427 | $18.999 | meli.la/2oszMRd | **usado** en `joystick-para-celular` (#2, el más barato) |
| GameSir Cyclone2 Bundle | MLA52360869 | GameSir | 270 | $126.951 | meli.la/1TsAU4M | **usado** en `joystick-para-celular` (#3, el premium) |
| GameSir Nova 2 Lite | MLA49838346 | GameSir | 252 | $49.699 | meli.la/2u846su | **usado** en `joystick-para-celular` (#4, compra segura) |

## Gaming — Joystick PS5

> Guía `joystick-ps5` creada (STAGED 2026-09-01), 4ta y última guía del sub-silo joystick (flagship, cierra el sub-silo completo: pc, xbox, celular, ps5). Los 4 links de Juan eran todos Sony oficial (3 colores del mismo DualSense + Edge), sin ningún compatible de terceros — se consultó con Juan (`AskUserQuestion`) y decidió: DualSense + Edge como fichas rankeadas, y la sección de "compatibles baratos" en prosa educativa sin ficha de producto ("ese es el ángulo de oro de la guía, y no necesita un producto para venderlo").

| Producto | MLA ID | Marca | Reseñas | Precio | meli.la | Estado / ángulo futuro |
| :-- | :-- | :-- | --: | --: | :-- | :-- |
| DualSense Cosmic Red | MLA18010994 | Sony/PlayStation | 18415 | $113.853 | meli.la/1zovXV4 | **usado** en `joystick-ps5` (#1, pick principal) |
| DualSense Galactic Purple | MLA18917848 | Sony/PlayStation | 18415 | $136.525 | meli.la/2Bpe8U9 | **usado** en `joystick-ps5` (variante de color, mencionada) |
| DualSense Sterling Silver | MLA31472572 | Sony/PlayStation | 18415 | $140.000 | meli.la/2RSG38M | **usado** en `joystick-ps5` (variante de color, mencionada) |
| DualSense Edge | MLA41152829 | Sony/PlayStation | 194 | $354.791 | meli.la/2RFmBSJ | **usado** en `joystick-ps5` (#2, premium) |

## Gaming — Kits gamer (teclado + mouse)

> Ángulo propio futuro: guía "kit gamer: cuál comprar" (combo teclado+mouse, conviene para armar el setup de una).

| Producto | MLA ID | Marca | Reseñas | Precio | meli.la | Estado / ángulo futuro |
| :-- | :-- | :-- | --: | --: | :-- | :-- |
| Kit Gadnic teclado + mouse RGB | MLA19079378 | Gadnic | 1570 | $33.849 | meli.la/1FRwXdn | pendiente — **kit gamer económico** |
| Kit Redragon S143 (K617 + M724) | MLA47333674 | Redragon | 809 | $74.999 | meli.la/1QjfBRL | pendiente — **kit gamer de marca** |
| Kit Senon 4 en 1 (teclado+mouse+auri+pad) | MLA63650610 | Senon | 412 | $37.481 | meli.la/2Epam1y | pendiente — kit completo económico |

## Cuidado Personal — Secadores de pelo

> Pilar `secador-de-pelo` (silo `cuidado-personal`, STAGED 2026-07-02). Traídos vía API oficial de ML (categoría MLA4597 "Secadores de Pelo"), rankeados por reviewCount. Los 6 links de afiliado ya están generados y aplicados en `curated-products.ts`.

| Producto | MLA ID | Marca | Reseñas | Precio | meli.la | Estado / ángulo futuro |
| :-- | :-- | :-- | --: | --: | :-- | :-- |
| Daewoo DHD-7007 2100W frío/calor + difusor | MLA22138728 | Daewoo | 8633 | $35.599 | https://meli.la/2QkGnV2 | **usado** en `secador-de-pelo` (#1, el más vendido) |
| Spica SP-1900 1800W iónico | MLA22934394 | Spica | 2067 | $16.599 | https://meli.la/1Y7ro1W | **usado** en `secador-de-pelo` (#2, el más económico) |
| Silfab Heat Expert By-520S 1800W | MLA23558351 | Silfab | 433 | $31.000 | https://meli.la/1n3Ks3T | **usado** en `secador-de-pelo` (#3, el más liviano) |
| Yelmo SC-3630 2200W Tourmaline Ion | MLA21813707 | Yelmo | 330 | $49.999 | https://meli.la/2TnTLcf | **usado** en `secador-de-pelo` (#4, motor AC verificado en yelmo.com.ar) |
| Vanta 3800 Mini Compact 1800W | MLA7477377 | Vanta | 948 | $71.000 | https://meli.la/1ywK42U | **usado** en `secador-de-pelo` (#5, motor AC, 400g) |
| GA.MA Italy Brilliant Blue Titanium 2200W | MLA24435487 | GA.MA Italy | 100 | $99.560 | https://meli.la/1hERTNt | **usado** en `secador-de-pelo` (#6, premium, motor DC verificado en gamaitalyonline.com.ar) |

Candidatos que quedaron afuera (para satélites futuros del silo, ej. `maquina-de-afeitar` no aplica pero sí futuras guías de secadores por marca o económicos): Blaupunkt Diamond Salon 2400w (MLA24240755, 103 reseñas, $64.679), Belprof Ventus 5000 (MLA21813705, 18 reseñas, $79.999), Philips Thermoprotect HP8230 (MLA6357153, 38 reseñas, $109.500 — precio con pocas ofertas, revisar antes de usar), Teknikpro New Eco Ion 3200 (MLA19486991, 1051 reseñas, $135.600 — 1 sola oferta activa, revisar precio).

## Cuidado Personal — Máquinas de afeitar

> Satélite `maquina-de-afeitar` (silo `cuidado-personal`, STAGED 2026-07-02), enlazado con el pilar `secador-de-pelo`. Traídos vía API oficial de ML (categoría "Afeitadoras Eléctricas"), rankeados por reviewCount. "Máquina de afeitar" y "afeitadora eléctrica" son el mismo producto (una sola guía); `cortadora de pelo` es distinta (corta longitud, no afeita a ras) y no comparte productos con esta guía. Los 6 links de afiliado ya están generados y aplicados en `curated-products.ts`.

| Producto | MLA ID | Marca | Reseñas | Precio | meli.la | Estado / ángulo futuro |
| :-- | :-- | :-- | --: | --: | :-- | :-- |
| GA.MA Italy G-Blade Wet & Dry | MLA25586824 | GA.MA Italy | 1134 | $29.999 | https://meli.la/2jg77p9 | **usado** en `maquina-de-afeitar` (#1, la más vendida) |
| Kemei KM-1102 | MLA44725486 | Kemei | 38 | $26.990 | https://meli.la/1nyvU2o | **usado** en `maquina-de-afeitar` (#2, la más económica) |
| GA.MA Italy GSH700 Tracker USB | MLA45401467 | GA.MA Italy | 308 | $37.200 | https://meli.la/1gTg98c | **usado** en `maquina-de-afeitar` (#3, doble pista + trimmer retráctil) |
| Wahl Travel Shaver 7 Piezas | MLA61642810 | Wahl | 181 | $42.000 | https://meli.la/2sEMMmK | **usado** en `maquina-de-afeitar` (#4, kit de viaje) |
| Remington R31A Rotativo | MLA19769919 | Remington | 213 | $65.000 | https://meli.la/24WtnAA | **usado** en `maquina-de-afeitar` (#5, única rotativa) |
| GA.MA Italy GSH987 Sport | MLA21346790 | GA.MA Italy | 142 | $68.999 | https://meli.la/2VNgUix | **usado** en `maquina-de-afeitar` (#6, premium, wet & dry verificada en gamaitalyonline.com.ar) |

Candidatos que quedaron afuera: varios productos con más reseñas que estos 6 resultaron ser recortadoras de barba/pelo o repuestos de cabezal (mal categorizados como "afeitadora" en ML) — excluidos por no afeitar a ras de piel, para no listarlos junto a afeitadoras reales. Tampoco se encontró ningún Philips OneBlade ni híbrido trim/shave con ofertas activas al momento del research; se cubrió el concepto de forma educativa en la guía, sin inventar un pick.

## Cuidado Personal — Cortadoras de pelo

> Satélite `cortadora-de-pelo` (silo `cuidado-personal`, STAGED 2026-07-02), cierra el silo. Enlazado con el pilar `secador-de-pelo` y con `maquina-de-afeitar`. Traídos vía API oficial de ML (categoría "Cortadoras de Pelo" MLA5411), rankeados por reviewCount. Distinta de `maquina-de-afeitar`: corta longitud con peines guía, no afeita a ras, no comparte productos con esa guía. **Las 2 fichas Philco (HC9901PN, HC9902PN) no generan link de afiliado** (rechazadas por el programa de MercadoLibre) — se marcaron `visibility: 'deprioritized'` y se reemplazaron en el ranking por Kemei KM-1951 y Teknikpro Silver. 4 de 6 productos ya tienen meli.la real; faltan los 2 nuevos.

| Producto | MLA ID | Marca | Reseñas | Precio | meli.la | Estado / ángulo futuro |
| :-- | :-- | :-- | --: | --: | :-- | :-- |
| Remington HC5850 Indestructible | MLA21820129 | Remington | 2338 | $61.080 | https://meli.la/2qnuJyn | **usado** en `cortadora-de-pelo` (#1, la más vendida, kit de 15 piezas) |
| Kemei KM-1951 | MLA24162945 | Kemei | 21 | $24.240 | PEGAR_MELI_LA | **usado** en `cortadora-de-pelo` (#2, la más económica, reemplaza a Philco HC9901PN) |
| Wahl Magic Clip | MLA22272888 | Wahl | 561 | $126.099 | https://meli.la/23AAFeN | **usado** en `cortadora-de-pelo` (#3, la profesional, motor rotativo, mejor puntuada 4.8) |
| Gadnic CP140 Care | MLA19606324 | Gadnic | 475 | $36.632 | https://meli.la/1x7QKoj | **usado** en `cortadora-de-pelo` (#4, la inalámbrica, carga USB) |
| Vanta Patillera 1100 | MLA19307536 | Vanta | 253 | $45.546 | https://meli.la/133hjdT | **usado** en `cortadora-de-pelo` (#5, única con pantalla digital) |
| Teknikpro Silver | MLA23131521 | Teknikpro | 19 | $89.000 | PEGAR_MELI_LA | **usado** en `cortadora-de-pelo` (#6, multigroomer con o sin cable, reemplaza a Philco HC9902PN) |

Candidatos que quedaron afuera: kits de navajas de afeitar manuales mal categorizados como "cortadora" en ML (ej. Gadnic Kit Barbería con porta-navajas, que en realidad es un porta-cuchillas de afeitar manual, no una máquina eléctrica), cortadoras para mascotas y trimmers exclusivos de barba (ya cubiertos o excluidos en la guía de `maquina-de-afeitar`).

**Fichas deprioritizadas (no borradas, solo sacadas del ranking):** Philco HC9901PN (MLA16142518, $27.000, 89 reseñas) y Philco HC9902PN (MLA17922390, $139.999, 251 reseñas). Siguen existiendo como fichas de producto standalone (`visibility: 'deprioritized'`), por si el rechazo del programa de afiliados era puntual y se puede reintentar más adelante.

## Otros silos / categorías

_(acá van los productos sobrantes de otras tandas que quieran guardarse para futuras guías)_
