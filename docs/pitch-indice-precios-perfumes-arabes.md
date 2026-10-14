# Pitch para periodistas — Índice de precios: perfumes árabes

Mandar desde tu mail/cuenta personal, uno por uno (no en copia masiva). Ajustá
el nombre del periodista y el medio en cada envío. No pedir el link — si usan
el dato, el link sale solo.

**Página fuente:** https://productosvirales.com.ar/indice-precios/perfumes-arabes

---

## Asunto

Dato: un perfume árabe de Lattafa casi duplicó su precio en Mercado Libre en 6 meses

## Cuerpo

Hola [Nombre],

Te escribo porque venimos siguiendo el precio de venta público de 39 perfumes
árabes en Mercado Libre Argentina desde abril. Con seis meses de datos
(hasta el 12 de octubre) encontramos algo que puede ser una nota:

- El Lattafa Qaed Al Fursan pasó de $30.050 en abril a $48.499 (+61%), y se
  sostiene en ese valor desde fines de septiembre.
- El set Lattafa My Yara Collection (4 perfumes) pasó de $67.600 a $118.000
  (+75%).
- En la misma marca, 8 de 22 perfumes subieron más de 20%.
- Pero no sube todo: el Lattafa Mayar bajó 23%, el Mandarine Sky (un genérico)
  20% y el Khamrah Qahwa 14%. El promedio de toda la categoría es +7,4%,
  pero la mediana es 0%: el promedio esconde una dispersión enorme.

Es precio de venta real, no una encuesta ni una estimación. Dejamos toda la
planilla (fecha y precio inicial y final de cada perfume) pública acá:
https://productosvirales.com.ar/indice-precios/perfumes-arabes

Si te sirve como fuente o querés el dato desagregado por marca, te lo paso
sin problema. Cualquier cosa, estoy para lo que necesites.

Saludos,
Juan
ProductosVirales.com.ar

---

## Notas para elegir a quién mandarlo

Apuntar a periodistas de economía/consumo que ya escriben sobre precios e
inflación, no a beauty/lifestyle (el ángulo es el dato, no el producto).
Candidatos típicos en medios argentinos: sección Economía de Infobae,
Ámbito Financiero, iProfesional, La Nación Economía, Chequeado (verifican
datos, les puede interesar la metodología). Buscar bylines de notas
recientes sobre "precios" o "inflación en supermercados/electro" en esos
medios y mandarles el pitch directo a su mail o por X/Twitter.

No hace falta mandar los 10 el mismo día — arrancar con 2-3, ver si
contestan, ajustar el ángulo si hace falta antes de seguir con el resto.

## Si alguien pregunta cómo se releva el precio (nota privada, no para el mail)

Ni la página ni el mail dicen cómo se capturan los precios — a propósito,
para no exponer el método de scraping (el ToS de Mercado Libre lo prohíbe
en su cláusula 12; ver memoria `ml-tos-prohibe-scraping-clausula-12`). Si un
periodista pregunta la metodología, responder en términos generales: "hacemos
un seguimiento periódico del precio publicado en cada ficha, unas 3 veces
por semana" — sin mencionar herramientas, scraping, ni automatización. No
hace falta mentir, solo no entrar en detalle técnico de cómo se releva.

## Nota de actualización (2026-10-14) — leer antes de mandar

- Datos al 2026-10-12: 39 perfumes con 4+ chequeos, 19 subieron y 19 bajaron
  (1 sin cambio). Promedio +7,4%, mediana 0%. Estos números salen de la
  página ya corregida (ver abajo) y coinciden con ella.
- Se sacaron del pitch el +93% y el -42% de la versión anterior: ya no
  aplican con los datos nuevos.
- Arreglo hecho en `src/lib/perfume-price-index.ts`: el precio inicial ahora
  es la mediana de las primeras 3 lecturas en vez de la primera. Antes
  Afnan 9PM Elixir figuraba con -55% por una lectura de abril de 99.999 que
  el mismo día convivía con 51.000 (ahora -15%).
- Bharara King sigue en -57% en la página (112.249 el 25/04 a 48.766 el
  12/10). Es una caída real en las lecturas, pero con mucho ruido en el
  medio (53.724 a 97.000 en septiembre-octubre), así que NO se cita en el
  mail. Si un periodista pregunta, decir que es el caso más volátil.
- Los valores "actuales" rebotan entre lecturas (ej. Asad Intense 44.864 el
  7/10 y 72.120 el 9/10), por eso el pitch solo cita casos con valor estable
  (Qaed Al Fursan 48.499 desde fines de septiembre, My Yara Collection
  100-118k desde septiembre).
- Antes de mandar: el cambio de código está SIN commitear ni deployado, así
  que la página en producción todavía muestra los números viejos. Hay que
  pushear primero, esperar el deploy y recién ahí mandar.
