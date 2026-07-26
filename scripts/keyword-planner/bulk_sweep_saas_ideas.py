#!/usr/bin/env python3
"""Bulk keyword sweep for SaaS/micro-tool opportunity discovery (US/English),
via Google Ads Keyword Planner.

Goal: surface "I need to solve X and don't have good software for it" demand
across dozens of verticals. Each seed group mixes a plain-English pain point
with explicit tool-intent modifiers (software, app, template, tracker,
generator, CRM, scheduling, management, alternative...) so Google's related-
keyword expansion leans commercial, not purely informational.

Runs GenerateKeywordIdeas once per seed group, captures ALL ideas returned
(no top-N truncation), dedupes across groups (keeping which verticals each
keyword showed up under), and writes one big CSV.

Does not touch kwp.py, bulk_sweep_usatoydeals.py, or google-ads.yaml. Reuses
the same credentials file already set up for the account.

Usage:
    cd scripts/keyword-planner
    .venv/bin/python bulk_sweep_saas_ideas.py
    .venv/bin/python bulk_sweep_saas_ideas.py --out /path/to/output.csv
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
# Each group mixes a real-world pain point with tool-intent modifiers.
SEED_GROUPS = [
    ("smb-invoicing", ["invoicing software for small business", "quote and invoice template", "estimate software for contractors"]),
    ("smb-scheduling", ["appointment scheduling software", "job scheduling app for small business", "dispatch software field service"]),
    ("smb-proposals", ["proposal software for freelancers", "contract template generator", "client proposal template"]),
    ("freelance-time", ["freelance time tracking app", "billable hours tracker", "time tracking software for consultants"]),
    ("freelance-client", ["client management software for freelancers", "freelancer CRM", "client portal software"]),
    ("landscaping-biz", ["lawn care scheduling software", "landscaping business software", "lawn care quote template"]),
    ("cleaning-biz", ["cleaning business scheduling software", "maid service management software", "cleaning business app"]),
    ("hvac-plumbing-biz", ["HVAC business software", "plumbing dispatch software", "field service management software"]),
    ("handyman-biz", ["handyman scheduling app", "handyman business software", "home repair quote software"]),
    ("real-estate-pm", ["rental property management software", "landlord software", "tenant screening software"]),
    ("real-estate-agent", ["real estate CRM", "real estate lead tracking software", "real estate transaction management software"]),
    ("vacation-rental", ["airbnb management software", "vacation rental pricing tool", "short term rental cleaning schedule software"]),
    ("personal-finance", ["budgeting app", "debt payoff tracker", "subscription tracker app", "net worth tracker"]),
    ("small-biz-accounting", ["mileage tracker app", "small business expense tracker", "quarterly tax calculator small business"]),
    ("legal-smb", ["LLC formation software", "small business contract templates", "compliance checklist software"]),
    ("estate-planning", ["will generator online", "estate planning software", "asset inventory tracker"]),
    ("hr-recruiting-smb", ["applicant tracking system for small business", "employee onboarding software", "PTO tracking software"]),
    ("ecommerce-returns", ["returns management software for small business", "ecommerce inventory management software", "review management software small business"]),
    ("etsy-seller", ["etsy seller tools", "etsy shop management software", "etsy pricing calculator"]),
    ("amazon-fba", ["amazon FBA software", "amazon seller inventory tool", "amazon repricing software"]),
    ("content-creator", ["content calendar software", "social media scheduling tool for creators", "caption generator app"]),
    ("newsletter-course", ["course creator software", "newsletter platform for creators", "cohort course software"]),
    ("podcast-production", ["podcast scheduling software", "podcast guest management software", "podcast show notes generator"]),
    ("fitness-tracking", ["workout tracker app", "meal planning app", "macro tracking app"]),
    ("personal-trainer-biz", ["personal trainer scheduling software", "personal trainer client management app", "gym class scheduling software"]),
    ("tutoring-education", ["tutoring business software", "lesson planning software", "student progress tracking software"]),
    ("music-teacher-biz", ["music lesson scheduling software", "music studio management software"]),
    ("event-planning", ["wedding planning app", "wedding budget tracker", "event guest list software"]),
    ("wedding-vendor", ["photography client gallery software", "photography business software", "DJ booking software"]),
    ("restaurant-ops", ["restaurant inventory management software", "menu planning software", "restaurant reservation software small business"]),
    ("food-truck-biz", ["food truck scheduling software", "farmers market vendor software"]),
    ("nonprofit-church", ["church management software", "volunteer scheduling software", "donor management software small nonprofit"]),
    ("pet-services-biz", ["dog walking scheduling app", "pet grooming booking software", "pet boarding management software"]),
    ("daycare-childcare", ["daycare management software", "childcare scheduling software", "preschool management app"]),
    ("automotive-shop", ["auto repair shop software", "vehicle maintenance tracker app", "car repair estimate software"]),
    ("moving-relocation", ["moving cost estimator", "moving checklist app", "relocation planning software"]),
    ("caregiver-coordination", ["caregiver scheduling app", "family caregiver coordination app", "medication tracker app for caregivers"]),
    ("coparenting", ["co-parenting app", "custody schedule app", "shared expense tracker for parents"]),
    ("job-search", ["resume builder software", "job application tracker", "interview prep app"]),
    ("insurance-shopping", ["insurance policy comparison tool", "insurance renewal tracker"]),
    ("insurance-agent-biz", ["insurance agent CRM", "insurance agency management software"]),
    ("financial-advisor-biz", ["financial advisor client software", "financial planning software for advisors"]),
    ("construction-pm", ["construction project management software", "punch list software", "change order software construction"]),
    ("home-renovation", ["home renovation budget tracker", "contractor comparison tool", "remodel cost estimator app"]),
    ("salon-spa-biz", ["salon booking software", "spa scheduling software", "salon client management app"]),
    ("martial-arts-biz", ["martial arts studio management software", "gym membership management software"]),
    ("notary-signing", ["notary scheduling software", "signing agent management software"]),
    ("virtual-assistant-agency", ["virtual assistant client management software", "agency client management software"]),
    ("genealogy", ["family tree builder software", "genealogy research software"]),
    ("travel-planning", ["trip itinerary planner app", "travel budget tracker app", "packing list app"]),
    ("subscription-box-biz", ["subscription box management software", "small batch inventory management software"]),
    ("personal-chef-biz", ["personal chef business software", "meal prep business software"]),
    ("landlord-tools", ["rent collection software", "maintenance request software for landlords"]),
    ("productivity-habit", ["habit tracker app", "goal tracking app", "personal productivity software"]),
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
    ap.add_argument("--out", default=str(BASE / "saas_ideas_keyword_sweep.csv"))
    ap.add_argument("--sleep", type=float, default=1.0, help="seconds between API calls")
    args = ap.parse_args()

    client = build_client()

    all_rows = {}
    keyword_verticals = {}

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
