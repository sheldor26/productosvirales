#!/usr/bin/env python3
"""Metricas historicas EXACTAS (no ideas/expansion) para una lista de keywords propias.

A diferencia de kwp.py (que usa GenerateKeywordIdeas y puede devolver variantes
en vez de la keyword pedida), esto usa GenerateKeywordHistoricalMetrics: pide
una lista de textos exactos y devuelve metricas para ESOS textos, en una sola
request. Pensado para el reporte de trafico potencial de guias existentes,
donde la keyword ya esta decidida (no estamos buscando ideas).

Uso:
    .venv/bin/python bulk_historical_metrics.py keywords.json --out resultados.json

keywords.json: lista JSON de strings.
"""
import argparse
import json
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent
YAML = BASE / "google-ads.yaml"

LANG_ES = "languageConstants/1003"
GEO_AR = "geoTargetConstants/2032"


def build_client():
    from google.ads.googleads.client import GoogleAdsClient
    return GoogleAdsClient.load_from_storage(str(YAML))


def fetch_historical(client, keywords, geo, lang):
    svc = client.get_service("KeywordPlanIdeaService")
    req = client.get_type("GenerateKeywordHistoricalMetricsRequest")
    req.customer_id = str(client.login_customer_id)
    req.keywords.extend(keywords)
    req.language = lang
    req.geo_target_constants.append(geo)
    req.keyword_plan_network = client.enums.KeywordPlanNetworkEnum.GOOGLE_SEARCH

    resp = svc.generate_keyword_historical_metrics(request=req)
    rows = []
    for result in resp.results:
        m = result.keyword_metrics
        rows.append({
            "keyword": result.text,
            "avg_monthly_searches": m.avg_monthly_searches or 0,
            "competition": m.competition.name if m.competition else "",
            "competition_index": m.competition_index or 0,
            "low_top_bid": round((m.low_top_of_page_bid_micros or 0) / 1e6, 2),
            "high_top_bid": round((m.high_top_of_page_bid_micros or 0) / 1e6, 2),
        })
    return rows


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("keywords_json", help="path a un JSON con lista de keywords (strings)")
    ap.add_argument("--geo", default=GEO_AR)
    ap.add_argument("--lang", default=LANG_ES)
    ap.add_argument("--out", default=None)
    args = ap.parse_args()

    keywords = json.load(open(args.keywords_json, encoding="utf-8"))
    client = build_client()

    all_rows = []
    # GenerateKeywordHistoricalMetrics acepta muchas keywords por request, pero
    # las mandamos en tandas de 20 por prudencia (no hay limite documentado
    # estricto, pero evitamos requests gigantes de una).
    BATCH = 20
    for i in range(0, len(keywords), BATCH):
        chunk = keywords[i:i + BATCH]
        try:
            rows = fetch_historical(client, chunk, args.geo, args.lang)
            all_rows.extend(rows)
            print(f"OK batch {i}-{i+len(chunk)}: {len(rows)} resultados", file=sys.stderr)
        except Exception as ex:
            print(f"FALLO batch {i}-{i+len(chunk)}: {ex}", file=sys.stderr)

    if args.out:
        json.dump(all_rows, open(args.out, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
        print(f"Escrito {args.out} ({len(all_rows)} filas)", file=sys.stderr)
    else:
        print(json.dumps(all_rows, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
