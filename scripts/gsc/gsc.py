#!/usr/bin/env python3
"""Lector y auditor de Google Search Console para productosvirales.com.ar

Subcomandos:
    setup-check          Verifica el JSON, conecta y lista tus propiedades.
    fetch                Baja queries, paginas y fechas y guarda un snapshot.
    audit                Reporte de oportunidades (cerca del top, CTR flojo, canibalizacion).
    report               Rinde por seccion (fichas / guias / categorias) y top/peores URLs.
    alerts               Compara con el snapshot anterior y avisa cambios fuertes.
    history              Lista los snapshots guardados.

Uso tipico:
    python scripts/gsc/gsc.py setup-check
    python scripts/gsc/gsc.py fetch                # corre esto seguido (ej. semanal)
    python scripts/gsc/gsc.py audit
    python scripts/gsc/gsc.py report
    python scripts/gsc/gsc.py alerts

Casi todo es stdlib; lo unico externo es la libreria de Google (ver requirements.txt).
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import sqlite3
import sys
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
            range_end TEXT NOT NULL
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
    return conn


# ---------------------------------------------------------------------------
# Descarga
# ---------------------------------------------------------------------------
def query_all(service, dimensions, start, end):
    """Pagina la API hasta traer todas las filas para esas dimensiones."""
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
    end = dt.date.today() - dt.timedelta(days=args.lag)
    start = end - dt.timedelta(days=args.days - 1)
    s, e = start.isoformat(), end.isoformat()
    print(f"Bajando GSC de {s} a {e} ({args.days} dias)...")

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
        "INSERT INTO snapshots (fetched_at, range_start, range_end) VALUES (?,?,?)",
        (dt.datetime.now().isoformat(timespec="seconds"), s, e),
    )
    snap_id = cur.lastrowid

    totals = {}
    for dim_type, dims in plans.items():
        rows = query_all(service, dims, s, e)
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

    # CSV crudos por si queres abrirlos en Excel/Sheets
    out_dir = config.EXPORTS_DIR / e
    out_dir.mkdir(parents=True, exist_ok=True)
    for dim_type in plans:
        _export_csv(conn, snap_id, dim_type, out_dir / f"{dim_type}.csv")
    conn.close()
    print(f"\nGuardado snapshot #{snap_id}. CSVs en {out_dir}")
    print("Proximo paso:  python scripts/gsc/gsc.py audit")


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
# Helpers de analisis
# ---------------------------------------------------------------------------
def latest_snapshot(conn):
    row = conn.execute(
        "SELECT id, range_start, range_end FROM snapshots ORDER BY id DESC LIMIT 1"
    ).fetchone()
    if not row:
        sys.exit("No hay datos todavia. Corre primero:  python scripts/gsc/gsc.py fetch")
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

    # 3) Canibalizacion: una misma keyword rankeando con >1 URL.
    print("\n[3] CANIBALIZACION (una keyword reparte impresiones entre varias URLs):")
    pq = conn.execute(
        "SELECT key2, key1, clicks, impressions, position FROM metrics"
        " WHERE snapshot_id=? AND dim_type='page_query' AND impressions >= ?",
        (snap_id, config.MIN_IMPRESSIONS),
    ).fetchall()
    by_query = {}
    for query, page, clicks, impr, pos in pq:
        by_query.setdefault(query, []).append((page, clicks, impr, pos))
    canib = []
    for query, items in by_query.items():
        if len(items) >= 2:
            total_impr = sum(i[2] for i in items)
            canib.append((query, len(items), round(total_impr)))
    canib.sort(key=lambda r: r[2], reverse=True)
    _fmt(canib, ["keyword", "n_urls", "impr_total"], limit=args.top)
    if args.verbose and canib:
        print("\n  Detalle de las 3 peores:")
        for query, _, _ in canib[:3]:
            print(f"  - \"{query}\":")
            for page, clicks, impr, pos in sorted(by_query[query], key=lambda x: -x[2]):
                short = page.replace("https://productosvirales.com.ar", "")
                print(f"      {round(impr):>5} impr  pos {pos:>4.1f}  {short}")
    conn.close()


# ---------------------------------------------------------------------------
# Reporte por seccion / producto / guia
# ---------------------------------------------------------------------------
def cmd_report(args):
    conn = db()
    snap_id, s, e = latest_snapshot(conn)
    print(f"=== REPORTE POR SECCION (snapshot #{snap_id}, {s} a {e}) ===\n")

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
        "SELECT id, range_start, range_end FROM snapshots ORDER BY id DESC LIMIT 2"
    ).fetchall()
    if len(snaps) < 2:
        sys.exit("Necesito al menos 2 snapshots para comparar. Corre 'fetch' de nuevo mas adelante.")
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
        "SELECT id, fetched_at, range_start, range_end FROM snapshots ORDER BY id DESC"
    ).fetchall()
    if not rows:
        print("Sin snapshots todavia.")
        return
    _fmt(rows, ["#", "bajado_el", "desde", "hasta"])
    conn.close()


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------
def main():
    p = argparse.ArgumentParser(description="Lector y auditor de Google Search Console.")
    sub = p.add_subparsers(dest="cmd", required=True)

    sub.add_parser("setup-check", help="verifica JSON + conexion + propiedades")

    f = sub.add_parser("fetch", help="baja y guarda un snapshot")
    f.add_argument("--days", type=int, default=28, help="ventana de dias (default 28)")
    f.add_argument("--lag", type=int, default=2, help="dias de retraso de GSC (default 2)")

    a = sub.add_parser("audit", help="oportunidades de optimizacion")
    a.add_argument("--top", type=int, default=20, help="cuantas filas mostrar")
    a.add_argument("-v", "--verbose", action="store_true", help="detalle de canibalizacion")

    r = sub.add_parser("report", help="rinde por seccion / URL")
    r.add_argument("--section", help="filtrar: producto / guias / categoria / trending")
    r.add_argument("--top", type=int, default=20)

    al = sub.add_parser("alerts", help="cambios fuertes vs snapshot anterior")
    al.add_argument("--top", type=int, default=25)

    sub.add_parser("history", help="lista los snapshots guardados")

    args = p.parse_args()
    {
        "setup-check": cmd_setup_check,
        "fetch": cmd_fetch,
        "audit": cmd_audit,
        "report": cmd_report,
        "alerts": cmd_alerts,
        "history": cmd_history,
    }[args.cmd](args)


if __name__ == "__main__":
    main()
