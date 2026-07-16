# Auditoría de inventario + keywords — 2026-07-16

> Disparador: Juan pidió un chequeo de las guías publicadas y staged (**sin tocar contenido**) para entender qué keywords/long-tail estamos posicionando hoy y qué tenemos construido, antes de lanzar un plan masivo de research de ideas nuevas. Datos 100% de fuentes verificadas mecánicamente (guides.ts + GSC), sin inferencias sin respaldo.

## Fuentes usadas

- `src/data/guides.ts` parseado con `node --experimental-strip-types` (Node 24 nativo, sin librerías nuevas): 136 guías totales.
- Snapshot fresco de Google Search Console: `python3.12 scripts/gsc/gsc.py fetch --days 90` → snapshot #22, ventana 2026-04-16 a 2026-07-14, 5.744 filas página×query.
- `docs/productos-backlog.md` (sección "Keywords validadas en reserva").
- JSON de respaldo: `docs/seo-reports/2026-07-16-data/guides-inventory.json` y `gsc-per-guide.json` (este último trae `totalImpr`/`totalClicks` reales por guía desde la dimensión `page`, más `topQueries` top-15 y `allVisibleQueries` con todas las keywords visibles reportadas por `page x query` — no confundir con el total real; el histórico completo de snapshots vive en `scripts/gsc/data/gsc.db`).

> **Correcciones post-auditoría Codex (2 pasadas, misma sesión):**
> 1. La v1 no canonicalizaba URLs con `#ancla` de GSC (ej. `/guias/x#seccion` contaba aparte de `/guias/x`), subcontando impresiones por guía. Corregido agrupando por URL sin fragmento.
> 2. La v2 seguía mal: usaba la dimensión `page x query` para el total por guía, pero GSC **no reporta ahí todas las queries individuales** (umbral de agregación/privacidad para las de bajo volumen) — la suma de `page x query` para una guía puede ser una fracción chica del total real. Ejemplo real: `atma-freidoras-de-aire-review` daba 1.360 impr sumando queries visibles, pero la dimensión `page` (el total real de la URL) da 6.285. **Corregido: los totales de impresiones/clicks por guía ahora salen de la dimensión `page` (canonicalizada por fragmento); la dimensión `page x query` se usa solo para listar qué keywords concretas son visibles, no para el total.**

## 1. Inventario: qué hay construido

**136 guías totales → 129 PUBLICADAS / 7 STAGED** (todas las staged con `publishedDate: 2026-09-01`, esperando la próxima tanda):

| Silo/categoría | Publicadas | Staged |
| :-- | --: | --: |
| freidoras-de-aire | 23 | 0 |
| perfumes-arabes | 15 | 0 |
| pavas-electricas | 13 | 0 |
| masajeadores | 12 | 0 |
| aspiradoras-robot | 12 | 0 |
| cafeteras | 12 | 0 |
| gaming | 9 | 1 (`kit-gamer`) |
| audio | 8 | 0 |
| cuidado-personal | 4 | 1 (`planchita-de-pelo`) |
| climatizacion | 4 | 1 (`ventilador-de-techo`) |
| cocina | 3 | 4 (`microondas-bgh`, `robot-de-cocina`, `microondas-atma`, `horno-atma`) |
| seguridad | 3 | 0 |
| tech | 3 | 0 |
| licuadoras | 6 | 0 |
| salud-bienestar | 1 | 0 |
| agua-caliente | 1 | 0 |

## 2. Rendimiento real en GSC (90 días)

### Top guías por impresiones REALES (dimensión `page`, no solo queries visibles)

| Guía | Impr | Clicks | Nº keywords visibles en `page x query` |
| :-- | --: | --: | --: |
| `mejores-freidoras-de-aire-argentina` (pilar) | 12.089 | 166 | 419 |
| `perfumes-arabes-mujer` | 9.214 | 97 | 364 |
| `atma-freidoras-de-aire-review` | 6.285 | 67 | 86 |
| `pava-electrica` (pilar) | 4.689 | 60 | 91 |
| `mejores-perfumes-arabes-hombre` | 4.620 | 51 | 283 |
| `masajeador-cervical` | 4.040 | 37 | 72 |
| `cafetera-express` | 3.173 | 54 | 146 |
| `estufa-electrica-bajo-consumo` | 3.105 | 17 | 152 |
| `perfumes-arabes-mas-vendidos-argentina` | 2.850 | 67 | 190 |
| `philips-freidoras-de-aire-review` | 2.800 | 18 | 77 |
| `mejor-aspiradora-robot` | 2.647 | 18 | 111 |
| `mejores-masajeadores-argentina` | 2.092 | 26 | 95 |
| `perfumes-arabes-por-color` | 2.049 | 3 | 98 |
| `perfumes-arabes-dupes` | 1.662 | 34 | 68 |
| `licuadora` | 1.636 | 16 | 132 |

**Total de impresiones reales sumando las 136 guías: 94.282** (90 días, dimensión `page`, fragmentos canonicalizados). Este es el número correcto para hablar de volumen — la columna "keywords visibles" es la cantidad de variantes long-tail distintas que GSC reportó de forma individual para esa guía, no el total de tráfico.

Lectura: 3 clusters (freidoras, perfumes árabes, pavas/masajeadores) concentran la mayoría del volumen. Cada guía top tiene además 70-420 keywords long-tail visibles reportadas por separado — el patrón de "cola larga amplia" ya está pasando, y el volumen real detrás es bastante más alto de lo que la cola visible por sí sola sugiere (típico de GSC: muchas búsquedas de 1-2 impresiones no se listan individualmente pero sí suman al total de la página).

### Oportunidades en distancia de gol (posición 5-15, ≥30 impresiones — empujón a página 1)

Selección de las primeras filas de `gsc.py oportunidades` (no es la tabla completa), listas para optimizar título/meta o reforzar contenido (no tocado, solo listado):

| Keyword | Impr | Posición | Página |
| :-- | --: | --: | :-- |
| perfume arabe hombre | 377 | 11,9 | `/guias/mejores-perfumes-arabes-hombre` |
| cual es la mejor freidora de aire en argentina | 376 | 8,7 | `/guias/mejores-freidoras-de-aire-argentina` |
| que estufa electrica gasta menos | 221 | 8,6 | `/guias/climatizacion/estufa-electrica-bajo-consumo` |
| cuál es la mejor freidora de aire | 146 | 14,7 | `/guias/mejores-freidoras-de-aire-argentina` |
| los 10 mejores perfumes árabes de mujer | 155 | 9,2 | `/guias/perfumes-arabes-mujer` |
| cual es la estufa electrica que menos consume | 111 | 9,3 | `/guias/climatizacion/estufa-electrica-bajo-consumo` |
| perfumes arabes de hombre | 101 | 12,8 | `/guias/mejores-perfumes-arabes-hombre` |

(lista completa en `scripts/gsc/` vía `gsc.py oportunidades`, no reproducida entera acá).

### CTR flojo (impresiones altas, casi 0 clicks — candidatas a reescribir title/meta)

Top del hallazgo: `productos` (872 impr, 0 clicks, home), `perfume arabe hombre` (377 impr, 0 clicks), `que estufa electrica gasta menos` (221 impr, 0 clicks), `pava peabody pe-dk2200n digital () reviews` (110 impr, 0 clicks — el `()` vacío sugiere un template de título con placeholder sin llenar en esa ficha/guía).

### Canibalización detectada (misma keyword, más de una URL)

- `cual es el mejor masajeador cervical argentina` — 2 URLs, 297 impr combinadas.
- `pava peabody pe-dk2200n digital 1,5 litros negro` — 2 URLs, 150 impr.
- `pava peabody pe-dk2200n digital () reviews` — 2 URLs, 142 impr.

### Publicadas con CERO impresiones reales en GSC (90 días) — 1 sola guía

Con el total correcto (dimensión `page`), de las 136 guías **solo `suono-airfryer-review`** (publicada 26-jun, 20 días) tiene 0 impresiones reales. Todas las demás que en la v1/v2 de este reporte parecían "sin datos" en realidad sí tienen impresiones — lo que no tenían era queries individuales visibles en `page x query` (normal por el umbral de agregación de GSC en páginas con poco volumen). Ejemplos reales: `kanji-home-freidora-review` 99 impr, `masajeador-donde-comprar-argentina` 12 impr / 1 click (a pesar de sus 96 días, no está en cero — pero con solo 12 impresiones en 3 meses sigue siendo la de peor performance del sitio entre las publicadas hace tiempo, vale la pena mirarla), `cafetera-liliana` 75 impr, `sillon-masajeador` 62 impr, `cafetera-peabody` 57 impr.

`suono-airfryer-review` (20 días) todavía puede ser indexación pendiente, normal a esa antigüedad — no hace falta acción todavía, solo seguimiento.

## 3. Keywords validadas y NO ejecutadas todavía (backlog listo para research masivo)

De `docs/productos-backlog.md`, research Ubersuggest 2026-07-06 AR, canibalización ya chequeada:

| Keyword | Vol/mes | SD | Intención |
| :-- | --: | --: | :-- |
| smartwatch | 40.500 | 31 | Transaccional |
| aspiradora | 33.100 | 20 | Transaccional (⚠️ riesgo medio, solapa con silo robot) |
| termo | 27.100 | 19 | Transaccional |
| tostadora | 12.100 | 12 | Transaccional |
| parrilla eléctrica | 6.600 | 11 | Transaccional |
| alarma para casa | 4.400 | 20 | Comercial, CPC alto |
| cerradura inteligente | 1.900 | 10 | Transaccional |

## 4. Historial de auditoría externa (Codex)

- **1ª pasada:** NO-GO parcial. Encontró el bug de fragmentos `#ancla` sin canonicalizar y la mala clasificación de antigüedad. Corregido.
- **2ª pasada:** NO-GO. Encontró que usar `page x query` para el total por guía subestima fuerte (GSC no reporta todas las queries individuales de bajo volumen), y que la lista de "16 sin datos" estaba mal — 15 de esas 16 sí tenían impresiones reales. Corregido usando la dimensión `page` para totales.
- **Gemini/agy:** no pudo correr en esta sesión (headless sin permiso de lectura de archivos, no forzado por seguridad). Pendiente: Juan puede correr `agy` una vez de forma interactiva para destrabarlo, o se hace la lectura SERP de las 7 keywords en reserva por otra vía cuando arranque la fase 2.
- **3ª pasada: GO.** Codex verificó los 136 totales contra `scripts/gsc/data/gsc.db` (dim `page`, canonicalizado) con 0 diferencias. Reporte cerrado y confiable para decisiones.

Inventario (sección 1) validado sin objeciones en las 3 pasadas.
