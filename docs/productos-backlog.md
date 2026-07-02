# Backlog de productos (inventario para guías futuras)

## ⚠️ Pendientes pre-publish (detectados por el vigía de stock, 2026-07-01)

- **Stromberg Mega Twin (MLA47305608) MURIÓ en ML** (catálogo sin vendedores) y está en las guías STAGED `parlante-stromberg` y `parlantes`. Antes de publicar el silo audio: reemplazarlo por un modelo Stromberg vigente (pedirle a Juan el meli.la) o reescribir esas secciones. Ya quedó `deprioritized`.
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

## Gaming — Kits gamer (teclado + mouse)

> Ángulo propio futuro: guía "kit gamer: cuál comprar" (combo teclado+mouse, conviene para armar el setup de una).

| Producto | MLA ID | Marca | Reseñas | Precio | meli.la | Estado / ángulo futuro |
| :-- | :-- | :-- | --: | --: | :-- | :-- |
| Kit Gadnic teclado + mouse RGB | MLA19079378 | Gadnic | 1570 | $33.849 | meli.la/1FRwXdn | pendiente — **kit gamer económico** |
| Kit Redragon S143 (K617 + M724) | MLA47333674 | Redragon | 809 | $74.999 | meli.la/1QjfBRL | pendiente — **kit gamer de marca** |
| Kit Senon 4 en 1 (teclado+mouse+auri+pad) | MLA63650610 | Senon | 412 | $37.481 | meli.la/2Epam1y | pendiente — kit completo económico |

## Otros silos / categorías

_(acá van los productos sobrantes de otras tandas que quieran guardarse para futuras guías)_
