# Análisis GEO — productosvirales.com.ar

Fecha: 2026-07-04. Verificado contra producción (robots.txt y llms.txt en vivo) y contra el código del repo.

GEO = Generative Engine Optimization: que ChatGPT, Perplexity, Claude y los AI Overviews de Google citen y recomienden el sitio cuando alguien pregunta "¿qué freidora de aire compro en Argentina?".

## Score GEO: 78/100

| Dimensión | Peso | Score | Qué significa para el negocio |
|---|---|---|---|
| Accesibilidad técnica | 20% | 95 | Los bots de IA leen todo el contenido sin problema (SSR/SSG). La base está perfecta. |
| Estructura | 20% | 85 | Tablas comparativas, FAQs y respuestas directas: muy citables. |
| Citabilidad | 25% | 82 | Buenos "bloques de respuesta", pero pocos títulos en formato pregunta. |
| Autoridad y marca | 20% | 65 | Schema completo, pero cero presencia en YouTube/Reddit (la señal que más pesa para IA). |
| Multi-modal | 15% | 55 | Solo texto + imágenes. Sin video. |

## Lo que ya está bien (no tocar)

- **Renderizado en servidor (SSG/ISR)**: los crawlers de IA no ejecutan JavaScript; acá el contenido completo (texto, tablas, FAQ, precios) ya viene en el HTML crudo. Es la mayor ventaja técnica del sitio.
- **JSON-LD completo**: Article + FAQPage + BreadcrumbList en guías; Product con reviews, rating y precio en fichas; Organization + WebSite en la home. Mejor que el promedio de sitios de afiliados.
- **Fechas reales**: `publishedDate`/`updatedDate` en guías y `lastModified` por precio en el sitemap — señal de frescura que los motores de IA valoran.
- **llms.txt existe** (`public/llms.txt`) — la mayoría de los sitios no lo tiene.
- **robots.txt no bloquea ningún bot de IA** (GPTBot, ClaudeBot, PerplexityBot, etc. entran todos). Verificado en producción.

## Top 5 cambios, priorizados

### 1. Generar llms.txt automáticamente desde guides.ts (esfuerzo: bajo / impacto: alto)

Hoy `public/llms.txt` se mantiene a mano y ya está desincronizado: lista solo 3 guías de cafeteras y usa URLs planas `/guias/{slug}` cuando algunas guías viven en silos `/guias/{silo}/{slug}`. Solución: un route handler o script de build que lo genere desde `getPublishedGuides()`, igual que ya hace `sitemap.ts`. Así nunca más queda viejo. De paso, ajustar al formato estándar (título `#`, resumen en blockquote `>`, links `- [Título](url): descripción`).

### 2. Reglas explícitas para bots de IA en robots.ts (esfuerzo: muy bajo / impacto: medio)

Hoy los bots de IA entran "por omisión" (regla genérica `*`). Conviene permitir explícitamente a GPTBot, OAI-SearchBot, ClaudeBot y PerplexityBot (los que traen tráfico/citas) y decidir conscientemente qué hacer con CCBot y bots de entrenamiento. Son ~10 líneas en `src/app/robots.ts`.

### 3. Más títulos H2 en formato pregunta (esfuerzo: medio / impacto: alto)

En la guía de freidoras, de 8 headings solo 1 es pregunta. Los motores de IA matchean consultas conversacionales contra headings. Ejemplos: "Los 20 modelos disponibles" → "¿Qué freidoras de aire hay en Argentina?"; "Qué diferencia realmente a las marcas" → "¿Qué diferencia hay entre Atma, Philips y Ninja?". Empezar por los pillars de cada cluster. No requiere código, solo edición de contenido en `src/data/guides.ts`.

### 4. Autor con entidad real (esfuerzo: bajo / impacto: medio)

Hoy el autor es "Equipo ProductosVirales" (genérico). Cambiar a `Person` con nombre, bio y links (`sameAs` a Twitter/LinkedIn) en el JSON-LD de Article. Los motores de IA pesan mucho la autoría identificable (E-E-A-T). Se toca en `GuidePageView.tsx` + una sección de autor en `/sobre-nosotros`.

### 5. Presencia en YouTube y Reddit (esfuerzo: alto / impacto: el más alto a largo plazo)

Estudio de Ahrefs (dic 2025, 75.000 marcas): las menciones de marca correlacionan 3x más con citas de IA que los backlinks. YouTube es la señal más fuerte (~0.74) y Reddit domina las citas de Perplexity (~47%). Hoy "productosvirales" no tiene presencia en ninguno. Opciones realistas: canal de YouTube con reviews cortas de los productos top (reusar el contenido de las guías), y participación honesta (no spam) en subreddits argentinos cuando alguien pregunta por estos productos. Es la palanca más lenta pero la que más mueve.

## Quick wins adicionales

- Verificar que el reemplazo de precios `{{precio:MLA_ID}}` se resuelve en servidor (parece que sí, `injectLivePrices` corre en el server component) — si algún caso quedara como placeholder en el HTML crudo, un LLM citaría "{{precio:...}}".
- Mantener el patrón "respuesta directa en las primeras 40-60 palabras" que ya usa la guía de freidoras ("La mejor freidora de aire para la mayoría de los hogares en Argentina es la Atma FR248ABP...") en TODAS las guías nuevas — es exactamente lo que los motores de IA extraen.
- Bloques de respuesta autocontenidos de ~134-167 palabras: varios product-cards quedan cortos (~55 palabras) y dependen del H3 anterior para tener sentido. En pillars, engordar las descripciones clave para que se sostengan solas.
- Agregar fecha de actualización al propio llms.txt.

## Contexto por plataforma

| Plataforma | De dónde cita | Qué hacer |
|---|---|---|
| Google AI Overviews | 92% de páginas top-10 en Google | Seguir con el SEO actual + headings-pregunta |
| ChatGPT | Wikipedia (48%), Reddit (11%) | Entidad de marca consistente + Reddit |
| Perplexity | Reddit (47%) | Reddit es casi obligatorio |
| Bing Copilot | Índice de Bing | Verificar el sitio en Bing Webmaster Tools |

Solo el 11% de los dominios son citados por ChatGPT y Google AI Overviews a la vez — por eso conviene trabajar más de una plataforma.

## Verificación realizada

- `https://productosvirales.com.ar/robots.txt` (fetch en vivo): regla genérica allow-all, coincide con `src/app/robots.ts`.
- `https://productosvirales.com.ar/llms.txt` (fetch en vivo): presente, 113 líneas, coincide con `public/llms.txt`.
- Código revisado: `robots.ts`, `sitemap.ts`, `layout.tsx`, `page.tsx` (home), `GuidePageView.tsx`, `ArticleHeader.tsx`, `producto/[slug]/page.tsx`, `types.ts`, `guides.ts`.
