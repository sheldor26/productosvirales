#!/usr/bin/env python3
"""Filter/score the raw SaaS keyword sweep to cut noise and surface real opportunities."""
import csv
import re
from collections import defaultdict
from pathlib import Path

BASE = Path(__file__).resolve().parent
IN_PATH = BASE / "saas_ideas_keyword_sweep.csv"
OUT_PATH = BASE / "saas_shortlist.csv"
OUT_CLUSTER_PATH = BASE / "saas_by_vertical.csv"

TOOL_INTENT = re.compile(
    r"\b(software|app|tool|template|tracker|tracking|generator|calculator|"
    r"alternative|alternatives|crm|scheduling|scheduler|management|manager|"
    r"planner|planning|checklist|platform|system|automation|automate|"
    r" vs |online|builder|dashboard|invoicing|booking)\b",
    re.IGNORECASE,
)

# Pure informational / navigational / off-topic noise patterns to drop.
NOISE = re.compile(
    r"\b(jobs?|salary|hiring|resume examples|cover letter|degree|certification|"
    r"course free|definition|meaning|wikipedia|near me|reviews? of|"
    r"walmart|amazon\.com|target\.com|costco|ebay)\b",
    re.IGNORECASE,
)

# Big obvious incumbents — keep (useful as "alternative to X" signal) only if
# paired with alternative/vs/compare, else treat as brand-navigational noise.
BRANDS = re.compile(
    r"\b(quickbooks|calendly|notion|salesforce|hubspot|mint|monday\.com|asana|"
    r"trello|square|shopify|wix|squarespace|mindbody|clover|toast pos|"
    r"housecall pro|jobber|servicetitan|acuity)\b",
    re.IGNORECASE,
)
BRAND_OK = re.compile(r"\b(alternative|vs|compare|like)\b", re.IGNORECASE)

MIN_VOLUME = 300
MIN_CPC = 1.50


def main():
    rows = []
    with open(IN_PATH, encoding="utf-8") as f:
        for r in csv.DictReader(f):
            r["avg_monthly_searches"] = int(r["avg_monthly_searches"])
            r["high_top_bid_usd"] = float(r["high_top_bid_usd"] or 0)
            r["competition_index"] = int(r["competition_index"] or 0)
            rows.append(r)

    shortlist = []
    for r in rows:
        kw = r["keyword"]
        if NOISE.search(kw):
            continue
        if BRANDS.search(kw) and not BRAND_OK.search(kw):
            continue
        if not TOOL_INTENT.search(kw):
            continue
        if r["avg_monthly_searches"] < MIN_VOLUME:
            continue
        if r["high_top_bid_usd"] < MIN_CPC:
            continue
        shortlist.append(r)

    # score: volume weighted by CPC (commercial value), dampened by competition
    def score(r):
        comp_penalty = 1 - (r["competition_index"] / 200.0)  # 0..0.5 penalty range
        return r["avg_monthly_searches"] * r["high_top_bid_usd"] * max(comp_penalty, 0.3)

    shortlist.sort(key=score, reverse=True)

    with open(OUT_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=[
            "keyword", "avg_monthly_searches", "competition", "competition_index",
            "low_top_bid_usd", "high_top_bid_usd", "verticals", "score",
        ])
        writer.writeheader()
        for r in shortlist:
            writer.writerow({**r, "score": round(score(r), 1)})

    print(f"Total raw: {len(rows)}")
    print(f"Shortlist (tool-intent, vol>={MIN_VOLUME}, cpc>=${MIN_CPC}): {len(shortlist)}")
    print(f"Saved shortlist to: {OUT_PATH}")

    # cluster by vertical: sum score, count keywords, top keyword
    by_vertical = defaultdict(lambda: {"count": 0, "total_score": 0.0, "top": None, "top_score": -1})
    for r in shortlist:
        s = score(r)
        for v in r["verticals"].split(", "):
            entry = by_vertical[v]
            entry["count"] += 1
            entry["total_score"] += s
            if s > entry["top_score"]:
                entry["top_score"] = s
                entry["top"] = r["keyword"]

    cluster_rows = sorted(
        ({"vertical": v, **d} for v, d in by_vertical.items()),
        key=lambda x: x["total_score"], reverse=True,
    )
    with open(OUT_CLUSTER_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["vertical", "count", "total_score", "top", "top_score"])
        writer.writeheader()
        for row in cluster_rows:
            row["total_score"] = round(row["total_score"], 1)
            row["top_score"] = round(row["top_score"], 1)
            writer.writerow(row)

    print(f"Saved vertical clusters to: {OUT_CLUSTER_PATH}")
    print("\nTop 20 verticals by total opportunity score:")
    for row in cluster_rows[:20]:
        print(f"  {row['vertical']:28} n={row['count']:4}  score={row['total_score']:>10,.0f}  top='{row['top']}'")


if __name__ == "__main__":
    main()
