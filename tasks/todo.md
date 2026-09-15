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
