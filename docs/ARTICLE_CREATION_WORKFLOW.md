# Workflow técnico para crear nuevos artículos

> Este documento cubre la parte **técnica**: cómo se guarda un artículo en `src/data/guides.ts`, qué campos tiene un `Guide`, cómo se renderiza.
>
> Para la parte **editorial y psicológica** (qué estructura usar, cómo escribir con SEO + persuasión, trucos de copy) ver [POST_MASTER_STRUCTURE.md](POST_MASTER_STRUCTURE.md) — esa es la biblia editorial.
>
> Si sos Claude y te piden crear un post nuevo, seguí la receta operativa en [.claude/skills/new-post.md](../.claude/skills/new-post.md).

Este proyecto publica artículos desde `src/data/guides.ts`. Los Markdown en `docs/clusters/` funcionan como fuente editorial o borrador, pero el sitio no los lee directamente en runtime.

## Como funciona hoy

1. El articulo final debe existir como objeto `Guide` dentro del array `guides` en `src/data/guides.ts`.
2. La ruta publica es `/guias/[slug]`.
3. Solo se muestran articulos con `publishedDate <= hoy`, mediante `getPublishedGuides()`.
4. La pagina de detalle esta en `src/app/guias/[slug]/page.tsx`.
5. El render visual lo hace `src/components/guides/GuideRenderer.tsx`.

## Campos minimos de una guia

```ts
{
  slug: "mi-slug",
  category: "perfumes-arabes",
  title: "Titulo visible",
  seoTitle: "Titulo SEO",
  metaDescription: "Descripcion SEO de 150-160 caracteres.",
  ogTitle: "Titulo para compartir",
  ogDescription: "Descripcion para compartir",
  h1: "H1 del articulo",
  publishedDate: "2026-05-27",
  updatedDate: "2026-05-27",
  hasDisclosure: true,
  intro: [
    "Primer parrafo.",
    "Segundo parrafo."
  ],
  sections: [
    { type: "h2", title: "Primer subtitulo" },
    { type: "p", content: "Texto con [link interno](/guias/perfumes-arabes)." }
  ],
  faq: [
    {
      question: "Pregunta frecuente",
      answer: "Respuesta breve y directa."
    }
  ]
}
```

## Regla: titulo de silo/categoria nuevo en `guideCategories`

Cada valor de `category` usado en un `Guide` tiene que existir como key en `guideCategories` (al final de `src/data/guides.ts`), con un `name` y una `description`. Si falta, `/guias` cae al fallback y muestra el slug crudo en vez de un titulo (paso por esto el 2026-07-24: `cocina`, `ventiladores-de-techo`, `streaming-tv`, `humidificadores`, `termos`, `tostadoras` y `yogurteras` estaban sin entrada).

**Convencion obligatoria para el `name`:** siempre `"Guía de <Tema>"` o `"Guías de <Tema>"` (singular si el silo es una sola categoria de producto tipo "Guía de Cafeteras", plural si agrupa varias cosas relacionadas tipo "Guías de Fechas Especiales"), nunca solo el nombre del tema pelado. Al crear una guia con una `category` nueva, agregar la entrada correspondiente a `guideCategories` en el mismo commit, no despues.

## Tipos de bloque disponibles

- `p`: parrafo.
- `h2` / `h3`: subtitulos.
- `table`: tabla con `headers` y `rows`.
- `list`: lista con `items`.
- `image`: imagen individual, idealmente con `alt`.
- `image-grid`: grilla de imagenes.
- `product-card`: tarjeta conectada a un producto por `productMlaId`.
- `callout`: nota, advertencia, tip o actualizacion.
- `trust-block`: bloque de metodologia, credenciales o precios.
- `pull-quote`: cita destacada.
- `verdict`: conclusion editorial.

## Roles AI-OS para guias

- **Claude/Kogod = cerebro principal y redactor/implementador.** Por costo y capacidad disponible en el plan Max, Claude debe escribir, reescribir y aplicar la mayor parte de los cambios largos de una guia.
- **Codex/GPT = auditor editorial/SEO y de repo.** Codex no debe gastar tokens escribiendo guias largas salvo emergencia: revisa estrategia, detecta riesgos, cruza opiniones, revisa diffs, valida checks y sugiere mejoras concretas para que Claude las aplique. Claude puede consultarlo con `scripts/ai-os/ask-codex.sh`.
- **Gemini = auditor Google/SERP/AIO + multimedia (auditor y generador).** Gemini revisa intencion de busqueda, cobertura semantica, canibalizacion, utilidad para AI Overviews/Gemini, hero, imagenes, manuales, screenshots, alt text, OG/Pinterest y oportunidades visuales. Ademas puede **generar** assets visuales cuando hagan falta: hero e imagenes decorativas/conceptuales, diagramas explicativos, ilustraciones, piezas OG/Pinterest y, si el caso lo amerita, video corto. Regla de honestidad de multimedia generada: los assets generados sirven solo para lo decorativo, conceptual o explicativo; **nunca** para fabricar una foto de producto ni un screenshot de manual que se presente como real. La foto del producto y las capturas de manual salen de la ficha/fuente real (Mercado Libre, pagina del fabricante), no de un generador.

## Por que cada rol (fortalezas comparativas)

El reparto no es arbitrario: cada IA tiene una ventaja comparativa real y se la usa en lo que es mejor. La excelencia no sale de una sola super-IA, sale de tres familias de modelos distintas con tres puntos ciegos distintos que se validan cruzado.

- **Claude construye.** Su fuerza es escritura larga con criterio y disciplina: sostener la voz (rioplatense, curador honesto) a lo largo de una guia entera, seguir reglas finas sin romperlas (no inventar specs, tokens de precio, `rel="sponsored"`) y aplicar los cambios en el repo con juicio de implementacion. Es el que mejor escribe y ejecuta.
- **Codex audita el como.** Su fuerza no es escribir, es revisar sin el sesgo del autor. Claude revisa lo que quiso escribir; Codex viene con ojos frescos y caza bugs, datos que no cierran, filas de tabla rotas, links huerfanos, y corre la cadena de checks. Es el control de calidad adversarial.
- **Gemini audita el para-quien (y genera lo visual).** Su ventaja es literal: lo hizo Google, asi que es el proxy mas cercano a como piensa el buscador y AI Overviews (intencion de busqueda AR, canibalizacion, preguntas que faltan), y es fuerte en vision (hero, screenshots de manuales, alt text, OG/Pinterest) y en generar assets visuales cuando faltan.

Como se explota: Claude no le pide opinion de escritura a los otros dos (desperdiciaria su fuerza); a Codex se lo usa para "hay un bug, un dato que no cierra, un link roto, pasa los checks"; a Gemini para "le gana la intencion a la SERP, es citable por AIO, la parte visual esta a la altura o hay que generar algo".

Contras a cuidar: Gemini piensa como Google pero **inventa specs con seguridad** (ej. horas de lampara) y puede generar imagenes que parezcan datos reales; su rol es marcar oportunidades y producir lo decorativo/conceptual, no aportar datos ni fabricar fotos de producto: Claude filtra contra el manual/ficha real antes de aplicar. Al reves, si Codex sugiere reescribir prosa, se toma como senal, no como texto final, porque escribir es lo de Claude.

Modelo de interaccion: Juan habla solo con Claude. Claude es el cerebro y el unico punto de contacto; orquesta a Codex y a Gemini por atras y le muestra a Juan el resultado consolidado, no el ida y vuelta interno.

## Flujo recomendado para un articulo nuevo

1. Crear el borrador en `docs/clusters/<cluster>/`.
2. Usar el formato del convertidor existente si el cluster ya tiene script.
3. Confirmar que el slug no exista en `src/data/guides.ts`.
4. Claude escribe u optimiza la guia. Si Juan esta en sesion con Claude, Claude redacta directo en la conversacion; `scripts/ai-os/claude-guide-task.sh <slug> <brief.md>` es el entrypoint de arranque en frio (cuando la tarea la dispara Codex y Claude no esta en la conversacion), no para cuando Juan ya esta hablando con Claude.
5. Claude agrega imagenes en `public/images/...` o `public/guias/...` si corresponde, carga el articulo en `src/data/guides.ts` y respeta `docs/guias.md`, `docs/fichas.md` y la regla de honestidad.
6. **Claude corre los checks** (`npm run lint`, `npm run build`, `npm run guides:check`) y le pasa a Codex el diff YA verificado. Codex no ejecuta el build: corre en sandbox read-only y audita logica/datos/SEO, no compila.
7. Claude le pasa el diff a Codex con `scripts/ai-os/ask-codex.sh review-guide <slug>`. Codex audita enlaces internos, monetizacion, metadata, tokens de precio, voz, canibalizacion, consistencia de datos y riesgos de implementacion. Termina en GO o NO-GO.
8. Claude consulta a Gemini con `scripts/ai-os/review-guide.sh <slug>` como auditor externo Google/SERP/AIO/multimedia. Termina en GO o NO-GO.
9. Distincion clave bloqueante vs no-bloqueante:
   - **NO-GO / bloqueante:** algo que obliga a NO publicar hasta arreglarlo (spec inventada, link interno roto, token de precio erroneo, link de afiliado sin `rel="sponsored"`, canibalizacion grave, bug de render). Claude lo corrige si o si y vuelve a auditar.
   - **GO con sugerencias / no-bloqueante:** mejoras que no frenan (sumar una FAQ, una imagen, matizar un claim). Claude las evalua, aplica las sensatas filtrando por la regla de honestidad (no aplica specs inventadas por Gemini) y sigue.
10. **Enlaces ENTRANTES a la guia nueva (paso que faltaba, agregado 2026-08-25).** Antes de
    publicar, agregar 2 o 4 enlaces DESDE guias que ya existen HACIA la guia nueva. No alcanza
    con los enlaces salientes que la guia nueva lleva adentro: esos no le transfieren autoridad
    a ella. Como hacerlo, en orden de preferencia:
    - **Buscar menciones que ya existan sin enlace.** Grepear el tema de la guia nueva en
      `guides.ts` y linkear donde el texto ya habla de eso. Es la mejor opcion porque no hay
      que inventar contexto. Ejemplo real: `cocina-a-gas` tenia 15 menciones sin enlace.
    - **Si no hay menciones, sumarla al bloque `internalLinks` de 2 o 3 guias del mismo silo.**
      Ese modulo existe para lectura relacionada; es legitimo aunque el texto no la mencione.
    - **Preferir 3 origenes distintos antes que 10 enlaces de la misma guia.** La diversidad de
      origen pesa mas que el volumen, y evita que parezca relleno. Variar el texto ancla.
    - **NO tocar `updatedDate` de las guias de origen.** Un enlace interno no es actualizacion
      editorial y moverla resetea las ventanas de maduracion que mide el loop SEO. Usar
      `sitemapLastmod` con la fecha del dia, que es el campo que existe para eso.

    **Por que este paso:** el 2026-08-25 se midieron los enlaces entrantes de las 205 guias
    publicadas y aparecieron **8 pilares con 0 o 1 entrante y 8 guias huerfanas con 0**, casi
    todas publicadas entre el 16 y el 22 de agosto. Entre ellas, `impresora-3d`, publicada ese
    mismo dia. El patron es claro: el flujo le pone enlaces salientes a la guia nueva y nadie le
    pone entrantes. Verificar con el diagnostico de entrantes antes de dar por cerrada una guia.

11. Si hubo cambios relevantes tras aplicar mejoras, Claude vuelve a pedir auditoria externa.
12. Publicacion (autorizado por Juan, 2026-07-11): cuando se cumple TODA la compuerta -Claude escribio, checks pasan, Codex da GO, Gemini no marca bloqueantes y las sugerencias no-bloqueantes ya fueron procesadas- **Claude commitea y pushea automaticamente**, sin esperar OK manual. Esta autonomia aplica SOLO a este loop con la compuerta completa; para una edicion suelta fuera del loop de auditoria sigue valiendo la regla general (mostrar el diff y esperar instruccion de Juan).

## Nota importante sobre Next.js

Este proyecto usa Next `16.2.3`. Antes de tocar rutas, metadata, rendering o convenciones de App Router, leer la guia relevante en `node_modules/next/dist/docs/`, como indica `AGENTS.md`.
