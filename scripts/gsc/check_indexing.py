#!/usr/bin/env python3
"""Chequea el estado de indexacion real de UNA URL puntual via la URL Inspection API.

Uso:
    .venv/bin/python check_indexing.py https://productosvirales.com.ar/guias/algo

Distinto de gsc.py: ese lee metricas historicas (clicks/impresiones). Este
pregunta a Google, en vivo, si una URL puntual esta indexada ahora mismo.
"""
import sys
from gsc import get_service, config


def check(url: str):
    service = get_service()
    body = {"inspectionUrl": url, "siteUrl": config.SITE_URL}
    result = service.urlInspection().index().inspect(body=body).execute()
    inspection = result.get("inspectionResult", {})
    index_status = inspection.get("indexStatusResult", {})
    verdict = index_status.get("verdict", "DESCONOCIDO")
    coverage_state = index_status.get("coverageState", "?")
    last_crawl = index_status.get("lastCrawlTime", "nunca rastreada")
    robots_state = index_status.get("robotsTxtState", "?")
    indexing_state = index_status.get("indexingState", "?")
    return {
        "url": url,
        "verdict": verdict,
        "coverage_state": coverage_state,
        "last_crawl": last_crawl,
        "robots_state": robots_state,
        "indexing_state": indexing_state,
        "indexed": verdict == "PASS",
    }


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit("Uso: check_indexing.py <url>")
    r = check(sys.argv[1])
    print(f"URL: {r['url']}")
    print(f"Indexada: {'SI' if r['indexed'] else 'NO'}")
    print(f"Veredicto: {r['verdict']}")
    print(f"Estado de cobertura: {r['coverage_state']}")
    print(f"Ultimo rastreo: {r['last_crawl']}")
    print(f"robots.txt: {r['robots_state']}")
    print(f"Estado de indexacion: {r['indexing_state']}")
