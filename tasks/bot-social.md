# Bot social autónomo — Instagram, Threads y X

Plan de construcción. Estado: **esperando GO de Juan**. Fecha: 2026-08-16.

No se pisó `tasks/todo.md` porque tiene el review cerrado del checklist SEO del 2026-07-27.

---

## 1. Qué se puede construir y qué no (verificado el 2026-08-16, no de memoria)

| Capacidad | Threads | Instagram | X |
|---|---|---|---|
| Publicar | Sí, API oficial. 250 posts/día | Sí, **ya funciona** (`scripts/publicar-instagram.cjs`) | Sí, API v2 |
| Responder replies/comentarios | Sí, 1.000 replies/día + webhooks | Sí, scopes de comentarios y mensajes | Sí, pero cada lectura se paga |
| Escuchar menciones | Sí, webhook de menciones | Sí, webhook | Sí, pago por lectura |
| Seguir / dejar de seguir | **No existe endpoint** | **No existe endpoint** | Sí, endpoint oficial |
| Costo | Gratis | Gratis | Pago por uso |

### 1.1 El follow/unfollow automático en IG y Threads no se construye

Meta no expone endpoint de follow ni de unfollow en la API de Instagram ni en la de
Threads. No es que sea difícil: no existe. La única forma de hacerlo es manejar la
sesión logueada con Puppeteer, que es exactamente el patrón que Meta detecta y
sanciona — y el que sanciona más agresivamente es justo el unfollow masivo, porque
es la huella clásica del follow/unfollow para inflar seguidores.

El downside no es que el script falle: es perder la cuenta de Instagram. La cuenta
es el activo, no el código. Por eso no entra en el plan.

**En X sí se puede legítimamente**, porque `POST /2/users/:id/following` es un
endpoint oficial de la API v2. Va en la Fase 5, con ritmo conservador y sin ciclo de
unfollow (el churn de follow/unfollow viola las reglas de X aunque el endpoint exista).

### 1.2 El reemplazo que sí funciona: cola de engagement dirigido (Fase 5)

En vez de seguir gente a ciegas, el bot busca posts recientes del nicho (robot
aspiradora, perfumes árabes, freidoras, mate, audio), filtra los que tienen tracción
real y baja intención comercial resuelta, y te deja **10 por día** en Telegram con un
comentario propuesto en tu voz. Vos tocás y comentás.

Eso trae seguidores que después hacen clic en el link de afiliado, que es lo que
importa. Y no viola nada de ninguna plataforma.

### 1.3 X ahora cuesta plata

El tier gratis de la API de X murió en febrero 2026. Hoy es pago por uso:

- $0,015 por post publicado
- **$0,20 por post que contiene un link**
- $0,005 por lectura de post
- Tope duro de 2.000.000 de lecturas/mes

Tu Premium de $2,5/mes **no es acceso a la API** — son productos separados. Con tu
formato actual (link en la primera respuesta, ver memoria
`x-copy-mismo-formato-multilinea-que-threads`), cada publicación son dos llamadas:
el post ($0,015) más la respuesta con link ($0,20) = **~$0,22 por publicación**.

- 3 publicaciones/día = ~$20/mes
- 1 publicación/día = ~$6,50/mes
- Leer menciones para responder: ~$0,005 cada una, arriba de eso

Decisión pendiente de Juan: presupuesto mensual tope para X. Recomendación: arrancar
en 1/día (~$7/mes) y subir solo si el tracking en `docs/x-tracking.md` justifica.
Threads es gratis y te da 12x el alcance de X — la prioridad de inversión es obvia.

---

## 2. Arquitectura

Nada de stack nuevo. Todo sobre lo que ya corre.

- **Fuente de verdad del contenido**: `src/data/curated-products.ts` (ya lo es)
- **Estado del bot**: Postgres de Neon que ya tenés (`DATABASE_URL`), tablas nuevas
  siguiendo el patrón de `scripts/db/*.sql`
- **Publicación programada**: GitHub Actions cron (ya hay 10 workflows andando)
- **Entrada en tiempo real** (comentarios, DMs, menciones): route handlers en Vercel
  bajo `src/app/api/bot/`, protegidos con `PV_API_SECRET` como el resto
- **Imágenes**: `generar-imagen-post-threads.cjs`, `generar-imagen-beneficios-threads.cjs`,
  `generar-imagen-story-instagram.cjs` — ya existen
- **Copy**: Claude API leyendo `voice.md` + la ficha real del producto
- **Alertas y kill switch**: Telegram, con el bot que ya está configurado

### Tablas nuevas (`scripts/db/005_bot_social.sql`)

- `bot_posts` — qué se publicó, dónde, cuándo, con qué link. Evita repetir producto
- `bot_replies` — qué se respondió, a quién, para no responder dos veces
- `bot_queue` — cola de engagement de la Fase 5
- `bot_kill_switch` — corte de emergencia sin necesidad de deploy

---

## 3. Gates de seguridad (autonomía total, pero no publica basura)

Elegiste autonomía total, así que el bot publica sin pedirte permiso. Estos gates no
son "pedir permiso": son "no mandar al aire un dato falso". Un precio viejo o un link
roto en un post autónomo te quema la credibilidad de curador honesto, que es todo lo
que tenés.

Un producto **no se publica** si:

1. El precio no fue verificado por Bright Data en las últimas 24hs
2. No existe link `meli.la` en el catálogo, o el link no resuelve a un producto
   (ver memoria `ml-publicacion-excluida-programa-afiliados`)
3. No hay foto real del producto
4. Ya se publicó ese producto en los últimos 30 días en esa red
5. `priceStatus` marca falta de stock o publicación pausada

Además:

- **Kill switch**: fila en `bot_kill_switch` + variable de entorno. Cortás todo sin deploy
- **Aviso post-hoc**: cada publicación te llega a Telegram *después* de salir, con el
  link. Si algo salió mal lo borrás en el momento
- **Tope diario duro** por red, hardcodeado. El bot nunca puede pasarse aunque falle la lógica
- **Nada de urgencia ni escasez inventada** (memoria `loop-mejora-continua-nunca-urgencia-falsa`)

---

## 4. Fases

### Fase 1 — Publicador autónomo: Instagram
*Gratis. Es el 80% del valor.*

- [x] `scripts/db/005_bot_social.sql` — tablas `bot_posts`, `bot_kill_switch`, `bot_runs`
- [x] `scripts/lib/bot-gates.mjs` — los 5 gates, testeables solos contra el catálogo
- [x] `scripts/lib/bot-copy.mjs` — caption y beneficios con la API de Claude, con validación de voz que rechaza (no corrige)
- [x] `scripts/bot-social.mjs` — orquestador: elige producto → gates → copy → imágenes → publica → registra → avisa a Telegram
- [x] `.github/workflows/bot-social.yml` — cron lun/mié/vie 14:23 UTC + `workflow_dispatch` con dry-run por default
- [x] `CHROME_PATH` por env en los 3 generadores de imagen (tenían la ruta de macOS hardcodeada, no corrían en Linux)
- [ ] **Juan:** correr `scripts/db/005_bot_social.sql` en el SQL Editor de Neon
- [ ] **Juan:** cargar los 7 secrets en GitHub (ver cabecera del workflow)
- [ ] Correr 3 corridas en `--dry-run` desde la pestaña Actions antes de soltarlo

### Fase 1b — Threads
- [ ] Registrar la app de Threads y pedir los scopes
      (`threads_basic`, `threads_content_publish`, `threads_manage_replies`)
- [ ] `scripts/publicar-threads.mjs` — espejo de `publicar-instagram.cjs`
- [ ] Sumar el bloque de instrucciones de Threads a `bot-copy.mjs` (formato hype/cupón,
      que es distinto al de Instagram: ver memoria `threads-formato-hype-cupon-no-curador-honesto`)

### Fase 2 — Respondedor de comentarios y DMs
- [ ] Scopes de Instagram (`instagram_business_manage_comments`, `..._messages`) + App Review de Meta
- [ ] `src/app/api/bot/webhook/instagram/route.ts` y `.../threads/route.ts`
- [ ] Clasificador de intención: precio / envío / stock / comparación / spam
- [ ] Respuestas con dato real del catálogo, nunca inventado. Si no sabe, no responde
- [ ] Escalado a Telegram cuando la pregunta no encaja en ningún molde

### Fase 3 — X
- [ ] Definir presupuesto mensual tope (bloqueante)
- [ ] `scripts/publicar-x.cjs` con contador de gasto y corte automático al tope
- [ ] Sumar X al orquestador de la Fase 1

### Fase 4 — Escucha de oportunidades
- [ ] Reusar `scripts/detect-general-trends.cjs` y `detect-tiktok-trends.cjs`
- [ ] Cruzar tendencias contra el catálogo: qué tenés listo para postear hoy
- [ ] Reporte diario a Telegram

### Fase 5 — Crecimiento
- [ ] Cola de engagement dirigido (10/día a Telegram)
- [ ] Follow conservador en X vía endpoint oficial, sin ciclo de unfollow

---

## 5. Próxima acción concreta

**Registrar la app de Threads hoy.** La aprobación de scopes de Meta tarda días y es
el camino crítico de todo lo demás. Mientras eso se aprueba, se construyen las tablas,
los gates y el orquestador contra Instagram, que ya tiene token funcionando.

---

## Review — Fase 1 (2026-08-16)

**Verificado:** `npm run build` pasa. `npm run lint` tira 5 errores, todos
preexistentes y en archivos que no toca este trabajo (`use-saved-products.ts`,
`Header.tsx`, etc.), ninguno en los archivos nuevos. Dry-run offline y dry-run
con gates en vivo corridos contra el catálogo real. Las dos imágenes del
carrusel generadas y revisadas a ojo.

**Lo que salió distinto de lo planeado, y por qué:**

1. **El bot va en `.mjs`, no `.cjs`.** Node 24 carga `curated-products.ts`
   directo con `await import()`, así que el bot lee el catálogo como objetos
   reales en vez de parsearlo con expresiones regulares como hacen los scripts
   viejos. Menos código y no se rompe si cambia el formato del archivo.

2. **Los gates en vivo daban 403 en TODO el catálogo.** No eran links rotos:
   MercadoLibre rechaza cualquier fetch sin User-Agent de navegador. Mismo link,
   403 sin UA y 200 con UA. Quedó documentado en `bot-gates.mjs` porque es
   exactamente el tipo de falso positivo que hace desconfiar de un gate que
   funciona bien.

3. **Se limitó a 8 la cantidad de verificaciones en vivo por corrida.** Recorrer
   los 147 candidatos serían ~300 requests contra ML desde la IP del runner de
   GitHub, que es cómo se escalan los bloqueos. Los gates baratos (precio,
   ficha, no repetir) descartan la mayoría sin tocar la red.

4. **El pre-filtro pide marca, puntaje y vendidos.** `generar-imagen-post-threads.cjs`
   los exige y no acepta vacíos. No se inventan: si la ficha no los tiene, el
   producto no es candidato. Eso baja los candidatos de 147 a 12, que es el
   número honesto.

5. **El badge de la imagen no repite el descuento.** El círculo naranja ya dice
   "-64% OFF"; poner "64% OFF" al lado era ruido. Ahora sale de la etiqueta real
   de la ficha, o de los vendidos, o del envío gratis. Nada de "última unidad":
   eso necesita que alguien mire el stock a mano.

**El cuello de botella real, que no es de código:**

El gate 1 exige precio verificado hace menos de 24hs, pero
`update-prices-brightdata.yml` abre un **PR** en vez de mergear solo. El bot lee
`master`. Si el PR de precios queda sin mergear, `master` sigue con precios
viejos y el bot no publica nada. Hoy el precio más fresco del catálogo tiene
45hs.

O sea: **la frecuencia de publicación del bot está atada a con qué frecuencia
Juan mergea los PR de precios.** El bot avisa por Telegram cuando todos los
candidatos caen por precio viejo, y menciona el PR. Si esto molesta, la opción
es automergear el PR de precios, pero eso saca el ojo humano de encima de los
datos de Bright Data, que ya mintió una vez (2026-08-12, 11 de 15 precios).
Decisión de Juan, no la tomo yo.

**Pendiente antes de que publique de verdad:** las tablas en Neon y los 7
secrets en GitHub. Sin `ANTHROPIC_API_KEY` el bot corta antes de generar copy;
sin `DATABASE_URL` corta antes de publicar (falla cerrado a propósito).
