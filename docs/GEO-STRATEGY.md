# Estrategia GEO — plan de aplicación

Fecha: 2026-07-04. Basado en `docs/GEO-ANALYSIS.md`.

## Fase 1 — Código (1 sesión de trabajo, riesgo bajo)

Cambios técnicos de una vez, no requieren mantenimiento:

1. **llms.txt autogenerado**: route handler `src/app/llms.txt/route.ts` que lee `getPublishedGuides()` y arma el archivo en formato estándar, agrupado por cluster. Se borra `public/llms.txt` manual. Nunca más queda desincronizado.
2. **robots.ts con reglas explícitas**: allow explícito a GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot. Requiere una decisión de Juan (ver "Decisión pendiente" abajo).
3. **Autor como Person en JSON-LD**: en `GuidePageView.tsx`, cambiar "Equipo ProductosVirales" por una persona real con bio en `/sobre-nosotros` y `sameAs` a redes. Requiere decisión de Juan (¿su nombre o un seudónimo editorial consistente?).
4. **Bing Webmaster Tools**: verificar el sitio (Copilot cita desde el índice de Bing; es gratis y toma 15 minutos).

Nota regla de oro #4: robots y sitemap son stack base → avisar antes de tocar. Este documento es el aviso; no se toca nada sin OK.

## Fase 2 — Contenido (4-6 semanas, de a un cluster por vez)

Orden sugerido: freidoras → perfumes árabes → robots aspiradora → resto (empezar por el cluster con más tráfico según GSC).

Por cada guía pillar:
- Convertir H2 descriptivos a formato pregunta donde suene natural ("Los 20 modelos disponibles" → "¿Qué freidoras de aire hay en Argentina?"). No forzar: si queda robótico, no se cambia.
- Verificar que la respuesta directa esté en las primeras 40-60 palabras después de cada heading importante.
- Engordar los bloques de respuesta clave a ~134-167 palabras para que se sostengan solos (hoy varios product-cards tienen ~55 y dependen del H3 anterior).

Regla editorial: `docs/guias.md` sigue siendo la plantilla oficial. Estos ajustes se integran a esa plantilla para guías nuevas, así el trabajo se hace una vez.

## Fase 3 — Marca fuera del sitio (continuo, la palanca más fuerte y más lenta)

- **YouTube**: canal con reviews cortas (60-90 seg) de los productos top, reusando el contenido que ya está escrito en las guías. Empezar con 1 video/semana de los 5 productos más vendidos. Link a la guía en la descripción.
- **Reddit**: participar solo cuando alguien pregunta genuinamente por estos productos en subreddits argentinos. Regla estricta: aportar valor primero, link solo si suma, nunca más de ~1 de cada 10 comentarios con link propio. El riesgo de ban por spam es real y un ban daña más de lo que suma.
- No intentar Wikipedia: un sitio de afiliados de nicho no califica y el intento puede dar mala imagen.

## Medición (mensual)

- En analytics: tráfico referral de chatgpt.com, perplexity.ai, copilot.microsoft.com, gemini.google.com.
- Test manual: preguntar a ChatGPT y Perplexity 5 queries objetivo ("mejor freidora de aire argentina", "yara lattafa es original", etc.) y anotar si citan el sitio. Guardar resultado en este doc.
- GSC: impresiones en AI Overviews (cuando Google las reporte para el sitio).
- Expectativa realista: GEO es de ciclo largo; 3-6 meses hasta ver citas consistentes.

## Decisión pendiente (para Juan)

**¿Bloquear los bots de entrenamiento (CCBot, anthropic-ai, Google-Extended) o dejarlos entrar?**
- Dejarlos: máxima visibilidad futura; el contenido puede quedar "adentro" de los modelos.
- Bloquearlos: protege el activo editorial de ser usado para entrenar sin compensación, sin afectar las citas en vivo (GPTBot/PerplexityBot/ClaudeBot de búsqueda siguen entrando).
- Recomendación: bloquear solo CCBot y Google-Extended, permitir todo lo de búsqueda. Reversible en 5 minutos.

## Contras y riesgos (honesto)

1. **La contra grande — canibalización de clics**: si ChatGPT o los AI Overviews responden "comprá la Atma FR248ABP" citando al sitio, muchos usuarios no hacen clic → no pasan por el link de afiliado → no hay comisión. GEO te da visibilidad de marca pero puede absorber la respuesta. Mitigación: el negocio de afiliados depende del clic final a MercadoLibre, y ese clic el LLM no lo reemplaza del todo — quien va a comprar termina entrando. Además, no hacer GEO no evita el problema: los AI Overviews ya responden estas queries igual, con o sin vos; mejor ser el citado que no existir.
2. **Precios viejos en boca de la IA**: un LLM puede citar un precio de hace 3 meses. En Argentina eso envejece feo. Mitigación: fechas visibles + `priceValidUntil` ya implementados; no hay mucho más que hacer.
3. **Entrenamiento gratis**: permitir todos los bots implica que el contenido editorial (el activo del negocio) entrena modelos ajenos sin compensación. Es la decisión pendiente de arriba.
4. **Exposición personal**: poner un autor con nombre real ata la identidad de Juan al sitio. Alternativa válida: seudónimo editorial consistente (menos potente para E-E-A-T, pero funciona).
5. **Costo de tiempo en Fase 3**: YouTube/Reddit es trabajo sostenido, no un cambio de código. Si no hay tiempo real para mantenerlo, mejor no empezar (un canal muerto o cuenta baneada resta).
6. **ROI incierto**: GEO es disciplina nueva, las "mejores prácticas" cambian rápido y la atribución es difícil. Las Fases 1-2 son baratas y también mejoran SEO clásico (riesgo ~cero); la Fase 3 es la apuesta.

Lo que NO es riesgo: nada de las Fases 1-2 puede dañar el SEO actual — headings-pregunta, schema de autor, llms.txt y robots explícito son compatibles o directamente positivos para Google clásico.
