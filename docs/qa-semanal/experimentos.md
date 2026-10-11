# Experimentos de conversion en curso

El agente semanal (`scripts/qa-semanal/AGENTE.md`) lee este archivo y reporta cada semana como van estas paginas contra su linea de base.

Metrica: clics a MercadoLibre (GA4 `affiliate_click` por pagePath) cada 100 clics de Google (GSC), ventana de 28 dias. No es tasa de conversion: GA4 cuenta tambien clics que no vienen de Google.

## A. Recomendacion clara en las guias flojas

Cambio: agregar `quickPicks` (boton de arriba + elecciones + barra fija en celular). Fecha de salida y de evaluacion: ver mas abajo (sin commit ni push al 2026-10-11). `updatedDate` NO se bumpeo (precedente del 27/7: no resetear ventanas de maduracion).

Linea de base (GSC 12/9 al 9/10, GA4 28 dias hasta el 11/10):

| Pagina | Grupo | Clics Google | Clics a ML | Cada 100 | Primer boton (celular) |
|---|---|---|---|---|---|
| /guias/yara-lattafa-guia-completa | tratamiento | 61 | 4 | 6,6 | 4,07 pantallas, sin barra fija |
| /guias/donde-comprar-perfumes-arabes-argentina | tratamiento | 59 | 5 | 8,5 | 2,34 pantallas, sin barra fija |
| /guias/donde-comprar-perfumes-arabes-buenos-aires | control (sin cambios) | 69 | 0 | 0 | 7,25 pantallas, sin barra fija |

Tratamiento pooled (yara + argentina): 120 clics de Google, 9 a ML = 7,5 cada 100. Promedio del sitio en esa ventana: 18,1.

Despues del cambio (medido en local): yara 1,51 pantallas con barra fija; argentina 1,63 pantallas con barra fija; buenos-aires sin cambios.

Correccion de precios tambien incluida en yara (11/10): el texto decia 'entre $25.000 y $40.000', set My Yara $64.508, set 5to Aniversario $100.528 y Elixir $68.000 a mano; ahora usan tokens de precio ({{precio:ID}}) y los titulos de los sets no llevan precio. Es un cambio de contenido adicional al `quickPicks`, asi que si Yara se mueve no se puede atribuir solo al boton: por eso se evalua pooled y contra el control.

Cambio editorial incluido en yara: se reescribio el parrafo "Cual comprar primero" porque decia que Tous costaba $42.000 y el Elixir $68.000 (hoy es al reves: Tous $65.900, Elixir $51.000) y contradecia el veredicto final de la misma guia (Elixir para el primer Yara). Ahora ambos dicen Elixir para el primer Yara, Tous para el calor.

Fecha de salida: PENDIENTE
Fecha de evaluacion: PENDIENTE (= fecha de salida + 42 dias)

Recordatorios (tareas programadas, corren con la app abierta; si estaba cerrada corren al abrirla):
- `recordatorio-experimento-a-fecha-salida`: 14/10/2026 09:00. Verifica si el cambio esta publicado en el sitio real, anota las dos fechas aca y agenda el aviso de evaluacion. Si no esta publicado, avisa que falta commit y push y reintenta cada 3 dias hasta el 15/11.
- `evaluacion-experimento-a`: se crea sola con la fecha de salida real.

Evaluacion: a las 6 semanas de la fecha de salida. Exito: pooled de tratamiento de 12 o mas cada 100. Si no se mueve y el control sigue igual, la causa es la intencion de busqueda y no el diseno: se deja asi y no se extiende a las otras 22 guias sin `quickPicks`.
Nota para la lectura: clics de Google de una pagina chica fluctuan; mirar el pooled y no cada pagina por separado.

## B. Primera pantalla en celular (toda la plantilla)

Pendiente de aprobacion. Linea de base del sitio: 4.485 clics de Google, 813 a ML = 18,1 cada 100 (33 paginas con 30 o mas clics). Excluir A del calculo.
