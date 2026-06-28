"""Configuracion del lector de Google Search Console.

Editar SOLO si cambia el dominio o donde guardas el JSON de la service account.
"""

from pathlib import Path

# --- Carpetas (no tocar) ---------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"          # base SQLite con el historico
EXPORTS_DIR = BASE_DIR / "exports"    # CSVs que podes abrir en Excel/Sheets
DB_PATH = DATA_DIR / "gsc.db"

# --- Tu cuenta -------------------------------------------------------------
# Propiedad en Search Console. Dos formatos posibles:
#   - Propiedad de DOMINIO  -> "sc-domain:productosvirales.com.ar"  (recomendado)
#   - Propiedad de URL      -> "https://productosvirales.com.ar/"
# Si no estas seguro, corre:  python scripts/gsc/gsc.py setup-check
SITE_URL = "https://productosvirales.com.ar/"

# Archivo JSON de la service account (lo descargas de Google Cloud).
# Por defecto lo busca al lado de este archivo con el nombre service-account.json
KEY_FILE = BASE_DIR / "service-account.json"

# --- Como agrupa tus URLs por tipo de pagina (para el reporte) -------------
# Prefijo de path -> etiqueta legible.
SECTION_PREFIXES = {
    "/producto/": "Fichas de producto",
    "/guias/": "Guias",
    "/categoria/": "Categorias",
    "/trending/": "Trending",
}

# --- Umbrales de la auditoria (podes ajustarlos) ---------------------------
# Posicion donde una pagina ya esta "cerca" del top y vale la pena empujar.
NEAR_TOP_MIN_POS = 4.0
NEAR_TOP_MAX_POS = 20.0
# Impresiones minimas para que una oportunidad cuente (filtra ruido).
MIN_IMPRESSIONS = 30
# CTR por debajo de este % del esperado segun su posicion = title/meta floja.
LOW_CTR_RATIO = 0.6
# Para alertas: variacion minima de clicks o posicion que dispara aviso.
ALERT_MIN_CLICK_DELTA = 5
ALERT_MIN_POS_DELTA = 1.5
