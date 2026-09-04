# Productos marcados sin stock — seguimiento y rutina de revisión

> Registro de fichas que se marcaron `visibility: 'deprioritized'` + `priceStatus: 'out_of_stock'`
> por falta de stock real (verificado en vivo, no solo el flag del catálogo), y qué se hizo en
> cada guía afectada. Objetivo: no perder de vista un producto que puede volver a stock, y no
> tener que repetir la investigación de "¿esto reapareció o ya no se fabrica más?" desde cero.
>
> No es lo mismo que `docs/productos-backlog.md` (esa es munición de productos sourceados que
> todavía no entraron a ninguna guía). Esta tabla es al revés: productos que SÍ estaban en una
> guía viva y se cayeron por falta de stock.

## Cómo funciona la rutina

**Parte automática (ya corre sola, no hace falta nada manual):** el workflow
`update-prices-brightdata.yml` dispara Bright Data 3 veces por semana (lunes/miércoles/viernes)
contra **todo** el catálogo, `deprioritized` incluido — la lista de URLs sale de todos los
`permalink` de `curated-products.ts` sin filtrar por `visibility`. `apply-brightdata-prices.cjs`
compara el `priceStatus` guardado contra el scrape de hoy y arma `stockChanges` con dirección
`"restock"` cuando algo que estaba `out_of_stock` vuelve a tener oferta activa. Eso queda en el
PR que el workflow abre para que Juan lo revise — **buscar la sección de restocks ahí antes de
asumir que hay que salir a chequear a mano.**

**Parte manual (esto sí hay que hacerlo, cada tanto o cuando se retoma este archivo):** Bright
Data solo puede decir "esta URL puntual volvió a tener stock" o "sigue sin". No puede decir
"este modelo ya no se fabrica más, pero salió un sucesor con otro nombre" — eso requiere
buscar en MercadoLibre a mano (o con el agente, vía Chrome logueado) igual que se hizo la
primera vez que se marcó el producto. Cuando una fila de la tabla lleva **4+ semanas sin que
Bright Data marque restock**, vale la pena una pasada de 5 minutos: buscar el modelo en ML,
ver si:

1. **Volvió el stock** (alguna publicación nueva o la vieja se repuso) → restaurar
   `visibility: 'normal'`, actualizar precio/afiliado, revisar si la guía necesita texto nuevo.
2. **Apareció un sucesor claro** (mismo fabricante, nombre/número de modelo distinto, específicamente
   reemplazando al anterior en el catálogo del vendedor) → evaluar migrar la ficha entera al
   sucesor, siguiendo `docs/fichas.md`.
3. **Sigue muerto y no hay sucesor obvio** → dejarlo como está, no hace falta re-registrar nada
   acá; se vuelve a mirar la próxima vez que se repase este archivo.

**Regla dura: nunca usar `scripts/stock-watchdog.cjs` ni `npm run prices:check/update` para esto.**
Dependen de la API oficial de MercadoLibre, que está bloqueada (401) desde 2026-07-03 y Juan
descartó explícitamente reautorizarla. Si alguna vez esos scripts empiezan a andar de nuevo, esta
nota se actualiza — hasta entonces, verificación puntual es siempre Chrome logueado
(`mcp__claude-in-chrome`, no el navegador sandbox, que ML bloquea).

**Cuándo agregar una fila nueva:** cada vez que se marque un producto `deprioritized` por falta
de stock real (no por rechazo del programa de afiliados, no por otra razón — esas van a
`docs/productos-backlog.md` con su propia nota). Completar todas las columnas, incluida "guías
afectadas y qué se hizo" con el detalle real (removido / callout sin stock / reemplazado por
X), para no tener que releer el diff de guides.ts para recordar el estado.

## Productos en seguimiento

| Producto | MLA ID | Marcado el | Motivo / verificación | Guías afectadas y qué se hizo | Último chequeo de restock |
| :-- | :-- | :-- | :-- | :-- | :-- |
| Pava Atma PEAT1351 (negra, publicación original) | MLA49747515 | 2026-08-31 | Publicación agotada, miles de reseñas perdidas. Verificado en vivo. | 8 guías `pava-electrica-*` + `pava-electrica-atma`: **reemplazado** por publicación nueva del mismo modelo, otro vendedor, sin historial propio (ver fila siguiente). | 2026-08-31 (recién marcado) |
| Pava Atma PEAT1351WP (blanca, publicación nueva) | MLAU4016948916 | — (ficha nueva, `visibility: normal`) | N/A — esta es la ficha que reemplazó a la de arriba. No forma parte del seguimiento de "sin stock" salvo que también se agote. | — | — |
| Proyector oso astronauta MTI 731 | MLA46927234 | 2026-08-31 | "Este producto no está disponible por el momento" en ML, 954 reseñas perdidas. Verificado en vivo. | `proyector-astronauta`: **reemplazado** por MTI M-733XL, mismo fabricante, otro vendedor (ver fila siguiente). | 2026-08-31 (recién marcado) |
| Proyector astronauta MTI M-733XL | MLA46994091 | — (ficha nueva, `visibility: normal`) | N/A — ficha que reemplazó a la de arriba. | — | — |
| Freidora Philips Essential HD927091 (6.2L) | MLA19630911 | 2026-08-31 | Precio real $999.999 (no error de scraper), pero **"Última unidad" + botón "Comprar ahora" deshabilitado en TODAS las publicaciones del modelo** (nuevas y usadas, cualquier vendedor) al verificar en vivo. No se encontró reemplazo del mismo modelo con compra funcional — el modelo XL Essential HD9280/90 (MLA19630913, ya en catálogo, $498.999, 4.9★/959 reseñas, stock real) es de la misma línea pero no el mismo SKU (tiene Wi-Fi/Alexa, precio bastante mayor). | `mejores-freidoras-de-aire-argentina`: sacado de quickPicks y del ranking "las 3 → 2 que más recomiendo", callout explicando la baja, tabla marcada sin stock. `philips-freidoras-de-aire-review`: sacado de quickPicks, su H3 pasó a callout de sin stock, ranking de los otros 4 modelos renumerado 1-4, tabla y veredicto actualizados. `ninja-vs-philips-freidora-de-aire`: callout agregado antes de la comparativa (la tabla y el product-card quedan como referencia; el componente ya muestra "Ver alternativas disponibles" en vez de un link de compra muerto). `recetas-freidora-de-aire`: sin cambios — mención de paso en una receta, el fallback del componente alcanza. | 2026-08-31 (recién marcado) |
| Cámara DJI Osmo Action 4 (Combo Estándar, negra) | MLA29364436 | 2026-09-03 | "Este producto no está disponible. Elige otra variante." en ML, reproducible tras recargar. Un solo color/variante en la publicación (no hay otra a la que saltar). Además, una reseña (Brasil, 4★) denuncia que la publicación "está hecha de manera que nos confunde… no es la Action 4, sino un modelo anterior" — posible mislabeling, no solo falta de stock. Verificado en vivo. Sucesores ya en catálogo: DJI Osmo Action 5 Pro (MLA66182550) y DJI Osmo Action 6 (MLA62340610, ya profundizada con articleBody+FAQ el mismo día). No se buscó un reemplazo 1:1 de la Action 4 puntual. | `camara-deportiva` y `dji-cual-comprar`: **resuelto** el 2026-09-03 — Action 4 sacada de ambas guías (quickPicks, ranking, tabla, precios piso, FAQ), reemplazada por DJI Osmo Action 5 Pro como nueva referencia de precio más barato; callout de sin-stock agregado en las dos. Las 4 fichas hermanas que la mencionaban en su articleBody (Gadnic MLA62771175, Akaso V50X MLA16132352, GoPro HERO13 MLA47374183, DJI Osmo Action 6 MLA62340610) tuvieron sus comparaciones de precio repuntadas contra Action 5 Pro/Action 6. | 2026-09-03 (recién marcado) |
| Difusor Aromatizador Humidificador Tren Locomotora 300ml (Electroland) | MLA841529901 | 2026-09-04 | "Publicación pausada" en ML, no se puede comprar. Verificado en vivo. No tenía guía propia todavía (huérfana, sourceada en una sesión anterior sin terminar). | Ninguna guía la enlazaba — sin impacto en contenido publicado. Se sacó de los `relatedProducts` de las 3 fichas hermanas de difusores que sí quedaron activas (Gadnic DIFU0001, USB simil madera, AJ-507). | 2026-09-04 (recién marcado) |
| Humidificador Portátil USB 220ml — Difusor Aromático Cápsula Blanca | MLA886877609 | 2026-09-04 | "Publicación pausada" en ML, no se puede comprar. Verificado en vivo. No tenía guía propia todavía (huérfana, sourceada en una sesión anterior sin terminar). | Ninguna guía la enlazaba — sin impacto en contenido publicado. Se sacó de los `relatedProducts` de las 3 fichas hermanas de difusores que sí quedaron activas (Gadnic DIFU0001, USB simil madera, AJ-507). | 2026-09-04 (recién marcado) |

## Fichas standalone deprioritized por otras razones (no son "sin stock", no siguen esta rutina)

Ver `docs/productos-backlog.md` para la lista completa (rechazos del Programa de Afiliados,
descartes editoriales, etc.). No se duplican acá para no tener dos fuentes de verdad.
