# domhunter

Enriquece listas de dominios expirados con autoridad y historial reales, y te devuelve
un CSV ordenado con veredicto de compra.

Sin dependencias: solo Python 3.8+ de fábrica.

---

## Puesta en marcha (5 minutos)

**1. Conseguir la API key gratis**

Andá a <https://openpagerank.keywordseverywhere.com/>, registrate y generá una key.
El plan gratuito da **30.000 dominios por mes**, más que suficiente para barrer
listas grandes de ExpiredDomains.

> Si tenías una key vieja de `domcop.com/openpagerank`, deja de funcionar el
> **30 de septiembre de 2026**. Migrá antes.

**2. Exportarla al entorno**

```bash
export OPR_API_KEY="tu_key_aca"
```

Para que quede permanente, agregá esa línea a `~/.zshrc`.

**3. Exportar los dominios de ExpiredDomains**

En ExpiredDomains.net, con la lista filtrada en pantalla, usá el botón de descarga
(el iconito arriba a la izquierda, al lado de "Show Filter"). También sirve un `.txt`
con un dominio por línea.

**4. Correr**

```bash
python3 domhunter.py dominios.csv -o resultado.csv --descartes descartes.csv
```

---

## Qué hace, en orden

El pipeline va de barato a caro para no desperdiciar tiempo ni cuota:

| Paso | Fuente | Costo | Qué descarta |
|---|---|---|---|
| 1. Prefiltro | El propio CSV | gratis, instantáneo | Ratios BL/DP imposibles, dominios de 2 años, ACR bajísimo, TF/CF spameado |
| 2. OpenPageRank | API, 100 dominios por request | 30k/mes gratis | Pocos dominios referentes, autoridad desplomada |
| 3. Wayback CDX | archive.org | gratis, ~15s por dominio | Los que nunca fueron un sitio real o están abandonados hace años |
| 4. Scoring | local | gratis | — |

El paso 3 es el lento, por eso corre **último** y solo sobre los sobrevivientes.
Por defecto verifica los 300 mejores; subilo con `--max-wayback`.

**Todo se cachea** en `.domhunter_cache.json`. Si cortás la corrida con Ctrl+C o se
cae la red, volvés a lanzar el mismo comando y retoma donde estaba sin volver a
gastar cuota.

---

## El score

Va de 0 a 100 y se normaliza según las señales disponibles, así que si corrés con
`--no-opr` los números siguen siendo comparables entre sí.

| Componente | Puntos | Notas |
|---|---|---|
| Dominios referentes | 40 | Escala logarítmica; 40 puntos recién a los 50.000 |
| Autoridad OpenPageRank | 25 | Score 0-10 × 2,5 |
| Años con capturas en Wayback | 20 | 20 puntos a los 15 años |
| Meses distintos capturados | 10 | Mide consistencia, no solo antigüedad |
| Actividad reciente | 5 | Bonus si tuvo capturas en los últimos 2 años |

Penalizaciones: ratio BL/DP alto (−15), pocos dominios referentes (−20), y caída de
autoridad proporcional a la severidad. Una caída de más del 70% desde el pico
histórico **nunca** sale COMPRAR aunque el score dé alto: casi siempre es una
penalización de Google.

Veredictos: **COMPRAR** ≥60 · **REVISAR** ≥38 · **DESCARTAR** <38.

Tratá COMPRAR como "vale la pena mirarlo a mano", no como orden de compra. El script
filtra basura a escala; la decisión final siempre se toma abriendo el Wayback.

---

## Opciones útiles

```bash
# Prueba rápida con 50 dominios antes de largar todo
python3 domhunter.py dominios.csv --limit 50 -o prueba.csv

# Sin API key: solo Wayback + heurísticas del CSV
python3 domhunter.py dominios.csv -o out.csv --no-opr

# Modo veloz: sin verificación de historial (miles de dominios en minutos)
python3 domhunter.py dominios.csv -o out.csv --no-wayback

# Verificar historial de los 1000 mejores en vez de 300
python3 domhunter.py dominios.csv -o out.csv --max-wayback 1000

# Umbrales más laxos para nichos chicos (ej. .com.ar)
python3 domhunter.py dominios.csv -o out.csv --min-ref-domains 3 --min-anios 2

# Ver por qué se descartó cada dominio
python3 domhunter.py dominios.csv -o out.csv --descartes descartes.csv
```

`python3 domhunter.py --help` lista todo.

---

## Nota sobre ccTLD argentinos

Para `.com.ar` la cobertura de OpenPageRank y Majestic es bastante más pobre que en
`.com` — muchos dominios válidos van a volver con `ref_domains` bajo o nulo
simplemente porque no están bien crawleados, no porque sean malos.

Si trabajás sobre `.com.ar`, bajá los umbrales:

```bash
--min-ref-domains 3 --min-anios 2 --min-meses 6
```

y dale más peso a la verificación manual en Wayback. El campo `wayback_url` del CSV
de salida te deja el link directo para cada dominio.

---

## Columnas del CSV de salida

`domain`, `score`, `veredicto`, `opr`, `ref_domains`, `opr_rank`, `opr_peak`,
`opr_caida_pct`, `wb_first_year`, `wb_last_year`, `wb_years`, `wb_months`, `wb_gap`,
`csv_bl`, `csv_dp`, `bl_dp_ratio`, `csv_tf`, `csv_cf`, `csv_da`, `notas`,
`notas_extra`, `descarte`, `wayback_url`

Abrilo en Excel o Google Sheets y filtrá por `veredicto`.

---

## Límites conocidos

- OpenPageRank **no es Moz DA**. Correlaciona bien y es gratis a esta escala, pero si
  necesitás el DA oficial para un cliente, pasá la lista corta final por la Moz Links API.
- Wayback CDX consulta solo la home del dominio. Un sitio que vivió en subcarpetas
  puede subestimarse.
- El script no chequea disponibilidad ni precio de registro. Eso lo confirmás en el
  registrador antes de pujar.
- No detecta marcas registradas. Revisá eso a mano antes de comprar.
