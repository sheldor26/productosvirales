# Esqueleto listo: par `bordeadora-electrica` + `cortadora-de-cesped`

Todo el trabajo que **no depende del stock**, hecho el 2026-08-17. Cuando se destrabe MercadoLibre,
esa sesión debería ser sourcing y pegar, sin research.

Mismo formato que `esqueleto-pileta-de-lona.md`, que funcionó bien.

## Por qué estas dos y no hidrolavadora

Hidrolavadora tiene 40.500/mes, cuatro veces más que estas, y **está descartada**: su SD es **74**.
Con DA 1 y sin backlinks esa keyword no se gana. Es la liga de Sodimac, Easy y Mercado Libre.

El par elegido gana por cuatro cosas que se dan juntas, no por volumen:

| | bordeadora eléctrica | cortadora de césped |
| :-- | --: | --: |
| Volumen/mes | 12.100 | 9.900 |
| **SD** | **11** | **13** |
| Intención | Transaccional | Transaccional |
| Pico | 18.100 (dic-ene) | 14.800 (nov-ene) |

Fuente: Ubersuggest con `locId` 2032 (Argentina), cruzado contra Keyword Planner, que dio los mismos
volúmenes. El `locId` sale de `scripts/keyword-planner/kwp.py`, que ya lo usa contra Google Ads.

## La ventana se está abriendo ahora

Volumen mensual real, Argentina:

| Keyword | jul | ago | **sep** | oct | nov | dic | ene | feb |
| :-- | --: | --: | --: | --: | --: | --: | --: | --: |
| bordeadora eléctrica | 2.900 | 8.100 | **12.100** | 14.800 | 14.800 | 18.100 | 18.100 | 12.100 |
| cortadora de césped | 2.900 | 5.400 | **9.900** | 12.100 | 14.800 | 14.800 | 14.800 | 12.100 |

Bordeadora casi triplica de julio a septiembre. **Publicar en las próximas semanas agarra la rampa
entera**; publicar en noviembre llega tarde a la mitad de la temporada.

## El SERP, verificado el 2026-08-17

**En las dos keywords, los orgánicos son páginas de categoría de tiendas o del fabricante. Cero
comparadores editoriales.** Es el mismo hueco que se detectó en pileta de lona.

### bordeadora eléctrica

| Pos | Dominio | DA |
| --: | :-- | --: |
| 2 | listado.mercadolibre.com.ar | 88 |
| 3 | easy.com.ar | 51 |
| 5 | tramontina.com.ar (fabricante) | 27 |
| 8 | fravega.com | 57 |
| 10 | casasilvia.com | 32 |
| 11 | sodimac.com.ar | 45 |
| 12 | **daewooherramientas.com.ar** | **16** |
| 14 | casadelaudio.com | 41 |
| 15 | **bringeri.com.ar** | **21** |
| 16 | megatone.net | 48 |

**Hay sitios rankeando con DA 16 y DA 21.** No hace falta autoridad grande para entrar.

Además hay **AI Overview en posición 4** y **"people also ask" en la 7**: el bloque GEO tiene dónde
engancharse pese a que la cola larga conversacional sea flaca (ver abajo).

### cortadora de césped

| Pos | Dominio | DA |
| --: | :-- | --: |
| 1 | listado.mercadolibre.com.ar | 88 |
| 2 | stihl.com.ar (fabricante) | 32 |
| 3 | easy.com.ar | 51 |
| 4 | megatone.net | 48 |
| 8 | naldo.com.ar | 44 |
| 9 | sodimac.com.ar | 45 |
| 10 | fravega.com | 57 |
| 13 | agrofy.com.ar | 52 |

Sin AI Overview acá, pero sí "people also ask" en la 6.

## Estructura: transaccional, no conversacional

**Dato que cambia el molde.** La cola larga en pregunta casi no existe en este rubro:

| Keyword | Vol/mes |
| :-- | --: |
| cuál es la mejor hidrolavadora | 170 |
| cuál es la mejor cortadora de césped | 20 |
| qué mancuernas comprar | 10 |

En perfumes y cafeteras, "cuál es la mejor X" carga volumen y justifica un hub de preguntas pensado
para que lo cite un AI Overview. **Acá no.** La intención declarada por Ubersuggest es
**Transaccional** en las dos keywords: la gente busca el producto, no la pregunta.

Consecuencia para `/optimizador-guias-pv`: el peso va a **comparativa, precio y specs**. El bloque
de respuesta rápida y el FAQ siguen yendo (hay AI Overview en bordeadora y PAA en las dos), pero
como complemento, no como columna vertebral.

## Canibalización: limpia, verificada contra contenido

Se comparó el **contenido** de las 190 guías, no solo los slugs. **Ninguna guía del sitio menciona
bordeadora ni cortadora de césped.** El silo `hogar-jardin` tiene 11 guías pero todas de interior
(zapatero, mesa ratona, lámpara de pie, estantería, colchones, piletas).

Sumar exterior le da al silo una segunda pata temática, con enlazado natural entre las dos guías
nuevas y hacia las de interior.

## El hallazgo barato para después

**"dibra o petri cuál es mejor" — 40/mes, competencia BAJA.** Es la única keyword de todo el barrido
con intención comercial y competencia baja. Revela además las dos marcas que importan en cortadoras
en Argentina: **Dibra y Petri**.

Sirve como sección dentro del pilar, o como guía hermana si el pilar funciona. Falta confirmar si
las dos formas (con y sin tilde) comparten bucket o suman 80/mes.

## Lo que falta: góndola

**No se pudo verificar.** El 2026-08-17 MercadoLibre pasó a pedir verificación de cuenta en todo:
fichas `/p/MLA`, listados de categoría y `/mas-vendidos`. Las tres rutas redirigen a
`/gz/account-verification`. Es nuevo respecto de sesiones anteriores, donde el listado sí renderizaba.

Sin acceso al listado no se pueden **descubrir** productos, y sin productos no hay fichas. Las
reglas del proyecto son claras: nada de IDs ni precios inventados.

### Cómo destrabarlo

1. **Que Juan mire la categoría** y pase 6 o más permalinks de publicaciones sin bandera de última
   unidad. Con eso el sourcing se hace con `brightdata-scoped-scrape`, que **sí funcionó** hoy.
2. **Reintentar el listado más adelante**: el bloqueo parece de sesión o de IP, no permanente.

Categorías de ML para el chequeo:

```
https://listado.mercadolibre.com.ar/herramientas/herramientas-jardin/bordeadoras/
https://listado.mercadolibre.com.ar/herramientas/herramientas-jardin/cortadoras-cesped/
```

**Umbral:** 6 o más publicaciones usables por rubro. Es el mismo criterio que hizo posponer
`pileta-de-lona` en agosto, cuando la categoría tenía 6 en total y solo 3 eran piletas de verdad.

## Lo que hay que verificar en la sesión de sourcing

- **Potencia declarada contra potencia real.** En bordeadoras el watt es el campo que más se infla.
- **Ancho de corte** en cortadoras: es el dato que define cuánto tarda un jardín, y las fichas lo
  esconden.
- **Con cable o a batería.** El mismo patrón que apareció hoy en el Wolke Multiuso: la ficha no
  declara "es inalámbrico" y el comprador se entera cuando llega.
- **Qué trae la caja.** Si el hilo de repuesto, la bobina o el cesto recolector vienen incluidos o
  se venden aparte. Es el equivalente al kit de salida de humos de salamandra.
- **Precio con `meta[itemprop="price"]`**, nunca regex sobre el texto.
- **Imágenes con GET**, que el CDN de ML responde 405 a HEAD.
- **Envío**: chequear una por una, que "envío gratis por ser tu primera compra" es promo de cuenta.
