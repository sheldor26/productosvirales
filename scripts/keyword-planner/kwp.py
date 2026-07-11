#!/usr/bin/env python3
"""Keyword Planner (Google Ads API) — ideas + métricas para planificar keywords.

Devuelve, para keywords semilla, la data del Planner de Google: volumen mensual
promedio, competencia (LOW/MEDIUM/HIGH + índice 0-100) y rango de puja top-of-page
(intención comercial). Es la fuente "oficial" de Google, para cruzar con Ubersuggest.

Uso:
    cd scripts/keyword-planner
    python3 kwp.py "masajeador facial" "gua sha"
    python3 kwp.py "masajeador facial" --json          # salida JSON (para orquestar)
    python3 kwp.py "masajeador facial" --limit 30

Geo por defecto: Argentina (2032). Idioma: Español (1003).
Requiere google-ads.yaml completo (developer_token, login_customer_id, refresh_token).
"""
import argparse
import json
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent
YAML = BASE / "google-ads.yaml"

LANG_ES = "languageConstants/1003"   # Español
GEO_AR = "geoTargetConstants/2032"   # Argentina


def build_client():
    if not YAML.exists():
        sys.exit(
            f"Falta {YAML}.\n"
            "Copiá google-ads.yaml.example a google-ads.yaml y completá "
            "developer_token, login_customer_id y refresh_token "
            "(este último lo imprime get_refresh_token.py)."
        )
    try:
        from google.ads.googleads.client import GoogleAdsClient
    except ImportError:
        sys.exit("Falta la librería google-ads. Instalá: pip install -r requirements.txt")
    return GoogleAdsClient.load_from_storage(str(YAML))


def fetch_ideas(client, seeds, geo, lang, limit):
    svc = client.get_service("KeywordPlanIdeaService")
    req = client.get_type("GenerateKeywordIdeasRequest")
    req.customer_id = str(client.login_customer_id)
    req.language = lang
    req.geo_target_constants.append(geo)
    req.include_adult_keywords = False
    req.keyword_plan_network = (
        client.enums.KeywordPlanNetworkEnum.GOOGLE_SEARCH
    )
    req.keyword_seed.keywords.extend(seeds)

    from google.ads.googleads.errors import GoogleAdsException
    try:
        resp = svc.generate_keyword_ideas(request=req)
    except GoogleAdsException as ex:
        msgs = "; ".join(e.message for e in ex.failure.errors)
        sys.exit(f"Google Ads API falló: {msgs}\n(request_id={ex.request_id})")

    rows = []
    for idea in resp:
        m = idea.keyword_idea_metrics
        rows.append(
            {
                "keyword": idea.text,
                "avg_monthly_searches": m.avg_monthly_searches or 0,
                "competition": m.competition.name if m.competition else "",
                "competition_index": m.competition_index or 0,
                "low_top_bid": round((m.low_top_of_page_bid_micros or 0) / 1e6, 2),
                "high_top_bid": round((m.high_top_of_page_bid_micros or 0) / 1e6, 2),
            }
        )
    rows.sort(key=lambda r: r["avg_monthly_searches"], reverse=True)
    return rows[:limit]


def main() -> None:
    ap = argparse.ArgumentParser(description="Keyword Planner de Google Ads")
    ap.add_argument("keywords", nargs="+", help="keywords semilla (1 o más)")
    ap.add_argument("--geo", default=GEO_AR, help="geoTargetConstants/ID (default AR 2032)")
    ap.add_argument("--lang", default=LANG_ES, help="languageConstants/ID (default ES 1003)")
    ap.add_argument("--limit", type=int, default=50)
    ap.add_argument("--json", action="store_true", help="salida JSON")
    args = ap.parse_args()

    client = build_client()
    rows = fetch_ideas(client, args.keywords, args.geo, args.lang, args.limit)

    if args.json:
        print(json.dumps(rows, ensure_ascii=False, indent=2))
        return

    print(f"\nKeyword Planner — {len(rows)} ideas (AR, español)\n")
    print(f"{'keyword':45} {'vol/mes':>9} {'comp':>7} {'idx':>4}  {'puja $ (top)':>16}")
    print("-" * 90)
    for r in rows:
        bid = f"{r['low_top_bid']}-{r['high_top_bid']}"
        print(
            f"{r['keyword'][:44]:45} {r['avg_monthly_searches']:>9,} "
            f"{r['competition']:>7} {r['competition_index']:>4}  {bid:>16}"
        )


if __name__ == "__main__":
    main()
