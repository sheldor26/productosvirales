# Threads — seguimiento de posts de bajas de precio

Log manual para encontrar qué patrón funciona (gancho, categoría, franja horaria).
Completar vistas/seguidores a las 24-48hs de publicado. Entradas nuevas arriba.

---

## Formato v3 (hype/cupón, desde 2026-08-09)

**Reemplaza al v2 en Threads** — decisión explícita de Juan, copiando el formato
que ya vio funcionar a otras cuentas del nicho, no un experimento a ciegas.
Ver memoria `threads-formato-hype-cupon-no-curador-honesto`. El formato v2
"curador honesto" sigue siendo la voz del resto del sitio, no de Threads.

Desde el 2026-08-10, el flujo pasó a generar 2 imágenes por post (precio +
beneficios) con `scripts/generar-imagen-post-threads.cjs` +
`scripts/generar-imagen-beneficios-threads.cjs`, en vez de captura de pantalla
cruda de la ficha de ML. Ver memoria `threads-generador-imagen-post`.

Línea de base (posts reales de Juan, formato copiado a mano antes de este log):
DualSense PS5 Gray Camouflage con cupón DOBLE88 → **283 vistas, el mejor
resultado de la cuenta hasta ahora** (post viejo, sin el generador de imágenes).

| Fecha | Producto | Categoría | Cupón real | Precio verificado | Vistas | Seguidores | Notas |
|---|---|---|---|---|---|---|---|
| 2026-08-13 | Aspiradora Robot Fika Trapeadora Swift | Electrodomésticos/robot-aspiradora | no (solo % OFF) | sí, Chrome vivo | | | Tienda oficial FIKA (+250 mil ventas), 4.8★/151 op., +100 vendidos, badges reales MÁS VENDIDO + OFERTA IMPERDIBLE, 54% OFF. Stock sano (+25 disponibles). Publicado también en Instagram (feed + Historia) vía API el mismo día. |
| 2026-08-13 | Cafetera Expresso Cuk By Gadnic 20 Bar | Cocina | no (solo % OFF) | sí, Chrome vivo | | | Tienda oficial Gadnic, 4.6★/118 op., +500 vendidos, 57% OFF. Precio real de 1 unidad confirmado — la página también mostraba precio por pack de 2 y 10 unidades, no usado. |
| 2026-08-11 | Control DualSense PS5 Gray Camouflage (redo) | Gaming | no (solo % OFF) | sí, Chrome búsqueda de ML | 80 (parcial, sigue sumando) | | Repetición del producto que dio 283 vistas históricas, esta vez con precio actual y las 2 imágenes generadas. Tienda oficial ML, 4.9★/93.126 op., 43% OFF. |
| 2026-08-10 | Auriculares JBL Wave Beam 2 TWS | Audio | no (solo % OFF) | sí, Chrome búsqueda de ML | | | Primer post con la plantilla branded generada por script, no captura cruda de ML — pasó 2 rondas de trio-auditor (GO). Tienda oficial JBL, 4.8★/834 op., +5 mil vendidos, badge real "MÁS VENDIDO" (no "última unidad": tenía +50 disponibles). Confirmado publicado por Juan. |

---

## Formato v2 (desde 2026-07-27)

Cambios respecto del v1, todos con dato atrás (ver `~/.claude/skills/price-drops-threads/SKILL.md`):
**foto obligatoria**, **una sola contra**, **pregunta abierta de cierre**, **1 topic tag**,
**responder los propios comentarios**, **publicar 6-11 AM de día de semana**.

Línea de base a superar (v1, texto puro, sin pregunta): 8 vistas / 1 seguidor en el mejor caso medido.

| Fecha | Hora | Producto | Categoría | Gancho | Foto | Pregunta | Respondí comentarios | Vistas | Seguidores | Notas |
|---|---|---|---|---|---|---|---|---|---|---|
| 2026-07-29 | ? | Licuadora Atma Pro LI8450AP | Cocina | 1 (dato) | sí | sí | | | | Hora sin definir — completar al publicar para clasificar variante del test de horario. Precio verificado en vivo, coincide exacto (sin ambigüedad de multi-oferta). |
| 2026-07-28 | 10:00 | Lattafa Yara Tous | Belleza/perfumes | 1 (dato) | sí | sí | | | | Variante A del test de horario (mañana, martes 10:00 = buen slot según Buffer). Contra con cita textual de reseña. Precio verificado en vivo. |
| 2026-07-27 | 20:00 | Pava Liliana AP152 | Cocina/mate | 1 (dato) | sí | sí | | | | 1er post v2. Franja noche = variante B del test de horario (Buffer la marca como la peor). Precio verificado en vivo con Bright Data. |

---

## Formato v1 (histórico, hasta 2026-07-26)

Texto puro, sin foto, sin pregunta de cierre, cierre con CTA estático, hora sin registrar.
Se conserva como línea de base para comparar.

> ⚠️ **Todas las filas fechadas 2026-07-20 quedaron con precios desactualizados**:
> se armaron con un diff cacheado de ese día que se siguió reusando por error
> en mensajes de días posteriores (25/07 real). Hubo 2 corridas de precios más
> después (22/07, 24/07). Antes de publicar cualquiera de esas filas,
> confirmar el precio actual en ML — no confiar en el "antes/ahora" original.
> Columna "Stock estable" (chequeado 20/07 contra `docs/cambios-de-stock.md`,
> 2+ apariciones = historial de pausas) es una señal aparte, sigue siendo
> válida, pero no alcanza sola — ver memoria `threads-drops-chequear-stock-inestable`.

| Fecha | Producto | Categoría | Gancho | Stock estable | Vistas | Seguidores | Notas |
|---|---|---|---|---|---|---|---|
| 2026-07-16 | Copa Mundial FIFA 2026 Panini | Coleccionables | 1 (dato) | — | | | tema, no baja grande |
| 2026-07-20 | Tira LED RGB Hytoshy 5m | Hogar/decor | 1 (dato) | **NO (6 flips)** | | | precio real en ML: $16.000, confirmado mal por Juan |
| 2026-07-20 | Lattafa Yara Moi EDP 100ml | Belleza | 1 (dato) | **NO (9 flips)** | | | precio real en ML: $50.934, confirmado mal por Juan |
| 2026-07-20 | Cargador Gadnic Power Bank 20000mAh | Tecnología | 1 (dato) | **NO (6 flips)** | | | sin confirmar en ML todavía |
| 2026-07-20 | Masajeador Cervical Lumbar Gadnic | Belleza/Salud | 1 (dato) | sí (0) | | | |
| 2026-07-20 | Microondas Grill Samsung MG23F3K3TAK | Cocina | 1 (dato) | sí (0) | | | repite gancho eléctrico (secundario) |
| 2026-07-20 | Afeitadora Wahl Travel Shaver | Cuidado Personal | 1 (dato) | sí (0) | | | |
| 2026-07-20 | Audio-Technica ATH-M30x | Auriculares | 1 (dato) | **NO (6 flips)** | | | sin confirmar en ML todavía |
| 2026-07-20 | Aspiradora Robot Gadnic 5 Modos | Electrodomésticos/robot-aspiradora | 1 (dato) | **NO (12 flips)** | | | sin confirmar en ML todavía |
| 2026-07-20 | Balanza Femmto BCS15 | Salud y Bienestar | 1 (dato) | **NO (12 flips)** | | | sin confirmar en ML todavía |
| 2026-07-20 | Amazon Fire TV Stick 4K Select | Tecnología | 1 (dato) | sí (0) | | | |
| 2026-07-20 | Freidora Philips Canasta Doble 9L PHNA35100 | Cocina/airfryer | 1 (dato) | sí (0) | | | gancho eléctrico (20A vs 10A) |
| 2026-07-20 | Ducha Eléctrica Lorenzetti Loren Shower Ultra | Climatización/seguridad | 1 (dato) | sí (0) | | | gancho de seguridad, no solo precio |
| 2026-07-20 | Termo Stanley Mate System Classic | Hogar/mate | 1 (dato) | **NO (6 flips)** | | | sin confirmar en ML todavía |
| 2026-07-20 | Freidora Oster Dual 7.6L Diamondforce | Cocina/airfryer | 1 (dato) | **NO (6 flips)** | | | sin confirmar en ML todavía |
| 2026-07-20 | Auriculares Logitech G733 | Gaming | 1 (dato) | **NO (12 flips)** | | | baja más grande del día (-46%), sin confirmar en ML |
| 2026-07-25 | Cepillo de Dientes Suono Premium | Cuidado Personal | 1 (dato) | sí (0) | | | verificado con Bright Data en vivo, coincide exacto |
| 2026-07-25 | Aspiradora Robot Roborock Q7 L5 | Electrodomésticos/robot-aspiradora | 1 (dato) | sí (0) | | | verificado: fecha real 24/07 + sitio en vivo coincide |
| 2026-07-25 | Google TV Streamer 4K | Tecnología | 1 (dato) | sí (0) | | | verificado: fecha real 24/07 + sitio en vivo coincide |
| 2026-07-20 | Xiaomi Vacuum X20 Max | Electrodomésticos/robot-aspiradora | 1 (dato) | sí (0) | | | premium, gancho enchufe extranjero — DESACTUALIZADO, no publicar sin reconfirmar |
| 2026-07-20 | Parlante Torre Aiwa AW-T2018R | Audio | 1 (dato) | sí (0) | | | |
| 2026-07-20 | Dispensador de Alimentos 5 Comp. | Cocina/organización | 1 (dato) | sí (0) | | | |
| 2026-07-19 | Cámara Ezviz TY1 | Seguridad | 1 (dato) | | | |
| 2026-07-19 | Parlante JBL Charge 5 | Audio | 1 (dato) | | | corrige fila anterior (era Go Essential por error) |
| 2026-07-16 | Planchita Allure PL1010AP | Cuidado Personal | 1 (dato) | | | |
| 2026-07-16 | Mini Proyector Maxnova HY320 | Tecnología | 1 (dato) | | | |
| 2026-07-16 | Termotanque Exahome 40L | Climatización | 1 (dato) | | | |
| 2026-07-16 | Control GameSir Nova 2 Lite | Gaming | 1 (dato) | | | |
| 2026-07-16 | Proyector Oso Astronauta MTI 731 | Hogar/novedad | 1 (dato) | | | |
| 2026-07-16 | Pava Eléctrica Telefunken PE800 | Cocina/mate | 1 (dato) | | | |
| 2026-07-16 | Torre Sonido JVC XS-LA5214 | Audio | 1 (dato) | | | |
| 2026-07-16 | Auriculares Alpina F50 Pro | Audio/deporte | 1 (dato) | 8 | 1 | primer post de la cuenta |

## Ganchos (referencia)

1. **Dato** — arranca con el número de la baja o el precio.
2. **Experiencia** — arranca con "lo venía mirando / lo tenía marcado".
3. **Contra primero** — arranca con el defecto real, después el precio.

## Cómo leer el patrón (revisar cada 5-6 posts)

- ¿Qué gancho repite mejor ratio vistas/seguidor?
- ¿Categoría con más tracción (audio, gaming, hogar, perfumes)?
- ¿Franja horaria del post con más vistas tempranas?
