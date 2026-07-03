#!/usr/bin/env python3
"""Lector de Google Analytics 4 para productosvirales.

Reusa el MISMO cliente OAuth que el lector de GSC (scripts/gsc/client_secret.json)
pero con el scope de Analytics. La primera corrida abre el navegador para que
apruebes el permiso (re-autorizacion); despues cachea el token acá al lado.

Correr con el venv de gsc (ya tiene las libs):
    scripts/gsc/.venv/bin/python scripts/ga4/ga4.py setup           # auth + prueba
    scripts/gsc/.venv/bin/python scripts/ga4/ga4.py affiliates      # clicks de afiliado por guia
    scripts/gsc/.venv/bin/python scripts/ga4/ga4.py overview        # top paginas por vistas
    (agregar --days N para cambiar la ventana; default 28)

Correr LOCAL desde Argentina, igual que el resto.
"""

import json
import sys
import urllib.request
from pathlib import Path

from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow

PROPERTY_ID = "540677058"
BASE = Path(__file__).resolve().parent
GSC_DIR = BASE.parent / "gsc"
CLIENT_SECRET = GSC_DIR / "client_secret.json"   # reusamos el cliente OAuth de GSC
TOKEN_FILE = BASE / "token.json"                 # token propio (scope Analytics)
SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]
API = f"https://analyticsdata.googleapis.com/v1beta/properties/{PROPERTY_ID}:runReport"


def get_creds():
    creds = None
    if TOKEN_FILE.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not CLIENT_SECRET.exists():
                sys.exit(f"Falta {CLIENT_SECRET} (el cliente OAuth de GSC).")
            print("Abriendo el navegador para autorizar el acceso a Analytics...")
            flow = InstalledAppFlow.from_client_secrets_file(str(CLIENT_SECRET), SCOPES)
            creds = flow.run_local_server(port=0)
        TOKEN_FILE.write_text(creds.to_json())
    return creds


def run_report(creds, body):
    if not creds.valid:
        creds.refresh(Request())
    req = urllib.request.Request(
        API,
        data=json.dumps(body).encode(),
        headers={"Authorization": f"Bearer {creds.token}", "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def rows_of(resp):
    out = []
    for row in resp.get("rows", []):
        dims = [d.get("value", "") for d in row.get("dimensionValues", [])]
        mets = [m.get("value", "") for m in row.get("metricValues", [])]
        out.append((dims, mets))
    return out


def arg_days(default=28):
    if "--days" in sys.argv:
        try:
            return int(sys.argv[sys.argv.index("--days") + 1])
        except (ValueError, IndexError):
            pass
    return default


def cmd_setup(creds):
    print("Auth OK. Token guardado en", TOKEN_FILE.name)
    resp = run_report(creds, {
        "dateRanges": [{"startDate": "7daysAgo", "endDate": "today"}],
        "metrics": [{"name": "activeUsers"}, {"name": "screenPageViews"}],
    })
    r = rows_of(resp)
    if r:
        print(f"Prueba (ultimos 7 dias): {r[0][1][0]} usuarios · {r[0][1][1]} vistas de pagina")
    else:
        print("Conecta bien, pero todavia no hay datos (normal si recien instalaste).")


def cmd_affiliates(creds):
    days = arg_days()
    print(f"=== Clicks de afiliado (evento affiliate_click) por guia, ultimos {days} dias ===")
    resp = run_report(creds, {
        "dateRanges": [{"startDate": f"{days}daysAgo", "endDate": "today"}],
        "dimensions": [{"name": "pagePath"}],
        "metrics": [{"name": "eventCount"}],
        "dimensionFilter": {"filter": {"fieldName": "eventName", "stringFilter": {"value": "affiliate_click"}}},
        "orderBys": [{"metric": {"metricName": "eventCount"}, "desc": True}],
        "limit": 30,
    })
    rows = rows_of(resp)
    if not rows:
        print("  (sin datos todavia; el evento recien empezo a registrarse. Dale unos dias.)")
        return
    total = 0
    for (dims, mets) in rows:
        c = int(mets[0]); total += c
        print(f"  {c:>5}  {dims[0]}")
    print(f"  ----- total affiliate_click: {total}")
    print("\n  Nota: para ver por PRODUCTO (no solo por guia), registrar en GA4 el parametro")
    print("  'link_url' como Dimension personalizada (Admin -> Definiciones personalizadas).")


def cmd_overview(creds):
    days = arg_days()
    print(f"=== Top paginas por vistas, ultimos {days} dias ===")
    resp = run_report(creds, {
        "dateRanges": [{"startDate": f"{days}daysAgo", "endDate": "today"}],
        "dimensions": [{"name": "pagePath"}],
        "metrics": [{"name": "screenPageViews"}, {"name": "activeUsers"}, {"name": "averageSessionDuration"}],
        "orderBys": [{"metric": {"metricName": "screenPageViews"}, "desc": True}],
        "limit": 25,
    })
    rows = rows_of(resp)
    if not rows:
        print("  (sin datos todavia)")
        return
    print(f"  {'vistas':>7} {'users':>6} {'seg/ses':>8}  pagina")
    for (dims, mets) in rows:
        print(f"  {int(mets[0]):>7} {int(mets[1]):>6} {float(mets[2]):>8.0f}  {dims[0]}")


def cmd_hostname(creds):
    """Trafico por hostName en dos ventanas: el pico vs despues del quiebre.

    Sirve para confirmar si el pico de principios de junio era trafico de
    desarrollo (localhost / preview de Vercel) y no usuarios reales.
    """
    ventanas = [
        ("PICO (8-20 jun)", "2026-06-08", "2026-06-20"),
        ("POST-QUIEBRE (23 jun - 1 jul)", "2026-06-23", "2026-07-01"),
    ]
    for etiqueta, start, end in ventanas:
        print(f"\n=== {etiqueta} — usuarios por hostname ===")
        resp = run_report(creds, {
            "dateRanges": [{"startDate": start, "endDate": end}],
            "dimensions": [{"name": "hostName"}],
            "metrics": [{"name": "activeUsers"}, {"name": "screenPageViews"}],
            "orderBys": [{"metric": {"metricName": "activeUsers"}, "desc": True}],
            "limit": 25,
        })
        rows = rows_of(resp)
        if not rows:
            print("  (sin datos)")
            continue
        print(f"  {'users':>6} {'vistas':>7}  hostname")
        for (dims, mets) in rows:
            host = dims[0] or "(not set)"
            print(f"  {int(mets[0]):>6} {int(mets[1]):>7}  {host}")


def cmd_daily(creds):
    """Serie diaria de usuarios activos, para clavar la fecha del quiebre."""
    days = arg_days(45)
    print(f"=== Usuarios activos por dia (ultimos {days} dias) ===")
    resp = run_report(creds, {
        "dateRanges": [{"startDate": f"{days}daysAgo", "endDate": "today"}],
        "dimensions": [{"name": "date"}],
        "metrics": [{"name": "activeUsers"}, {"name": "screenPageViews"}],
        "orderBys": [{"dimension": {"dimensionName": "date"}}],
        "limit": 60,
    })
    rows = rows_of(resp)
    if not rows:
        print("  (sin datos)")
        return
    print(f"  {'fecha':>10} {'users':>6} {'vistas':>7}  grafico")
    for (dims, mets) in rows:
        d = dims[0]
        fecha = f"{d[0:4]}-{d[4:6]}-{d[6:8]}"
        u = int(mets[0])
        bar = "#" * min(u, 50)
        print(f"  {fecha:>10} {u:>6} {int(mets[1]):>7}  {bar}")


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else "setup"
    creds = get_creds()
    {
        "setup": cmd_setup,
        "affiliates": cmd_affiliates,
        "overview": cmd_overview,
        "hostname": cmd_hostname,
        "daily": cmd_daily,
    }.get(cmd, cmd_setup)(creds)


if __name__ == "__main__":
    main()
