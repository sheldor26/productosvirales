# Días pares de MercadoLibre — runbook

> Escrito el 2026-08-29. MercadoLibre corre un evento de ofertas los días "pares" del calendario: 9/9, 10/10, 11/11, 12/12. Este documento es el plan para esos cuatro días, no un reporte de resultados — se actualiza a medida que se corre cada fecha.

## Por qué esto no es una jugada de SEO

Medido con Ubersuggest (Argentina, 2026-08-29): "ofertas mercadolibre 9/9" tiene **0 búsquedas/mes**. "Hot sale mercadolibre" (el evento grande y real de ML, en mayo) apenas junta 880/mes en su pico. Nadie busca estos días por nombre en Google — es un fenómeno de plataforma/push, no de búsqueda. Una guía nueva tampoco llegaría a tiempo: faltan 11 días para el 9/9 y el sitio no indexa/rankea contenido nuevo en ese plazo.

La jugada real es **distribución directa a la audiencia que ya seguimos**, el día del evento, con bajas de precio reales verificadas ese mismo día — el mismo mecanismo que ya existe para bajas de precio sueltas (ver `canal-telegram-bajas-precio` en memoria), pero concentrado en las 4 fechas de mayor tráfico de compra real de MercadoLibre.

## Canales y su estado (al 2026-08-29)

| Canal | Estado | Qué falta |
|---|---|---|
| Telegram (`@productosvirales_argentina`) | **Operativo** | Nada — bot armado, `scripts/telegram-price-drop.cjs` probado |
| Threads / X | **Operativo** | Nada — flujo de posts ya rutinario |
| WhatsApp Channel | **Armado, no conectado** | `WHATSAPP_CHANNEL_JID` vacío. Juan tiene que correr `node scripts/whatsapp-bootstrap.mjs` a mano (necesita escanear QR o ingresar código con el celular) y cargar el JID que imprime en `.env` y en los secrets de GitHub. Es un paso de una sola vez, no lo puede hacer Claude. |

**Si el bootstrap de WhatsApp no está listo para el 9/9**, el runbook corre igual con Telegram + Threads/X — WhatsApp se suma cuando esté.

## El runbook, por fecha (9/9, 10/10, 11/11, 12/12)

1. **Un día antes:** confirmar que los tres canales responden (si WhatsApp ya está bootstrapeado, probar `publicar-whatsapp-canal.cjs text "prueba"` al chat/canal antes, no en vivo el día del evento).
2. **La mañana del evento (antes de las 10am):** escanear el catálogo (Bright Data si el pipeline está sano, o verificación manual como venía haciéndose) buscando bajas de precio reales que coincidan con el evento — no alcanza con que ML diga "oferta", hay que confirmar contra `price-history.json` que el precio bajó de verdad.
3. **Filtrar antes de publicar:**
   - Precio verificado a mano ese mismo día (no un dato de `priceStatus: "fresh"` viejo).
   - Si hay un cupón de ML activo que aplique, sumarlo solo si el precio ya supera la compra mínima por sí solo (regla ya establecida, ver `cupones-activos-chequear-al-postear`).
   - Nunca inflar ni inventar el "antes" — mismo estándar que cualquier otro post de baja de precio del sitio.
4. **Armar y mandar la tanda de posts:** Telegram vía `scripts/telegram-price-drop.cjs <ID> <precioNuevo>` (revisión al chat privado primero, `--canal` solo cuando Juan lo confirma explícito ese día), Threads/X con el formato ya rutinario, WhatsApp vía `publicar-whatsapp-canal.cjs` si está listo.
5. **Después del evento:** anotar acá abajo qué funcionó (clicks de afiliado del día vs. un día normal, cuál canal rindió más) para que la próxima fecha (10/10) salga mejor que la anterior.

## Bitácora

- **9/9:** pendiente.
- **10/10:** pendiente.
- **11/11:** pendiente.
- **12/12:** pendiente.
