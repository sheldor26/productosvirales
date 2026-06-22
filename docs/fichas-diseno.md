# fichas-diseno.md — Diseño y disposición de la ficha de producto (embudo de conversión)

> Sistema de diseño OFICIAL de la página de producto (`/producto/[slug]`). Define cómo se PRESENTA la ficha, no qué dice (eso es `docs/fichas.md`) ni cómo se programa (eso es `ProductDetail.tsx`).
> Complementa a `docs/guias.md` (diseño de guías) y a `docs/fichas.md` (proceso de importación/contenido).
> Prototipo navegable de referencia: `docs/propuestas/ficha-lattissima-propuesta.html`.

## Principio

Cada página de producto es un **embudo de conversión con un solo objetivo**: que la persona haga click en el botón que va a MercadoLibre (link de afiliado `meli.la/...`). No hay carrito ni checkout propio. La única acción valiosa es el click saliente.

El texto (contenido editorial honesto) ya está definido en `docs/fichas.md`. Este doc es sobre la **presentación**: convertir un bloque de texto largo en estaciones escaneables que empujan al click, sin perder la honestidad que es el sello del sitio.

Regla mental: el 80% de la decisión pasa arriba del pliegue (precio + por qué + botón). Todo lo de abajo refuerza y captura al que necesita más pruebas.

## Estructura del embudo (orden de secciones)

El orden no es decorativo: lleva de "¿qué es y cuánto sale?" a "¿es para mí?" a "comprá".

1. **Hero / buy-box** (arriba del pliegue): categoría, H1, byline + fecha, rating con estrellas, precio + señal de cuotas, trust signals, **CTA dominante único**, disclosure de afiliado, veredicto rápido.
2. **Pros y contras** en dos tarjetas de color (verde / rojo), + tira de specs clave en mosaicos.
3. **Tabla comparativa** contra los otros modelos del catálogo (con CTA por fila). Sección con `id="comparativa"`.
4. **¿Para quién sí / para quién no?** en dos tarjetas.
5. **Artículo** (cuerpo editorial completo, con callouts de honestidad y pull-quotes).
6. **Reviews** de compradores en tarjetas.
7. **Especificaciones** en tabla.
8. **FAQ** en acordeones (`<details>`).
9. **CTA final** en banda destacada.
10. **Otros modelos** (relacionados) → enlazan a fichas internas.

Notas de orden:
- El **veredicto** va dentro del hero (decisión de Juan, jun 2026): NO se sube a un TL;DR arriba de todo.
- "¿Para quién?" conviene lo más arriba posible: la pregunta nº1 de un producto de nicho caro es "¿esto es para mí?".
- Los **relacionados van al final**, después de la banda CTA, y enlazan a fichas internas (no compiten con el click principal saliente).

## Sistema de color

Base sobria del sitio (blanco/negro) + acentos funcionales que codifican significado:

- **CTA principal de compra:** azul MercadoLibre `#3483fa` (hover `#2968c8`), texto blanco. Es el color reconocible de "comprar en ML".
- **Banda CTA final:** fondo negro con botón amarillo ML `#ffe600` y texto oscuro (cierre, máximo contraste).
- **Pros:** verde `#16a34a` sobre fondo `#ecfdf3`. **Contras:** rojo `#ef4444` sobre `#fef2f2`.
- **Estrellas / rating:** ámbar `#f59e0b`.
- **Callout de honestidad:** azul claro (`#eff6ff` / borde `#bfdbfe`).
- **Texto:** `#111` primario, `#555` secundario, `#767676` muted (este último ya pasa contraste AA — no bajar a `#999`).
- Tipografía: Plus Jakarta Sans (display del sitio). En producción usar `next/font` self-hosted, NO `<link>` a Google Fonts.

Regla: el color codifica significado (compra / bueno / malo / puntaje), no se usa decorativo ni en arcoíris.

## Reglas de CTA

- **Un solo CTA dominante por bloque de decisión.** Nunca dos botones al mismo destino compitiendo (ej. el hero lleva UN botón a ML; el secundario es otra acción, como bajar a la comparativa).
- **Copy de intención, no de "ver precio".** El precio ya está visible arriba. Usar "Ir a MercadoLibre →" / "Comprar en MercadoLibre →". El mejor copy es el de decisión tomada: "Me quedo con la Lattissima One →".
- **CTAs en los momentos de decisión:** hero, después de la comparativa, banda final, y barra sticky en mobile.
- **Subtexto de seguridad y honestidad** cerca del CTA: "Compra protegida en MercadoLibre · el precio puede cambiar, confirmalo allí" + disclosure de afiliado.
- Todo CTA de compra es un **enlace real** `<a href="meli.la/..." target="_blank" rel="sponsored nofollow noopener">`. Nunca `<button onclick>` (no es rastreable, no pasa señal, no se le puede poner `rel`).

## Tabla comparativa

- Compara el producto contra los otros modelos del catálogo (precio, diferencial, material, puntaje, "mejor para", comprar).
- La fila del producto de la página va **resaltada** (fondo azul claro).
- Columna **Puntaje**: estrellas doradas con relleno parcial real (ej. 4.8 = 96% de ancho), con la **cantidad de opiniones como subtexto chico debajo** (20 vs 130 vs 2.663). Las estrellas dan impacto visual; el conteo mantiene la honestidad del respaldo real.
- Cada fila tiene su botón **"Ver en MercadoLibre →"** con el link de afiliado del modelo (cualquier click saliente paga comisión).
- Tabla en `<table>` semántica (thead/tbody), con scroll horizontal en mobile.

## La honestidad como activo de conversión

El diferencial del sitio es decir los contras de frente. Para que GENERE confianza (y no frene el click):

- **Decir la debilidad UNA vez, fuerte, y mitigarla en el mismo lugar.** No repetir "20 opiniones" cuatro veces sin cerrarla. Ej.: "Solo 20 opiniones — pero 18 son de 5★ y es el sistema Nespresso de siempre."
- **Poner el contra ANTES del CTA**, no después: cuando un sitio admite el defecto y aun así recomienda, el recomendar pesa más.
- **Disclosure de afiliado explícito** ("ganamos una comisión, no te cambia el precio"): en sitios serios, la transparencia SUBE la confianza.
- Usar la honestidad como prueba de confiabilidad del SITIO (no como defecto del producto): "Te decimos los contras de frente — siempre."

## E-E-A-T y confianza

- **Byline + fecha de actualización** visibles bajo el H1: "Por ProductosVirales · Actualizado <mes año>".
- Línea de "cómo lo evaluamos" (opiniones reales de ML + ficha del fabricante; decir qué se verificó y qué no).
- Nada de placeholders vacíos (ej. thumbnails de galería sin imagen): gritan "borrador" y matan la confianza. O foto real o no va.

## Accesibilidad (mínimos)

- Contraste de texto ≥ AA (muted `#767676`, no `#999`).
- `:focus-visible` visible en todos los interactivos (links, botones, acordeones).
- Estrellas de rating con `role="img"` + `aria-label` ("4.8 de 5 estrellas, 20 opiniones").
- CTAs y tarjetas de relacionados son `<a>` reales (focusables por teclado), no `<div onclick>`.
- Tabla con scroll horizontal en mobile; H1 baja a ~21px, legible.

## Reglas para llevarlo a producción (`ProductDetail.tsx`)

El prototipo HTML es standalone. Al portarlo a Next, esto es NO NEGOCIABLE para no romper el SEO que la ficha real ya tiene ganado:

1. **CTAs y links de compra = `<a href rel="sponsored nofollow noopener" target="_blank">`.** Cero `<button onclick>` para navegar.
2. **Conservar los 5 bloques JSON-LD** existentes: Product, AggregateRating, Review, FAQPage, BreadcrumbList. (Ojo políticas: AggregateRating con muestra chica —ej. 20 opiniones— es zona gris; la honestidad explícita es la defensa, y las reviews deben estar visibles en la página).
3. **Links a modelos hermanos → fichas internas** (`/producto/...`), NO directo a ML. ML solo en el CTA de compra del producto de la página. (Excepción acordada: los botones "comprar" de la tabla comparativa sí van a ML, porque ahí hay intención de compra.)
4. **No recortar el cuerpo editorial** (~1.200 palabras) ni las FAQ largas por estética. El texto largo y específico es el activo SEO/GEO.
5. **Conservar los H2 descriptivos con keyword** ("La premium de Nespresso con leche integrada", "Lattissima One vs Citiz & Milk"). Los "kickers" son decoración encima del H2, no lo reemplazan.
6. **`next/font` self-hosted**, no Google Fonts vía `<link>`. Hero con `priority`, relacionados con `lazy`.
7. **Frase-respuesta extraíble bajo el H1** (1–2 líneas) para AI Overviews / Perplexity / ChatGPT.
8. Verificar a nivel sitio que GPTBot/PerplexityBot/ClaudeBot no estén bloqueados (citabilidad IA).

## Pendiente de contenido (datos reales por conseguir)

Información decisiva que un comprador de producto premium quiere y que conviene sumar (fuente: ficha del fabricante + ML, ver `docs/fichas.md`):

- **Costo por cápsula y por taza** (para cafeteras de cápsulas es EL dato).
- **Garantía y posventa** (¿oficial del fabricante en AR? ¿servicio técnico?).
- **Compatibilidad** (¿acepta compatibles más baratas o solo el sistema oficial?).
- **Tamaño/dimensiones** ("¿entra bajo la alacena?"), peso, ruido, consumo, descalcificación.
- **Distribución de estrellas** como dato visual (ej. "18 de 20 = 5★").

---

_Origen: auditoría multi-disciplinaria (UX/UI, CRO, SEO/GEO, redacción de afiliados de nicho) sobre el prototipo de la ficha Nespresso Lattissima One, junio 2026._
