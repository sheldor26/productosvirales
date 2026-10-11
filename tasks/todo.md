# Checklist SEO semanal 2026-07-27

- [x] 1. Links internos con ancla exacta "perfume árabe hombre" desde perfumes-arabes (pilar), perfumes-arabes-mas-vendidos-argentina y perfumes-arabes-dupes → /guias/mejores-perfumes-arabes-hombre
- [x] 2. seoTitle de perfumes-arabes-por-color con "blanco y dorado" + metaDescription que abre con la pregunta del perfume blanco con tapa dorada
- [x] 3. seoTitle + H2 pregunta de mejor-aspiradora-robot con "trapeadora" (link también a mejores-robot-aspiradora-trapeadora, que estaba invisible)
- [x] 4. Link cuanto-consume-freidora-de-aire → estufa-electrica-bajo-consumo, ancla "qué estufa eléctrica gasta menos"
- [x] 5. Links hacia cafetera-nespresso desde cafetera-express y cafetera-de-capsulas, ancla "modelos y precios de cafeteras Nespresso"
- [x] Verificado: npm run build OK, eslint de guides.ts limpio, guides:check OK (4 chequeos), render verificado en dev server
- [ ] IndexNow: corre solo con el push de src/data (workflow); pendiente de commit+push de Juan

## Review

- Trío auditor: calificación final 10/10 de las tres IAs (Claude, Codex, Gemini) en la pasada 4. Antes: 3 pasadas hasta GO doble. Bloqueantes reales corregidos: (1) claim falso "la Atma es la única que trapea" en el H2 nuevo y en la FAQ preexistente de mejor-aspiradora-robot — según catálogo casi todas las seis trapean; reescrito con Gadnic AC800, S40c, S40 Pro, Fika y Atma linkeadas + contra honesta "trapeado de mantenimiento". (2) Fraseo de anclas "perfume árabe hombre" suavizado. (3) "los 15 mejores" removido del copy nuevo (la guía destino lista 13; queda como tarea aparte). El seoTitle "trapeadora" de mejor-aspiradora-robot quedó como riesgo aceptado con monitoreo semanal (contiene "mejor aspiradora robot" como substring, h1 intacto, rollback de una línea si cae la posición).
- 9 ediciones finales, todas en `src/data/guides.ts`. Sin cambios de estructura ni componentes.
- Decisión: NO se bumpearon las `updatedDate` de las guías tocadas. Son links internos y ajustes de título; bumpear la fecha resetearía las ventanas de maduración que usa el loop semanal para medir (el reporte compara contra fechas de update).
- En perfumes-arabes-mas-vendidos-argentina el ancla se cambió sobre el link existente (no se duplicó el link a la misma página).
- Pendiente de Juan: revisar diff, commitear y pushear (IndexNow se dispara solo).

---

# Agente QA de conversión semanal ("Cliente fantasma") - plan 2026-10-11

Objetivo: una corrida semanal automática que simula compradores, mide el camino hasta el clic de afiliado y cruza con GSC/GA4, y deja un reporte con acciones.

Arquitectura (sin dependencias nuevas: puppeteer, gsc.py y ga4.py ya existen):
- `scripts/qa-semanal/medir.cjs`: puppeteer en viewport móvil sobre el sitio en vivo. Por página mide: scroll hasta el primer CTA (`data-cta-location`), cantidad de CTAs, `rel="sponsored"` en links `meli.la`, presencia de veredicto/tabla/FAQ, links rotos. Salida JSON en `docs/qa-semanal/AAAA-MM-DD/`.
- Tarea programada (lunes, antes de la de ventas): corre medir.cjs, `gsc.py fetch/report`, `ga4.py affiliates`, y Claude actúa de 4 personas sobre el texto renderizado + capturas.
- Reporte: `docs/qa-semanal/AAAA-MM-DD.md`, máx. 1 página, termina con "Acción de hoy".

Fase 1 (esta sesión):
- [x] medir.cjs sobre las páginas con clics en GSC + todo el nicho robot aspiradora (65 páginas)
- [x] Prompt de las 4 personas + 7 pasos del agente: `scripts/qa-semanal/AGENTE.md`
- [x] Corrida manual completa: `docs/qa-semanal/2026-10-11.md` (pendiente de que Juan diga si sirve)
- [ ] Recién ahí: programar la tarea semanal

Fase 2 (features del sitio, no tests; cada una con su plan):
- [ ] Selector guiado de 3 preguntas (m², mascotas, presupuesto)
- [ ] Página "bajó esta semana" alimentada por price-drops.cjs

Reglas del agente: solo lectura sobre el sitio y el repo (no commitea, no edita src/), no inventa precios ni IDs de ML, no usa la palabra "cluster", español rioplatense.

---

# Plan de conversión post-QA (2026-10-11) - esperando OK de Juan

Premisa corregida: la barra fija NO explica las guías flojas (sin barra: 21 cada 100; con barra: 17,6; `perfumes-arabes-dupes` no la tiene y rinde 27). Lo que distingue a las 3 flojas es que no tienen `quickPicks` (ni boton de arriba ni recomendacion clara) y que dos son de intencion "donde comprar". Con 3 paginas no se separan las causas, asi que se prueba el cambio mas chico y se mide pooled.

Mecanica: `quickPicks` (`src/lib/types.ts:342`) = array de `{ productMlaId, label, labelColor?, tagline }`. El primero alimenta `AboveFoldCta` y `StickyBuyBar` (`GuideRenderer.tsx:710-731, 882`). Solo IDs MLA que ya existan en `curated-products.ts`, nunca inventados. `labelColor` solo valores validos del enum `LabelColor`.

## Experimento A: recomendacion clara en las 3 guias flojas

Linea de base (28 dias, GSC 12/9-9/10 + GA4 `affiliate_click`): yara-lattafa 61 Google / 4 ML; donde-comprar-argentina 59 / 5; donde-comprar-buenos-aires 69 / 0. Pooled: 189 / 9 = 4,8 cada 100. Promedio del sitio: 18.

- [x] A1. yara-lattafa-guia-completa: agregar `quickPicks` con 3-4 Yara reales del catalogo (hay Elixir, Tous, Candy y el set My Yara) + un veredicto "cual comprar" arriba, que es lo que promete el titulo. Leer `docs/guias.md` antes.
- [x] A2. donde-comprar-perfumes-arabes-argentina: `quickPicks` de 2-3 opciones "si queres comprar online hoy". El texto de la guia ya llama a MercadoLibre "la opcion principal".
- [x] A3. (decidido por Juan 11/10: queda de control, sin tocar) donde-comprar-perfumes-arabes-buenos-aires: DECISION DE JUAN. Es intencion local (4 canales, 1 es ML) y 0 clics a ML puede ser la pagina cumpliendo su funcion. Por defecto: no tocarla y dejarla como grupo de control.
- [x] A4. (verificado: 7 de 8 chequeos OK; el de precios viejos falla igual que antes por 3 precios de otras guias; lint y build OK; medido en local) `npm run guides:check`, `npm run lint`, `npm run build`, mirar en `npm run dev` en celular que aparezcan el boton de arriba y la barra fija.
- [x] A5. (GO de Codex y de Gemini en la 1ra pasada, sin bloqueantes; ninguno modifico archivos) Trio auditor (Codex + Gemini) sobre el texto nuevo, como en el resto de las guias.
- [x] A6. No bumpear `updatedDate` (precedente del 27/7: no resetear las ventanas de maduracion). Registrar fecha de salida y linea de base en `docs/qa-semanal/experimentos.md`.
- [ ] A7. Medir a las 6 semanas (con ~190 clics cada 28 dias, 4 semanas dan muy pocos datos). Exito: pooled de A1+A2 de 12 cada 100 o mas. Si no se mueve, la causa es la intencion de busqueda y no el diseno: se deja asi.

## Experimento B: primera pantalla en celular (toda la plantilla)

Hoy la primera pantalla de celular es titulo + parrafo largo + byline + foto; el boton "above-fold" cae a 1,4-1,6 pantallas en 25 de 33 guias. Como casi todas son iguales no hay variacion para aprender: se cambia y se compara antes/despues sobre el sitio completo (4.485 clics de Google, linea de base 18,1).

- [ ] B1. Leer `ArticleHeader.tsx` y `AboveFoldCta` (`GuideRenderer.tsx:547`). Opcion: en celular, tira compacta (nombre + precio + boton) justo debajo del H1, antes de la bajada y la foto. Cuidar CLS y LCP.
- [ ] B2. Pedir OK antes de implementar: toca un componente que usan las 267 guias. Excluir A1/A2/A3 de la comparacion.
- [ ] B3. Medir a las 4 semanas. Mejora real si sube 3 puntos o mas (el error de la medicion ronda 0,7 puntos).

## Contenido suelto

- [ ] C1. mejor-aspiradora-robot: texto viejo ("Los precios son de junio 2026" en el bloque de metodologia, "Actualizado 2 de julio"). Reescribir sin fecha en el texto; aca si corresponde actualizar la fecha. Skill `optimizador-guias-pv`.
- [ ] C2. Fichas robot X20 Pro, S20 y X20 Max: no responden ruido ni garantia. Necesitan resenas reales (Bright Data, hoy sin autenticar). Skill `product-review-deepening` + `optimizador-productos-pv`. Tres fichas por semana.
- [ ] C3. Las otras 22 guias sin `quickPicks` con clics (908 en total; arriba: masajeador-cervical 47, cafetera-de-filtro 28, perfumes-arabes-originales 23): NO tocarlas en masa. Decidir despues de A7.

## Agente semanal

- [x] `tieneBotonFijo` del medidor corregido (barra real = `data-cta-location` "sticky*", no cualquier ancestro sticky).
- [x] Agregar a `AGENTE.md` un paso (6b) que lea `docs/qa-semanal/experimentos.md` y reporte cada semana los clics de Google y a ML de las paginas en prueba contra su linea de base.
- [ ] Programar la tarea semanal (lunes, antes de la revision de ventas) cuando Juan diga que el reporte sirve.

## Review experimento A (2026-10-11)

- Hecho: `quickPicks` en yara-lattafa-guia-completa (3 items) y donde-comprar-perfumes-arabes-argentina (4 items); reescrito un parrafo de Yara que tenia precios invertidos y contradecia el veredicto final. 13 lineas en `src/data/guides.ts`. Buenos Aires de control, sin tocar.
- Verificado: eslint OK, `npm run build` OK, 7 de 8 chequeos de `guides:check` OK (el de precios viejos falla igual que antes por 3 precios de OTRAS guias), medido en local (boton de arriba + barra fija en ambas), trio auditor GO/GO.
- Pendiente de Juan: revisar `git diff src/data/guides.ts`, commitear y pushear (IndexNow sale solo). Despues cargar la fecha de salida en `docs/qa-semanal/experimentos.md`; la evaluacion cae 6 semanas despues.
- Deuda visible que NO se toco (fuera de alcance, la marcaron los dos auditores): en la guia de Yara quedan precios hardcodeados viejos (lineas ~14452, 14464, 14639, 14662, 14710) y "Precios actualizados al 2026-04-20" (~14721). Ahora el boton de arriba muestra el Elixir a precio de hoy y la prosa de mas abajo todavia dice $68.000.

## Seguimiento experimento A (11/10)

- [x] Corregidos los precios viejos de la guia de Yara con tokens (6 cambios; build OK; checks igual que antes; trio auditor salteado por ser ajuste mecanico acotado).
- [x] Recordatorio programado `recordatorio-experimento-a-fecha-salida` (14/10 09:00): verifica publicacion, anota fecha de salida y evaluacion en `docs/qa-semanal/experimentos.md` y agenda `evaluacion-experimento-a` a los 42 dias.
- [ ] Juan: revisar `git diff src/data/guides.ts`, commitear y pushear.
- [ ] Evaluacion a las 6 semanas de la salida (se agenda sola).
