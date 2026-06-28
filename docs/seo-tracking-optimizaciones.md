# Tracking de optimizaciones de guías (SEO)

> Archivo interno de seguimiento. Registra el estado **ANTES** de optimizar cada guía (baseline en GSC) para poder medir la evolución después.
> La skill `optimizador-guias-pv` lee este archivo antes de optimizar una guía: si la URL ya tiene baseline, lo usa para comparar; si no, la agrega.
>
> **Regla de oro:** el baseline NO se pisa. Cuando re-medimos, agregamos una columna/sección nueva con la fecha, no reemplazamos el número viejo. Así se ve la curva real.

---

## Cómo usar este archivo

1. **Antes de optimizar** una URL, buscala en la tabla "Baseline". Si está, ese era su estado previo (impresiones, clicks, posición). Sirve para saber de dónde partimos.
2. **Después de optimizar**, agregá o actualizá la fila: completá `Optimizada` con la fecha (`AAAA-MM-DD`) y dejá el baseline intacto.
3. **Para medir evolución** (a las ~3-4 semanas de optimizar): exportar GSC del **sitio completo** (no filtrado por query), últimos 3 meses. Comparar impresiones / clicks / posición actuales contra el baseline. Anotar el resultado en la sección **"Mediciones posteriores"** con su fecha.
4. **Criterio de éxito** por tipo de cambio:
   - Snippet/CTR (title y meta): subió el CTR a misma o mejor posición.
   - Empuje de ranking (tabla, profundidad, enlazado): bajó el número de posición (ej. 10 → 6).
   - Página nueva o página 2: aparecieron impresiones/clicks que antes no estaban.

### Notas de medición
- `Pos` = posición media en GSC (más bajo es mejor). `n/d` = sin datos suficientes para promediar.
- `CTR` = clicks / impresiones del período.
- Las URLs son `https://productosvirales.com.ar/guias/<slug>`.

---

## Baseline (snapshot GSC 2026-06-25, últimos 3 meses)

Estado **previo** a la primera tanda de optimización del 2026-06-26.

| Slug | Impr | Clicks | Pos | CTR | Publicada | Optimizada |
| :-- | --: | --: | --: | --: | :-- | :-- |
| atma-freidoras-de-aire-review | 2725 | 46 | 7.10 | 1.69% | 2026-04-18 | 2026-06-26 |
| mejores-freidoras-de-aire-argentina | 1863* | 31* | 9.60* | 1.66%* | 2026-04-15 | 2026-06-28 |
| philips-freidoras-de-aire-review | 1446 | 11 | 8.20 | 0.76% | 2026-04-27 | 2026-06-26 |
| mejores-perfumes-arabes-hombre | 1262 | 14 | 9.97 | 1.11% | 2026-04-17 | 2026-06-26 |
| masajeador-cervical | 1092 | 16 | 9.26 | 1.47% | 2026-04-11 | 2026-06-26 |
| perfumes-arabes-mujer | 1075 | 10 | 18.18 | 0.93% | 2026-04-17 | 2026-06-26 |
| mejores-masajeadores-argentina | 914 | 15 | 7.59 | 1.64% | 2026-04-11 | 2026-06-26 |
| perfumes-arabes-amaderados | 513 | 5 | 8.37 | 0.97% | 2026-04-17 | 2026-06-26 |
| pava-electrica-philips | 412 | 7 | 7.87 | 1.70% | 2026-04-13 | 2026-06-26 |
| mejor-aspiradora-robot | 369 | 3 | 15.08 | 0.81% | 2026-06-08 | revisada s/cambios (nueva) |
| perfumes-arabes-precio-argentina | 343 | 1 | 7.10 | 0.29% | 2026-04-17 | 2026-06-26 |
| pava-electrica-precio | 332 | 6 | 7.65 | 1.81% | 2026-04-25 | 2026-06-26 |
| perfumes-arabes | 271 | 2 | 8.48 | 0.74% | 2026-04-27 | 2026-06-26 |
| pava-electrica-peabody | 268 | 4 | 7.72 | 1.49% | 2026-05-09 | 2026-06-26 |
| pava-electrica-atma | 238 | 1 | 10.66 | 0.42% | 2026-04-20 | 2026-06-26 |
| masajeador-espalda | 201 | 6 | 11.72 | 2.99% | 2026-04-24 | 2026-06-26 |
| perfumes-arabes-originales | 169 | 1 | 7.62 | 0.59% | 2026-05-26 | 2026-06-26 |
| masajeador-donde-comprar-argentina | 11 | 1 | n/d | — | 2026-04-11 | 2026-06-26 |
| pava-electrica-mercadolibre | 4 | 0 | n/d | 0% | 2026-05-02 | 2026-06-26 |
| masajeador-gadnic | n/d | n/d | n/d | — | 2026-06-17 | revisada s/optimización (nueva, 11 días) |

**masajeador-gadnic (2026-06-28):** guía nueva (11 días), sin baseline en GSC todavía. No se re-optimizó por ser muy nueva (mismo criterio que `mejor-aspiradora-robot`). Sí se hizo un cambio de contenido puntual: el asiento Sauce (MLA19712537) quedó discontinuado en ML, se reemplazó por el Gadnic Acacia (MLA21263803, shiatsu, 4.7, ~$438.000) y se pasaron los links de afiliado a meli.la propios. `updatedDate` → 2026-06-28. Medir en la próxima tanda.

**mejores-freidoras-de-aire-argentina (2026-06-28):** guía pilar que la tanda del 26-06 NO había tocado (plateau real, nunca modificada desde 04-15). `*` = baseline de ventana 28 días (snapshot GSC propio 2026-06-26 vía el lector `scripts/gsc/`), no de 3 meses como el resto de la tabla. **Bug crítico encontrado y corregido:** los 20 links de afiliado "Ver en Mercado Libre" estaban rotos (`https://productosvirales.com.arhttps://meli.la/...` → 404); se arreglaron los 20 + 4 en atma-review + 4 en peabody-review (28 en total, la guía rankeaba sin monetizar). Optimización: seoTitle afilado a 57 car. con keyword al inicio e intención ("cuál comprar"), meta ≤155, bloque de respuesta directa tras el "Resumen rápido" para ganar el snippet de "cuál es la mejor freidora de aire en argentina" (pos 11), `updatedDate` → 2026-06-28. Contenido ya robusto (20 modelos + tabla + FAQ), no se reescribió. Medir en la próxima tanda.

**Qué se hizo en la tanda 2026-06-26 (resumen):** las 18 se llevaron al estándar de embudo de la skill (respuesta directa + tabla comparativa + pros/contras + FAQ + CTAs), se reforzó el enlazado interno hacia los hubs de cada silo, se dedujeron los heros duplicados (cada guía con imagen única), se limpiaron anglicismos crudos y se actualizó `updatedDate` a 2026-06-26. `mejor-aspiradora-robot` se revisó pero se dejó igual por ser muy nueva (18 días).

**Silo cocina (nuevo, STAGED — sin publicar, 2026-06-28):** 7 guías creadas y optimizadas el mismo día con investigación de fabricante (potencia de salida real vs consumo, garantías, convección confirmada, temperatura máx, dimensiones) ANTES de publicar: `microondas`, `horno-electrico`, `horno-electrico-vs-microondas`, `microondas-bgh`, `microondas-atma`, `horno-atma`, `robot-de-cocina`. Todas con `publishedDate: 2026-09-01` (ocultas hasta que Google procese las tandas anteriores). **Sin baseline GSC todavía** (nunca estuvieron en vivo). Optimización: seoTitles 52-54 car. con keyword al inicio, metas ≤155, fichas con datos técnicos verificados de fabricante y garantías. Correcciones factuales de la investigación: el BGH 65L NO pide toma de 20A (la ficha oficial dice 10A; el 20A era de otro modelo), el BGH 23L SÍ tiene grill, el "1500W" del BGH 28L es consumo (salida real 900W), Smartlife tiene 2 años de garantía (diferenciador), LG da 10 años al magnetrón. Medir una vez publicadas + crawleadas.

> Las fichas de producto (`/producto/`) se trackean aparte en [`seo-tracking-productos.md`](seo-tracking-productos.md).

---

## Mediciones posteriores

> Agregar acá cada re-medición. Formato sugerido: una subsección por fecha de export, con las URLs que cambiaron y el delta contra el baseline (o contra la medición anterior).

### Próxima medición agendada: ~2026-07-24 (≈4 semanas)

_(pendiente: exportar GSC del sitio completo y comparar contra el baseline)_

<!--
Plantilla para cada medición nueva:

### Medición AAAA-MM-DD (export GSC últimos 3 meses)

| Slug | Impr (antes→ahora) | Clicks (antes→ahora) | Pos (antes→ahora) | Lectura |
| :-- | :-- | :-- | :-- | :-- |
| ejemplo-slug | 343 → 520 | 1 → 6 | 7.10 → 5.8 | CTR recuperado + subió posición |
-->
