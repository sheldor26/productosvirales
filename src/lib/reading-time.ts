import type { Guide, GuideSection } from "./types";

const WORDS_PER_MINUTE = 220;

function countWords(text: string | undefined): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function sectionWords(section: GuideSection): number {
  let total = 0;
  if (section.title) total += countWords(section.title);
  if (section.content) total += countWords(section.content);
  if (section.headers) total += section.headers.reduce((n, h) => n + countWords(h), 0);
  if (section.rows) total += section.rows.reduce((n, row) => n + row.reduce((m, c) => m + countWords(c), 0), 0);
  if (Array.isArray(section.items)) {
    for (const item of section.items) {
      if (typeof item === "string") total += countWords(item);
      else if (item && "label" in item) total += countWords(item.label);
    }
  }
  if (section.card) {
    total += countWords(section.card.heading);
    total += section.card.paragraphs.reduce((n, p) => n + countWords(p), 0);
  }
  return total;
}

export function calcReadingTime(guide: Guide): number {
  if (guide.readingTime && guide.readingTime > 0) return guide.readingTime;

  let words = countWords(guide.h1);
  words += guide.intro.reduce((n, p) => n + countWords(p), 0);
  words += guide.sections.reduce((n, s) => n + sectionWords(s), 0);
  if (guide.faq) {
    words += guide.faq.reduce((n, f) => n + countWords(f.question) + countWords(f.answer), 0);
  }

  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
