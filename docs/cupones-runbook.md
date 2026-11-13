# Runbook: cargar cupones de MercadoLibre (para Codex)

Rutina diaria de Juan. El programa de afiliados de ML le manda por Telegram un mensaje con los cupones del día; Juan lo pega en el chat y hay que cargarlos en el sitio. Resultado: un badge verde "Cupón CODIGO -$X.XXX" aparece al lado del precio de todo producto que califica, en tarjetas, guías, fichas y en `/enlaces`.

Esto se hace a mano a propósito (los mensajes de MELI no tienen formato fijo y el sitio no tiene DB). No armar automatizaciones.

## Autorización (leer primero)

Juan dio aprobación permanente para **commitear y pushear los cambios de cupones sin preguntar cada vez**. Aplica SOLO a cambios en `src/data/coupons.ts`. Para cualquier otra cosa rige la regla del repo: no commitear ni pushear sin que Juan lo pida.

## Archivos

- `src/data/coupons.ts`: la ÚNICA fuente. Exporta `activeCoupons: Coupon[]`. La leen tarjetas, guías, ficha de producto y `/enlaces`. No crear otro archivo de cupones (hubo un duplicado que dejaba `/enlaces` desactualizado; se borró).
- `src/lib/types.ts`: interfaz `Coupon`.
- `src/lib/coupons.ts`: lógica (`getApplicableCoupon`, `couponDiscountFor`). No tocar.

## Pasos, siempre en este orden

1. **`date "+%H:%M — %Y-%m-%d"` ANTES de escribir nada.** Usar esa fecha, no la que crea la sesión. Es el error más repetido: se cargó el día anterior más de una vez.
2. Del mensaje sacar, por cada cupón: código, monto, compra mínima y vigencia.
3. Decidir si reemplaza o suma (sección de abajo).
4. Reescribir `src/data/coupons.ts` completo.
5. `npm run build` (1-2 min). Es el único test, no hay `npm test`.
6. Commit solo de ese archivo + push (secciones de abajo).
7. Contarle a Juan qué quedó, en tabla.

## Formato de cada entrada

```ts
{
  code: "MELICYBER26",
  discountAmount: 20000,          // monto fijo en pesos
  minPurchase: 250000,
  validFrom: "2026-11-02T00:00:00-03:00",   // o null
  validUntil: "2026-11-02T23:59:00-03:00",
  active: true,
},
```

Fechas siempre ISO con `-03:00` (Argentina).

## Vigencia: cómo traducir el mensaje

| El mensaje dice | validFrom | validUntil |
|---|---|---|
| "Hoy de 9:00 a 23:59" | hoy 09:00 | hoy 23:59 |
| "De 00:00 a 23:59" | hoy 00:00 | hoy 23:59 |
| "Hoy hasta las 23:59" (sin hora de inicio) | `null` | hoy 23:59 |
| "Válido hasta 15:30" | `null` | hoy 15:30 |
| No dice nada de vigencia | `null` | hoy 23:59 |

Si no hay vigencia, se asume 23:59 de hoy: es preferible que el badge desaparezca de más antes que prometer un descuento que el carrito rechaza.

Cuando un cupón vence NO hay que tocar el archivo: el badge se baja solo según el reloj del visitante (las páginas son estáticas pero el badge se resuelve en el navegador; `/enlaces` se recalcula en cada request). Lo que sí hay que hacer es sacar las entradas vencidas cuando se carga un día nuevo.

## Reemplazar o sumar

- **Día nuevo**: reemplazar TODO el contenido por los cupones del mensaje.
- **Segundo mensaje el mismo día**:
  - Si trae otro tramo distinto (otro monto o mínima) o dice "seguimos sumando", "nuevo cupón", "el último cupón del día" → **sumar** a los de la mañana, que siguen vigentes.
  - Si trae el mismo monto y mínima con un código casi igual (pasó con MELIMODO y después MODOMELI) → parece corrección: **reemplazar** el anterior y avisarle a Juan.
- Si un mensaje dice "ya les avisé hace un ratito", probablemente hubo un cupón antes que Juan no pasó: avisarle.

## Reglas de contenido (no negociables)

- **Cargar siempre lo que dice el mensaje del día.** MELI reusa códigos con montos distintos y manda los mismos montos con códigos distintos. Nunca copiar de un día anterior por parecido de nombre ni asumir el monto por el tramo.
- **Nunca inventar un monto o una mínima.** Si el mensaje no los trae (pasó con CYBERLOCO), dejar ese cupón afuera y preguntarle a Juan. No loguearse en la cuenta de MercadoLibre de Juan para averiguarlo.
- Los "TIP DE AFILIADO" del mensaje son ideas de contenido para redes: ignorarlos. Ojo: a veces dicen cosas que no cuadran (ej. "10% extra" para un cupón de monto fijo).
- El badge nunca combina productos para llegar a la mínima: se muestra solo si ESE producto, solo, supera la mínima.

## Cómo resuelve el sitio varios cupones

`getApplicableCoupon` filtra los vigentes y se queda con el que más descuento da **para ese precio**. Por eso los escalones se resuelven solos (ej. $80k / $250k / $500k / $1M): no hay que ordenar ni partir rangos a mano, solo cargar todos los vigentes.

## Casos especiales

- **Porcentual** ("10% OFF, tope $100.000"): usar `discountPercent: 10` + `maxDiscount: 100000` y NO `discountAmount`. El badge muestra el descuento real por producto, no el tope.
- **Limitado a categorías**: `categories: ["cocina"]` con slugs de `src/data/categories.ts` (viral, hogar, cocina, musica, tech, gaming, audio, belleza, climatizacion, salud-bienestar, seguridad, juguetes, coleccionables, movilidad, hogar-jardin, fitness, mascotas, bebes, equipaje-de-viaje, oficina). Con `categories` el cupón se omite en `/enlaces` (ahí no hay categoría) a propósito. Mapear categorías de forma conservadora y decirle a Juan qué mapeaste; si hay duda, preguntar.
- **"Productos 1P" (los vende Mercado Libre directo), "ofertas destacadas", exclusión de marcas**: el catálogo no tiene ese dato, así que no se filtra. Cargar como sitio completo y avisarle a Juan de la restricción.
- **Medio de pago** ("exclusivo con Mercado Pago", como FAMILIA): el tipo no tiene campo para eso. Cargarlo igual y dejar un comentario en el archivo; avisarle a Juan que el badge no aclara la condición.

## Escribir el archivo sin errores

Usar heredoc con delimitador entre comillas simples (`<<'EOF'`): ahí NO se expande nada, así que **no escapar los `$`** (una vez quedaron `\$15.000` en un comentario). Después de escribir: `grep -c '\\\$' src/data/coupons.ts` tiene que dar 0.

El comentario de cabecera del archivo explica en español rioplatense los escalones y cualquier rareza del día (monto nuevo, sin vigencia, un solo cupón en vez de tres). Dejarlo actualizado: es lo que evita que alguien "arregle" algo que no está roto.

## Build

`npm run build`. Tiene que terminar con la tabla de rutas (Static / SSG / Dynamic) sin errores.

- Si falla, leer el error antes de concluir nada. La vez que pareció que master estaba roto, el error venía de un archivo **sin trackear** de otra sesión (`docs/ai/reviews/.../guide-excerpt.ts`); eso no llega a Vercel. Verificar con `git ls-files --error-unmatch <ruta>`.
- Si hay otro build corriendo (lock de `.next`), usar `npx tsc --noEmit`.
- Si falla con `next/font/google queries have exactly one entry` o `Can't resolve '@vercel/turbopack-next/internal/font/google/font'`, es la descarga de fuentes de Google, no el cupón (pasó el 4/11 con `tsc` limpio). Chequear `npx tsc --noEmit` y reintentar `npm run build`: a la segunda pasó.

## Commit y push

Hay otras sesiones trabajando en este mismo repo, por eso todo esto:

1. `git branch --show-current` tiene que dar `master`. Otras sesiones dejan HEAD en otras ramas; si no es master, pasar a master y reaplicar el cambio ahí.
2. **Antes de stagear, mirar si otra sesión ya cargó el día.** Pasó varios días seguidos: mientras buildeás, otra sesión (Codex u otro chat de Claude) escribe, commitea y pushea los mismos cupones. Chequeo:

```bash
git fetch -q origin master
git log origin/master --format='%h %s' -1 -- src/data/coupons.ts
```

   Si ese último commit es del día de hoy, comparar valores (código, monto, mínima, vigencia) contra tu archivo. Si coinciden, `git checkout -- src/data/coupons.ts` y NO commitear (solo cambia el comentario de cabecera, no vale la pena un commit duplicado). Si difieren, no pisar: avisarle a Juan. Si el archivo del árbol de trabajo ya cambió solo mientras estabas por escribirlo, otra sesión está en medio de la carga: esperar a que termine su build, no correr un segundo `npm run build` (se pelean por el lock de `.next`).

3. **Stagear solo el archivo**: `git add src/data/coupons.ts`. NUNCA `git add -A` ni `git add .`: el árbol siempre tiene decenas de archivos ajenos sin commitear (una vez se barrieron 9.212). Chequear `git status --short src/data/coupons.ts` y que la primera columna sea `M`.
4. Commit con mensaje tipo `cupones: <qué se cargó>` y un cuerpo corto con lo raro del día. No poner atribución a Claude. Si `git commit` responde "nothing to commit", parar ahí: no seguir con stash, pull ni push.
5. Push: el remoto casi siempre está adelantado y los cambios ajenos sin commitear bloquean el `pull --rebase`. Rutina, en un bloque aparte del commit:

```bash
STASHED=0
if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  git stash push -m "wip otras sesiones (auto, cupon)" -q && STASHED=1
fi
git pull --rebase -q && git push
if [ "$STASHED" = "1" ]; then git stash pop -q; fi
```

El `pop` corre SOLO si este mismo bloque hizo el `stash` (por eso la bandera `STASHED`). Nunca hacer un `git stash pop` suelto: la lista de stashes tiene entradas viejas de otras sesiones y un `pop` sin haber stasheado vos aplica la equivocada. No encadenar el commit con el stash y el `pop` en un solo `&&`: si el commit sale vacío, el resto se saltea de formas raras.

No tocar ni commitear lo stasheado: el `pop` lo devuelve. Nunca `--force`. Si el `pop` da conflicto, no resolver adivinando: avisarle a Juan. Un `.git/index.lock` viejo solo se borra si `pgrep -fl git` no muestra ningún proceso git.

El push también sube los commits locales de otras sesiones que estén sin pushear (por ejemplo guías marcadas STAGED). Mirá `git log origin/master..HEAD --format='%h %an %s'` antes de pushear y mencionalo en el reporte si hay algo que no sea de cupones.

## Verificar en /enlaces (cuando Juan lo pide)

```bash
npm run dev -- -p 3100 &        # esperar ~15 s
curl -s http://localhost:3100/enlaces -o /tmp/enlaces.html
grep -o '🎫 Cupón <!-- -->[A-Z0-9]*<!-- -->: \$<!-- -->[0-9.]*' /tmp/enlaces.html \
  | sed 's/<!-- -->//g; s/🎫 Cupón //' | sort | uniq -c | sort -rn
```

Contar sobre el markup, no sobre el texto "Cupón CODIGO": React parte los nodos de texto con comentarios y el payload RSC repite cada string, así que un grep ingenuo da 0 o el doble. Esperado: cuántos `newPrice` de `src/data/social-posts.ts` caen en cada escalón (el mayor monto cuyo mínimo no supera el precio). Siempre calzó exacto. Al terminar, apagar el servidor de dev.

## Cómo reportarle a Juan

Español rioplatense, directo, sin relleno. Una tabla `Precio | Cupón` con los escalones que quedaron, el hash del push, y solo lo que cambia su lectura: monto o mínima nuevos respecto a ayer, falta de vigencia, días que quedaron sin cargar, restricciones que el sitio no puede mostrar. Sin la palabra "cluster". No mencionar IA ni Claude en nada de cara al usuario.

## Estado al 4/11/2026 (puede haber cambiado)

Cyber Monday arrancó el 2/11. Vienen tres escalones fijos todos los días, solo rotan los códigos: $20.000 desde $250.000, $45.000 desde $500.000 y $80.000 desde $1.000.000. El 4/11 arrancaron a las 10:00 y se sumó FAMILIA ($8.000 desde $80.000, solo Mercado Pago, hasta 15:30). Antes, desde el 17/10, mandaban un solo cupón por día con tramos que cambiaban sin patrón, así que nunca asumir el del día siguiente.
