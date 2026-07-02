# Plan de ejecución — Silo Cuidado Personal

> Brief autónomo para construir el silo entero. Todo lo estratégico ya está decidido y validado acá (keywords, SERP, estructura, ángulos). El ejecutor NO necesita re-analizar: sigue este documento + las skills y scripts que ya existen. Fecha del análisis: 2026-07-02.

## 0. Por qué este silo (contexto, no re-validar)

Salió como el hueco más fuerte del radar de tendencias de ML (`scripts/trends-radar.cjs`): "afeitadora / máquina de afeitar" apareció 6 veces y "difusor secador" también. Validado con Ubersuggest (locId 2032, es) + análisis de SERP.

**La cuña estratégica (el ángulo que nos hace ganar):** las SERP de "mejor secador" y "mejor máquina de afeitar" están dominadas por **revistas de belleza/grooming españolas de DA alto** (glamour, vogue, hola, menshealth, GQ). Son **genéricas y globales: no tienen precios argentinos, no linkean a ML, no dicen qué se consigue acá.** El ML listado rankea (prueba de intención de compra AR). Nuestra cuña = AR-focus + precios reales de ML + honestidad de curador. Lo confirma que sitios chicos SÍ entran: labarberiashop DA 26 rankea #1 en "mejor máquina de afeitar", lasmargaritas DA 31 en secador, infobae AR, TikTok "mejores marcas en Argentina".

**Matiz honesto:** es una SERP MÁS competitiva que gaming (revistas grandes, no blogs AR chicos). Rankear va a tardar más. Se compensa con más volumen y mejor intención. Es un juego más largo, vale la pena.

## 1. Datos validados (NO re-consultar Ubersuggest)

| Keyword | Volumen/mes | KD | Intención |
| :-- | --: | --: | :-- |
| secador de pelo | 27.100 | 14 | **Comercial** |
| máquina de afeitar | 8.100 | 12 | **Comercial** |
| afeitadora eléctrica | 4.400 | 13 | Transaccional |
| cortadora de pelo | 2.900 | 12 | Transaccional |

SERP de los comparativos ("mejor secador de pelo", "mejor máquina de afeitar"): guía-dominada + AI Overview + ML listado + Reddit AR. Hueco de guía confirmado. Apuntar SIEMPRE al comparativo ("mejor X" / "X cuál comprar"), no al término pelado (que es listado de tienda).

## 2. Estructura del silo

Routing: usa el silo dinámico existente (`/guias/cuidado-personal/[slug]`). No hay que tocar infraestructura: con `silo: "cuidado-personal"` en el objeto Guide, la ruta anda sola (igual que audio/cocina/gaming).

| Orden | Guía (slug) | Keyword objetivo | Rol | Sub-audiencia |
| :-- | :-- | :-- | :-- | :-- |
| 1 | `secador-de-pelo` | secador de pelo (27k) | **Pilar del silo** | Belleza (mujer) |
| 2 | `maquina-de-afeitar` | máquina de afeitar (8.1k) + afeitadora eléctrica (4.4k) | Satélite | Grooming (hombre) |
| 3 | `cortadora-de-pelo` | cortadora de pelo (2.9k) | Satélite | Grooming (hombre) |
| Futuro | `alisadora-de-pelo` / `depiladora` | (validar cuando toque) | Satélites belleza | Belleza |

**IMPORTANTE — evitar canibalización:** "máquina de afeitar" y "afeitadora eléctrica" son el MISMO producto (afeitadora eléctrica). Van en UNA sola guía (`maquina-de-afeitar`) que apunta a las dos keywords. NO hacer dos guías separadas. La `cortadora de pelo` SÍ es distinta (recorta largo de pelo/barba, no afeita al ras).

Enlazado interno: cada satélite enlaza al pilar `secador-de-pelo` y a los hermanos. El pilar enlaza a los satélites. Modelo hub-and-spoke, igual que gaming.

## 3. Datos técnicos del repo (para fichas y guías)

- Fichas en `src/data/curated-products.ts`: `category: "Cuidado Personal"`, `categorySlug: "belleza"` (ya existe, lo usan los perfumes).
- Guías en `src/data/guides.ts`: `silo: "cuidado-personal"`, `category: "cuidado-personal"`, `publishedDate: "2026-09-01"` (STAGED, oculto hasta que Google digiera lo anterior; mismo criterio que el resto).
- Afiliados: `meli.la` que genera Juan (o el link largo del panel, sirve igual). NUNCA el `matt_tool` pelado del importador.
- Precio en copy: usar "desde $X" (hay dispersión entre vendedores; ver cómo se hizo en mouse/monitor gamer).

## 4. Proceso por guía (repetir para cada una)

Seguir la skill **`/optimizador-guias-pv`** (modo CREAR) + `docs/guias.md` (diseño obligatorio) + `docs/fichas.md` (proceso de fichas). Pasos:

1. **Traer productos (Juan):** en ML, "{keyword}" → ordenar por **Más vendidos** → pasar 5-6 links `/p/` de arriba con sus `meli.la`. (La API no saca best-sellers de electro/belleza en nicho nuevo; ver memoria `ml-api-oficial-funciona`. Juan logueado los ve al toque.)
2. **Rankear por reseñas:** correr el patrón de ranking por `reviewCount` (proxy de ventas) contra la API — el mismo script python que se usó en gaming (token client_credentials + `/products/{id}/items` + `/reviews/item/...`). Elegir 5-6 que cubran el abanico (económico → premium) + variedad de marca.
3. **Verificar specs contra fabricante:** subagente (modelo Sonnet para ahorrar) que chequea specs contra la página oficial (Philips, Gama, Xiaomi, Braun, Wahl, etc.) y trae correcciones + datos que suman. NO inventar specs.
4. **Escribir 5-6 fichas** en `curated-products.ts` (formato de las fichas de gaming: id, title, canonicalName, price, image, images[], category/categorySlug, permalink, affiliateUrl, condition, freeShipping, rating, reviewCount, pastelColor, visibility "normal", specs[], relatedProducts[], priceUpdated/LastChecked, priceStatus, description con la contra honesta).
5. **Escribir la guía** en `guides.ts` siguiendo `docs/guias.md` (respuesta rápida neutra para AIO, trust-block metodología, ranking con product-cards, tabla comparativa, cómo elegir, precios, veredicto, FAQ 5-6 con schema, internalLinks). Pull-quotes reales de reseñas en #1 y #2. Staged.
6. **Verificar:** `npm run build` verde + confirmar que la guía queda staged (no genera HTML en `.next/server/app/guias/cuidado-personal/{slug}.html`). Chequear seoTitle 50-60, meta ≤155, 0 `matt_tool`, 0 guiones largos (—).
7. **Registrar:** entrada en `docs/seo-tracking-optimizaciones.md` (guía nueva, baseline cero, fecha) + productos usados/sobrantes en `docs/productos-backlog.md`.
8. **Commit:** mostrar diff, esperar OK de Juan. Sin auto-commit. Push solo si Juan lo pide.

## 5. Ángulos editoriales por guía (la columna vertebral honesta)

### Guía 1 — Secador de pelo (pilar)
Ejes de compra reales: **potencia (W)** de verdad vs marketing (los 2400W baratos no siempre son reales); **motor AC vs DC** (AC dura más, es de los profesionales); **iónico** (reduce frizz, útil en pelo largo/rizado, no es humo pero tampoco magia); **temperatura + difusor** (clave para rulos); **peso y ruido** (los pro pesan más). Marcas AR: Gama, Atma, Philips, Ultracomb, Liliana, y gama alta (Gama Italy, Babyliss).
Cuña AR: las revistas hablan de Dyson/GHD de $500+ que acá casi no se consiguen o cuestan fortuna. Nosotros mostramos qué comprar de verdad en ML AR con precio real.
Contra típica a decir: los baratos de "2400W" calientan pero el motor DC dura poco; el iónico no hace milagros en pelo lacio fino.

### Guía 2 — Máquina de afeitar / afeitadora eléctrica
Ejes: **rotativa (3 cabezales) vs láminas/foil** (rotativa mejor para barba despareja y cuello; foil más al ras y prolija en barba fina); **seco vs húmedo (wet & dry)** (poder usarla con espuma en la ducha); **al ras vs recortadora tipo OneBlade** (OneBlade recorta y perfila, NO afeita al ras al cero); **batería y carga rápida**; **piel sensible** (rotativa suele irritar menos). Marcas AR: Philips (serie 3000/5000, OneBlade), Gama, Xiaomi, Kemei, Braun.
Contra típica: los Kemei baratos rinden para empezar pero la duración es la pega; el OneBlade no deja la cara al ras como una de láminas.
Ojo audiencia: es masculina (menshealth, GQ, Reddit "afeitadora hombre"). Tono grooming.

### Guía 3 — Cortadora de pelo
Ejes: **con cable vs inalámbrica** (inalámbrica más cómoda, cable no se queda sin batería para un corte largo); **peines guía / medidas**; **cuchilla acero vs cerámica/titanio** (cerámica calienta menos); **para casa vs profesional/barbería**; **corte al ras / patillera**. Marcas AR: Gama, Wahl, Kemei, Philips, Babyliss.
Contra típica: las baratas tiran del pelo si la cuchilla no es buena; las inalámbricas económicas pierden potencia con la batería baja.

## 6. Orden y ritmo de ejecución

1. Arrancar por el **pilar `secador-de-pelo`** (ancla de 27k). Juan trae los secadores primero.
2. Después `maquina-de-afeitar`, después `cortadora-de-pelo`.
3. Todo **staged** (`2026-09-01`). Se publica en tanda propia cuando Google haya digerido lo anterior (ver memoria `publicacion-por-tandas-no-saturar-google`).
4. Al publicar la tanda: flip de fecha + spot-check de afiliados + pedir indexación del pilar en GSC.

## 7. Checklist de "listo para cerrar" por guía

- [ ] 5-6 fichas escritas con specs verificadas de fabricante + contra honesta en la description
- [ ] Guía con respuesta rápida neutra (AIO), tabla comparativa, cómo elegir, veredicto, FAQ 5-6
- [ ] Pull-quotes reales en #1 y #2
- [ ] Enlace al pilar + hermanos (hub-and-spoke)
- [ ] seoTitle 50-60 car. keyword al inicio · meta ≤155
- [ ] Ángulo cuña AR presente (precios reales, qué se consigue acá vs las revistas ES)
- [ ] `npm run build` verde · guía staged-ok (no en `.next`)
- [ ] 0 `matt_tool` · 0 guiones largos (—) · sin la palabra "cluster" en contenido
- [ ] Registrada en seo-tracking + backlog
- [ ] Diff mostrado, commit con OK de Juan
