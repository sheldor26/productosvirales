# Keywords verificadas — 2026-08-15

Barrido nuevo + re-verificación de SERP de los candidatos que quedaban sin construir de
`docs/lista-definitiva-keywords-2026-08-06.md`. Todo el volumen de este documento sale de
**Keyword Planner de Google Ads** (`bulk_historical_metrics.py`, métricas exactas, no ideas),
y todo el SERP se chequeó a mano el 2026-08-15 buscando específicamente **competidores
argentinos con formato "los mejores X"**.

Ese chequeo de SERP es el que el documento del 2026-08-06 declaró poco confiable en su propia
nota de cierre. Este lo reemplaza para las keywords que lista.

---

## Verdes confirmadas (listas para construir)

| Keyword | Vol/mes | SERP real | Estacionalidad | Silo |
| :-- | --: | :-- | :-- | :-- |
| **conservadora** | 14.800 | 100% retail: Sodimac, Frávega, Naldo, ML, Xplora, La Ardilla. El único con formato editorial es ZULKI, que es fabricante promocionando sus propias rotomoldeadas, no un comparador neutral | Pico dic-feb | hogar-jardin o camping |
| **cartuchera** | 14.800 | 100% retail: ML x4, Simones, Coppel, Todomoda, Papelera Bariloche, zonacuaderno | Pico feb-mar (vuelta a clases) | librería/oficina (silo nuevo) |
| **lámpara de pie** | 14.800 | Retail + tiendas de iluminación (Sodimac, Kolor, UBID, GIOLUCE). Aparece el blog de ML con un "más vendidos" de 2024, desactualizado y sin formato de comparativa | Evergreen | hogar-jardin |
| **estantería flotante** | 12.100 | 100% retail: ML x3, Frávega, Coppel, Ciudad Muebles, SKLUM. Cero editorial | Evergreen | hogar-jardin |
| **tacho de basura** | 9.900 | Solo el blog de ML ("Guía completa para elegir el mejor basurero"). Ningún tercero | Evergreen | hogar-jardin |

**El patrón que las une:** son objetos aburridos. Muebles, plásticos, cosas sin marca fuerte
ni ficha técnica que luzca. Nadie escribió sobre ellas porque no dan clics fáciles, que es
exactamente por qué zapatero (22.200) resultó ganable. Los rubros con electrónica o motor
(hidrolavadora, deshumidificador, gazebo) ya están todos tomados.

**La jugada de silo:** estantería flotante + tacho de basura + lámpara de pie suman
**36.700/mes**, las tres evergreen y las tres del mismo silo que zapatero. Construidas juntas
se enlazan entre sí, que ataca el cuello de botella real del sitio con DA 1: no falta prosa,
falta autoridad interna.

---

## Rojas confirmadas (no construir, quemarían el esfuerzo)

| Keyword | Vol/mes | Quién la tiene |
| :-- | --: | :-- |
| **hidrolavadora** | 40.500 | mejorescompras.com.ar con el título exacto ("Mejores hidrolavadoras en Argentina 2026"), Bidcom News con dos notas, el blog de ML con dos, más 55detailshop |
| **gazebo** | 40.500 | canigo.com.ar con "Gazebos 【Los MEJORES del 2026】", el mismo rival que ya tenía carpas, mochilas y linternas. Más Bidcom News x2 |
| **deshumidificador** | 12.100 | expertoenproductos.com.ar y miprecio.com.ar, los dos **argentinos**, más Trendencias, Xataka y pccomponentes |
| **aspiradora de mano** | 9.900 | expertoenproductos.com.ar, el blog de Naldo, TechRadar, El Independiente, OkDiario |
| **matera** | 18.100 | Sin comparador editorial, pero el SERP es todo tienda D2C de mates (tiendamatera, jardindelmate, mateando, tapamate) y **MercadoLibre no aparece en la primera página**. Si ML no está, una guía de afiliados de ML no tiene a dónde mandar el clic |

**Regla nueva que sale de esto:** además de buscar comparadores editoriales, chequear que
**ML esté presente en el SERP**. Un SERP limpio de competencia editorial pero dominado por
tiendas propias (D2C) es igual de inservible para este sitio: no hay clic de afiliado posible.
El caso matera es el primero donde el rubro se cae por este motivo y no por competencia.

---

## Correcciones al volumen del documento del 2026-08-06

| Keyword | Decía | Es | Por qué |
| :-- | --: | --: | :-- |
| **torno para uñas** | 9.900 | **8.100** | Se había medido sin acento. "torno para unas" da 10/mes; "torno para uñas" da 8.100. El acento cambia el resultado |
| **cesto de basura cocina** | 4.400 | **9.900** como "tacho de basura" | "Tacho" es la palabra argentina y tiene el doble de volumen que "cesto". "cesto de basura cocina" literal da 50/mes |

El resto de los volúmenes del documento del 2026-08-06 se re-midieron y **dieron igual**
(cartuchera 14.800, lámpara de pie 14.800, estantería flotante 12.100, perchero de pie 9.900,
mochilas escolares 6.600, pizarra mágica 4.400, andador bebé 4.400, pechera para perro 3.600).
La conclusión de aquel documento se sostiene: el volumen de Keyword Planner es confiable, su
clasificación de SERP no.

---

## Segunda ronda — bazar, dormitorio, limpieza, mascotas (mismo día)

Barrido de rubros que nunca se habían tocado, apuntando al mismo patrón de objeto aburrido.

### Verdes nuevas

| Keyword | Vol/mes | SERP real | Silo |
| :-- | --: | :-- | :-- |
| **tupper** | 14.800 | El SERP más limpio de todo el día: ML x6 y Sodimac. Nada más | bazar/cocina |
| **mesa ratona** | 14.800 | Sodimac, Easy, Frávega, ML, Ciudad Muebles, Silvina C., Pili Deco. Lo único con formato editorial es una nota de Cadena3 que es contenido pago de Grupo Edisur, una desarrolladora inmobiliaria, no un comparador | hogar-jardin |
| **escurridor de platos** | 9.900 | Sodimac, Tramontina oficial, ML, Bazar Celta. Aparece el blog de ML con un "más vendidos" de 2024 y ruido extranjero irrelevante (Amazon US, eBay Alemania) | bazar/cocina |

### Amarillas nuevas (viables, comparadores solo extranjeros)

Mismo criterio que se usó para aprobar `perchero de pie`: si los únicos rankings son españoles
con productos de Amazon España, en google.com.ar domina ML igual.

| Keyword | Vol/mes | Quién compite |
| :-- | --: | :-- |
| **puff** | 12.100 | mejorespuff.com (dominio de match exacto), migefurniture, sillas-gaming. Todos españoles |
| **rascador para gatos** | 9.900 | patitasco.com y una clínica veterinaria, las dos españolas. Puppis y Rascat son retail/D2C argentino, no editorial |
| **respaldo de cama** | 14.800 | Cero comparadores, pero el SERP es todo fábrica de muebles a medida (dellacasa, BedDesign, Miguel Living, Belgrano Home) y la intención real es "me lo hacen a medida", no "lo compro". La más floja de las tres |

### Rojas nuevas

| Keyword | Vol/mes | Por qué |
| :-- | --: | :-- |
| **valija** | 27.100 | leonardostore.com.ar tiene "Mejor valija relación precio-calidad en Argentina", promociones-aereas.com.ar tiene "Las Mejores Mochilas y Valijas", más una nota de Infobae. Competencia editorial argentina real |
| **dispenser de agua** | 14.800 | Cae por intención, no por competencia: el SERP lo dominan empresas de servicio de botellón (Vitalis, IVESS, Agua Nuestra) que alquilan e instalan. Quien busca esto quiere contratar un servicio, no comprar un aparato. Segundo caso del día del filtro "¿está ML en el SERP?" |

### Ojo con esto: variantes de una guía que ya existe

`mueble zapatero` (6.600) y `botinero` (2.900) son la misma intención que la guía **zapatero**
ya publicada. No son guías nuevas: o la guía actual ya las captura, o le falta cubrirlas dentro
del mismo texto. Antes de escribir nada, revisar en GSC si `zapatero` ya rankea para esas dos.
Crear una guía aparte sería auto-canibalización.

### Leads sin verificar (para la próxima ronda)

Volumen ya medido con Keyword Planner, SERP todavía sin chequear:
máquina de coser (33.100), maceta (22.200), plancha a vapor (14.800), mopa (12.100),
bajo mesada (12.100), cómoda (9.900), alacena (9.900), fogonero (9.900), cortina blackout
(9.900), perchero de pared (6.600), chifonier (6.600), cava de vino (6.600), brasero (5.400),
tabla de planchar (3.600), secador de piso (2.900).

Descartados de arranque por intención ambigua pese al volumen: **vinoteca** (49.500, en
Argentina significa sobre todo el negocio que vende vino, no la heladera) y **biblioteca**
(33.100, el mueble compite contra la institución).

---

## El total, ordenado por silo

| Silo | Keywords verdes | Vol/mes combinado |
| :-- | :-- | --: |
| **hogar-jardin** (ya existe, con zapatero) | estantería flotante, tacho de basura, lámpara de pie, mesa ratona | 51.600 |
| **bazar/cocina** (nuevo) | tupper, escurridor de platos | 24.700 |
| **camping/verano** | conservadora | 14.800 |
| **librería/oficina** (nuevo) | cartuchera | 14.800 |

Ocho verdes confirmadas, 105.900/mes de volumen combinado, todas con SERP verificado a mano
el 2026-08-15.

---

## Pendiente antes de escribir cualquiera de estas

Ninguna está verificada del lado del producto. Antes de escribir hay que confirmar con Bright
Data que existan **5-6 publicaciones reales con stock** en ML para cada una, y que ninguna esté
excluida del Programa de Afiliados (ver `docs/fichas.md`).
