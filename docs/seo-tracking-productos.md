# Tracking de optimizaciones de fichas de producto (SEO)

> Archivo interno de seguimiento de las páginas `/producto/`. Registra el estado **ANTES** de optimizar cada ficha (baseline en GSC) para poder medir la evolución después.
> Gemelo de `seo-tracking-optimizaciones.md`, que es para las guías `/guias/`. Se mantienen separados para no mezclar.
>
> **Regla de oro:** el baseline NO se pisa. Cuando re-medimos, agregamos una sección nueva con la fecha, no reemplazamos el número viejo. Así se ve la curva real.

---

## Cómo usar este archivo

1. **Antes de optimizar** una ficha, buscala en la tabla "Baseline". Si está, ese era su estado previo (impresiones, clicks, posición). Sirve para saber de dónde partimos.
2. **Después de optimizar**, agregá o actualizá la fila: completá `Optimizada` con la fecha (`AAAA-MM-DD`) y dejá el baseline intacto.
3. **Para medir evolución** (a las ~3-4 semanas de optimizar): exportar GSC del **sitio completo** (no filtrado por query), últimos 3 meses. Comparar impresiones / clicks / posición actuales contra el baseline. Anotar el resultado en la sección **"Mediciones posteriores"** con su fecha.
4. **Criterio de éxito** por tipo de cambio:
   - Snippet/CTR (title y meta): subió el CTR a misma o mejor posición.
   - Empuje de ranking (enlazado interno, profundidad): bajó el número de posición (ej. 10 → 6).
   - Página nueva o página 2: aparecieron impresiones/clicks que antes no estaban.

### Notas de medición
- `Pos` = posición media en GSC (más bajo es mejor). `n/d` = sin datos suficientes para promediar.
- `CTR` = clicks / impresiones del período.
- Las URLs son `https://productosvirales.com.ar/producto/<slug>`.
- El freno de CTR en estas fichas no suele ser el snippet sino la **posición** (puesto 7-10) en una SERP transaccional dominada por MercadoLibre. La palanca real de posición es el enlazado interno + autoridad de dominio.

---

## Baseline (snapshot GSC 2026-06-28, período 8 abr – 26 jun)

Primera tanda de optimización de páginas `/producto/` (2026-06-28). Hallazgo: el 80% de las fichas con tráfico **ya estaban optimizadas** (seoTitle + metaDescription + veredicto + FAQ). El laburo real fue acotado: completar las pocas que corrían con el título crudo de ML, dos retoques de gancho/FAQ en las páginas top, y enlazado interno desde guías de marca hacia su ficha.

| Ficha (id ML) | Impr | Clicks | Pos | CTR | Qué se hizo | Optimizada |
| :-- | --: | --: | --: | --: | :-- | :-- |
| MLA47275624 (pava Peabody PE-DK2200N) | 554 | 7 | 6.94 | 1.3% | meta con gancho mate | 2026-06-28 |
| MLA39861162 (freidora Atma FR248ABP 8L) | 196 | 0 | 8.24 | 0% | link interno desde guía Atma | 2026-06-28 |
| MLA38663195 (lámpara velador Dakota) | 70 | 0 | 7.66 | 0% | metaDescription nueva | 2026-06-28 |
| MLA43422049 (cepillo eléctrico 9 en 1) | 67 | 1 | 6.66 | 1.5% | metaDescription nueva | 2026-06-28 |
| MLA43928643 (proyector Gadnic P-3129) | 66 | 0 | 8.59 | 0% | metaDescription nueva | 2026-06-28 |
| MLA1454279831 (velador mesa USB-C) | 63 | 0 | 8.05 | 0% | seoTitle + meta nuevos | 2026-06-28 |
| MLA43926951 (proyector Android HY300 9000lm) | 50 | 1 | 7.74 | 2.0% | seoTitle + meta nuevos | 2026-06-28 |
| MLA62320294 (freidora Ninja Crispi 5.2L) | 44 | 0 | 16.59 | 0% | seoTitle + meta nuevos | 2026-06-28 |
| MLA24692647 (proyector LED Dakota 8500lm) | 34 | 1 | 11.74 | 2.9% | metaDescription nueva | 2026-06-28 |
| MLA42113760 (freidora Kanji Home 8L) | 34 | 0 | 10.06 | 0% | meta nueva + link interno desde guía Kanji | 2026-06-28 |
| MLAU3407622515 (perfume Jamal árabe) | 32 | 2 | 8.06 | 6.2% | seoTitle + meta nuevos | 2026-06-28 |
| MLA38719920 (secador vidrios Kiokio) | 30 | 0 | 12.20 | 0% | metaDescription nueva | 2026-06-28 |
| MLA19053146 (Bharara King EDP) | 19 | 0 | 6.26 | 0% | FAQ alineada a query "árabe o americano" | 2026-06-28 |

---

## Silo gaming (STAGED, sin publicar — enriquecido 2026-06-30)

Las 17 fichas gaming importadas de ML en jun 2026 estaban **peladas** (solo specs + description, sin seoTitle/verdict/pros/cons/articleBody/faq). Se llevaron al estándar de oro de `/producto/` el 2026-06-30: investigación de specs reales contra el sitio del fabricante (Alpina, Cougar, Corsair, Redragon, HyperX, Aula, Logitech, Razer, Kotion) y desmentido de exageraciones típicas del nicho (7.1 surround que es virtual y solo en PC, RGB por zonas vs por tecla, layouts sin ñ, pesos máximos inflados, apoyabrazos fijos que la publicación no aclara). **Sin "Voz del comprador"**: la API de opiniones de ML está cerrada, así que los contras salen de specs y límites técnicos reales, no de reseñas. **Sin baseline GSC** (nunca estuvieron en vivo). Precio/rating/reviewCount se mantuvieron tal cual del bloque (datos reales de ML).

| Tipo | Fichas (id ML) |
| :-- | :-- |
| Sillas | MLA47061669 (Alpina FT-088), MLA26019250 (Cougar Armor Elite), MLA69124616 (Cougar Fusion EX), MLA47084299 (Alpina PRE-FT055), MLA16171813 (Corsair T3 Rush) |
| Teclados | MLA16369071 (Redragon Kumara K552), MLA14075573 (HyperX Alloy Core), MLA57380272 (Aula F75), MLA8906508 (Logitech G213), MLA19893399 (Redragon K622 Horus), MLA16085611 (Razer Huntsman Mini) |
| Auriculares | MLA9406415 (Kotion Each G9000), MLA16280514 (Razer BlackShark V2 X), MLA18651915 (Logitech G435), MLA8732921 (HyperX Cloud Alpha), MLA58836044 (Redragon Ire Pro H848), MLA16269737 (Logitech G733) |

Medir una vez publicadas + crawleadas.

---

## Mediciones posteriores

> Agregar acá cada re-medición. Formato sugerido: una subsección por fecha de export, con las URLs que cambiaron y el delta contra el baseline (o contra la medición anterior).

### Próxima medición agendada: ~2026-07-26 (≈4 semanas)

_(pendiente: exportar GSC del sitio completo y comparar las 13 fichas contra el baseline 2026-06-28)_

<!--
Plantilla para cada medición nueva:

### Medición AAAA-MM-DD (export GSC últimos 3 meses)

| Ficha (id ML) | Impr (antes→ahora) | Clicks (antes→ahora) | Pos (antes→ahora) | Lectura |
| :-- | :-- | :-- | :-- | :-- |
| MLA47275624 | 554 → ___ | 7 → ___ | 6.94 → ___ | ___ |
-->
