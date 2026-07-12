# Keyword Planner (Google Ads API)

Trae la data del **Keyword Planner de Google** (volumen mensual, competencia, puja
top-of-page) para keywords semilla. Es la fuente oficial de Google, para **cruzar
con Ubersuggest** y con GSC al planificar keywords.

Reusa el **cliente OAuth de GSC** (`scripts/gsc/client_secret.json`) — no hace falta
crear otro. Correr local desde Argentina.

## Setup (una vez)

### 1. Dependencias (venv propio, no toca package.json)
```bash
cd scripts/keyword-planner
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
```

### 2. Completar `google-ads.yaml`
Ya existe con `client_id`/`client_secret` pre-cargados del OAuth de GSC. Faltan 3 campos:

- **`developer_token`**: en Google Ads → `Herramientas y config → Configuración → API Center`.
  (Un token nuevo arranca en nivel *Test*; para data real puede necesitar *Basic access*,
  un formulario corto en el mismo API Center.)
- **`login_customer_id`**: tu Customer ID de 10 dígitos, **sin guiones** (arriba a la
  derecha en ads.google.com, formato `123-456-7890` → `1234567890`).
- **`refresh_token`**: lo genera el paso 3.

### 3. Generar el refresh_token (consentimiento OAuth, una vez)
```bash
.venv/bin/python get_refresh_token.py
```
Abre el navegador → logueate con la cuenta del Google Ads → aceptá. Imprime el
`refresh_token`: pegalo en `google-ads.yaml`.

## Uso
```bash
.venv/bin/python kwp.py "masajeador facial" "gua sha"
.venv/bin/python kwp.py "masajeador facial" --json      # para orquestar con Ubersuggest
.venv/bin/python kwp.py "masajeador facial" --limit 30
```

Geo por defecto Argentina (`geoTargetConstants/2032`), idioma Español (`1003`).

## Secretos
`google-ads.yaml`, `client_secret.json` y `token.json` están gitignored. Nunca se versionan.
