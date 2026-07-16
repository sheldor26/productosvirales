# Research masivo de nichos nuevos — 2026-07-16

> Disparador: tras la auditoría de inventario de la misma sesión ([2026-07-16-auditoria-inventario.md](2026-07-16-auditoria-inventario.md)), Juan pidió un research masivo de ideas nuevas: Ubersuggest + Keyword Planner (Google Ads, recién aprobado) + tendencias de MercadoLibre + tendencias de Amazon (como radar de qué puede llegar a Argentina), para encontrar productos que el sitio todavía no cubre. Auditado por Codex (Gemini/agy bloqueado en esta sesión, ver nota al final).

## Fuentes usadas

- **Keyword Planner (Google Ads API):** recién aprobado (pedido 2026-07-11, activo desde esta sesión). `scripts/keyword-planner/kwp.py`, geo AR (2032), idioma es (1003).
- **Ubersuggest MCP:** `keyword_overview` para SD (search difficulty), intención y estacionalidad mes a mes (13 meses de histórico), locId 2032 Argentina.
- **Agente de tendencias (browser):** exploró en vivo `https://tendencias.mercadolibre.com.ar/` (3 listas: Más crecieron, Más deseadas, Más populares) y Amazon Best Sellers por categoría (EE.UU., como radar de qué puede llegar a Argentina). **Amazon Movers & Shakers no cargó** en esta sesión ("no hay Productos del momento disponibles en esta categoría, vuelve más tarde") — no es un bug del agente, la propia página lo dijo así con la dirección de envío en Argentina (modo "Amazon Bazaar"). Se compensó con Amazon Best Sellers, que sí cargó con datos reales (reviews, precio, ranking).
- **Cruce de canibalización:** contra las 136 guías reales de `src/data/guides.ts` (mismo inventario de la auditoría anterior), no contra suposiciones.
- **Bright Data MCP (pasada adicional post-cierre):** Juan autorizó el conector después de la primera versión de este reporte. Con `scrape_as_markdown`/`scrape_batch` se reintentó: (a) Amazon Movers & Shakers (4 URLs de categoría) — **volvió a fallar, esta vez con Bright Data también** (mensaje "no movers and shakers available in this category" en las 4). (b) `tendencias.mercadolibre.com.ar` — el scrape trajo una vista distinta a la del browser (una lista alfabética "Productos más buscados" en vez de las 3 cajas segmentadas), que confirma casi todo lo ya encontrado y suma candidatos nuevos: **yogurtera, calefón, aire acondicionado inverter** — validados con Ubersuggest, ver Tier 1 actualizado.
- **Verificación final de Amazon Movers & Shakers (Claude in Chrome, cuenta real de Juan):** para descartar que el fallo fuera por geolocalización (IP/dirección de envío de Argentina), se probó una tercera vez navegando con el Chrome real de Juan, logueado, con dirección de envío cambiada a Nueva York, EEUU. **El resultado fue el mismo: la página no muestra el ranking real**, solo módulos de recomendación genéricos ("Customers who viewed items in your browsing history also viewed"). Con 3 intentos fallidos (browser sandbox, Bright Data, cuenta real en EEUU) la conclusión ya no es "problema de Argentina" sino que **Amazon dejó de poblar esta página con datos reales** para la mayoría de las sesiones — se descarta como fuente confiable para este research. **Amazon Best Sellers** (`amazon.com/Best-Sellers/zgbs`), en cambio, sí carga con datos reales consistentemente en los 3 intentos, y de ahí salieron 2 candidatos nuevos: **Chromecast/streaming y AirTag/rastreadores**, ver tablas.

## 1. Qué encontró el radar de tendencias (ML + Amazon)

Del agente de investigación, señales con **doble confirmación** (aparecen en ambas fuentes) o **triple repetición** dentro de ML Tendencias (aparece en las 3 listas: crecimiento, deseadas, populares):

- **Termos / botellas térmicas (mate y tipo tumbler):** la señal más repetida. "Termo stanley" en ML Tendencias populares; en Amazon, el Owala FreeSip y el Stanley Quencher aparecen en 4 categorías distintas de Best Sellers con 129.861 y 208.355 reviews respectivamente.
- **Notebook / Tablet / Celulares:** top de "Más deseada" en ML Tendencias (Notebook #1, Samsung #4, Celulares #5), pero categorías hiper-competidas dominadas por tiendas oficiales.
- **Figuritas / álbum Mundial 2026:** aparece en las 3 listas de ML Tendencias (posiciones 6, 8 y 15). Ver caveat en la sección 3 — la demanda sigue fuerte, el problema es que llegamos sobre el final del ciclo (el Mundial termina el 19-jul).
- **Cortinas blackout / roller:** #4 "Más popular" en ML Tendencias.
- **Wifi mesh / hub USB-C / cargador notebook:** de Amazon Best Sellers en Computadoras y Accesorios (TP-Link Deco #1 con 12.931 reviews, Anker Hub #3 con 18.321 reviews).
- **Báscula de cocina / mancuernas:** de Amazon Best Sellers en Cocina y Deportes, ambos con cientos de miles de reviews en el mercado de origen.
- **Zapatillas deportivas:** ocupa los 5 primeros puestos de "Mayor crecimiento" en ML Tendencias — la señal más fuerte de todo el ranking, pero es moda/ropa, fuera del foco habitual del sitio (electro/hogar/tech). Se deja anotado, no se investiga en profundidad.
- **Microondas, PS5/consolas, lavarropas/heladera-freezer:** el agente los marcó como huecos, pero al cruzar contra `guides.ts` **microondas ya está cubierto** (pilar + horno-vs-microondas publicadas, BGH + Atma STAGED para el 2026-09-01) y PS5 solo tiene cubierto el accesorio (joystick-ps5), no la consola — matices en la sección 2.

## 2. Candidatos validados con datos reales (Keyword Planner + Ubersuggest)

### Tier 1 — mejor combinación volumen + SEO difficulty bajo + sin canibalización

| Keyword | Vol/mes (Ubersuggest AR) | SD | Intención | Nota |
| :-- | --: | --: | :-- | :-- |
| yogurtera | 33.100 | 12 | Transaccional | **Nuevo (Bright Data), el mejor del lote**: volumen enorme y SD bajísimo. Pico estacional histórico en octubre (60.500), primavera AR |
| termo (mate) | 27.100 | 19 | Transaccional | Del backlog original, reconfirmado con datos frescos |
| smartwatch | 40.500 | 31 | Transaccional | Del backlog original, reconfirmado |
| aire acondicionado inverter | 22.200 | 17 | Transaccional | Nuevo (Bright Data), distinto de `aire-acondicionado-portatil` ya existente (ahí son equipos portátiles; acá es el split/inverter fijo, el tipo dominante en hogares argentinos). Pico estacional histórico en diciembre (49.500), antes del verano |
| calefón | 14.800 | 11 | Transaccional | Nuevo (Bright Data), distinto de `termotanque-electrico` ya existente (calefón es a gas, termotanque es eléctrico — productos y compradores distintos) |
| bicicleta eléctrica | 18.100 | 23 | Transaccional | Nuevo |
| cortinas roller / blackout | 18.100 | 12 | Transaccional | Nuevo, de ML Tendencias (#4 popular) |
| dispenser de agua (frío/calor) | 14.800 | 12 | Transaccional | Nuevo |
| humidificador | 22.200 | 19 | Comercial | Nuevo, estacional invierno (pico may-jul, **estamos en la ventana ahora**) |
| planchas a vapor (ropa) | 14.800 | 13 | Comercial | Nuevo, distinto de `planchita-de-pelo` (esa es para el pelo) |
| mancuernas / pesas | 14.800 | 11 | Comercial | Nuevo, de Amazon Best Sellers (fitness en casa) |
| botella térmica (tipo Stanley/tumbler) | 12.100 | 11 | Transaccional | Nuevo, ángulo distinto de "termo" (mate) dentro del mismo silo bebidas térmicas |
| balanza de cocina | 8.100 | 11 | Transaccional | Nuevo — **no es lo mismo que `balanza-digital`** (esa es de cuerpo/composición corporal, verificado leyendo la guía existente) |
| tostadora | 12.100 | 12 | Comercial | Del backlog original |
| repetidor wifi | 6.600-8.100 | 15 | Transaccional | Nuevo, de Amazon Best Sellers (TP-Link Deco), extendería el silo `tech`. El volumen fuerte está acá, no en "wifi mesh" (ese término solo trae 1.300/mes — corrección de Codex, usar "repetidor"/"extensor de wifi" como keyword principal, no "mesh") |
| parrilla eléctrica | 6.600 | 11 | Transaccional | Del backlog original |
| alarma para casa | 4.400 | 20 | Comercial | Del backlog original |
| purificador de aire | 4.400 | 12 | Transaccional | Del backlog original, volumen más chico |
| cerradura inteligente | 2.900 | 10 | Transaccional | Del backlog original |
| chromecast / streaming para TV | 74.000 | 25 | Transaccional | **Nuevo (Amazon Best Sellers vía Chrome real)**: volumen altísimo (2do de toda la lista) con SD moderado, no bajo pero manejable. En Argentina "chromecast" se usa como término genérico para cualquier dispositivo de streaming (Fire TV Stick, TV box, etc.), similar a "Google" para buscador — ángulo: comparativa Chromecast/Google TV Streamer vs. Fire TV Stick vs. genéricos Android TV |

### Tier 2 — volumen alto pero SD más exigente o categoría más dura

| Keyword | Vol/mes | SD | Nota |
| :-- | --: | --: | :-- |
| monopatín eléctrico | 33.100 | 58 | Volumen enorme, pero SD casi el doble que el resto de la lista |
| silla ergonómica / de oficina | 14.800 | 53 | Distinta de `silla-gamer` (mercado de oficina/home-office, no gaming), pero SD alto |
| starlink Argentina | 60.500 | 66 | Nuevo (Bright Data), volumen enorme y SD alto (segundo más alto de todo el research, después de tablet con 76). Además el formato de contenido es distinto: no es "cuál modelo comprar" (un solo kit), es más "vale la pena / cobertura / precio" — bajo fit con el template de guía comparativa del sitio |
| procesadora de alimentos | 4.400 | 16 | Nuevo (Bright Data), volumen chico, sin urgencia |
| airtag / rastreador de objetos | 9.900 | 64 | Nuevo (Amazon Best Sellers vía Chrome real): la marca "airtag" concentra casi todo el volumen (el genérico "rastreador bluetooth"/"localizador de objetos" en español apenas tiene 20-50/mes) — SD alto y depende de ecosistema Apple, ángulo real sería "AirTag vs. alternativas Android" |

### Tier 3 — alto volumen, DESCARTAR o mirar con mucha cautela

| Keyword | Vol/mes | SD | Por qué cuidado |
| :-- | --: | --: | :-- |
| notebook | 110.000 | 29 | SD parece bajo pero es engañoso: SERP dominado por MercadoLibre mismo + Compumundo/Fravega/Garbarino + marcas oficiales. Ticket alto, decisión de compra no impulsiva. |
| tablet | 49.500 | 76 | SD más alto de todo el research — descartar por ahora |
| aspiradora (genérica) | 27.100 | — | **Riesgo real de canibalización** con el cluster `robot-aspiradora` (12 guías ya publicadas) — señalado también en el backlog original |
| lavarropas | ~74.000 (KWP) | — | Ticket muy alto, se compra en tiendas de electro con financiación en cuotas, no por impulso vía afiliado — no encaja con el patrón del sitio (freidoras/pavas/cafeteras son de ticket bajo-medio) |
| freezer / heladera | ~49.500 (KWP) | — | Mismo problema que lavarropas: electrodoméstico grande, ticket alto |
| celulares / notebooks / smartphones de marca (iPhone, Samsung) | muy alto | — | Hiper-competido, dominado por marcas oficiales; further, ML Tendencias los muestra pero no hay hueco editorial real |
| zapatillas deportivas | muy alto (señal #1 de ML Tendencias) | — | Fuera de foco: moda/indumentaria, no electro/hogar. Se anota como dato, no se recomienda ejecutar |

### Descartado por canibalización confirmada (no son oportunidad nueva)

- **balanza digital** — ya existe (`balanza-digital`, silo `salud-bienestar`, publicada).
- **microondas** — cubierto: `microondas` (pilar) y `horno-electrico-vs-microondas` ya están PUBLICADAS; `microondas-bgh` y `microondas-atma` están STAGED (`publishedDate: 2026-09-01`, corrección de Codex — el reporte original decía "silo completo publicado", lo cual era incorrecto en el estado de esas 2). La conclusión de canibalización se mantiene: el keyword ya está cubierto y en camino de estarlo más.
- **hub USB-C / cargador de notebook / repelente eléctrico de mosquitos:** la señal de Amazon existía, pero al validar con Keyword Planner en español AR el volumen real es bajísimo (590-1.900/mes hub USB-C, 720-1.000 cargador notebook, 20-140 repelente/trampa de moscas) — no alcanza el volumen mínimo que usa el sitio para justificar una guía nueva.

## 3. Caveat importante: álbum/figuritas Mundial 2026 — llegamos tarde a este ciclo

> **Corrección post-auditoría Codex:** la v1 de este reporte afirmaba que "el pico de compra ya pasó en marzo 2026" leyendo el histórico de Ubersuggest. Codex chequeó contra fuentes reales (AP, El País Argentina, FourFourTwo) y encontró **actividad fuerte y sostenida en mayo y junio 2026** (trueque de figuritas el 10-may, furor y faltantes reportados el 11-jun) — el interés NO cayó después de marzo como decía la lectura original del gráfico de Ubersuggest. Ese dato estaba mal interpretado.

KWP mostró un número enorme para "album mundial 2026" (246.000/mes) y "figuritas mundial 2026" (110.000/mes). El motivo real para descartarlo no es "ya pasó la ola", sino: **(a)** hoy es 16-jul-2026 y el Mundial 2026 termina el 19-jul — cualquier guía nueva llegaría en los últimos días del ciclo de consumo, sin tiempo real de posicionar y capturar la demanda; **(b)** es un producto único (el álbum oficial Panini), no hay "cuál conviene comprar" — bajo fit para el formato de guía comparativa del sitio. **Se descarta para este ciclo por timing tardío, no por demanda decreciente.** Anotado para la próxima vez: arrancar 2-3 meses ANTES del evento (la demanda ya viene fuerte desde esa ventana), no reaccionar cuando el torneo ya casi terminó.

## 4. Prioridad recomendada (para ejecutar, sujeto a que Juan decida)

De mayor a menor combinación de volumen + facilidad + fit de contenido + estacionalidad:

1. **Yogurtera** (33.100/mes, SD12) — el mejor combo volumen/SD de todo el research, y en ventana estacional ascendente (primavera-verano AR, se cocina el pico en sep-oct).
2. **Chromecast / streaming para TV** (74.000/mes, SD25) — el volumen más alto de todos los candidatos nuevos, SD manejable.
3. **Humidificador** (22.200/mes, SD19) — estamos en la ventana estacional (invierno AR) ahora mismo.
4. **Termo + botella térmica** (27.100 + 12.100/mes, SD19/11) — un solo silo nuevo "bebidas térmicas" con 2 ángulos (mate vs. tumbler deportivo).
5. **Aire acondicionado inverter** (22.200/mes, SD17) — estacional, conviene arrancar ya para estar publicado antes del pico nov-dic.
6. **Cortinas roller/blackout** (18.100/mes, SD12).
7. **Dispenser de agua** (14.800/mes, SD12).
8. **Planchas a vapor** (14.800/mes, SD13).
9. **Mancuernas** (14.800/mes, SD11).
10. **Calefón** (14.800/mes, SD11) — satélite del silo `agua-caliente` junto a `termotanque-electrico`.
11. **Balanza de cocina** (8.100/mes, SD11) — satélite chico, posible extensión del silo `salud-bienestar` o `cocina`.
12. **Smartwatch** (40.500/mes, SD31) — del backlog original, el de mayor volumen del lote de menor SD.
13. Resto del backlog original (tostadora, parrilla eléctrica, alarma para casa, purificador de aire, cerradura inteligente) sin cambios de prioridad.

## 5. Auditoría externa (Codex + Gemini/agy)

- **Gemini/agy:** bloqueado de nuevo en esta sesión (mismo problema de permisos en headless que en la auditoría anterior). No forzado con `--dangerously-skip-permissions` por el gate de seguridad de Claude Code — pendiente que Juan lo destrabe corriendo `agy` una vez de forma interactiva.
- **Codex — GO (3 pasadas sobre el cuerpo original).** 1ª: NO-GO por 2 bloqueantes reales — el caveat del Mundial 2026 decía "el pico ya pasó en marzo" sin evidencia real (Codex chequeó fuentes AP/El País/FourFourTwo y encontró actividad fuerte hasta junio), y "microondas silo completo publicado" era impreciso (2 de las 4 guías están STAGED). 2ª: quedó una frase residual sin actualizar en la sección 1. 3ª: **GO**, documento consistente. El resto del cruce (balanza-digital vs. balanza de cocina, aspiradora genérica, silla-gamer vs. silla ergonómica, repetidor wifi vs. wifi mesh, descartes de Tier 3) fue confirmado correcto por Codex sin objeciones desde la 1ª pasada.
- **Codex — GO (4ª pasada, agregado de Bright Data).** Tras autorizar el conector, se sumaron yogurtera/aire acondicionado inverter/calefón (Tier 1) y starlink/procesadora (Tier 2). 1er intento: NO-GO por una contradicción interna (starlink SD66 descrito como "el más alto" cuando tablet tiene SD76, más alto) — corregido. Confirmado sin canibalización real para aire acondicionado inverter (distinto de `aire-acondicionado-portatil`, que es explícitamente portátil) ni para calefón (distinto de `termotanque-electrico`, que es eléctrico de acumulación).
