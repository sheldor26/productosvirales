# Oportunidades de guías nuevas — investigación continua

Documento vivo del loop de investigación. Cada iteración suma o descarta candidatos.
Alimenta `/optimizador-guias-pv` (modo CREAR) y cierra con `/trio-auditor`.

**Regla de entrada:** un candidato no pasa a "listo para escribir" hasta tener las tres cosas.

1. **Volumen verificado** con Keyword Planner (fuente oficial de Google, manda sobre Ubersuggest).
2. **Sin canibalización** contra las 190 guías que ya existen.
3. **Góndola real en MercadoLibre**, o sea 6+ publicaciones usables sin bandera de última unidad.

El punto 3 es el que nos mordió con `pileta-de-lona` en agosto: keyword de 90.500 en diciembre,
pero en la ventana de sourcing la categoría tenía 6 publicaciones y solo 3 eran piletas de verdad.

---

## Iteración 1 — 2026-08-17

**Hueco encontrado: jardín y exterior, sin una sola guía en el sitio.** El barrido de coberturas
sobre los 190 slugs da cero para césped, riego, hidrolavado y herramientas de jardín. Es además el
rubro con la ventana estacional abierta: en Argentina esto se compra de septiembre a noviembre, y
estamos a cuatro semanas de la primavera.

Volúmenes de **Keyword Planner** (promedio mensual, Argentina):

| Keyword | Vol/mes | Competencia | Estado |
| :-- | --: | :-- | :-- |
| hidrolavadora | **40.500** | ALTA | libre |
| hidrolavadora inalámbrica | 6.600 | ALTA | libre |
| hidrolavadora Karcher | 5.400 | ALTA | libre |
| máquina de cortar pasto | **12.100** | ALTA | libre |
| bordeadora eléctrica | **12.100** | ALTA | libre |
| cortadora de césped | 9.900 | ALTA | libre |
| cortadora de pasto | 8.100 | ALTA | libre |
| bordeadora | 8.100 | ALTA | libre |
| robot cortacésped | 1.900 | ALTA | libre |

**Ojo con "competencia ALTA":** es competencia de **puja publicitaria**, no dificultad SEO. Mide
cuántos anunciantes pelean por el clic pagado, no cuán difícil es rankear orgánico. No confundir
con el SD de Ubersuggest, que es lo otro. Antes de comprometerse hace falta el SD real.

> **Corrección de la iteración 2 (leer antes de usar estos números).** En la primera pasada se
> sumaron las tres formas de decir cortadora y salió "30.100/mes". **Ese número está mal.** Keyword
> Planner agrupa variantes cercanas en un mismo bucket y les devuelve el mismo volumen, así que
> sumarlas infla el rubro. La prueba salió sola en la iteración 2: "rascador para gatos",
> "rascadores para gato" y "rascadores para gatas" devuelven **9.900 las tres**, y obviamente no son
> 29.700 búsquedas. Vale el número más alto del grupo como referencia del rubro, nunca la suma. Para
> cortadora eso deja **12.100/mes**, no 30.100.

**Canibalización: limpia.** Los choques que tira el grep son falsos positivos por substring
(`cortadora-de-pelo`, `maquina-de-afeitar`, `robot-de-cocina`). Ninguna guía existente toca jardín.

**El silo:** entrarían en `hogar-jardin`, que hoy tiene 11 guías pero todas de interior (zapatero,
mesa ratona, lámpara de pie, estantería, colchones, piletas). Sumar exterior le da al silo una
segunda pata temática con enlazado natural entre sus guías.

### Lo que falta antes de escribir

**Góndola sin verificar.** El 2026-08-17 MercadoLibre pasó a pedir verificación de cuenta tanto en
las fichas `/p/MLA` como en los listados de categoría, así que no se pudo contar publicaciones.
Es un bloqueo del día, no una conclusión sobre el rubro. Formas de destrabarlo:

- Reintentar el listado más adelante (el bloqueo parece de sesión o de IP, no permanente).
- Usar el workflow `brightdata-scoped-scrape` con permalinks concretos, que **sí funcionó** hoy
  para traer specs, precios, reseñas y stock de 4 productos.

**Dificultad SEO sin medir.** Ubersuggest devolvió HTTP 429 con el token expirado. Falta correr
`keyword_overview` y `serp_analysis` sobre las tres cabeceras para saber contra quién se compite.

### Orden sugerido cuando se destrabe

1. **hidrolavadora** — 40.500/mes es el número más alto de todo el barrido de hoy, y el rubro tiene
   marcas claras (Karcher, Gamma, Black+Decker) que dan hermanas de marca después.
2. **cortadora de césped** — sumando las tres formas de decirlo (máquina de cortar pasto, cortadora
   de césped, cortadora de pasto) el rubro pesa 30.100/mes. Un pilar genérico y después la keyword
   de marca.
3. **bordeadora** — 20.200/mes entre las dos formas. Complemento natural de la cortadora, con
   enlazado cruzado obvio entre las dos.

### Descartado por ahora

**parrilla a gas** (2.400/mes). La keyword madre "parrilla" tiene 110.000/mes pero es
navegacional/ambigua, y ya existe `parrilla-electrica`. Habría que resolver el corte como se hizo
con `pileta-de-lona` contra `pileta-pelopincho`: combustible distinto y comprador distinto. Vale la
pena, pero después de jardín.

---

---

## Iteración 2 — 2026-08-17

Se midieron con Keyword Planner los cinco huecos que quedaban sin números. **Todos los volúmenes de
abajo son el pico del bucket, no una suma.**

| Rubro | Keyword cabecera | Vol/mes | Nota |
| :-- | :-- | --: | :-- |
| Fitness | mancuernas | **14.800** | "pesas rusas" 5.400 como hermana |
| Mascotas | rascador para gatos | **9.900** | tres formas, mismo bucket |
| Bebé | cochecito de bebé | **9.900** | "coche Carestino" 3.600, hermana de marca |
| Auto | aspiradora para auto | **8.100** | comparte bucket con "aspiradoras inalámbricas" |
| Herramientas | taladro percutor | **5.400** | el más chico del grupo |
| Fitness | cinta caminadora | 4.400 | rubro fragmentado, ninguna variante pasa de 4.400 |

**Dos hallazgos que cambian el orden:**

**Mancuernas es el mejor candidato no estacional.** 14.800/mes, más que cualquier keyword de
jardín salvo hidrolavadora, y con un detalle que salta: "peso muerto con mancuerna" (6.600) y "peso
muerto rumano con mancuernas" (6.600) tienen competencia **BAJA**, las únicas dos de todo el barrido
de hoy. Son informativas, no transaccionales, pero sirven de puerta de entrada al rubro.

**Cinta de correr está más floja de lo que parecía.** Ninguna variante supera 4.400 y el rubro se
parte en seis formas distintas de nombrarlo. Baja de prioridad.

### Góndola: sigue sin verificar, y hoy no se va a poder

MercadoLibre bloqueó el acceso completo en esta sesión. Se probaron dos rutas y las dos redirigen a
`/gz/account-verification`:

- `listado.mercadolibre.com.ar/herramientas/hidrolavadoras/`
- `mercadolibre.com.ar/mas-vendidos/MLA1500`

Esto es nuevo respecto de sesiones anteriores, donde el listado de categoría sí renderizaba y solo
fallaba el buscador. **No se insiste**: ML escala bloqueos por IP y machacarlo empeora el problema.

La vía que sí funcionó hoy es el workflow `brightdata-scoped-scrape`, pero necesita permalinks
concretos, no sirve para contar una góndola. Para eso hace falta el listado, o pedirle a Juan que
mire la categoría a ojo.

### Ubersuggest sigue caído

`auth_status` confirma sesión válida (tier0), pero `location_suggest` devuelve HTTP 429 con "bearer
token expired". Es límite de la cuenta, no de credenciales. Sin esto no hay SD ni análisis de SERP.

---

## Iteración 3 — 2026-08-17

Dos cosas: canibalización fina y cola larga conversacional. Ninguna depende de ML ni de Ubersuggest.

### Canibalización: limpia de verdad

La iteración 1 comparó solo substrings de slug, que es flojo. Acá se comparó el **contenido** de las
190 guías contra los seis candidatos. Resultado: **ninguna guía menciona ninguno de los seis**.

El único hit, `ducha-electrica` para "rascador gatos", es un falso positivo de manual: la palabra
"gato" está adentro de **"obli-gato-ria"**. Vale la pena anotarlo porque es el mismo tipo de error
que ya nos costó tiempo hoy con los greps de substring.

### La cola larga conversacional acá casi no existe

| Keyword | Vol/mes | Competencia |
| :-- | --: | :-- |
| cuál es la mejor hidrolavadora | 170 | ALTA |
| cuál es la mejor marca de hidrolavadora | 70 | ALTA |
| cuál es la mejor cortadora de césped | 20 | MEDIA |
| qué mancuernas comprar | 10 | ALTA |

**Esto cambia cómo hay que armar estas guías.** En perfumes y cafeteras, "cuál es la mejor X" carga
volumen real y justifica un bloque conversacional pensado para que lo cite un AI Overview. En
hidrolavadora, cortadora y mancuernas la demanda es casi toda **cabecera transaccional**: la gente
busca el producto, no la pregunta.

Consecuencia práctica para `/optimizador-guias-pv`: en estos rubros el peso va a la comparativa, el
precio y las specs, no a un hub de preguntas. El bloque GEO sigue valiendo, pero como complemento,
no como columna vertebral.

### El hallazgo barato: marca contra marca

**"dibra o petri cuál es mejor" — 40/mes con competencia BAJA**, y aparece también escrita con
tilde, o sea 80/mes entre las dos formas si no comparten bucket (falta confirmarlo).

Es la única keyword de todo el barrido de hoy que combina intención comercial clara con competencia
baja. Y de paso revela cuáles son las marcas que importan en cortadoras de césped en Argentina:
**Dibra y Petri**. Ese enfrentamiento es material para una sección dentro del pilar, o para una
guía hermana si el pilar funciona.

---

## Iteración 4 — 2026-08-17 · el SD da vuelta todo

Ubersuggest volvió (el 429 era del endpoint `/locations/suggest`, no de la cuenta) y por fin hay
**dificultad SEO real**. El `locId` de Argentina es **2032**, sacado del propio `kwp.py` del repo,
que ya lo usa contra Google Ads. No hizo falta adivinarlo.

| Keyword | Vol/mes | **SD** | Intención | Curva estacional |
| :-- | --: | --: | :-- | :-- |
| bordeadora eléctrica | 12.100 | **11** | Transaccional | rampa sep→ene, pico 18.100 en dic-ene |
| cortadora de césped | 9.900 | **13** | Transaccional | rampa sep→ene, pico 14.800 en nov-ene |
| mancuernas | 14.800 | **8** | Informacional | plana todo el año |
| hidrolavadora | 40.500 | **74** | — | plana todo el año |

### El error propio, anotado

**Hidrolavadora estuvo primera en el ranking de las iteraciones 1 y 2, y está mal.** Se la ordenó
por volumen antes de tener el SD. Con **SD 74** y un sitio de DA 1 sin backlinks, esa keyword no se
gana: es la liga de Sodimac, Easy y Mercado Libre. El volumen era la mitad del dato.

La lección es la misma que ya está en `LEARNINGS.md` sobre las dos ventanas de calendario, pero
aplicada a otra variable: **un rubro no se prioriza hasta tener volumen Y dificultad**. Uno solo de
los dos números lleva a la decisión equivocada, y acá casi manda a escribir la guía más difícil
del barrido.

### La curva confirma la ventana, con números

Cortadora de césped por mes, Argentina:

| jul | ago | **sep** | oct | nov | dic | ene | feb | mar |
| --: | --: | --: | --: | --: | --: | --: | --: | --: |
| 2.900 | 5.400 | **9.900** | 12.100 | 14.800 | 14.800 | 14.800 | 12.100 | 9.900 |

Se duplica de agosto a septiembre. Bordeadora hace lo mismo y más marcado: 2.900 en julio, 8.100 en
agosto, 12.100 en septiembre, 18.100 en diciembre. **La ventana no está por abrirse, se está
abriendo**, y publicar ahora agarra la rampa entera.

### Lo que esto implica para el orden

El par cortadora + bordeadora es el mejor candidato del barrido por cuatro razones juntas: SD de un
dígito o poco más, intención transaccional confirmada, curva que arranca este mes, y son hermanas
naturales que se enlazan entre sí sin forzar nada.

Mancuernas queda como el mejor **no** estacional: SD 8 es el más bajo de todos, pero su intención es
informacional, así que convierte peor y conviene tratarla como guía de captación, no de venta.

---

## Orden de prioridad al cierre de la iteración 4

1. **bordeadora eléctrica** — 12.100/mes, SD 11, transaccional, rampa abierta.
2. **cortadora de césped** — 9.900/mes, SD 13, transaccional, rampa abierta. Hermana de la anterior.
3. **mancuernas** — 14.800/mes, SD 8. El más fácil de todos, pero informacional.
4. **rascador para gatos** — 9.900/mes, SD sin medir. Abre el rubro mascotas.
5. **cochecito de bebé** — 9.900/mes, SD sin medir. Ticket alto, rubro sensible.

**Fuera: hidrolavadora** (SD 74), cinta de correr (fragmentada), taladro percutor (5.400),
parrilla a gas (2.400 y roce con `parrilla-electrica`).

---

## Orden anterior, de la iteración 3 (superado por el SD)

Con volumen verificado y canibalización limpia, faltando góndola y SD en todos:

1. **hidrolavadora** — 40.500/mes. El número más alto del barrido y con ventana estacional abierta.
2. **mancuernas** — 14.800/mes. El mejor no estacional, sirve todo el año.
3. **cortadora de césped** — 12.100/mes. Ventana abierta, hermana natural de bordeadora.
4. **bordeadora eléctrica** — 12.100/mes. Enlazado cruzado obvio con cortadora.
5. **rascador para gatos** — 9.900/mes. Abre el rubro mascotas, que hoy es cero.
6. **cochecito de bebé** — 9.900/mes. Ticket alto, pero rubro sensible: exige más cuidado editorial.

Descartados por ahora: cinta de correr (fragmentada), taladro percutor (5.400, el más chico),
parrilla a gas (2.400 y roce con `parrilla-electrica`).

---

## Iteración 3 — 2026-08-18

**Publicada `hidrolavadora`** (40.500/mes), STAGED al 2026-11-23, silo `hogar-jardin`,
6 fichas nuevas, GO de los dos auditores. Con esto el top 3 de jardín queda cerrado:
bordeadora, cortadora e hidrolavadora.

### Hallazgo de método: cómo verificar góndola cuando el listado no renderiza

El 2026-08-18 el listado de ML seguía sin renderizar: `listado.mercadolibre.com.ar/<query>`
carga el HTML pero se queda en 919 caracteres, cero productos, con el progressbar colgado.
Pedir el HTML del servidor tampoco sirve: devuelve el shell, sin productos.

**Lo que SÍ funciona: la ruta `/mas-vendidos/<CATEGORIA>`.** Renderiza y devuelve URLs de
catálogo `/p/MLA` reales. Así se verificó la góndola de hidrolavadoras, que resultó tener
categoría propia (`MLA30840`) con filtros de marca.

Ruta para llegar a la categoría: `mas-vendidos/` → categoría madre → subcategoría.
Para hidrolavadoras fue MLA407134 (Herramientas) → MLA5228 (Herramientas Eléctricas) →
MLA455279 (Limpieza) → **MLA30840 (Hidrolavadoras)**.

### Límite importante de ese método (no confundirlo con "no hay góndola")

`/mas-vendidos` muestra un **top curado, no el catálogo completo**. Sirve como piso, nunca
como conteo. Concretamente: para "hidrolavadora inalámbrica" aparecieron 4 fichas y para
"hidrolavadora Karcher" apareció 1. **Eso NO significa que la góndola sea flaca**: significa
que son *recortes por atributo o marca dentro* de una categoría, y el top de la categoría
no los lista a todos.

Es el mismo error de inferencia que casi hace descartar heladeras: confundir "la herramienta
que uso no me los muestra" con "no existen".

### Consecuencia para elegir el próximo rubro

**Priorizar rubros que tengan categoría propia en MercadoLibre**, porque ahí `/mas-vendidos`
da una verificación limpia. Los recortes por atributo (inalámbrica, a batería) o por marca
(Karcher) quedan bloqueados hasta que el listado vuelva a renderizar, o hasta encontrar otra
forma de enumerar la categoría completa.

- `hidrolavadora inalámbrica` (6.600/mes, Keyword Planner confirmado, canibalización limpia)
  → EN ESPERA por góndola no verificable, no por falta de demanda.
- `hidrolavadora Karcher` (5.400/mes, canibalización limpia) → misma espera.

### Deuda pendiente que arrastra de la iteración anterior

- **cochecito de bebé**: se descartó con el método flojo (WebSearch sin `/p/MLA`). Hay que
  rechequearlo por navegador antes de darlo por muerto.
- **pileta de lona**: 90.500/mes en diciembre. Retomar fines de septiembre de 2026.
