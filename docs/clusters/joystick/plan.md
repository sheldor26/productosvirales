# Plan de ejecución — Sub-silo Joystick (dentro de Gaming)

> Brief autónomo para construir las guías de joystick, que **extienden el silo gaming ya publicado** (silla + auriculares + teclado + mouse + monitor). Todo lo estratégico ya está decidido y validado acá. El ejecutor NO re-analiza: sigue este documento + `docs/skills/optimizador-guias-pv.md` (espejo de la skill) + `docs/guias.md`. Análisis: 2026-07-02.

## 0. Por qué (contexto, no re-validar)

Salió como hueco fuerte en el radar de tendencias de ML (`scripts/trends-radar.cjs`, categoría Consolas y Videojuegos): joystick ps5, dualsense, joystick redragon, joystick pc, joystick con juegos. Es la extensión natural del silo gaming que ya está en vivo y rankeando.

**Terminología (importante para AR):** en Argentina el término es **"joystick"**, no "mando" (España) ni "control" (mucho menos volumen: joystick ps5 = 18.100 vs control ps5 = 1.300). Escribir SIEMPRE "joystick".

**La cuña estratégica (cómo ganamos):** las SERP están dominadas por revistas de gaming españolas (hobbyconsolas, 3djuegos, xataka, hardzone) que son genéricas y globales: listan el DualSense Edge o Scuf premium, sin precios argentinos ni qué se consigue en ML AR. Nuestra cuña = **AR-focus + precios reales de ML + honestidad de curador**. Y hay un ángulo de honestidad ENORME propio del nicho (ver sección 5). Lo confirma que sitios AR chicos rankean (gamingcity DA 33, laguiadelmando DA 21 en "mejor joystick pc") y que el blog de ML AR rankea con guía de compra en "mejor joystick ps5".

## 1. Datos validados (NO re-consultar Ubersuggest)

| Keyword | Volumen/mes | KD | Intención | SERP |
| :-- | --: | --: | :-- | :-- |
| joystick ps5 | **18.100** | 18 | Transaccional | guía-dominada; incumbentes ES grandes (más dura) + blog ML AR rankea |
| joystick xbox | **5.400** | 21 | **Comercial** | 2da más grande del sub-silo; ML AR con reseñas modestas (Xbox es minoría en AR) |
| joystick pc | 2.900 | 16 | Transaccional | guía-dominada; **sitios AR chicos rankean (DA 21-33)** = más fácil |
| joystick para celular | 2.900 | 19 | **Comercial** | (misma familia, guía-dominada) |
| joystick inalámbrico | 390 | 12 | Transaccional | cola larga, se cubre dentro de las otras |
| control ps5 / control xbox series | 1.300 / 110 | 25 / 34 | Transaccional | NO usar como ancla ("joystick" es el término real en AR) |

Apuntar SIEMPRE al comparativo ("mejor joystick X" / "joystick X cuál comprar"), no al término pelado (que es listado de tienda).

## 2. Estructura (3 guías, dentro del silo gaming)

Routing: usa el silo gaming existente → `/guias/gaming/[slug]`. Con `silo: "gaming"` en el objeto Guide, la ruta anda sola.

| Orden | Guía (slug) | Keyword objetivo | Rol | Dificultad |
| :-- | :-- | :-- | :-- | :-- |
| 1 | `joystick-pc` | joystick pc (2.900) | **Quick win** (SERP más blanda) | fácil |
| 2 | `joystick-xbox` | joystick xbox (5.400, Comercial) | Satélite de buen volumen | media |
| 3 | `joystick-para-celular` | joystick para celular (2.900, Comercial) | Satélite | media |
| 4 | `joystick-ps5` | joystick ps5 (18.100) | **Flagship** (más volumen, SERP más dura, ángulo honestidad fuerte) | difícil, juego largo |

Recomendación de arranque: **joystick-pc primero** (se rankea más fácil, valida el sub-silo). Después `joystick-xbox` (comparte ecosistema con PC, el control de Xbox es dual PC+consola), después celular, y dejar el flagship joystick-ps5 para cuando los otros estén asentados.

**Nota Xbox (importante):** el control de Xbox es minoría en ventas en AR (menos reseñas que PS5/Redragon), pero la keyword tiene buen volumen. La guía se sostiene por la demanda de búsqueda + porque el control de Xbox es el **estándar de PC** (XInput, plug-and-play). Por eso **el control oficial de Xbox va TAMBIÉN en la guía `joystick-pc`** como la opción premium "simplemente anda", además de anclar su propia guía.

Enlazado interno (hub-and-spoke, dentro de gaming): cada guía de joystick enlaza al pilar `silla-gamer` y a las hermanas de gaming relevantes (mouse, teclado, auriculares, monitor). Y entre las 3 de joystick.

## 3. Datos técnicos del repo

- Guías en `src/data/guides.ts`: `silo: "gaming"`, `category: "gaming"`, `publishedDate: "2026-09-01"` (STAGED; se publica en tanda propia cuando Google digiera la tanda gaming actual).
- Fichas en `src/data/curated-products.ts`: `category: "Gaming"`, `categorySlug: "tech"` (igual que el resto de gaming).
- Afiliados: `meli.la` que genera Juan (o el link largo del panel, sirve igual). NUNCA el `matt_tool` pelado.
- Precio en copy: "desde $X" (dispersión entre vendedores).
- Voz: rioplatense, sin urgencia falsa, contra honesta siempre. Guion largo (—) solo en títulos h3 (convención del sitio), no como muletilla de prosa.

## 4. Proceso por guía (repetir para cada una)

Seguir `docs/skills/optimizador-guias-pv.md` (modo CREAR) + `docs/guias.md` (diseño OBLIGATORIO) + `docs/fichas.md`. Pasos:

1. **Traer productos (Juan):** en ML, "{keyword}" → **Más vendidos** → 5-6 links `/p/` de arriba con sus `meli.la`. (La API no saca best-sellers de nicho nuevo; Juan logueado los ve al toque.)
2. **Rankear por reseñas** (proxy de ventas) con el patrón python de siempre (token client_credentials + `/products/{id}/items` + `/reviews/item/...`). Elegir 5-6 que cubran económico→premium + variedad de marca/plataforma.
3. **Verificar specs contra fabricante** con subagente (modelo Sonnet, ahorra tokens): conexión (cable/BT/2.4GHz/dongle), compatibilidad real por plataforma, batería, gatillos/haptics, layout. NO inventar.
4. **Escribir 5-6 fichas** (formato de las fichas de gaming existentes).
5. **Escribir la guía** siguiendo `docs/guias.md` (respuesta rápida neutra para AIO, trust-block, ranking con product-cards, tabla comparativa, cómo elegir, precios, veredicto, FAQ 5-6). Pull-quotes reales en #1 y #2.
6. **Verificar:** `npm run build` verde + confirmar staged (no genera HTML en `.next`). seoTitle 50-60, meta ≤155, 0 `matt_tool`, 0 guiones largos fuera de h3, internalLinks a guías publicadas.
7. **Registrar** en `docs/seo-tracking-optimizaciones.md` (guía nueva, baseline cero) + productos en `docs/productos-backlog.md`.
8. **Commit:** mostrar diff, esperar OK de Juan. Sin auto-commit.

## 5. Ángulos editoriales por guía (la columna vertebral honesta)

### Guía 1 — Joystick PC (quick win)
Ejes: **compatibilidad** (el estándar de PC es el control de Xbox / XInput, plug-and-play; los genéricos usan DirectInput y algunos juegos no los detectan bien), **con cable vs inalámbrico** (dongle 2.4GHz sin lag vs Bluetooth), **marcas** (control de Xbox, 8BitDo, GameSir, Redragon, Logitech F310/F710). **Incluir el control oficial de Xbox** como la opción premium "simplemente anda" (es el mismo que ancla la guía joystick-xbox: dual PC+consola). Contra honesta: los joysticks genéricos baratos a veces no los reconoce Steam sin configurar; el de Xbox es el que no falla.

### Guía 2 — Joystick para celular
Dos categorías, aclararlas: **(a) gamepad Bluetooth + soporte/clip** para el celular, y **(b) controles telescópicos que abrazan el celular** (tipo GameSir X2, Razer Kishi). Ejes: latencia Bluetooth (para juegos rápidos, mejor 2.4GHz o cable), compatibilidad Android vs iOS, para qué se usa (Free Fire, emuladores, cloud gaming). Contra honesta: muchos gamepads baratos tienen lag por Bluetooth que arruina los shooters; algunos juegos (Free Fire) limitan el uso de controles.

### Guía — Joystick Xbox
Ejes: el **control oficial de Xbox Wireless** es el estándar de PC y consola (XInput, plug-and-play, funciona en Xbox Series/One, PC, celular). El **Elite Series 2** es el premium (paletas, gatillos ajustables). Compatibles/third-party más baratos para quien no quiere pagar el oficial. Conexión (Bluetooth vs receptor), pilas AA vs recargable. Contra honesta: el oficial usa pilas AA (comprás aparte el kit recargable), y hay menos opciones third-party confiables que en PC genérico. Ojo: Xbox es minoría en AR, así que varios modelos tienen pocas reseñas (decirlo de frente). Cuña AR: precios reales de ML y qué se consigue acá; el control de Xbox sirve igual para PC, ese es su gran valor.

### Guía — Joystick PS5 (flagship, honestidad = el arma)
El ángulo que NADIE hace en AR y que es el más buscado: **cuáles joysticks "compatibles con PS5" baratos andan de verdad y cuáles no.** La verdad honesta: el **DualSense oficial** es el único con gatillos adaptativos y haptics reales; muchos third-party baratos "para PS5" en realidad **solo andan en PC**, o pierden funciones, o piden cable, o Sony los banea con updates. Estructura sugerida: DualSense oficial (el seguro) → DualSense Edge (premium, paletas) → alternativas con licencia que sí funcionan → advertencia sobre los clones baratos. Esta honestidad es exactamente lo que las revistas ES no dan y lo que el comprador argentino necesita antes de gastar. Es el diferencial.

## 6. Orden, ritmo y publicación

1. Arrancar por `joystick-pc` (SERP más blanda). Juan trae los productos.
2. Después `joystick-para-celular`, después el flagship `joystick-ps5`.
3. Todo **staged** (`2026-09-01`). Se publica en **tanda propia** cuando Google haya digerido la tanda gaming actual (ver memoria `publicacion-por-tandas-no-saturar-google`).
4. Al publicar: flip de fecha + bump de `updatedDate` a la fecha (para el lastmod del sitemap) + spot-check de afiliados + linkear desde las guías de gaming hacia estas + forzar índice en GSC.

## 7. Checklist de "listo para cerrar" por guía

- [ ] 5-6 fichas con specs verificadas de fabricante + contra honesta en la description
- [ ] Guía con respuesta rápida neutra (AIO), tabla comparativa, cómo elegir, veredicto, FAQ 5-6
- [ ] Pull-quotes reales en #1 y #2
- [ ] "joystick" como término (no "mando"/"control")
- [ ] Enlace al pilar silla-gamer + hermanas de gaming (hub-and-spoke)
- [ ] seoTitle 50-60 keyword al inicio · meta ≤155
- [ ] Cuña AR presente (precios reales + qué se consigue acá + la honestidad de compatibilidad)
- [ ] `npm run build` verde · staged-ok · 0 matt_tool · sin "cluster" en contenido
- [ ] Registrada en seo-tracking + backlog
- [ ] Diff mostrado, commit con OK de Juan
