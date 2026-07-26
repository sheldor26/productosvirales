#!/usr/bin/env python3
"""Bulk keyword sweep for usatoydeals.com (US/English), via Google Ads Keyword Planner.

Runs GenerateKeywordIdeas once per seed group (each group = a handful of tightly
related seed terms for one toy vertical/category), captures ALL ideas returned
(no top-N truncation), dedupes across groups, and writes one big CSV that opens
directly in Excel.

Does not touch kwp.py (shared cross-project script) or google-ads.yaml. Reuses
the same credentials file already set up for the account.

Usage:
    cd scripts/keyword-planner
    .venv/bin/python bulk_sweep_usatoydeals.py
    .venv/bin/python bulk_sweep_usatoydeals.py --out /path/to/output.csv
"""
import argparse
import csv
import sys
import time
from pathlib import Path

BASE = Path(__file__).resolve().parent
YAML = BASE / "google-ads.yaml"

GEO_US = "geoTargetConstants/2840"   # United States
LANG_EN = "languageConstants/1000"   # English

# Seed groups: (vertical label, [seed keywords]).
# Grouped tightly so Google Ads returns genuinely related ideas per call,
# not a diluted mix. Covers every category in categories.ts plus the new
# dog/cat/infant verticals from the 2026-07-13 sourcing research.
SEED_GROUPS = [
    ("building-sets", ["building blocks", "building toys for kids", "construction toy set", "stacking blocks"]),
    ("board-games", ["family board games", "party dice games", "board games for adults", "cooperative board games"]),
    ("trading-cards", ["trading card game", "collectible card game", "kids trading cards", "card game storage"]),
    ("video-games", ["kids video games", "educational video games", "gaming toys for kids"]),
    ("educational", ["educational toys", "STEM toys", "learning toys for toddlers", "STEM kits for kids"]),
    ("outdoor", ["outdoor toys for kids", "backyard toys", "water toys for kids", "sand toys"]),
    ("dolls", ["dolls for girls", "plush toys", "stuffed animals", "collectible dolls"]),
    ("premium-plush", ["soft plush toys", "cute stuffed animals", "plush pillow"]),
    ("action-figures", ["action figures for kids", "superhero action figures", "collectible action figures"]),
    ("puzzles", ["puzzles for kids", "wooden puzzles", "jigsaw puzzles for adults", "brain teaser puzzles", "3d puzzle model kit"]),
    ("arts-crafts", ["arts and crafts for kids", "craft kits for kids", "drawing toys for kids", "kids paint set"]),
    ("montessori", ["montessori toys", "montessori toys by age", "wooden montessori toys"]),
    ("fidget-sensory", ["fidget toys", "sensory toys for kids", "stress relief toys", "adhd fidget toys"]),
    ("travel", ["travel toys for kids", "car toys for road trips", "travel games for kids"]),
    ("pet-toys-dog", ["dog toys", "durable dog toys", "puppy toys", "interactive dog toys", "snuffle mat", "dog puzzle toy"]),
    ("pet-toys-cat", ["cat toys", "interactive cat toys", "kitten toys", "catnip toys for cats", "cat kicker toy"]),
    ("cameras", ["kids camera", "toy camera for kids", "kids digital camera"]),
    ("play-tents", ["kids play tent", "pop up play tent", "teepee tent for kids"]),
    ("infant-newborn", ["infant toys", "newborn toys", "baby sensory toys", "tummy time toys"]),
    ("novelty-gag", ["prank toys", "gag gifts", "novelty toys"]),
    ("bath-toys", ["bath toys for toddlers", "kids bath toys"]),
    ("science-kits", ["science kits for kids", "kids microscope"]),
    ("gift-guides", ["best gifts for kids", "gift ideas for toddlers", "unique kids gifts"]),
]


def build_client():
    if not YAML.exists():
        sys.exit(f"Falta {YAML}.")
    from google.ads.googleads.client import GoogleAdsClient
    return GoogleAdsClient.load_from_storage(str(YAML))


def fetch_all_ideas(client, seeds, geo=GEO_US, lang=LANG_EN):
    svc = client.get_service("KeywordPlanIdeaService")
    req = client.get_type("GenerateKeywordIdeasRequest")
    req.customer_id = str(client.login_customer_id)
    req.language = lang
    req.geo_target_constants.append(geo)
    req.include_adult_keywords = False
    req.keyword_plan_network = client.enums.KeywordPlanNetworkEnum.GOOGLE_SEARCH
    req.keyword_seed.keywords.extend(seeds)

    from google.ads.googleads.errors import GoogleAdsException
    try:
        resp = svc.generate_keyword_ideas(request=req)
    except GoogleAdsException as ex:
        msgs = "; ".join(e.message for e in ex.failure.errors)
        print(f"  ERROR: {msgs} (request_id={ex.request_id})", file=sys.stderr)
        return []

    rows = []
    for idea in resp:
        m = idea.keyword_idea_metrics
        rows.append({
            "keyword": idea.text,
            "avg_monthly_searches": m.avg_monthly_searches or 0,
            "competition": m.competition.name if m.competition else "",
            "competition_index": m.competition_index or 0,
            "low_top_bid": round((m.low_top_of_page_bid_micros or 0) / 1e6, 2),
            "high_top_bid": round((m.high_top_of_page_bid_micros or 0) / 1e6, 2),
        })
    return rows


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=str(BASE / "usatoydeals_keyword_sweep.csv"))
    ap.add_argument("--sleep", type=float, default=1.0, help="seconds between API calls")
    args = ap.parse_args()

    client = build_client()

    all_rows = {}  # keyword (lowercased) -> best row (first vertical it appeared in, kept)
    keyword_verticals = {}  # keyword -> set of verticals it showed up under

    for i, (vertical, seeds) in enumerate(SEED_GROUPS, 1):
        print(f"[{i}/{len(SEED_GROUPS)}] {vertical}: {seeds}", file=sys.stderr)
        rows = fetch_all_ideas(client, seeds)
        print(f"  -> {len(rows)} ideas", file=sys.stderr)
        for r in rows:
            key = r["keyword"].lower().strip()
            keyword_verticals.setdefault(key, set()).add(vertical)
            if key not in all_rows or r["avg_monthly_searches"] > all_rows[key]["avg_monthly_searches"]:
                all_rows[key] = r
        time.sleep(args.sleep)

    final = []
    for key, r in all_rows.items():
        final.append({
            "keyword": r["keyword"],
            "avg_monthly_searches": r["avg_monthly_searches"],
            "competition": r["competition"],
            "competition_index": r["competition_index"],
            "low_top_bid_usd": r["low_top_bid"],
            "high_top_bid_usd": r["high_top_bid"],
            "verticals": ", ".join(sorted(keyword_verticals[key])),
        })
    final.sort(key=lambda r: r["avg_monthly_searches"], reverse=True)

    out_path = Path(args.out)
    with open(out_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=[
            "keyword", "avg_monthly_searches", "competition", "competition_index",
            "low_top_bid_usd", "high_top_bid_usd", "verticals",
        ])
        writer.writeheader()
        writer.writerows(final)

    print(f"\nTotal unique keywords: {len(final)}", file=sys.stderr)
    print(f"Saved to: {out_path}", file=sys.stderr)


if __name__ == "__main__":
    main()
