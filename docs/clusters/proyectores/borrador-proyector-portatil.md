# Borrador: guía pilar `proyector-portatil` (silo tech)

> Origen: análisis GSC 2026-07-09 (snapshot #14). Cluster "proyectores": **14 queries, 130 impresiones, 0 clicks**, sin guía dedicada — hoy rankean las fichas de producto solas (pos 8-9).

## VALIDADA 2026-07-09 (Ubersuggest, AR) — luz verde

- **"proyector portatil": 14.800/mes · SD 13 · intención transaccional.** Mejor ratio volumen/dificultad que varias ya ejecutadas (ventilador de techo era 33.100/SD 13; planchita 18.100/SD 11).
- **"proyector": 22.200/mes · SD 18** — la guía puede capturar ambas.
- **Estacionalidad: el pico es AHORA** — julio 22.200 (invierno = pelis adentro), baja a 9.900 en enero-febrero. Cada semana de demora es pico perdido.
- **SERP 100% tiendas** (ML pos 1, Gadnic DA 30, Frávega DA 57, Megatone DA 48, Bidcom, Naldo), Wikipedia y un solo YouTube. **Cero contenido editorial** — mismo patrón que ventilador-de-techo, que se validó como "muy ganable". People Also Ask en posición 3 → hueco directo para las FAQ.

## Queries del cluster (GSC, 28 días)

| Query | Impr | Pos | Página que rankea hoy |
|---|---|---|---|
| proyector led smart android 11 fhd 4500 lumenes wifi bt | 67 | 9,4 | ficha MLA28251222 |
| proyector portátil 4k hy300 full hd wifi hdmi android 11 | 34 | 8,7 | ficha MLA42238146 |
| proyector chico | 5 | 4,2 | ficha MLA22975097 |
| proyector 9000 lumens | 4 | 11,2 | ficha MLA43926951 |
| + 10 queries menores | ~20 | — | fichas |

**Ventaja de arranque:** ya hay 4 fichas de proyector en el catálogo (`categorySlug: "tech"`) con afiliado. La guía se arma con productos existentes, sin importar nada.

## Título y metadata propuestos

- **H1:** Proyector portátil: cuál comprar en Argentina y cuál conviene [2026]
- **seoTitle:** ¿Qué Proyector Portátil Conviene? Cuál Comprar en Argentina [2026]
- **Slug:** `proyector-portatil` · silo `tech` · `pillar: true` (pilar chico del silo junto a `cargador-portatil`)
- **directAnswer (borrador):** "Para la mayoría conviene el proyector Android de 4500 lúmenes (alrededor de {{precio:MLA28251222:k}}): Full HD real, WiFi y apps integradas. Si lo querés para mover o llevar, el HY300 portátil; si el presupuesto manda, el mini de 1200 lúmenes. Ojo con los lúmenes de marketing: abajo explicamos cuáles son reales."

## Outline H2/H3 (formato pregunta donde aporta)

1. **H2 ¿Qué proyector portátil necesitás según el uso?** (`id: "tipos"`)
   — pelis en casa vs. patio/quincho vs. camping/viaje. Regla rápida: oscuridad total = cualquier lúmen sirve; con luz ambiente, mínimo real alto.
2. **H2 Los mejores proyectores portátiles 2026** (`id: "ranking"`)
   - H3 1. Proyector LED Smart Android 4500 lúmenes — el equilibrado *(product-card MLA28251222)*
   - H3 2. HY300 portátil "4K" — el más buscado *(product-card MLA42238146; aclarar honesto: resolución nativa 720p, "soporta" 4K)*
   - H3 3. Mini proyector 1200 lúmenes — el barato para empezar *(product-card MLA22975097)*
   - H3 4. Proyector Android 9000 lm — el de máxima luminosidad declarada *(product-card MLA43926951; contra: lúmenes declarados ≠ ANSI)*
3. **H2 Tabla comparativa** — columnas: lúmenes declarados / resolución NATIVA / Android / entradas / "Ideal para" / precio-link.
4. **H2 ¿Los lúmenes del anuncio son reales?** (`id: "lumenes"`) — LED/marketing vs ANSI; por qué "9000 lúmenes" a $70.000 no existe; cómo comparar.
5. **H2 ¿Qué mirar antes de comprar?** — H3 Resolución nativa vs "soportada" · H3 Android integrado y el problema de Netflix (los baratos no tienen certificación; se resuelve con stick o celular) · H3 Distancia de proyección y tamaño de imagen · H3 Ruido del ventilador · H3 Keystone (corrección trapezoidal).
6. **H2 ¿Cuánto cuesta un proyector portátil? [julio 2026]** — franjas con tokens `{{precio:ID:k}}`.
7. **H2 Veredicto: cuál comprar** — caja + CTA primario y `.ghost`.
8. **FAQ (5-7, primera abierta):** ¿Sirve un proyector barato para ver fútbol con luz? · ¿El HY300 es 4K de verdad? · ¿Puedo ver Netflix directo? · ¿Cuántos lúmenes necesito para pared blanca de día? · ¿Proyector o smart TV usada al mismo precio? · ¿Se puede conectar a parlante bluetooth?

## Entidades a cubrir (para AEO)

Lúmenes ANSI vs lúmenes LED de marketing · resolución nativa vs soportada (720p/1080p/"4K") · Android 11 integrado · HY300 / Magcubic (modelo genérico más buscado) · certificación Netflix/Widevine · keystone · distancia de tiro y pulgadas proyectadas · HDMI / USB / WiFi 5G / BT 5.0 · Gadnic (marca local del catálogo) · uso: cine en casa, fútbol, camping, quincho · alternativa TV Stick.

## 5 links internos desde páginas existentes (con ancla)

1. **`/guias/audio/parlantes`** (pilar audio, publicada) → en la sección de la torre Noblex/hogar: ancla **"proyector portátil"** ("para armar un cine en casa completo, sumale un [proyector portátil]").
2. **`/guias/audio/auriculares-inalambricos`** (publicada) → sección vincha/cancelación: ancla **"proyector portátil para ver películas"** (ver pelis de noche sin molestar a nadie).
3. **`/guias/gaming/silla-gamer`** (pilar gaming, publicada) → en "cómo elegir"/setup: ancla **"proyector para jugar en pantalla grande"**.
4. **Las 4 fichas de proyector** (`/producto/...` — son las que HOY rankean para el cluster): línea en la descripción "antes de decidir, mirá la [guía completa de proyectores portátiles](/guias/tech/proyector-portatil)". Es el link más valioso: pasa relevancia exacta de las páginas que ya tienen las impresiones.
5. **`/guias/tech/cargador-portatil`** (pilar del silo tech, staged 01-sep) → hub-and-spoke del silo: ancla **"proyector portátil"** en la sección de usos (proyector + power bank = cine en el camping). Link bidireccional al publicarse.

## Los otros 4 clusters detectados (impresiones, 0 clicks, sin página dedicada)

| # | Cluster | Impr/28d | Nota |
|---|---|---|---|
| 2 | "electroland" (marca/retailer) | ~68 | Navegacional: buscan la tienda Electroland. Rankean fichas nuestras. Riesgo de intención equivocada — NO hacer guía; opción: mención/branding en fichas |
| 3 | Perfumes árabes por nota/olor ("mandarina", etc.) | ~42 | Existe `por-color` pero no "por nota". Satélite: "¿Qué perfume árabe elegir según el olor?" |
| 4 | Masajeador lumbar | ~40 | `masajeador-espalda` rankea pos 10,7 pero no es lumbar-específico. Satélite corto o sección + H2 en la guía existente (más barato) |
| 5 | Caliber (marca de masajeadores) | ~38 | Rankea la ficha sola. Patrón ya probado en el sitio: guía review de marca (como `masajeador-gadnic`) |
