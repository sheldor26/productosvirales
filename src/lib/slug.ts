import type { Guide, GuideSection } from "./types";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Return a copy of the guide with deterministic IDs on every H2/H3 section. */
export function ensureSectionIds(guide: Guide): Guide {
  const seen = new Set<string>();
  const sections: GuideSection[] = guide.sections.map((s) => {
    if (s.type !== "h2" && s.type !== "h3") return s;
    if (s.id) {
      seen.add(s.id);
      return s;
    }
    let id = slugify(s.title || "");
    if (!id) return s;
    let unique = id;
    let i = 2;
    while (seen.has(unique)) {
      unique = `${id}-${i++}`;
    }
    seen.add(unique);
    return { ...s, id: unique };
  });
  return { ...guide, sections };
}

/** Get the list of top-level H2 anchors for TOC rendering. */
export function getTocItems(guide: Guide): Array<{ id: string; title: string }> {
  const withIds = ensureSectionIds(guide);
  return withIds.sections
    .filter((s) => s.type === "h2" && s.id && s.title)
    .map((s) => ({ id: s.id!, title: s.title! }));
}
