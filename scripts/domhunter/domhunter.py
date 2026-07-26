#!/usr/bin/env python3
"""
domhunter — enriquece listas de dominios expirados con autoridad real.

Pipeline (barato -> caro, para no desperdiciar tiempo ni cuota):
  1. Lee un CSV exportado de ExpiredDomains.net (o un .txt con un dominio por linea).
  2. Prefiltro local gratis: descarta basura obvia con las columnas del propio CSV.
  3. OpenPageRank / Keywords Everywhere: autoridad, dominios referentes e historico.
     100 dominios por request, asi que miles de dominios son minutos.
  4. Wayback CDX (gratis, sin key): ~15s por dominio, por eso corre AL FINAL y solo
     sobre los que sobrevivieron a los pasos anteriores.
  5. Scoring y CSV ordenado con veredicto.

Todo se cachea en disco: re-correr no vuelve a gastar cuota de API.

Uso:
    export OPR_API_KEY="tu_key"
    python3 domhunter.py entrada.csv -o resultado.csv

Sin key (solo Wayback + heuristicas del CSV):
    python3 domhunter.py entrada.csv -o resultado.csv --no-opr

Solo dependencias de la libreria estandar de Python 3.8+.
"""

from __future__ import annotations

import argparse
import csv
import json
import math
import os
import re
import sys
import time
import threading
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
from pathlib import Path

# --------------------------------------------------------------------------
# Configuracion
# --------------------------------------------------------------------------

OPR_ENDPOINT = "https://openpagerank.keywordseverywhere.com/v1/domains/bulk"
OPR_BATCH_SIZE = 100          # maximo que acepta la API por request
CDX_ENDPOINT = "https://web.archive.org/cdx/search/cdx"

WAYBACK_WORKERS = 5           # subir esto hace que archive.org te tire 429
WAYBACK_TIMEOUT = 45
OPR_TIMEOUT = 60

USER_AGENT = "domhunter/1.0 (expired domain research; +https://example.org)"

CURRENT_YEAR = datetime.now().year

# Calibracion del score: 40 puntos recien a los 50.000 dominios referentes.
# Con el coeficiente anterior (13.3) cualquier dominio con >1000 rd saturaba
# y no se distinguia un sitio bueno de uno excelente.
RD_COEF = 40 / math.log10(50001)   # ~8.51
YEARS_COEF = 20 / 15               # 20 puntos a los 15 anios de historial

# Umbrales del prefiltro. Ajustables por CLI.
DEFAULTS = {
    "min_wayback_years": 3,       # anios distintos con capturas
    "min_wayback_months": 12,     # meses distintos con capturas
    "max_last_seen_gap": 12,      # anios desde la ultima captura
    "min_ref_domains": 10,        # dominios referentes segun OPR
    "max_bl_dp_ratio": 500,       # backlinks / domain pop del CSV
    "max_caida_pct": 85,          # caida de autoridad desde el pico historico
}

_print_lock = threading.Lock()


def log(msg: str) -> None:
    with _print_lock:
        print(msg, file=sys.stderr, flush=True)


# --------------------------------------------------------------------------
# Cache en disco
# --------------------------------------------------------------------------

class Cache:
    """Cache JSON simple con escritura periodica. Evita quemar cuota al re-correr."""

    def __init__(self, path: Path):
        self.path = path
        self.lock = threading.Lock()
        self.dirty = 0
        if path.exists():
            try:
                self.data = json.loads(path.read_text(encoding="utf-8"))
            except (json.JSONDecodeError, OSError):
                log(f"  aviso: cache {path.name} ilegible, empiezo de cero")
                self.data = {}
        else:
            self.data = {}

    def get(self, key):
        with self.lock:
            return self.data.get(key)

    def set(self, key, value):
        with self.lock:
            self.data[key] = value
            self.dirty += 1
            if self.dirty >= 25:
                self._flush_unlocked()

    def _flush_unlocked(self):
        tmp = self.path.with_suffix(self.path.suffix + ".tmp")
        tmp.write_text(json.dumps(self.data), encoding="utf-8")
        tmp.replace(self.path)
        self.dirty = 0

    def flush(self):
        with self.lock:
            if self.dirty:
                self._flush_unlocked()


# --------------------------------------------------------------------------
# HTTP con reintentos
# --------------------------------------------------------------------------

def http_request(url, *, data=None, headers=None, timeout=30, retries=3):
    """GET/POST con backoff exponencial. Devuelve bytes o lanza la ultima excepcion."""
    hdrs = {"User-Agent": USER_AGENT}
    if headers:
        hdrs.update(headers)

    last_err = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, data=data, headers=hdrs)
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                return resp.read()
        except urllib.error.HTTPError as e:
            last_err = e
            body = ""
            try:
                body = e.read().decode("utf-8", "replace")[:300]
            except Exception:
                pass
            # 4xx que no sean rate limit: no tiene sentido reintentar
            if e.code in (400, 401, 403, 404) and e.code != 429:
                raise RuntimeError(f"HTTP {e.code}: {body}") from e
            wait = min(2 ** attempt * 2, 30)
            if attempt < retries - 1:
                time.sleep(wait)
        except (urllib.error.URLError, TimeoutError, OSError) as e:
            last_err = e
            if attempt < retries - 1:
                time.sleep(min(2 ** attempt * 2, 30))

    raise RuntimeError(f"fallo tras {retries} intentos: {last_err}")


# --------------------------------------------------------------------------
# Paso 1 — Lectura de entrada
# --------------------------------------------------------------------------

DOMAIN_RE = re.compile(r"^(?:https?://)?(?:www\.)?([a-z0-9](?:[a-z0-9\-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?)+)\.?$", re.I)


def normalize_domain(raw: str) -> str | None:
    if not raw:
        return None
    raw = raw.strip().strip('"').strip("'").lower()
    if not raw or " " in raw:
        return None
    # sacar esquema ANTES de cortar por "/", si no "https://x.com" queda en "https:"
    if "://" in raw:
        raw = raw.split("://", 1)[1]
    raw = raw.split("/")[0].split("?")[0].split("#")[0]
    if "@" in raw:                 # por si viene un mail
        raw = raw.rsplit("@", 1)[1]
    if ":" in raw:                 # puerto
        raw = raw.split(":", 1)[0]
    m = DOMAIN_RE.match(raw)
    if not m:
        return None
    dom = m.group(1)
    if "." not in dom or len(dom) > 253:
        return None
    return dom


def _to_number(val):
    """Convierte '5.2 M', '1,234', '12' a float. Devuelve None si no se puede."""
    if val is None:
        return None
    s = str(val).strip().replace(",", "")
    if not s or s == "-":
        return None
    mult = 1.0
    if s and s[-1] in "KkMmBb":
        mult = {"k": 1e3, "m": 1e6, "b": 1e9}[s[-1].lower()]
        s = s[:-1].strip()
    elif s.endswith(" M"):
        mult, s = 1e6, s[:-2]
    try:
        return float(s) * mult
    except ValueError:
        return None


# Nombres de columna de ExpiredDomains.net que nos interesan
CSV_FIELD_MAP = {
    "domain": ["domain", "domainname", "domain name"],
    "bl": ["bl", "backlinks", "majesticbacklinks"],
    "dp": ["dp", "domainpop", "domain pop", "seokicksdomainpop"],
    "aby": ["aby", "archivebirthyear", "birth year", "archive.org birth year"],
    "wby": ["wby", "whoisbirthyear"],
    "acr": ["acr", "archivecrawlresults", "archive.org crawl results"],
    "tf": ["tf", "majestictf", "trustflow", "majestic tf"],
    "cf": ["cf", "majesticcf", "citationflow", "majestic cf"],
    "da": ["da", "mozda", "domainauthority", "moz da"],
}


def read_input(path: Path) -> list[dict]:
    """Devuelve lista de dicts con al menos 'domain' y, si estaban, las metricas del CSV."""
    text = path.read_text(encoding="utf-8", errors="replace")

    # .txt / lista plana
    if path.suffix.lower() in (".txt", ".list") or ("," not in text.split("\n")[0] and ";" not in text.split("\n")[0] and "\t" not in text.split("\n")[0]):
        rows = []
        seen = set()
        for line in text.splitlines():
            d = normalize_domain(line)
            if d and d not in seen:
                seen.add(d)
                rows.append({"domain": d})
        return rows

    # CSV / TSV — ExpiredDomains exporta con ; o , segun config
    sample = text[:8192]
    try:
        dialect = csv.Sniffer().sniff(sample, delimiters=",;\t|")
    except csv.Error:
        dialect = csv.excel

    reader = csv.DictReader(text.splitlines(), dialect=dialect)
    if not reader.fieldnames:
        raise SystemExit(f"No pude leer cabeceras de {path}")

    # mapea cabeceras reales -> campos canonicos
    lookup = {}
    for real in reader.fieldnames:
        if real is None:
            continue
        key = real.strip().lower().replace("_", "").replace("-", "")
        for canon, aliases in CSV_FIELD_MAP.items():
            if key in [a.replace(" ", "").replace("_", "") for a in aliases] or key == canon:
                lookup.setdefault(canon, real)

    if "domain" not in lookup:
        raise SystemExit(
            f"No encontre una columna de dominio en {path}.\n"
            f"Cabeceras detectadas: {reader.fieldnames}"
        )

    rows, seen = [], set()
    for r in reader:
        dom = normalize_domain(r.get(lookup["domain"], ""))
        if not dom or dom in seen:
            continue
        seen.add(dom)
        entry = {"domain": dom}
        for canon in ("bl", "dp", "aby", "wby", "acr", "tf", "cf", "da"):
            if canon in lookup:
                entry[f"csv_{canon}"] = _to_number(r.get(lookup[canon]))
        rows.append(entry)
    return rows


# --------------------------------------------------------------------------
# Paso 2 — Prefiltro local (gratis, sin red)
# --------------------------------------------------------------------------

def prefilter(rows: list[dict], cfg: dict) -> tuple[list[dict], list[dict]]:
    """Separa candidatos de descartes usando solo las columnas del CSV."""
    keep, drop = [], []
    for r in rows:
        flags = []
        bl, dp = r.get("csv_bl"), r.get("csv_dp")
        aby, acr = r.get("csv_aby"), r.get("csv_acr")
        tf, cf = r.get("csv_tf"), r.get("csv_cf")

        # Muchisimos backlinks desde casi ningun dominio = granja de enlaces
        if bl and dp is not None:
            ratio = bl / dp if dp > 0 else float("inf")
            r["bl_dp_ratio"] = round(ratio, 1) if ratio != float("inf") else None
            if ratio > cfg["max_bl_dp_ratio"]:
                flags.append(f"ratio BL/DP {'inf' if ratio == float('inf') else int(ratio)}")

        # Dominio demasiado nuevo: no hay historia que heredar
        if aby and aby > 0 and (CURRENT_YEAR - aby) < cfg["min_wayback_years"]:
            flags.append(f"ABY {int(aby)} muy reciente")

        # Nunca fue crawleado de verdad
        if acr is not None and acr < 10:
            flags.append(f"ACR {int(acr)}")

        # Citation Flow muy por encima de Trust Flow = perfil spameado
        if tf is not None and cf and cf > 0:
            if tf / cf < 0.34 and cf > 10:
                flags.append(f"TF/CF {tf / cf:.2f}")

        if flags:
            r["descarte"] = "; ".join(flags)
            drop.append(r)
        else:
            keep.append(r)
    return keep, drop


# --------------------------------------------------------------------------
# Paso 3 — Wayback CDX (gratis, sin API key)
# --------------------------------------------------------------------------

def wayback_probe(domain: str) -> dict:
    """
    Devuelve historial de capturas de la home.
    collapse=timestamp:6 -> una fila por mes, suficiente para medir actividad real.
    """
    params = {
        "url": domain,
        "output": "json",
        "fl": "timestamp",
        "collapse": "timestamp:6",
        "limit": "1000",
    }
    url = f"{CDX_ENDPOINT}?{urllib.parse.urlencode(params)}"
    try:
        raw = http_request(url, timeout=WAYBACK_TIMEOUT, retries=3)
    except RuntimeError as e:
        return {"ok": False, "error": str(e)[:120]}

    body = raw.decode("utf-8", "replace").strip()
    if not body:
        return {"ok": True, "months": 0, "years": 0, "first_year": None, "last_year": None}

    try:
        data = json.loads(body)
    except json.JSONDecodeError:
        return {"ok": False, "error": "respuesta CDX no es JSON"}

    stamps = [row[0] for row in data[1:] if row and row[0]]
    if not stamps:
        return {"ok": True, "months": 0, "years": 0, "first_year": None, "last_year": None}

    years = sorted({int(s[:4]) for s in stamps if len(s) >= 4})
    return {
        "ok": True,
        "months": len(stamps),
        "years": len(years),
        "first_year": years[0],
        "last_year": years[-1],
        "gap_years": CURRENT_YEAR - years[-1],
    }


def run_wayback(rows: list[dict], cache: Cache, workers: int) -> None:
    pending = [r for r in rows if cache.get("wb:" + r["domain"]) is None]
    log(f"[wayback] {len(rows)} dominios, {len(pending)} sin cachear")

    done = 0
    if pending:
        with ThreadPoolExecutor(max_workers=workers) as pool:
            futures = {pool.submit(wayback_probe, r["domain"]): r for r in pending}
            for fut in as_completed(futures):
                r = futures[fut]
                try:
                    res = fut.result()
                except Exception as e:  # red rara, no matar la corrida
                    res = {"ok": False, "error": str(e)[:120]}
                cache.set("wb:" + r["domain"], res)
                done += 1
                if done % 25 == 0 or done == len(pending):
                    log(f"[wayback] {done}/{len(pending)}")
        cache.flush()

    for r in rows:
        res = cache.get("wb:" + r["domain"]) or {}
        r["wb_months"] = res.get("months")
        r["wb_years"] = res.get("years")
        r["wb_first_year"] = res.get("first_year")
        r["wb_last_year"] = res.get("last_year")
        r["wb_gap"] = res.get("gap_years")
        if not res.get("ok"):
            r["wb_error"] = res.get("error")


def opr_filter(rows: list[dict], cfg: dict) -> tuple[list[dict], list[dict]]:
    """Descarta por autoridad antes de gastar 15s/dominio en Wayback."""
    keep, drop = [], []
    for r in rows:
        rd = r.get("ref_domains")
        if rd is None:  # sin dato: que siga y decida Wayback
            keep.append(r)
            continue
        flags = []
        if rd < cfg["min_ref_domains"]:
            flags.append(f"{int(rd)} dominios referentes")
        caida = r.get("opr_caida_pct")
        if isinstance(caida, (int, float)) and caida > cfg["max_caida_pct"]:
            flags.append(f"autoridad cayo {caida}% desde su pico")
        if flags:
            r["descarte"] = "; ".join(flags)
            drop.append(r)
        else:
            keep.append(r)
    return keep, drop


def wayback_filter(rows: list[dict], cfg: dict) -> tuple[list[dict], list[dict]]:
    keep, drop = [], []
    for r in rows:
        if r.get("wb_error"):
            keep.append(r)  # error de red no es culpa del dominio: que siga
            continue
        flags = []
        if (r.get("wb_years") or 0) < cfg["min_wayback_years"]:
            flags.append(f"solo {r.get('wb_years') or 0} anios en Wayback")
        if (r.get("wb_months") or 0) < cfg["min_wayback_months"]:
            flags.append(f"solo {r.get('wb_months') or 0} meses capturados")
        if r.get("wb_gap") is not None and r["wb_gap"] > cfg["max_last_seen_gap"]:
            flags.append(f"sin capturas hace {r['wb_gap']} anios")
        if flags:
            r["descarte"] = "; ".join(flags)
            drop.append(r)
        else:
            keep.append(r)
    return keep, drop


# --------------------------------------------------------------------------
# Paso 4 — OpenPageRank
# --------------------------------------------------------------------------

def opr_bulk(domains: list[str], api_key: str, include_history: bool) -> dict:
    payload = json.dumps({"domains": domains, "include_history": include_history}).encode()
    raw = http_request(
        OPR_ENDPOINT,
        data=payload,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        timeout=OPR_TIMEOUT,
        retries=4,
    )
    return json.loads(raw.decode("utf-8", "replace"))


def run_opr(rows: list[dict], api_key: str, cache: Cache, include_history: bool) -> None:
    pending = [r["domain"] for r in rows if cache.get("opr:" + r["domain"]) is None]
    log(f"[opr] {len(rows)} dominios, {len(pending)} sin cachear "
        f"({math.ceil(len(pending) / OPR_BATCH_SIZE)} requests)")

    for i in range(0, len(pending), OPR_BATCH_SIZE):
        batch = pending[i:i + OPR_BATCH_SIZE]
        try:
            resp = opr_bulk(batch, api_key, include_history)
        except RuntimeError as e:
            log(f"[opr] lote {i // OPR_BATCH_SIZE + 1} fallo: {e}")
            if "401" in str(e) or "403" in str(e):
                raise SystemExit("API key de OpenPageRank rechazada. Revisa OPR_API_KEY.")
            continue

        by_domain = {}
        for item in resp.get("results", []) or []:
            dom = normalize_domain(item.get("domain", "")) or item.get("domain", "").lower()
            by_domain[dom] = item

        for d in batch:
            cache.set("opr:" + d, by_domain.get(d, {"_missing": True}))

        log(f"[opr] {min(i + OPR_BATCH_SIZE, len(pending))}/{len(pending)}")
        time.sleep(0.5)  # cortesia con la API

    cache.flush()

    for r in rows:
        item = cache.get("opr:" + r["domain"]) or {}
        if item.get("_missing"):
            continue
        r["opr"] = item.get("open_page_rank")
        r["opr_rank"] = item.get("rank")
        r["ref_domains"] = item.get("referring_domains")

        hist = item.get("history") or []
        scores = []
        for h in hist:
            if isinstance(h, dict):
                v = h.get("open_page_rank", h.get("value"))
                if isinstance(v, (int, float)):
                    scores.append(float(v))
            elif isinstance(h, (int, float)):
                scores.append(float(h))
        if scores:
            peak = max(scores)
            now = r["opr"] if isinstance(r.get("opr"), (int, float)) else scores[-1]
            r["opr_peak"] = round(peak, 2)
            if peak > 0:
                caida = 1 - (now / peak)
                r["opr_caida_pct"] = round(caida * 100, 1)


# --------------------------------------------------------------------------
# Paso 5 — Scoring
# --------------------------------------------------------------------------

def _provisional_score(r: dict) -> float:
    """Ranking rapido pre-Wayback, para decidir a quien vale la pena verificar."""
    s = 0.0
    rd = r.get("ref_domains") or r.get("csv_dp") or 0
    if rd > 0:
        s += RD_COEF * math.log10(rd + 1)
    opr = r.get("opr")
    if isinstance(opr, (int, float)):
        s += opr * 2.5
    aby = r.get("csv_aby")
    if aby and aby > 1990:
        s += min(15.0, (CURRENT_YEAR - aby) * 0.8)
    return s


def score_row(r: dict, cfg: dict) -> None:
    """Score 0-100. Prioriza dominios referentes reales e historia larga, no backlinks brutos."""
    # Se puntua solo sobre las señales disponibles y se normaliza a 0-100.
    # Asi una corrida con --no-opr no castiga a todos los dominios por igual.
    got = 0.0        # puntos obtenidos
    posible = 0.0    # puntos que se podian obtener con los datos que hay
    notes = []

    # Dominios referentes (peso principal, escala log)
    rd = r.get("ref_domains")
    if isinstance(rd, (int, float)) and rd > 0:
        got += min(40.0, RD_COEF * math.log10(rd + 1))
        posible += 40.0
    elif r.get("csv_dp"):
        got += min(40.0, RD_COEF * math.log10(r["csv_dp"] + 1))
        posible += 40.0
        notes.append("sin datos OPR, uso DP del CSV")

    # Autoridad OpenPageRank (0-10 -> 0-25)
    opr = r.get("opr")
    if isinstance(opr, (int, float)):
        got += min(25.0, opr * 2.5)
        posible += 25.0

    # Historial en Wayback
    if r.get("wb_years") is not None:
        got += min(20.0, (r.get("wb_years") or 0) * YEARS_COEF)
        posible += 20.0
        got += min(10.0, (r.get("wb_months") or 0) / 12.0)
        posible += 10.0

        gap = r.get("wb_gap")
        if isinstance(gap, int):
            posible += 5.0
            if gap <= 2:
                got += 5.0
            elif gap >= 8:
                notes.append(f"abandonado hace {gap} anios")

    if posible == 0:
        r["score"] = 0.0
        r["veredicto"] = "SIN DATOS"
        r["notas"] = "no hubo ninguna señal disponible para puntuar"
        r["wayback_url"] = f"https://web.archive.org/web/*/{r['domain']}"
        return

    score = 100.0 * got / posible
    if posible < 60:
        notes.append(f"score parcial: solo {int(posible)} de 100 puntos evaluables")

    # Penalizaciones por spam (sobre la escala ya normalizada)
    ratio = r.get("bl_dp_ratio")
    if isinstance(ratio, (int, float)) and ratio > 150:
        score -= 15
        notes.append(f"ratio BL/DP alto ({int(ratio)})")

    # Penalizacion proporcional: perder 50% de autoridad es un tropiezo,
    # perder 80% suele ser penalizacion de Google o desindexacion.
    caida = r.get("opr_caida_pct")
    techo = None
    if isinstance(caida, (int, float)) and caida > 50:
        score -= (caida - 50) * 0.6
        notes.append(f"la autoridad cayo {caida}% desde su pico (posible penalizacion)")
        if caida > 70:
            techo = "REVISAR"   # por bueno que parezca, no se recomienda a ciegas

    if isinstance(rd, (int, float)) and rd < cfg["min_ref_domains"]:
        score -= 20
        notes.append(f"solo {int(rd)} dominios referentes")

    r["score"] = round(max(0.0, min(100.0, score)), 1)
    r["notas"] = "; ".join(notes)

    if r["score"] >= 60:
        r["veredicto"] = "COMPRAR"
    elif r["score"] >= 38:
        r["veredicto"] = "REVISAR"
    else:
        r["veredicto"] = "DESCARTAR"

    # Un techo por bandera roja gana sobre el score numerico
    if techo == "REVISAR" and r["veredicto"] == "COMPRAR":
        r["veredicto"] = "REVISAR"

    r["wayback_url"] = f"https://web.archive.org/web/*/{r['domain']}"


# --------------------------------------------------------------------------
# Salida
# --------------------------------------------------------------------------

OUT_COLUMNS = [
    "domain", "score", "veredicto", "opr", "ref_domains", "opr_rank",
    "opr_peak", "opr_caida_pct",
    "wb_first_year", "wb_last_year", "wb_years", "wb_months", "wb_gap",
    "csv_bl", "csv_dp", "bl_dp_ratio", "csv_tf", "csv_cf", "csv_da",
    "notas", "notas_extra", "descarte", "wayback_url",
]


def write_csv(rows: list[dict], path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=OUT_COLUMNS, extrasaction="ignore")
        w.writeheader()
        for r in rows:
            w.writerow(r)


# --------------------------------------------------------------------------
# main
# --------------------------------------------------------------------------

def main() -> int:
    p = argparse.ArgumentParser(
        description="Enriquece listas de dominios expirados con autoridad y historial reales.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    p.add_argument("entrada", type=Path, help="CSV de ExpiredDomains.net o .txt con un dominio por linea")
    p.add_argument("-o", "--salida", type=Path, default=Path("resultado.csv"))
    p.add_argument("--descartes", type=Path, help="CSV opcional con los dominios filtrados y el motivo")
    p.add_argument("--cache", type=Path, default=Path(".domhunter_cache.json"))
    p.add_argument("--no-opr", action="store_true", help="Saltea OpenPageRank (no necesita API key)")
    p.add_argument("--no-wayback", action="store_true", help="Saltea la verificacion de historial (mucho mas rapido)")
    p.add_argument("--no-history", action="store_true", help="No pide historico a OPR (respuestas mas chicas)")
    p.add_argument("--no-prefilter", action="store_true", help="Manda todo a las APIs sin filtrar antes")
    p.add_argument("--max-wayback", type=int, default=300,
                   help="Cuantos dominios verificar en Wayback como maximo (default 300; ~15s c/u)")
    p.add_argument("--limit", type=int, help="Procesa solo los primeros N dominios")
    p.add_argument("--workers", type=int, default=WAYBACK_WORKERS, help=f"Hilos para Wayback (default {WAYBACK_WORKERS})")
    p.add_argument("--min-anios", type=int, default=DEFAULTS["min_wayback_years"])
    p.add_argument("--min-meses", type=int, default=DEFAULTS["min_wayback_months"])
    p.add_argument("--max-abandono", type=int, default=DEFAULTS["max_last_seen_gap"])
    p.add_argument("--min-ref-domains", type=int, default=DEFAULTS["min_ref_domains"])
    p.add_argument("--max-bl-dp", type=float, default=DEFAULTS["max_bl_dp_ratio"])
    p.add_argument("--max-caida", type=float, default=DEFAULTS["max_caida_pct"],
                   help="%% de caida de autoridad desde el pico que dispara descarte")
    args = p.parse_args()

    cfg = {
        "min_wayback_years": args.min_anios,
        "min_wayback_months": args.min_meses,
        "max_last_seen_gap": args.max_abandono,
        "min_ref_domains": args.min_ref_domains,
        "max_bl_dp_ratio": args.max_bl_dp,
        "max_caida_pct": args.max_caida,
    }

    if not args.entrada.exists():
        raise SystemExit(f"No existe: {args.entrada}")

    api_key = os.environ.get("OPR_API_KEY", "").strip()
    if not args.no_opr and not api_key:
        raise SystemExit(
            "Falta OPR_API_KEY.\n"
            "  Sacala gratis en https://openpagerank.keywordseverywhere.com/ (30.000 dominios/mes)\n"
            "  export OPR_API_KEY='...'\n"
            "O corre con --no-opr para usar solo Wayback."
        )

    rows = read_input(args.entrada)
    if args.limit:
        rows = rows[:args.limit]
    log(f"[entrada] {len(rows)} dominios unicos desde {args.entrada.name}")
    if not rows:
        raise SystemExit("La entrada no tiene dominios validos.")

    descartes = []

    if not args.no_prefilter:
        rows, dropped = prefilter(rows, cfg)
        descartes += dropped
        log(f"[prefiltro] descarto {len(dropped)}, quedan {len(rows)}")

    if not rows:
        log("El prefiltro descarto todo. Proba con --no-prefilter o umbrales mas laxos.")
    else:
        cache = Cache(args.cache)

        # OPR primero: es barato (100 dominios por request) y corta la lista fuerte
        if not args.no_opr:
            run_opr(rows, api_key, cache, include_history=not args.no_history)
            rows, dropped = opr_filter(rows, cfg)
            descartes += dropped
            log(f"[opr] descarto {len(dropped)}, quedan {len(rows)}")

        # Wayback al final: ~15s por dominio, solo sobre los sobrevivientes
        if rows and not args.no_wayback:
            if len(rows) > args.max_wayback:
                rows_sorted = sorted(rows, key=_provisional_score, reverse=True)
                a_verificar = rows_sorted[:args.max_wayback]
                resto = rows_sorted[args.max_wayback:]
                log(f"[wayback] limitando a los {args.max_wayback} mejores "
                    f"(de {len(rows)}); {len(resto)} quedan sin verificar historial. "
                    f"Subi --max-wayback si los queres todos.")
                for r in resto:
                    r["notas_extra"] = "historial Wayback no verificado (--max-wayback)"
            else:
                a_verificar, resto = rows, []

            eta = len(a_verificar) * 15 / max(1, args.workers) / 60
            log(f"[wayback] ~{eta:.0f} min estimados para {len(a_verificar)} dominios")

            run_wayback(a_verificar, cache, args.workers)
            a_verificar, dropped = wayback_filter(a_verificar, cfg)
            descartes += dropped
            log(f"[wayback] descarto {len(dropped)}, quedan {len(a_verificar)}")
            rows = a_verificar + resto

        cache.flush()

    for r in rows:
        score_row(r, cfg)
    rows.sort(key=lambda r: r.get("score", 0), reverse=True)

    write_csv(rows, args.salida)
    log(f"\n[salida] {len(rows)} dominios -> {args.salida}")

    if args.descartes and descartes:
        write_csv(descartes, args.descartes)
        log(f"[salida] {len(descartes)} descartes -> {args.descartes}")

    # Resumen
    comprar = [r for r in rows if r.get("veredicto") == "COMPRAR"]
    revisar = [r for r in rows if r.get("veredicto") == "REVISAR"]
    log(f"\n  COMPRAR   {len(comprar)}")
    log(f"  REVISAR   {len(revisar)}")
    log(f"  DESCARTAR {len(rows) - len(comprar) - len(revisar)}")

    if comprar or revisar:
        log("\n  Top 10:")
        for r in rows[:10]:
            log(f"    {r['score']:>5}  {r['domain'][:38]:<38} "
                f"rd={r.get('ref_domains') or '-'} opr={r.get('opr') or '-'} "
                f"anios={r.get('wb_years') or '-'}")

    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        log("\nInterrumpido. El cache quedo guardado, podes retomar re-corriendo el mismo comando.")
        sys.exit(130)
