#!/usr/bin/env python3
"""Lector y auditor de Google Search Console para productosvirales.com.ar

Subcomandos:
    setup-check          Verifica el JSON, conecta y lista tus propiedades.
    fetch                Baja queries, paginas y fechas de GOOGLE y guarda un snapshot. --type web|image|video|news.
    fetch-bing           Baja queries, paginas y fechas de BING y guarda un snapshot.
    audit                Reporte de oportunidades a nivel PAGINA (cerca del top, CTR flojo, canibalizacion). Solo Google.
    oportunidades        Queries en distancia de gol (pos 5-15) + la pagina que las sirve. --match freidora para filtrar.
    report               Rinde por seccion (fichas / guias / categorias) y top/peores URLs. --source google|bing.
    alerts               Compara con el snapshot anterior y avisa cambios fuertes. Solo Google.
    history              Lista los snapshots guardados (ambas fuentes).

Uso tipico:
    python scripts/gsc/gsc.py setup-check
    python scripts/gsc/gsc.py fetch                # corre esto seguido (ej. semanal)
    python scripts/gsc/gsc.py fetch --type image    # Google Imagenes, inventario aparte
    python scripts/gsc/gsc.py report --source google-image
    python scripts/gsc/gsc.py fetch-bing            # idem, para Bing Webmaster Tools
    python scripts/gsc/gsc.py audit
    python scripts/gsc/gsc.py report
    python scripts/gsc/gsc.py report --source bing
    python scripts/gsc/gsc.py alerts

Casi todo es stdlib; lo unico externo es la libreria de Google (ver requirements.txt).
Bing usa su API REST con una simple api key (sin libreria adicional, solo urllib).
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import json
import re
import sqlite3
import sys
import urllib.parse
import urllib.request
from pathlib import Path

import config

SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]
ROW_LIMIT = 25000  # maximo por pagina que permite la API


# ---------------------------------------------------------------------------
# Conexion
# ---------------------------------------------------------------------------
SA_FILE = config.KEY_FILE                       # service account (clave JSON)
OAUTH_CLIENT_FILE = config.BASE_DIR / "client_secret.json"  # cliente OAuth
TOKEN_FILE = config.BASE_DIR / "token.json"     # token cacheado tras loguear


def _install_hint():
    return (
        "Faltan las librerias de Google.\n"
        "Instalalas con:\n"
        "  python3 -m venv scripts/gsc/.venv\n"
        "  source scripts/gsc/.venv/bin/activate\n"
        "  pip install -r scripts/gsc/requirements.txt\n"
    )


def get_service():
    """Crea el cliente de la API.

    Detecta solo el metodo de conexion:
      1) service-account.json  -> service account (si tu org lo permite).
      2) client_secret.json    -> OAuth (entras con tu Google; recomendado).
    """
    try:
        from googleapiclient.discovery import build
    except ImportError:
        sys.exit(_install_hint())

    creds = None

    if Path(SA_FILE).exists():
        # --- Camino service account ---
        from google.oauth2 import service_account
        creds = service_account.Credentials.from_service_account_file(
            str(SA_FILE), scopes=SCOPES
        )

    elif OAUTH_CLIENT_FILE.exists() or TOKEN_FILE.exists():
        # --- Camino OAuth ---
        try:
            from google.oauth2.credentials import Credentials
            from google.auth.transport.requests import Request
        except ImportError:
            sys.exit(_install_hint())

        if TOKEN_FILE.exists():
            creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)

        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                try:
                    from google_auth_oauthlib.flow import InstalledAppFlow
                except ImportError:
                    sys.exit(_install_hint())
                if not OAUTH_CLIENT_FILE.exists():
                    sys.exit(
                        f"No encuentro {OAUTH_CLIENT_FILE.name}.\n"
                        "Descargalo de Google Cloud (Credenciales -> ID de cliente OAuth, "
                        "tipo Aplicacion de escritorio) y guardalo en scripts/gsc/. Ver README.md."
                    )
                print("Abriendo el navegador para que inicies sesion con Google...")
                flow = InstalledAppFlow.from_client_secrets_file(str(OAUTH_CLIENT_FILE), SCOPES)
                creds = flow.run_local_server(port=0)
            TOKEN_FILE.write_text(creds.to_json())

    else:
        sys.exit(
            "No hay credenciales. Elegi UN camino (ver README.md):\n"
            f"  - OAuth (recomendado): guarda client_secret.json en {config.BASE_DIR}\n"
            f"  - Service account:     guarda service-account.json en {config.BASE_DIR}\n"
        )

    return build("searchconsole", "v1", credentials=creds, cache_discovery=False)


# ---------------------------------------------------------------------------
# Base de datos (historico)
# ---------------------------------------------------------------------------
def db() -> sqlite3.Connection:
    config.DATA_DIR.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(config.DB_PATH)
    conn.execute(
        """CREATE TABLE IF NOT EXISTS snapshots (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fetched_at TEXT NOT NULL,
            range_start TEXT NOT NULL,
            range_end TEXT NOT NULL,
            source TEXT NOT NULL DEFAULT 'google'
        )"""
    )
    conn.execute(
        """CREATE TABLE IF NOT EXISTS metrics (
            snapshot_id INTEGER NOT NULL,
            dim_type TEXT NOT NULL,   -- query | page | page_query | date | country
            key1 TEXT NOT NULL,
            key2 TEXT,
            clicks REAL, impressions REAL, ctr REAL, position REAL,
            FOREIGN KEY (snapshot_id) REFERENCES snapshots(id)
        )"""
    )
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_metrics ON metrics(snapshot_id, dim_type)"
    )
    # Migracion suave: bases viejas no tienen la columna source todavia.
    cols = [r[1] for r in conn.execute("PRAGMA table_info(snapshots)").fetchall()]
    if "source" not in cols:
        conn.execute("ALTER TABLE snapshots ADD COLUMN source TEXT NOT NULL DEFAULT 'google'")
    return conn


# ---------------------------------------------------------------------------
# Descarga
# ---------------------------------------------------------------------------
def query_all(service, dimensions, start, end, search_type="web"):
    """Pagina la API hasta traer todas las filas para esas dimensiones.

    `search_type` es el bucket de busqueda: web, image, video o news. Son
    inventarios SEPARADOS, no se suman ni se pisan. Durante mucho tiempo esta
    funcion no mandaba el parametro y la API devuelve `web` por defecto, asi
    que todos los snapshots viejos son solo web: Imagenes nunca se midio.
    """
    rows = []
    start_row = 0
    while True:
        body = {
            "startDate": start,
            "endDate": end,
            "dimensions": dimensions,
            "rowLimit": ROW_LIMIT,
            "startRow": start_row,
            "dataState": "all",
            "type": search_type,
        }
        resp = (
            service.searchanalytics()
            .query(siteUrl=config.SITE_URL, body=body)
            .execute()
        )
        batch = resp.get("rows", [])
        rows.extend(batch)
        if len(batch) < ROW_LIMIT:
            break
        start_row += ROW_LIMIT
    return rows


def cmd_fetch(args):
    service = get_service()
    search_type = getattr(args, "type", "web")
    # web sigue guardandose como 'google' para no romper los snapshots viejos
    # ni los comandos que filtran por esa fuente (audit, alerts, oportunidades).
    source = "google" if search_type == "web" else f"google-{search_type}"
    end = dt.date.today() - dt.timedelta(days=args.lag)
    start = end - dt.timedelta(days=args.days - 1)
    s, e = start.isoformat(), end.isoformat()
    print(f"Bajando GSC [{search_type}] de {s} a {e} ({args.days} dias)...")

    plans = {
        "query": ["query"],
        "page": ["page"],
        "page_query": ["page", "query"],
        "date": ["date"],
        "country": ["country"],
    }

    conn = db()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO snapshots (fetched_at, range_start, range_end, source) VALUES (?,?,?,?)",
        (dt.datetime.now().isoformat(timespec="seconds"), s, e, source),
    )
    snap_id = cur.lastrowid

    totals = {}
    for dim_type, dims in plans.items():
        rows = query_all(service, dims, s, e, search_type)
        totals[dim_type] = len(rows)
        for r in rows:
            keys = r.get("keys", [])
            cur.execute(
                "INSERT INTO metrics (snapshot_id, dim_type, key1, key2, clicks, impressions, ctr, position)"
                " VALUES (?,?,?,?,?,?,?,?)",
                (
                    snap_id,
                    dim_type,
                    keys[0] if len(keys) > 0 else "",
                    keys[1] if len(keys) > 1 else None,
                    r.get("clicks", 0),
                    r.get("impressions", 0),
                    r.get("ctr", 0),
                    r.get("position", 0),
                ),
            )
        print(f"  {dim_type:12} {len(rows):>6} filas")
    conn.commit()

    # CSV crudos por si queres abrirlos en Excel/Sheets. Cada bucket va a su
    # propia carpeta para que un fetch de imagenes no pise los CSV de web.
    out_dir = config.EXPORTS_DIR / (e if search_type == "web" else f"{e}-{search_type}")
    out_dir.mkdir(parents=True, exist_ok=True)
    for dim_type in plans:
        _export_csv(conn, snap_id, dim_type, out_dir / f"{dim_type}.csv")
    conn.close()
    print(f"\nGuardado snapshot #{snap_id} (fuente {source}). CSVs en {out_dir}")
    if search_type == "web":
        print("Proximo paso:  python scripts/gsc/gsc.py audit")
    else:
        print(f"Proximo paso:  python scripts/gsc/gsc.py report --source {source}")


def _export_csv(conn, snap_id, dim_type, path):
    rows = conn.execute(
        "SELECT key1, key2, clicks, impressions, ctr, position FROM metrics"
        " WHERE snapshot_id=? AND dim_type=? ORDER BY clicks DESC",
        (snap_id, dim_type),
    ).fetchall()
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["key1", "key2", "clicks", "impressions", "ctr", "position"])
        w.writerows(rows)


# ---------------------------------------------------------------------------
# Bing Webmaster Tools (API REST simple, solo urllib)
# ---------------------------------------------------------------------------
BING_BASE = "https://ssl.bing.com/webmaster/api.svc/json/"
BING_DATE_RE = re.compile(r"/Date\((-?\d+)")


def get_bing_key():
    if not config.BING_API_KEY_FILE.exists():
        sys.exit(
            f"No encuentro {config.BING_API_KEY_FILE.name}.\n"
            "Conseguila en Bing Webmaster Tools -> Settings -> API access y "
            f"pegala (solo el texto de la key) en {config.BING_API_KEY_FILE}."
        )
    return config.BING_API_KEY_FILE.read_text(encoding="utf-8").strip()


def _parse_bing_date(raw):
    """Convierte '/Date(1777618800000-0700)/' a fecha ISO (YYYY-MM-DD)."""
    m = BING_DATE_RE.search(raw)
    if not m:
        return None
    ms = int(m.group(1))
    return dt.datetime.utcfromtimestamp(ms / 1000).date().isoformat()


def bing_call(method, api_key):
    url = BING_BASE + method + "?" + urllib.parse.urlencode(
        {"apikey": api_key, "siteUrl": config.BING_SITE_URL}
    )
    try:
        with urllib.request.urlopen(url, timeout=30) as resp:
            payload = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        sys.exit(f"Bing API rechazo {method} ({e.code}): {body[:300]}")
    except urllib.error.URLError as e:
        sys.exit(f"No pude conectar a Bing API ({method}): {e}")
    if "ErrorCode" in payload:
        sys.exit(f"Bing API error en {method}: {payload.get('Message', payload)}")
    return payload.get("d", []) or []


def cmd_fetch_bing(args):
    api_key = get_bing_key()
    print(f"Bajando Bing Webmaster Tools para {config.BING_SITE_URL}...")

    daily = bing_call("GetRankAndTrafficStats", api_key)
    query_rows = bing_call("GetQueryStats", api_key)
    page_rows = bing_call("GetPageStats", api_key)  # el campo "Query" trae la URL

    if not daily and not query_rows and not page_rows:
        sys.exit(
            "Bing no devolvio datos. Confirma que el sitio esta verificado en "
            "Bing Webmaster Tools con esa misma URL (config.BING_SITE_URL)."
        )

    # --- date: fila por dia (igual forma que el dim_type 'date' de Google) ---
    date_agg = {}
    for r in daily:
        d = _parse_bing_date(r.get("Date", ""))
        if not d:
            continue
        a = date_agg.setdefault(d, {"clicks": 0, "impr": 0})
        a["clicks"] += r.get("Clicks", 0)
        a["impr"] += r.get("Impressions", 0)

    def _aggregate(rows, key_field):
        """Suma clicks/impresiones por key y promedia la posicion, ponderada por impresiones."""
        agg = {}
        for r in rows:
            key = r.get(key_field, "")
            if not key:
                continue
            a = agg.setdefault(key, {"clicks": 0, "impr": 0, "pos_w": 0.0})
            impr = r.get("Impressions", 0) or 0
            a["clicks"] += r.get("Clicks", 0) or 0
            a["impr"] += impr
            pos = r.get("AvgImpressionPosition", -1)
            if pos and pos > 0:
                a["pos_w"] += pos * impr
        return agg

    query_agg = _aggregate(query_rows, "Query")
    page_agg = _aggregate(page_rows, "Query")  # si, el campo se llama Query pero es la URL

    s = min([d for d in date_agg] or [dt.date.today().isoformat()])
    e = max([d for d in date_agg] or [dt.date.today().isoformat()])

    conn = db()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO snapshots (fetched_at, range_start, range_end, source) VALUES (?,?,?,?)",
        (dt.datetime.now().isoformat(timespec="seconds"), s, e, "bing"),
    )
    snap_id = cur.lastrowid

    def _insert(dim_type, key, clicks, impr, pos=0.0):
        ctr = (clicks / impr) if impr else 0.0
        cur.execute(
            "INSERT INTO metrics (snapshot_id, dim_type, key1, key2, clicks, impressions, ctr, position)"
            " VALUES (?,?,?,?,?,?,?,?)",
            (snap_id, dim_type, key, None, clicks, impr, ctr, pos),
        )

    for d, a in date_agg.items():
        _insert("date", d, a["clicks"], a["impr"])
    for q, a in query_agg.items():
        pos = (a["pos_w"] / a["impr"]) if a["impr"] else 0.0
        _insert("query", q, a["clicks"], a["impr"], pos)
    for p, a in page_agg.items():
        pos = (a["pos_w"] / a["impr"]) if a["impr"] else 0.0
        _insert("page", p, a["clicks"], a["impr"], pos)
    conn.commit()

    print(f"  date   {len(date_agg):>6} filas")
    print(f"  query  {len(query_agg):>6} filas")
    print(f"  page   {len(page_agg):>6} filas")

    out_dir = config.EXPORTS_DIR / f"bing-{e}"
    out_dir.mkdir(parents=True, exist_ok=True)
    for dim_type in ("date", "query", "page"):
        _export_csv(conn, snap_id, dim_type, out_dir / f"{dim_type}.csv")
    conn.close()
    print(f"\nGuardado snapshot #{snap_id} (bing, {s} a {e}). CSVs en {out_dir}")
    print("Nota: Bing no da CTR esperado por posicion como Google, asi que 'audit' sigue siendo solo-Google.")
    print("Proximo paso:  python scripts/gsc/gsc.py report --source bing")


# ---------------------------------------------------------------------------
# Helpers de analisis
# ---------------------------------------------------------------------------
def latest_snapshot(conn, source="google"):
    row = conn.execute(
        "SELECT id, range_start, range_end FROM snapshots WHERE source=? ORDER BY id DESC LIMIT 1",
        (source,),
    ).fetchone()
    if not row:
        cmd = "fetch" if source == "google" else "fetch-bing"
        sys.exit(f"No hay datos de {source} todavia. Corre primero:  python scripts/gsc/gsc.py {cmd}")
    return row


def expected_ctr(position):
    """Curva CTR organico aproximada por posicion (blended, AR)."""
    p = round(position)
    table = {1: .27, 2: .15, 3: .10, 4: .07, 5: .05, 6: .04, 7: .03, 8: .025, 9: .02, 10: .018}
    if p <= 10:
        return table.get(p, .02)
    if p <= 20:
        return .012
    return .006


def section_for(url):
    for prefix, label in config.SECTION_PREFIXES.items():
        if prefix in url:
            return label
    return "Otras"


def canonical_gsc_url(url):
    """Normaliza URLs de GSC para no contar fragments # como paginas distintas."""
    return urllib.parse.urldefrag(url).url


def _fmt(rows, headers, limit=None):
    """Imprime una tabla simple en consola."""
    rows = list(rows)
    if limit:
        rows = rows[:limit]
    if not rows:
        print("  (nada)")
        return
    widths = [len(h) for h in headers]
    str_rows = []
    for r in rows:
        cells = []
        for v in r:
            cells.append(f"{v:.2f}" if isinstance(v, float) else str(v))
        str_rows.append(cells)
        widths = [max(w, len(c)) for w, c in zip(widths, cells)]
    line = "  " + "  ".join(h.ljust(w) for h, w in zip(headers, widths))
    print(line)
    print("  " + "  ".join("-" * w for w in widths))
    for cells in str_rows:
        print("  " + "  ".join(c.ljust(w) for c, w in zip(cells, widths)))


# ---------------------------------------------------------------------------
# Auditoria de oportunidades
# ---------------------------------------------------------------------------
def cmd_audit(args):
    conn = db()
    snap_id, s, e = latest_snapshot(conn)
    print(f"=== AUDITORIA (snapshot #{snap_id}, {s} a {e}) ===\n")

    # 1) Paginas cerca del top: posicion 4-20 con impresiones reales.
    print(f"[1] Paginas CERCA DEL TOP (pos {config.NEAR_TOP_MIN_POS}-{config.NEAR_TOP_MAX_POS}, "
          f">= {config.MIN_IMPRESSIONS} impresiones) -> un empujon las mete a pagina 1:")
    near = conn.execute(
        "SELECT key1, clicks, impressions, position FROM metrics"
        " WHERE snapshot_id=? AND dim_type='page' AND position BETWEEN ? AND ?"
        " AND impressions >= ? ORDER BY impressions DESC",
        (snap_id, config.NEAR_TOP_MIN_POS, config.NEAR_TOP_MAX_POS, config.MIN_IMPRESSIONS),
    ).fetchall()
    _fmt([(p.replace("https://productosvirales.com.ar", ""), c, i, pos) for p, c, i, pos in near],
         ["pagina", "clicks", "impr", "pos"], limit=args.top)

    # 2) Queries con muchas impresiones y CTR flojo para su posicion.
    print(f"\n[2] Keywords con CTR FLOJO (muchas impresiones, CTR < {int(config.LOW_CTR_RATIO*100)}% "
          "del esperado) -> reescribir title/meta:")
    q = conn.execute(
        "SELECT key1, clicks, impressions, ctr, position FROM metrics"
        " WHERE snapshot_id=? AND dim_type='query' AND impressions >= ?",
        (snap_id, config.MIN_IMPRESSIONS),
    ).fetchall()
    low_ctr = []
    for key, clicks, impr, ctr, pos in q:
        exp = expected_ctr(pos)
        if exp and ctr < exp * config.LOW_CTR_RATIO:
            gap = (exp - ctr) * impr  # clicks que estas dejando sobre la mesa
            low_ctr.append((key, clicks, impr, round(ctr * 100, 1), round(pos, 1), round(gap, 1)))
    low_ctr.sort(key=lambda r: r[5], reverse=True)
    _fmt(low_ctr, ["keyword", "clicks", "impr", "ctr%", "pos", "clicks_perdidos"], limit=args.top)

    # 3) Canibalizacion: una misma keyword rankeando con >1 URL base.
    # GSC puede reportar fragments (#seccion) como URLs separadas; para
    # canibalizacion real solo cuentan paginas canonicas distintas.
    print("\n[3] CANIBALIZACION (una keyword reparte impresiones entre varias URLs):")
    pq = conn.execute(
        "SELECT key2, key1, clicks, impressions, position FROM metrics"
        " WHERE snapshot_id=? AND dim_type='page_query' AND impressions >= ?",
        (snap_id, config.MIN_IMPRESSIONS),
    ).fetchall()
    by_query = {}
    for query, page, clicks, impr, pos in pq:
        canonical_page = canonical_gsc_url(page)
        by_page = by_query.setdefault(query, {})
        item = by_page.setdefault(canonical_page, {
            "clicks": 0.0,
            "impressions": 0.0,
            "pos_weight": 0.0,
            "raw_urls": set(),
        })
        item["clicks"] += clicks
        item["impressions"] += impr
        item["pos_weight"] += pos * impr
        item["raw_urls"].add(page)
    canib = []
    for query, pages in by_query.items():
        if len(pages) >= 2:
            total_impr = sum(item["impressions"] for item in pages.values())
            canib.append((query, len(pages), round(total_impr)))
    canib.sort(key=lambda r: r[2], reverse=True)
    _fmt(canib, ["keyword", "n_urls", "impr_total"], limit=args.top)
    if args.verbose and canib:
        print("\n  Detalle de las 3 peores:")
        for query, _, _ in canib[:3]:
            print(f"  - \"{query}\":")
            rows = []
            for page, item in by_query[query].items():
                impr = item["impressions"]
                pos = item["pos_weight"] / impr if impr else 0.0
                rows.append((page, item["clicks"], impr, pos, len(item["raw_urls"])))
            for page, clicks, impr, pos, raw_count in sorted(rows, key=lambda x: -x[2]):
                short = page.replace("https://productosvirales.com.ar", "")
                fragments = f"  ({raw_count} fragments)" if raw_count > 1 else ""
                print(f"      {round(impr):>5} impr  pos {pos:>4.1f}  {short}{fragments}")
    conn.close()


# ---------------------------------------------------------------------------
# Oportunidades: distancia de gol a nivel QUERY (que empujar al top)
# ---------------------------------------------------------------------------
def cmd_oportunidades(args):
    """Queries que ya rankean en posicion 5-15 (pagina 1 baja / pagina 2).

    A diferencia de 'audit' [1], que mira paginas, esto mira las KEYWORDS
    exactas en distancia de gol y muestra la pagina que las sirve, para saber
    que guia/ficha optimizar. 'potencial' = clicks/mes extra estimados si esa
    query sube al top 3 (impresiones x CTR_top3 - clicks actuales).
    """
    conn = db()
    snap_id, s, e = latest_snapshot(conn)
    lo, hi, floor = args.min_pos, args.max_pos, args.min_impr
    print(f"=== OPORTUNIDADES: distancia de gol (snapshot #{snap_id}, {s} a {e}) ===")
    filtro = f" que contienen \"{args.match}\"" if args.match else ""
    print(f"Queries en posicion {lo:g}-{hi:g} con >= {floor} impresiones{filtro}.")
    print("'potencial' = clicks/mes extra estimados si suben al top 3.\n")

    # Mapa query -> pagina que mas impresiones aporta (para saber que tocar).
    pagemap = {}
    for query, page, impr in conn.execute(
        "SELECT key2, key1, impressions FROM metrics"
        " WHERE snapshot_id=? AND dim_type='page_query'",
        (snap_id,),
    ):
        prev = pagemap.get(query)
        if prev is None or impr > prev[1]:
            pagemap[query] = (canonical_gsc_url(page), impr)

    sql = (
        "SELECT key1, clicks, impressions, ctr, position FROM metrics"
        " WHERE snapshot_id=? AND dim_type='query'"
        " AND position BETWEEN ? AND ? AND impressions >= ?"
    )
    params = [snap_id, lo, hi, floor]
    if args.match:
        sql += " AND lower(key1) LIKE ?"
        params.append(f"%{args.match.lower()}%")
    rows = conn.execute(sql, params).fetchall()

    ctr_top3 = expected_ctr(3)
    out = []
    for key, clicks, impr, ctr, pos in rows:
        potential = max(0.0, impr * ctr_top3 - clicks)
        page = pagemap.get(key, ("", 0))[0].replace("https://productosvirales.com.ar", "")
        out.append((key, round(impr), round(pos, 1), round(ctr * 100, 1),
                    round(clicks), round(potential), page or "(sin pagina)"))
    out.sort(key=lambda r: r[5], reverse=True)  # por potencial
    _fmt(out, ["keyword", "impr", "pos", "ctr%", "clicks", "potencial", "pagina"], limit=args.top)
    if not out:
        print("  (nada en ese rango; proba bajar --min-impr o ampliar --max-pos)")
    conn.close()


# ---------------------------------------------------------------------------
# Reporte por seccion / producto / guia
# ---------------------------------------------------------------------------
def cmd_report(args):
    conn = db()
    source = args.source
    snap_id, s, e = latest_snapshot(conn, source)
    print(f"=== REPORTE POR SECCION [{source.upper()}] (snapshot #{snap_id}, {s} a {e}) ===\n")

    pages = conn.execute(
        "SELECT key1, clicks, impressions, ctr, position FROM metrics"
        " WHERE snapshot_id=? AND dim_type='page'",
        (snap_id,),
    ).fetchall()

    sections = {}
    for url, clicks, impr, ctr, pos in pages:
        label = section_for(url)
        d = sections.setdefault(label, {"clicks": 0, "impr": 0, "n": 0, "pos_w": 0})
        d["clicks"] += clicks
        d["impr"] += impr
        d["n"] += 1
        d["pos_w"] += pos * impr  # posicion ponderada por impresiones

    summary = []
    for label, d in sections.items():
        avg_pos = d["pos_w"] / d["impr"] if d["impr"] else 0
        ctr = d["clicks"] / d["impr"] * 100 if d["impr"] else 0
        summary.append((label, d["n"], round(d["clicks"]), round(d["impr"]),
                        round(ctr, 1), round(avg_pos, 1)))
    summary.sort(key=lambda r: r[2], reverse=True)
    print("Resumen por seccion:")
    _fmt(summary, ["seccion", "urls", "clicks", "impr", "ctr%", "pos_media"])

    # Mejores y peores URLs dentro de la seccion pedida (o todas)
    target = args.section
    rows = []
    for url, clicks, impr, ctr, pos in pages:
        if target and target.lower() not in section_for(url).lower():
            continue
        rows.append((url.replace("https://productosvirales.com.ar", ""),
                     round(clicks), round(impr), round(ctr * 100, 1), round(pos, 1)))
    rows.sort(key=lambda r: r[1], reverse=True)
    label = target or "todas las secciones"
    print(f"\nTOP URLs ({label}):")
    _fmt(rows, ["url", "clicks", "impr", "ctr%", "pos"], limit=args.top)
    print(f"\nURLs con impresiones pero CASI SIN clicks ({label}) -> revisar:")
    weak = [r for r in rows if r[2] >= config.MIN_IMPRESSIONS and r[1] == 0]
    weak.sort(key=lambda r: r[2], reverse=True)
    _fmt(weak, ["url", "clicks", "impr", "ctr%", "pos"], limit=args.top)
    conn.close()


# ---------------------------------------------------------------------------
# Alertas (diff vs snapshot anterior)
# ---------------------------------------------------------------------------
def cmd_alerts(args):
    conn = db()
    snaps = conn.execute(
        "SELECT id, range_start, range_end FROM snapshots WHERE source='google' ORDER BY id DESC LIMIT 2"
    ).fetchall()
    if len(snaps) < 2:
        sys.exit("Necesito al menos 2 snapshots de Google para comparar. Corre 'fetch' de nuevo mas adelante.")
    (new_id, ns, ne), (old_id, os_, oe) = snaps
    print(f"=== ALERTAS: {os_}..{oe}  ->  {ns}..{ne} ===\n")

    def page_map(sid):
        rows = conn.execute(
            "SELECT key1, clicks, impressions, position FROM metrics"
            " WHERE snapshot_id=? AND dim_type='page'",
            (sid,),
        ).fetchall()
        return {r[0]: r[1:] for r in rows}

    new, old = page_map(new_id), page_map(old_id)
    movers = []
    for url in set(new) | set(old):
        nc, ni, npos = new.get(url, (0, 0, 0))
        oc, oi, opos = old.get(url, (0, 0, 0))
        dclicks = nc - oc
        dpos = (npos - opos) if (npos and opos) else 0
        big_click = abs(dclicks) >= config.ALERT_MIN_CLICK_DELTA
        big_pos = opos and npos and abs(dpos) >= config.ALERT_MIN_POS_DELTA
        if big_click or big_pos:
            short = url.replace("https://productosvirales.com.ar", "")
            movers.append((short, round(oc), round(nc), round(dclicks),
                           round(opos, 1), round(npos, 1), round(dpos, 1)))
    # Ordenar: lo que mas cayo primero (negativos arriba)
    movers.sort(key=lambda r: r[3])
    print("Caidas y subidas fuertes (orden: peores caidas de clicks arriba):")
    _fmt(movers, ["url", "clk_ant", "clk_now", "d_clk", "pos_ant", "pos_now", "d_pos"], limit=args.top)
    print("\n  d_pos positivo = empeoro (bajo en el ranking). Negativo = mejoro.")
    conn.close()


# ---------------------------------------------------------------------------
# Query -> paginas: pivot inverso al de "report"/"audit".
# ---------------------------------------------------------------------------
def cmd_query_pages(args):
    """Para una o mas queries exactas, que URLs base reciben impresiones.

    Es el pivot inverso al de "report"/"audit" (que van pagina -> query):
    sirve para revisar a mano una query puntual, incluso con pocas
    impresiones (donde `audit` nunca la va a mostrar por no llegar a
    MIN_IMPRESSIONS), o para chequear una lista de variantes de una sola
    vez. `audit` seccion [3] ya hace este mismo pivot mirando TODO el sitio,
    pero solo arriba de ese piso: esto es la version dirigida, sin piso,
    para cuando ya tenes las queries que te interesan.

    LIMITE DURO, no cosmetico: la API de GSC no reporta cada query
    individual que recibio una pagina. Google aplica un umbral de privacidad
    y omite las queries mas raras o identificables (ver la documentacion
    oficial de Search Console sobre "queries filtradas por privacidad").
    Consecuencia medida en este proyecto (snapshot #30, 27/6-24/7 2026):
    una pagina con 3.111 impresiones reales (dimension "page") solo mostro
    732 en la dimension "page_query" -> 24% de cobertura. No es un caso
    raro: las 4 URLs del cluster de perfumes arabes midieron entre 24% y
    50% de cobertura ese mismo dia.

    Por eso cada fila de este reporte imprime su % de cobertura, y por eso
    "no aparece ninguna otra URL compitiendo" se imprime como NO VERIFICABLE
    (no como negativo/REFUTADA) cuando la cobertura es baja: la ausencia de
    una URL competidora en el 24% de los datos que Google te deja ver no es
    evidencia de que no exista en el 76% que no te muestra. El unico chequeo
    que cierra el diagnostico con cobertura baja es manual: buscar la query
    en incognito, sin sesion, y ver que URL muestra Google.

    Quien lea "ninguna otra URL compite" en un output de este comando dentro
    de 6 meses y no se acuerde de este limite, va a leerlo como un negativo
    limpio. No lo es. Este docstring existe para que esa lectura no pase.
    """
    conn = db()
    snap_id, s, e = latest_snapshot(conn)  # solo Google: Bing no tiene dim 'page_query'
    print(f"=== QUERY -> PAGINAS (snapshot #{snap_id}, {s} a {e}) ===\n")
    if args.breakdown:
        print("(--breakdown: fragments # SIN colapsar a su URL base)\n")

    # Total de impresiones por URL base (dim 'page') para el chequeo de cobertura.
    page_totals = {}
    for key1, impr in conn.execute(
        "SELECT key1, impressions FROM metrics WHERE snapshot_id=? AND dim_type='page'",
        (snap_id,),
    ).fetchall():
        base = canonical_gsc_url(key1)
        page_totals[base] = page_totals.get(base, 0) + impr

    # Suma de impresiones visibles por query, por URL base, para la misma
    # cuenta de cobertura (cuanto de esa URL SI aparece en dim 'page_query').
    pq_totals = {}
    for key1, impr in conn.execute(
        "SELECT key1, impressions FROM metrics WHERE snapshot_id=? AND dim_type='page_query'",
        (snap_id,),
    ).fetchall():
        base = canonical_gsc_url(key1)
        pq_totals[base] = pq_totals.get(base, 0) + impr

    multi_url_queries = []  # para el resumen final si vinieron 2+ queries

    for query in args.query:
        rows = conn.execute(
            "SELECT key1, clicks, impressions, position FROM metrics"
            " WHERE snapshot_id=? AND dim_type='page_query' AND lower(key2)=lower(?)",
            (snap_id, query),
        ).fetchall()
        print(f'"{query}"')
        if not rows:
            print("  Sin datos: 0 impresiones, o Google no reporta esta query individualmente"
                  " (umbral de privacidad). No es lo mismo que 'nadie rankea para esto'.\n")
            continue

        if args.breakdown:
            grouped = {}
            for url, clicks, impr, pos in rows:
                d = grouped.setdefault(url, {"clicks": 0.0, "impr": 0.0, "pos": pos})
                d["clicks"] += clicks
                d["impr"] += impr
        else:
            grouped = {}
            for url, clicks, impr, pos in rows:
                base = canonical_gsc_url(url)
                d = grouped.setdefault(base, {"clicks": 0.0, "impr": 0.0, "pos_w": 0.0})
                d["clicks"] += clicks
                d["impr"] += impr
                d["pos_w"] += pos * impr

        table = []
        for url, d in grouped.items():
            pos = d["pos"] if args.breakdown else (d["pos_w"] / d["impr"] if d["impr"] else 0)
            short = url.replace("https://productosvirales.com.ar", "")
            base = url if args.breakdown else canonical_gsc_url(url)
            covered = pq_totals.get(canonical_gsc_url(base), 0)
            total = page_totals.get(canonical_gsc_url(base), 0)
            coverage = f"{100*covered/total:.0f}%" if total else "?"
            table.append((short, round(d["clicks"]), round(d["impr"]), round(pos, 1), coverage))
        table.sort(key=lambda r: -r[2])
        _fmt(table, ["url", "clicks", "impr", "pos", "cobertura_url"])

        n_urls = len({canonical_gsc_url(u) for u, *_ in rows})
        if n_urls >= 2:
            print(f"  -> {n_urls} URLs base compiten por esta query.")
            multi_url_queries.append((query, n_urls))
        else:
            min_cov = min(
                (100 * pq_totals.get(canonical_gsc_url(u), 0) / page_totals.get(canonical_gsc_url(u), 1))
                for u, *_ in rows
            )
            if min_cov < 50:
                print(f"  -> 1 sola URL visible, pero cobertura de datos baja (~{min_cov:.0f}%)."
                      " NO VERIFICABLE con esto solo: confirma a mano en incognito.")
            else:
                print("  -> 1 sola URL visible, con cobertura de datos razonable.")
        print()

    if len(args.query) > 1:
        print("=== RESUMEN: queries con 2+ URLs base compitiendo ===")
        if multi_url_queries:
            _fmt(multi_url_queries, ["query", "n_urls"])
        else:
            print("  Ninguna de las queries pasadas tiene mas de una URL base compitiendo"
                  " (sujeto a la cobertura de datos de cada una, ver arriba).")
    conn.close()


# ---------------------------------------------------------------------------
# Utilidades
# ---------------------------------------------------------------------------
def cmd_setup_check(args):
    print("1) Credenciales...")
    if Path(SA_FILE).exists():
        print(f"   OK: service account ({Path(SA_FILE).name})")
    elif OAUTH_CLIENT_FILE.exists() or TOKEN_FILE.exists():
        which = TOKEN_FILE.name if TOKEN_FILE.exists() else OAUTH_CLIENT_FILE.name
        print(f"   OK: OAuth ({which})")
    else:
        sys.exit(
            "   FALTAN. Guarda en scripts/gsc/ uno de estos (ver README.md):\n"
            "     - client_secret.json  (OAuth, recomendado)\n"
            "     - service-account.json (si tu org permite claves)"
        )

    print("2) Conectando a la API...")
    service = get_service()
    sites = service.sites().list().execute().get("siteEntry", [])
    print("   OK. Propiedades que ve esta service account:")
    if not sites:
        print("   (NINGUNA) -> Falta agregar el email de la service account como")
        print("   usuario en Search Console. Ver README.md, paso 6.")
        return
    found = False
    for s in sites:
        mark = "  <-- configurada en config.py" if s["siteUrl"] == config.SITE_URL else ""
        if s["siteUrl"] == config.SITE_URL:
            found = True
        print(f"     {s['siteUrl']}  [{s['permissionLevel']}]{mark}")
    if not found:
        print(f"\n   OJO: en config.py tenes SITE_URL = {config.SITE_URL}")
        print("   pero no aparece arriba. Copia uno de la lista a config.py.")
    else:
        print("\n   Todo listo. Corre:  python scripts/gsc/gsc.py fetch")


def cmd_history(args):
    conn = db()
    rows = conn.execute(
        "SELECT id, source, fetched_at, range_start, range_end FROM snapshots ORDER BY id DESC"
    ).fetchall()
    if not rows:
        print("Sin snapshots todavia.")
        return
    _fmt(rows, ["#", "fuente", "bajado_el", "desde", "hasta"])
    conn.close()


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------
# ---------------------------------------------------------------------------
# Apariencia en busqueda (rich results)
# ---------------------------------------------------------------------------
def cmd_rich_results(args):
    """Que rich results esta sirviendo Google, y en que URLs.

    GOTCHA de la API: `searchAppearance` NO se puede combinar con otras
    dimensiones en la misma consulta. Google obliga a un flujo de dos pasos:
      1. pedir solo ["searchAppearance"] para saber que tipos existen
      2. volver a pedir ["page"] filtrando por un tipo concreto
    Por eso este comando hace dos llamadas y no una sola con dos dimensiones.

    Para que sirve: confirma con DATO si el marcado Product/Offer/AggregateRating
    de las guias esta siendo aceptado por Google o descartado en silencio. Si un
    tipo no aparece en el paso 1, Google no lo esta sirviendo, y no tiene sentido
    portar ese template a mas guias.
    """
    service = get_service()
    end = dt.date.today() - dt.timedelta(days=args.lag)
    start = end - dt.timedelta(days=args.days - 1)
    s, e = start.isoformat(), end.isoformat()
    print(f"Apariencia en busqueda de {s} a {e} ({args.days} dias)\n")

    rows = query_all(service, ["searchAppearance"], s, e)
    if not rows:
        print("  (Google no reporta ningun tipo de apariencia en esta ventana)")
        print("  Eso significa que NO esta sirviendo rich results para el sitio.")
        return

    tabla = []
    for r in rows:
        clicks = r.get("clicks", 0)
        impr = r.get("impressions", 0)
        ctr = (clicks / impr * 100) if impr else 0.0
        tabla.append((r["keys"][0], clicks, impr, ctr, r.get("position", 0.0)))
    tabla.sort(key=lambda x: -x[2])
    print("[1] Tipos de apariencia que Google SI esta sirviendo")
    _fmt(tabla, ["APARIENCIA", "CLICKS", "IMPR", "CTR%", "POS"])

    if not args.tipo:
        print("\n  Para ver que URLs traen un tipo:")
        print(f"    gsc.py rich-results --tipo {tabla[0][0]}")
        return

    print(f"\n[2] URLs con apariencia {args.tipo}")
    body_rows = []
    start_row = 0
    while True:
        body = {
            "startDate": s, "endDate": e,
            "dimensions": ["page"],
            "rowLimit": ROW_LIMIT, "startRow": start_row,
            "dataState": "all", "type": "web",
            "dimensionFilterGroups": [{
                "filters": [{
                    "dimension": "searchAppearance",
                    "operator": "equals",
                    "expression": args.tipo,
                }]
            }],
        }
        resp = service.searchanalytics().query(siteUrl=config.SITE_URL, body=body).execute()
        batch = resp.get("rows", [])
        body_rows.extend(batch)
        if len(batch) < ROW_LIMIT:
            break
        start_row += ROW_LIMIT

    if not body_rows:
        print(f"  (ninguna URL con apariencia {args.tipo})")
        return
    det = []
    for r in body_rows:
        clicks = r.get("clicks", 0)
        impr = r.get("impressions", 0)
        ctr = (clicks / impr * 100) if impr else 0.0
        det.append((canonical_gsc_url(r["keys"][0]), clicks, impr, ctr, r.get("position", 0.0)))
    det.sort(key=lambda x: -x[2])
    _fmt(det, ["URL", "CLICKS", "IMPR", "CTR%", "POS"], limit=args.top)


def main():
    p = argparse.ArgumentParser(description="Lector y auditor de Google Search Console.")
    sub = p.add_subparsers(dest="cmd", required=True)

    sub.add_parser("setup-check", help="verifica JSON + conexion + propiedades")

    f = sub.add_parser("fetch", help="baja y guarda un snapshot de Google")
    f.add_argument("--days", type=int, default=28, help="ventana de dias (default 28)")
    f.add_argument("--lag", type=int, default=2, help="dias de retraso de GSC (default 2)")
    f.add_argument("--type", choices=["web", "image", "video", "news"], default="web",
                   help="bucket de busqueda (default web). image son las fotos de las "
                        "guias/fichas en Google Imagenes: inventario aparte, no se suma a web")

    sub.add_parser("fetch-bing", help="baja y guarda un snapshot de Bing Webmaster Tools")

    a = sub.add_parser("audit", help="oportunidades de optimizacion (solo Google)")
    a.add_argument("--top", type=int, default=20, help="cuantas filas mostrar")
    a.add_argument("-v", "--verbose", action="store_true", help="detalle de canibalizacion")

    op = sub.add_parser("oportunidades", help="queries en distancia de gol (pos 5-15) para empujar al top")
    op.add_argument("--min-pos", type=float, default=5.0, help="posicion minima (default 5)")
    op.add_argument("--max-pos", type=float, default=15.0, help="posicion maxima (default 15)")
    op.add_argument("--min-impr", type=int, default=config.MIN_IMPRESSIONS,
                    help=f"impresiones minimas (default {config.MIN_IMPRESSIONS})")
    op.add_argument("--match", help="filtrar queries que contengan este texto (ej: freidora)")
    op.add_argument("--top", type=int, default=30, help="cuantas filas mostrar")

    r = sub.add_parser("report", help="rinde por seccion / URL")
    r.add_argument("--section", help="filtrar: producto / guias / categoria / trending")
    r.add_argument("--source", choices=["google", "google-image", "google-video", "google-news", "bing"],
                   default="google", help="fuente (default google)")
    r.add_argument("--top", type=int, default=20)

    al = sub.add_parser("alerts", help="cambios fuertes vs snapshot anterior")
    al.add_argument("--top", type=int, default=25)

    qp = sub.add_parser("query-pages", help="query -> que URLs aparecen (pivot inverso, para chequeo dirigido)")
    qp.add_argument("query", nargs="+", help="una o mas queries exactas (comparacion sin importar mayusculas)")
    qp.add_argument("--breakdown", action="store_true",
                     help="mostrar fragments # sin colapsar a su URL base (default: colapsados)")

    rr = sub.add_parser("rich-results",
                        help="que rich results sirve Google (confirma si el schema Product/Offer se acepta)")
    rr.add_argument("--days", type=int, default=28, help="ventana de dias (default 28)")
    rr.add_argument("--lag", type=int, default=2, help="dias de retraso de GSC (default 2)")
    rr.add_argument("--tipo", help="detallar URLs de un tipo (ej: PRODUCT_SNIPPETS)")
    rr.add_argument("--top", type=int, default=25, help="cuantas URLs mostrar")

    sub.add_parser("history", help="lista los snapshots guardados")

    args = p.parse_args()
    {
        "setup-check": cmd_setup_check,
        "fetch": cmd_fetch,
        "fetch-bing": cmd_fetch_bing,
        "audit": cmd_audit,
        "oportunidades": cmd_oportunidades,
        "report": cmd_report,
        "alerts": cmd_alerts,
        "query-pages": cmd_query_pages,
        "rich-results": cmd_rich_results,
        "history": cmd_history,
    }[args.cmd](args)


if __name__ == "__main__":
    main()
