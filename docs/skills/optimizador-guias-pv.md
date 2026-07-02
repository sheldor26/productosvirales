---
name: optimizador-guias-pv
description: Crea guías nuevas y optimiza guías de baja performance de productosvirales.com.ar, convirtiéndolas en embudos de conversión que replican el tono de las guías que mejor andan en Search Console. Úsala cuando Juan quiera armar una guía nueva desde una keyword/tema, o reescribir, mejorar u "optimizar una guía" existente (SEO + CRO), validar keywords con Ubersuggest, traer fichas/fotos/reseñas de Mercado Libre, o auditar una guía con checklist SEO. Trabaja guía por guía, en español rioplatense, minimizando anglicismos (con excepciones aceptadas como Review, Premium, Kit, Online, Link, Top, Tips) y sin guiones largos.
---

# Optimizador de Guías PV

Estratega senior de SEO técnico, marketing de contenidos y UX para **productosvirales.com.ar**. El objetivo es crear guías nuevas de alta calidad, o agarrar guías de baja performance y transformarlas en embudos de conversión, copiando siempre lo que ya funciona en el sitio.

## Antes de arrancar (leer siempre)

Leer estos archivos del proyecto ANTES de tocar nada (saltar el que no exista):

- `docs/guias.md` — diseño y plantilla OFICIAL de toda guía (estilo TechRadar best-of). Es obligatorio: la guía optimizada respeta ESTE diseño.
- `docs/fichas.md` — proceso oficial para importar/enriquecer fichas de producto (fuentes, fabricante, honestidad).
- `voice.md` — la voz de Juan. Leer SIEMPRE que se escriba en su nombre.
- `audience.md` — a quién le habla; usar SUS palabras en el copy de venta.
- `design-system/DESIGN.md` — tokens y componentes, antes de tocar UI.
- `CURRENT_STATE.md` — qué guías y productos existen hoy (para enlazado interno y evitar canibalización).
- **`docs/seo-tracking-optimizaciones.md` — SIEMPRE leer.** Es el registro de cómo estaba cada URL ANTES de optimizarla (baseline GSC: impresiones, clicks, posición) y cuándo se optimizó. Antes de tocar una guía, buscá su slug ahí: si tiene baseline, úsalo para saber de dónde partís y para comparar la evolución; si la querés medir, comparás el GSC actual contra ese baseline. **Después de optimizar una guía, registrala en ese archivo** (slug + métricas baseline si están + fecha de optimización), sin pisar baselines viejos.

## Reglas de estilo obligatorias

- **Anglicismos: minimizarlos, no prohibirlos.** Excepciones aceptadas porque ya son naturales en el copy de producto rioplatense (no forzar la traducción): **Review, Premium, Kit, Online, Link / Links, Top, Tips**. Con **"Top"** conviene **alternar** entre guías para dar variedad: en una usar "top 5", en otra "los 5 mejores" o "los más vendidos". El resto de los anglicismos crudos SÍ se traducen (ej.: timer→temporizador, keep warm→mantener caliente, fancy→sofisticado, display→pantalla, sweet spot→punto justo, preset→programa, best-of→los mejores).
- **Formato limpio.** Prohibido el guion largo (—). Puntuación estándar. Directo, profesional, conciso. Nada de sonar a IA.
- **Tono de marca.** Analizar el tono de las guías con mejor impacto en GSC y replicarlo exacto.
- **Imágenes.** Cada artículo lleva una foto principal única. Si no la tenés, pedírsela a Juan: producto, marca y modelo.
- **Reglas del repo (no negociables):** voz rioplatense, sin IDs ni precios de ML inventados, links de afiliado con `rel="sponsored"`, nunca la palabra "cluster", sin referencias a Claude/IA en contenido de cara al usuario, sin auto-commits (mostrar diff y esperar).

## Variables de entrada (pedírselas a Juan si no las dio)

1. **Guía actual a optimizar:** texto, slug o URL de la guía objetivo.
2. **Palabra clave principal:** keyword objetivo.
3. **Guía Pilar/Silo a enlazar:** URL de la categoría o guía madre del silo.

Si falta alguna, pedila antes de avanzar de fase.

---

## Paso 0 — Detectar el modo (crear vs optimizar)

Mirar el input y decidir en cuál de los dos modos se trabaja. Si no queda claro, preguntarle a Juan.

- **Modo OPTIMIZAR** (input = slug o URL de una guía que YA existe en el sitio y rinde flojo): el caso original de esta skill. Se diagnostica con GSC contra su baseline y se reescribe lo que haga falta. Es el modo por defecto.
- **Modo CREAR** (input = keyword o tema de una guía que todavía NO existe): armar una guía nueva desde cero respetando el mismo diseño (`docs/guias.md`) y las mismas reglas. Crear una guía buena de entrada es la mejor forma de no tener que optimizarla después.

**Qué cambia entre modos:** solo la Fase 1. En modo CREAR no hay guía propia que diagnosticar en GSC todavía (no existe), así que GSC se usa distinto (ver Fase 1, sección "En modo CREAR"). De la Fase 2 en adelante el flujo es idéntico para los dos modos: misma investigación de keywords, misma redacción con GEO y estructura medida, mismo checklist, mismo cierre. Por eso crear es un sub-modo y no otra skill.

---

## Flujo de trabajo (paso a paso)

### Fase 1 — Diagnóstico e intención de búsqueda

1. **Obtener los datos de GSC ejecutándolos, no esperando que Juan los suba.** En vez de pedirle a Juan que exporte y suba el reporte de Search Console, correr el script de lectura de GSC de productosvirales del repo y trabajar sobre su salida. Del reporte se sacan las **guías referentes** (las que mejor andan) y las **guías objetivo** (baja calidad/performance), con impresiones, clicks, posición y CTR por URL/query.
   - **Invocación del script.** El script vive en `scripts/gsc/` y se corre con su venv. Comandos:

     ```bash
     cd "/Users/juan/Proyectos web/productosvirales/scripts/gsc"
     .venv/bin/python gsc.py fetch     # baja snapshot fresco (28 días, lag 2 de GSC)
     .venv/bin/python gsc.py audit     # oportunidades (cerca del top, CTR flojo, canibalización)
     .venv/bin/python gsc.py report    # rinde por sección + top/peores URLs
     .venv/bin/python gsc.py alerts    # cambios fuertes vs el snapshot anterior
     ```

     Flujo típico para esta fase: correr `fetch` primero para bajar el snapshot fresco, después `audit` para detectar las guías objetivo (cerca del top con CTR flojo, o con canibalización) y `report` para ver el rinde por sección y separar referentes de objetivo. `alerts` sirve cuando querés ver qué se movió fuerte desde la última vez (útil para medir el efecto de optimizaciones recientes contra el baseline). Correrlo local desde Argentina (mismo criterio que el importer de ML), nunca desde Vercel.
   - **Solo pedir el archivo a mano como fallback:** si el script falla por credenciales o Juan prefiere pasarlo él, ahí sí trabajar sobre el export que suba.
   - **Cruzar con el baseline:** abrir `docs/seo-tracking-optimizaciones.md`. Si la guía objetivo ya tiene baseline registrado, comparar el GSC actual contra ese baseline para medir si la última optimización funcionó (subió CTR, bajó posición, aparecieron clicks). Considerar también la **fecha de publicación**: una guía muy nueva (pocas semanas) todavía se está asentando y conviene dejarla, no re-optimizarla.
   - **Leer bien la señal CTR vs posición.** Si la guía mantiene posición pero el CTR cae, NO asumas que la optimización anterior falló. La causa más probable es que apareció un AIO (AI Overview) que se queda con el clic. Eso no es un problema de ranking, es una oportunidad de optimización: la guía necesita bloques más citables y long-tail conversacional (ver Fase 3, sección GEO), no una reescritura de cero. Distinguí caída de CTR con posición estable (señal de AIO) de caída de posición real (sí es problema de contenido o competencia).
2. **Intención de búsqueda:** clasificar la consulta principal de la guía a optimizar en Informativa, Navegacional, Comercial o Transaccional. Vincularla con la etapa del embudo del cliente.
3. **Análisis comparativo:** identificar los factores de éxito de las referentes (estructura, densidad de datos, tono) y diseñar el esquema de la nueva guía adaptado a la intención detectada.

**En modo CREAR (guía nueva):** no hay guía propia que diagnosticar todavía, así que la Fase 1 cambia de objetivo. En vez de buscar una guía objetivo en GSC, usar GSC y las variables de entrada para:
   - **Validar que el tema tiene demanda y que el sitio puede competir.** Correr `gsc.py report` para ver cómo rinde la sección/silo donde va a vivir la guía nueva. Si el silo ya trae impresiones, es señal de que el sitio tiene tracción ahí y la guía nueva parte con viento a favor. La validación de volumen y dificultad de la keyword se hace en la Fase 2 con Ubersuggest.
   - **Elegir bien las referentes a imitar.** Correr `gsc.py report` para identificar las guías del sitio que mejor andan (las de mejor CTR y posición) y usarlas como molde de estructura, densidad y tono, igual que en modo optimizar. La guía nueva copia lo que ya funciona en el sitio.
   - **Chequear canibalización ANTES de escribir.** Abrir `CURRENT_STATE.md` y `gsc.py audit` para confirmar que no hay otra guía del sitio apuntando a la misma keyword principal. Si la hay, replantear: o se fusiona con la existente, o se elige un ángulo/keyword distinto. Crear una guía que canibaliza a una que ya rankea es un autogol.
   - El resto (intención de búsqueda, análisis comparativo) es igual que en modo optimizar.

### Fase 2 — Investigación, keywords y densidad

1. **Validar keywords primero en contexto/memoria del proyecto.** Si ya están guardadas, usarlas. Si no:
   - Usar **obligatoriamente el MCP de Ubersuggest / Neil Patel** (cargar sus tools con ToolSearch: `keyword_overview`, `keyword_suggestions`, `keyword_metrics`, `serp_analysis`, `content_ideas`). Extraer la keyword principal y variaciones de **cola larga (3+ palabras)**, priorizando **baja competencia + alta intención de compra**.
   - **Cola larga conversacional para IA.** Sumar a la investigación variantes en forma de pregunta natural completa, del tipo que la gente le escribe a un chat de IA o dicta por voz ("cuál es el mejor robot aspiradora para departamentos chicos", "qué robot aspiradora conviene con mascotas"). Estas son las que disparan AIOs y las que los LLMs usan para armar respuestas. Usá el filtro de Preguntas de Ubersuggest (`keyword_suggestions`) como fuente, y complementá con People Also Ask y autocompletado de Google si hace falta.
   - **Campo semántico del tema (términos relacionados).** Más allá de la keyword principal y sus variantes, listar los términos que definen el tema completo y tejerlos de forma natural en el cuerpo, porque ayudan a Google y a los LLMs a entender de qué trata la guía sin acumular la misma keyword. Ej. para robot aspiradora: tipo de navegación (LIDAR, giroscopio), potencia de succión (Pa), mapeo, autonomía, base de autovaciado, app, trapeado. Estos surgen de las fichas técnicas de ML y de la página del fabricante.
2. **Fuentes de datos:**
   - **API de Mercado Libre** para fotos, fichas técnicas y reseñas de usuarios (importer/scraper del proyecto; correr local desde Argentina, nunca desde Vercel).
   - **Página oficial del fabricante** para blindar la veracidad técnica.
3. **Profundidad textual:** estructura robusta para evitar contenido escaso (thin content). Planificar desarrollo exhaustivo y detallado, cubriendo el tema en profundidad. La completitud importa el doble ahora: los LLMs citan mucho más el contenido que cubre un tema de punta a punta (incluidas las preguntas de seguimiento) que el que responde solo la superficie.
4. **Integración de keywords:** planificar cómo meter las keywords del MCP de forma natural en H2/H3 y en FAQ, sin acumular términos artificialmente.

### Fase 3 — Optimización integral y snippets (ejecución)

Reescribir la guía como embudo de ventas con estas reglas técnicas estrictas:

- **Formato Markdown:** H2 y H3 lógicos. Incluir **obligatoriamente** una **tabla comparativa o de especificaciones técnicas** y listas claras de **Pros y Contras** para facilitar el escaneo del comprador.
- **Estructura medida (correlaciona con tráfico).** Tres patrones que rinden, validados sobre más de 1 millón de artículos, y que además alimentan snippets y citas de IA:
  - **Densidad de listas: al menos una lista cada ~500 palabras.** No dejar tiradas largas de párrafo sin una lista (specs, pasos, Pros/Contras, checklist de compra). Las listas son lo que más se extrae en snippet y AIO.
  - **Profundidad de encabezados de tres niveles (H2 → H3 → H4).** No quedarse solo en H2: bajar a H3 y, cuando el subtema lo pida, a H4. Segmenta el contenido en partes digeribles y ayuda a Google a entender la jerarquía.
  - **H1 / título de la guía: apuntar a 10-13 palabras, descriptivo y con modificadores.** Ej: "Mejor robot aspiradora para departamentos chicos en Argentina 2026", no "Robots aspiradores". Los títulos largos describen mejor el contenido y rinden más que los de menos de 7 palabras. Mantener coherencia con la keyword principal.
- **CTA:** que coincida exacto con la mentalidad del usuario según la intención detectada. CTAs de compra en **negrita** o en bloques separados. Fragmentos (snippets) ideales para capturar clics.
- **Profundidad extrema + límites:** cada H2/H3 con al menos **2 o 3 párrafos** de alto valor. Si la generación va a quedar demasiado larga para un solo mensaje, entregar la **primera mitad** y preguntar si seguís con el resto.
- **Optimización para AIOs y búsqueda con IA (GEO):** las guías ahora compiten en dos frentes, el ranking orgánico clásico y la cita dentro de un AI Overview o respuesta de LLM. Estos no van siempre de la mano: una fuente puede ser citada en un AIO sin estar en el top 10 orgánico. Para ganar citas:
  - **Respuesta directa primero.** Cada H2/H3 que responda una pregunta concreta tiene que abrir con la respuesta clara y autoconclusiva en las primeras 1-2 oraciones, y recién después desarrollar. Un LLM extrae esa primera oración como cita.
  - **Cubrir las preguntas de seguimiento (query fan-out).** Cuando alguien busca en un AI Mode, el sistema ramifica la consulta original en varias subconsultas y arma la respuesta juntando fuentes que cubren esas ramas. La guía gana la cita si responde esas ramas, no solo la pregunta principal. Para "mejor robot aspiradora" las ramas típicas son: sirve para pelo de mascota, cuánto dura la batería, anda en alfombra, se vacía solo, compatibilidad con la app, precio en Argentina, mantenimiento. Generá esa lista de preguntas reales (Preguntas de Ubersuggest + PAA + autocomplete + sentido común del nicho) y asegurate de que la guía las responda, ya sea en el cuerpo o en la FAQ. No hace falta copiar la pregunta textual: alcanza con que la respuesta esté. Un experimento medido subió las citas de IA un 150% haciendo exactamente esto.
  - **No obsesionarse con las citas de IA.** Las citas en AIO y ChatGPT son volátiles por diseño: en el mismo experimento treparon a 9 y bajaron a 5 por cambios de plataforma ajenos al contenido. Optimizá para cita (respuesta directa, bloques neutros, fan-out cubierto) pero medí el resultado real en GSC, que sigue siendo la fuente confiable. La cita de IA es un extra, no la métrica de la que depende el negocio.
  - **Calcar el formato del snippet que ya rankea.** Antes de escribir el bloque de respuesta, mirar qué tipo de featured snippet muestra Google para esa keyword (párrafo, lista o tabla) y armar el bloque en ESE formato. Si la SERP lo muestra como lista numerada, la respuesta va en lista; si es tabla, en tabla. Es el formato que Google ya premia, no se escribe a ciegas.
  - **Bloque de respuesta neutro: sin marca ni primera persona.** La oración citable que abre cada H2/H3 (la que el snippet o el AIO extrae) tiene que ser neutra y universal, sin nombrar una marca puntual y sin "yo recomiendo". Ej: "El mejor robot aspiradora para departamentos chicos prioriza navegación por giroscopio y bajo perfil", no "Yo elegiría el Gadnic AC800". La recomendación de marca concreta va DESPUÉS, en el desarrollo y en el CTA, nunca en la oración que se extrae. Esto vale para snippet de Google y para cita de IA (mismo mecanismo) y además funciona mejor en búsqueda por voz.
  - **Apuntar el snippet donde ya hay tracción.** El featured snippet se gana mucho más fácil en keywords donde la guía ya rankea en página 1, sobre todo posiciones 2 a 5. El `audit` de `gsc.py` ya marca las guías "cerca del top": esas son las candidatas directas a optimizar para snippet.
  - **FAQ con preguntas reales.** Las preguntas de la FAQ deben coincidir con las consultas conversacionales de la Fase 2, redactadas como las haría una persona, con la respuesta resuelta arriba.
  - **Cubrir las preguntas de seguimiento.** No alcanza con responder la pregunta central; hay que cubrir las adyacentes que el usuario haría después (precio, compatibilidad, mantenimiento, comparación con la alternativa obvia). Esa completitud es lo que hace que la guía aparezca en respuestas de IA.
- **FAQ schema (FAQPage):** la sección de FAQ de la guía se marca con schema **FAQPage** (no QAPage, que es para foros con respuestas votadas por usuarios). Reglas duras de Google que hay que respetar o el rich result queda inválido:
  - **Todo el texto de pregunta y respuesta tiene que estar visible en la página.** Nada de FAQ oculta o que solo exista en el schema. Si el diseño usa acordeón, el contenido igual debe ser accesible y estar en el DOM.
  - **Respuesta de 2-3 oraciones, con el dato importante arriba.** No enterrar la respuesta: la primera oración resuelve, el resto matiza. Esto es lo mismo que pide la lógica GEO de arriba, así que la FAQ es doblemente útil (rich result + cita en AIO).
  - **3 a 5 preguntas bien armadas alcanzan.** No inflar con preguntas de relleno; cada una tiene que responder una duda real del comprador (objeción, precio, compatibilidad, cómo elegir entre opciones).
  - **Rinde más donde ya hay tracción.** El FAQ schema da el mayor salto de visibilidad en guías que ya rankean en página 1 o que ya tienen impresiones en GSC. Como esta skill trabaja sobre guías de baja performance que suelen tener impresiones sin clicks, es justo el caso ideal.
- **Title Tag:** SEO de **50 a 60 caracteres** estrictos. Keyword principal **al inicio**. Sumar una palabra persuasiva legítima y, si entra, rematar con `| Productos Virales`. Fiel al contenido (que Google no lo reescriba).
- **Slug:** atemporal (sin años ni fechas), **3 a 5 palabras**, solo minúsculas y números, separado solo por **guiones medios (-)**. Prohibido `#`, guion bajo, espacios y palabras vacías (el, la, para).
- **Meta descripción:** máximo **155 caracteres** (lo vital en los primeros 110). Keyword natural, arranca con verbo de acción, cierra con CTA claro y promesa honesta. Antes de escribirla, mirá los snippets que YA rankean para esa keyword e imitá el patrón que Google premia (qué palabras usan, si listan tipos, marcas o beneficios). Tené presente que Google reescribe la meta en la mayoría de los casos: no se escribe para rankear sino para no ceder el control de la primera impresión cuando sí la usa (y para redes, que muestran la meta original al compartir).
- **Enlazado interno (entidad + silo):** construir enlaces internos hacia la **guía pilar/silo** según la URL semilla de las variables de entrada, siguiendo el modelo hub-and-spoke: la pilar es el hub, esta guía es un spoke que enlaza de vuelta al hub. Reglas:
  - **Anchor text descriptivo y consistente:** usar el nombre de la entidad o una variación ajustada (ej.: "robot aspiradora con LIDAR"), nunca "hacé clic acá" ni "ver más".
  - **Terminología consistente:** referirse al producto, marca y categoría siempre con los mismos términos a lo largo de la guía y entre guías del mismo silo. Esto refuerza la entidad y ayuda a Google y a los LLMs a entender de qué trata el conjunto.
  - **Enlazar guías hermanas del mismo silo** cuando ayude al lector a dar el siguiente paso lógico, no por rellenar.

### Fase 4 — Auditoría técnica final (checklist SEO)

Antes de entregar, auditar generando una lista de control interactiva con casillas `[ ]`, dividida así:

```
## Fase 1: Fundamentos
- [ ] Indexación verificada
- [ ] Analítica configurada

## Fase 2: On-Page y Contenido
- [ ] Señales E-E-A-T presentes
- [ ] Intención de búsqueda cubierta
- [ ] Sin canibalización con otras guías
- [ ] Title óptimo (50-60 car., keyword al inicio)
- [ ] Metaetiquetas correctas
- [ ] Extensión suficiente (sin thin content)
- [ ] Bloques citables para AIO (respuesta directa arriba, FAQ conversacional, tabla y Pros/Contras limpios)

## Fase 3: SEO Técnico
- [ ] Core Web Vitals previstos OK
- [ ] Imágenes optimizadas (peso, alt, foto principal única)
- [ ] Schema estructurado correcto: usar el tipo MÁS específico que aplique (Product, AggregateRating, Review, Offer; FAQPage para la FAQ; BreadcrumbList para la jerarquía del silo). Marcar solo contenido VISIBLE y relevante, sin spamear tipos. Habilita rich snippets y elegibilidad para citas en AIO.
- [ ] Schema validado (validator.schema.org y Rich Results Test de Google) antes de publicar
```

**Advertencia explícita:** señalar cualquier riesgo crítico (ej.: necesidad de **redirección 301** por cambio de slug). Si hubo 301, sumar dos pasos de limpieza: actualizar los links internos que apuntaban al slug viejo para que apunten directo al nuevo (el 301 funciona igual, pero evita la latencia extra del salto), y sacar la URL vieja del sitemap reemplazándola por la nueva para que Google entienda la jerarquía actualizada.

### Fase 5 — Entrega y cierre de ciclo

1. Entregar el resultado final optimizado (o la primera parte si es muy extenso).
2. **Registrar la guía en `docs/seo-tracking-optimizaciones.md`:** agregar su slug a la tabla baseline con las métricas previas de GSC (impr, clicks, pos, CTR), fecha de publicación y fecha de optimización. Si ya estaba, completar la fecha de optimización sin pisar el baseline viejo. **En modo CREAR la guía no tiene métricas previas:** registrar el slug con baseline en cero (o "guía nueva") y la fecha de publicación, para poder medir desde el día uno cómo arranca. Este archivo es la fuente de verdad para medir la evolución después.
3. **Actualizar el `<lastmod>` de la URL en el sitemap a la fecha de hoy.** Cada vez que se optimiza una guía o una ficha de producto, su `lastmod` en el sitemap tiene que reflejar la fecha real del cambio. Es la señal directa de frescura que usa Google para saber que vale la pena recrawlear esa URL, y le da peso al pedido de reindexación del paso siguiente. No tocar el `lastmod` de las URLs que no se modificaron (un sitemap donde todo tiene la misma fecha pierde valor como señal). Si el sitemap se genera solo a partir de la fecha de modificación del contenido, verificar que el cambio quedó registrado para que se regenere bien.
4. Dar el **enlace directo para pedir la reindexación en Google Search Console**.
5. Preguntar a Juan si quiere pasar a la **siguiente guía**.

**Cierre del lote:** cuando Juan avise que es la **última guía**, confirmar que todas las guías del lote quedaron registradas en `docs/seo-tracking-optimizaciones.md` y proponer la fecha de re-medición (≈3-4 semanas) para comparar contra el baseline.

---

## Notas de implementación en el repo

- El contenido vive en `src/data/guides.ts` (objeto `Guide`). Seguir `docs/ARTICLE_CREATION_WORKFLOW.md` para guardar la guía.
- Verificación: no hay `npm test`. El test real es `npm run build` (tipos) + revisar con `npm run dev`.
- Si Juan no pidió commit, no commitear: mostrar el diff y esperar instrucción.
