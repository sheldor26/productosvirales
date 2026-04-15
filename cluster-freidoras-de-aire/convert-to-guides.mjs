#!/usr/bin/env node
/**
 * convert-to-guides.mjs
 * Converts cluster-freidoras-de-aire .md files to Guide{} TypeScript objects
 * and appends them to src/data/guides.ts
 *
 * Usage:
 *   node cluster-freidoras-de-aire/convert-to-guides.mjs
 *
 * Run from the project root (productosvirales/).
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "fs";
import { join, dirname, basename } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Strip markdown bold/italic markers: **text** → text, *text* → text */
function stripFormatting(text) {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .trim();
}

/** Extract inline [text](url) from a list item like "- [text](url): description"
 *  Returns { label, href } or null */
function extractLink(line) {
  const m = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
  if (!m) return null;
  return { label: m[1].trim(), href: m[2].trim() };
}

/** Parse YAML frontmatter from raw file content.
 *  Extracts known fields with simple line-by-line parsing. */
function parseFrontmatter(raw) {
  const fmMatch = raw.match(/^---\n([\s\S]+?)\n---/);
  if (!fmMatch) return {};
  const yaml = fmMatch[1];
  const data = {};

  // slug
  const slugM = yaml.match(/^slug:\s*["']?([^"'\n]+)["']?/m);
  if (slugM) data.slug = slugM[1].trim();

  // title
  const titleM = yaml.match(/^title:\s*["'](.+)["']/m);
  if (titleM) data.title = titleM[1].trim();

  // description
  const descM = yaml.match(/^description:\s*["'](.+)["']/m);
  if (descM) data.description = descM[1].trim();

  // publishDate
  const pubM = yaml.match(/^publishDate:\s*["']?(\d{4}-\d{2}-\d{2})["']?/m);
  if (pubM) data.publishDate = pubM[1].trim();

  // keywords.primary (indented under keywords:)
  const kwM = yaml.match(/primary:\s*["']?([^"'\n]+)["']?/m);
  if (kwM) data.primaryKeyword = kwM[1].trim();

  // featuredImage
  const imgM = yaml.match(/^featuredImage:\s*["']?([^"'\n]+)["']?/m);
  if (imgM) data.featuredImage = imgM[1].trim();

  return data;
}

/** Extract body (everything after frontmatter) */
function extractBody(raw) {
  return raw.replace(/^---\n[\s\S]+?\n---\n/, "");
}

// ─── Markdown → Guide sections parser ────────────────────────────────────────

/**
 * Parses the markdown body into:
 *   intro: string[]         - paragraphs before first ##
 *   sections: GuideSection[]
 *   faq: { question, answer }[]
 *   internalLinks: { label, href }[]
 *   h1: string              - from # heading
 *   affiliateCta: { label, href } | null
 */
function parseBody(body) {
  const lines = body.split("\n");

  const intro = [];
  const sections = [];
  const faq = [];
  const internalLinks = [];
  let h1 = "";
  let affiliateCta = null;
  let heroImage = null;

  // State: "before_h1" | "intro" | "sections" | "faq" | "internal_links"
  let state = "before_h1";

  // Buffers
  let paraBuffer = [];
  let listBuffer = [];
  let tableHeaders = null;
  let tableRows = [];
  let inTable = false;
  let currentFaqQ = null;
  let faqAnswerBuffer = [];

  function flushPara(targetArray) {
    if (paraBuffer.length > 0) {
      const text = paraBuffer.join(" ").trim();
      if (text) targetArray.push(text);
      paraBuffer = [];
    }
  }

  function flushList() {
    if (listBuffer.length > 0) {
      sections.push({ type: "list", items: [...listBuffer] });
      listBuffer = [];
    }
  }

  function flushTable() {
    if (tableHeaders && tableRows.length > 0) {
      sections.push({ type: "table", headers: tableHeaders, rows: tableRows });
    }
    tableHeaders = null;
    tableRows = [];
    inTable = false;
  }

  function flushFaqAnswer() {
    if (currentFaqQ && faqAnswerBuffer.length > 0) {
      faq.push({
        question: currentFaqQ,
        answer: faqAnswerBuffer.join(" ").trim(),
      });
      currentFaqQ = null;
      faqAnswerBuffer = [];
    }
  }

  function flushAllBuffers() {
    if (state === "intro") flushPara(intro);
    else if (state === "sections") flushPara(null); // will be added separately
    flushList();
    flushTable();
    flushFaqAnswer();
  }

  function addParaToSections(text) {
    if (text.trim()) sections.push({ type: "p", content: text.trim() });
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // ── H1 ──────────────────────────────────────────────────────────────────
    if (trimmed.startsWith("# ") && !trimmed.startsWith("## ")) {
      h1 = stripFormatting(trimmed.slice(2).trim());
      state = "intro";
      continue;
    }

    // ── Image line ───────────────────────────────────────────────────────────
    if (trimmed.startsWith("![")) {
      // Capture the first product image (right after H1) as hero image
      if (state === "intro" && !heroImage) {
        const imgM = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
        if (imgM) heroImage = { src: imgM[2], alt: imgM[1] };
      }
      continue;
    }

    // ── Horizontal rule ──────────────────────────────────────────────────────
    if (trimmed === "---") continue;

    // ── H2 ──────────────────────────────────────────────────────────────────
    if (trimmed.startsWith("## ")) {
      // Flush current buffers
      if (state === "intro") flushPara(intro);
      else {
        if (paraBuffer.length) { addParaToSections(paraBuffer.join(" ")); paraBuffer = []; }
        flushList();
        flushTable();
        flushFaqAnswer();
      }

      const heading = stripFormatting(trimmed.slice(3).trim());

      // Detect FAQ section
      if (/^faq|^preguntas/i.test(heading)) {
        state = "faq";
        continue;
      }

      // Detect "internal links" section (seguí leyendo, otras lecturas, related)
      if (/seguí leyendo|otras lecturas|relacionad|también podrías/i.test(heading)) {
        state = "internal_links";
        continue;
      }

      state = "sections";
      sections.push({ type: "h2", title: heading });
      continue;
    }

    // ── H3 ──────────────────────────────────────────────────────────────────
    if (trimmed.startsWith("### ")) {
      // In FAQ state, H3 headings are questions (used in comparativas)
      if (state === "faq") {
        flushFaqAnswer();
        currentFaqQ = stripFormatting(trimmed.slice(4).trim());
        continue;
      }
      if (state === "sections") {
        if (paraBuffer.length) { addParaToSections(paraBuffer.join(" ")); paraBuffer = []; }
        flushList();
        flushTable();
      }
      const heading = stripFormatting(trimmed.slice(4).trim());
      sections.push({ type: "h3", title: heading });
      continue;
    }

    // ── Table rows ───────────────────────────────────────────────────────────
    if (trimmed.startsWith("|") && state === "sections") {
      // Separator row
      if (/^\|[\s\-:|]+\|$/.test(trimmed)) {
        inTable = true;
        continue;
      }
      const cells = trimmed.split("|").slice(1, -1).map((c) => stripFormatting(c.trim()));
      if (!inTable && !tableHeaders) {
        // First row = headers
        tableHeaders = cells;
        inTable = true;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      flushTable();
    }

    // ── List items ───────────────────────────────────────────────────────────
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const itemText = trimmed.slice(2).trim();

      // Affiliate CTA link? e.g. "**[Ver X en Mercado Libre](https://...)**"
      const ctaMatch = itemText.match(/^\*\*\[([^\]]+)\]\((https?:\/\/[^)]+)\)\*\*$/);
      if (ctaMatch) {
        affiliateCta = { label: ctaMatch[1], href: ctaMatch[2] };
        continue;
      }

      // Internal link item? e.g. "[Texto](/guias/slug): description"
      const linkItem = extractLink(itemText);
      if (linkItem && (linkItem.href.startsWith("/guias") || linkItem.href.startsWith("/producto") || state === "internal_links")) {
        internalLinks.push(linkItem);
        continue;
      }

      // Regular list item (strip bold, keep inline links)
      if (state === "sections") {
        if (paraBuffer.length) { addParaToSections(paraBuffer.join(" ")); paraBuffer = []; }
        listBuffer.push(stripFormatting(itemText));
        continue;
      }
    } else if (listBuffer.length > 0 && state === "sections") {
      flushList();
    }

    // ── Affiliate CTA as standalone bold link ────────────────────────────────
    // e.g. **[Ver X en Mercado Libre](https://productosvirales.com.ar/producto/MLA...)**
    const standaloneCta = trimmed.match(/^\*\*\[([^\]]+)\]\((https?:\/\/[^)]+)\)\*\*$/);
    if (standaloneCta) {
      if (state === "sections" || state === "intro") {
        if (paraBuffer.length) {
          if (state === "intro") flushPara(intro);
          else { addParaToSections(paraBuffer.join(" ")); paraBuffer = []; }
        }
        affiliateCta = { label: standaloneCta[1], href: standaloneCta[2] };
      }
      continue;
    }

    // ── FAQ state: collect Q&A ───────────────────────────────────────────────
    if (state === "faq") {
      // Empty line → don't flush yet, wait for next question or end
      if (trimmed === "") continue;

      // H3 question: ### ¿...? (used in comparativas)
      if (trimmed.startsWith("### ")) {
        flushFaqAnswer();
        currentFaqQ = stripFormatting(trimmed.slice(4).trim());
        continue;
      }

      // Bold question: **¿...?** or **Question text** (used in reviews)
      const faqQ = trimmed.match(/^\*\*(.+\?)\*\*$/);
      if (faqQ) {
        flushFaqAnswer();
        currentFaqQ = faqQ[1].trim();
        continue;
      }

      // Answer text (any non-heading, non-empty line)
      if (currentFaqQ) {
        faqAnswerBuffer.push(stripFormatting(trimmed));
      }
      continue;
    }

    // ── Internal links state ─────────────────────────────────────────────────
    if (state === "internal_links") {
      const link = extractLink(trimmed);
      if (link) internalLinks.push(link);
      continue;
    }

    // ── Empty line ───────────────────────────────────────────────────────────
    if (trimmed === "") {
      if (state === "intro") {
        flushPara(intro);
      } else if (state === "sections") {
        if (paraBuffer.length) { addParaToSections(paraBuffer.join(" ")); paraBuffer = []; }
        if (listBuffer.length) flushList();
        if (inTable) flushTable();
      }
      continue;
    }

    // ── Regular paragraph text ───────────────────────────────────────────────
    if (state === "intro") {
      paraBuffer.push(stripFormatting(trimmed));
    } else if (state === "sections") {
      paraBuffer.push(stripFormatting(trimmed));
    }
  }

  // Flush any remaining buffers
  flushPara(intro);
  if (paraBuffer.length) addParaToSections(paraBuffer.join(" "));
  flushList();
  flushTable();
  flushFaqAnswer();

  return { intro, sections, faq, internalLinks, h1, affiliateCta, heroImage };
}

// ─── File discovery ───────────────────────────────────────────────────────────

function findMdFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findMdFiles(fullPath));
    } else if (
      entry.name.endsWith(".md") &&
      !["README.md", "PUBLISHING-PROMPT.md", "INTERNAL-LINKING-MAP.md"].includes(entry.name)
    ) {
      files.push(fullPath);
    }
  }
  return files;
}

// ─── Generate TypeScript Guide object ────────────────────────────────────────

function escapeStr(s) {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\${/g, "\\${");
}

function guideToTs(guide) {
  const lines = [];
  lines.push(`  {`);
  lines.push(`    slug: "${guide.slug}",`);
  lines.push(`    category: "freidoras-de-aire",`);
  lines.push(`    title: \`${escapeStr(guide.title)}\`,`);
  lines.push(`    seoTitle: \`${escapeStr(guide.seoTitle)}\`,`);
  lines.push(`    metaDescription: \`${escapeStr(guide.metaDescription)}\`,`);
  lines.push(`    h1: \`${escapeStr(guide.h1)}\`,`);
  lines.push(`    publishedDate: "${guide.publishedDate}",`);
  lines.push(`    updatedDate: "${guide.publishedDate}",`);
  lines.push(`    hasDisclosure: true,`);
  lines.push(`    intro: [`);
  for (const p of guide.intro) {
    lines.push(`      \`${escapeStr(p)}\`,`);
  }
  lines.push(`    ],`);

  lines.push(`    sections: [`);
  for (const s of guide.sections) {
    if (s.type === "h2") {
      lines.push(`      { type: "h2", title: \`${escapeStr(s.title)}\` },`);
    } else if (s.type === "h3") {
      lines.push(`      { type: "h3", title: \`${escapeStr(s.title)}\` },`);
    } else if (s.type === "p") {
      lines.push(`      { type: "p", content: \`${escapeStr(s.content)}\` },`);
    } else if (s.type === "list") {
      lines.push(`      { type: "list", items: [`);
      for (const item of s.items) {
        lines.push(`        \`${escapeStr(item)}\`,`);
      }
      lines.push(`      ]},`);
    } else if (s.type === "image") {
      lines.push(`      { type: "image", src: "${s.src || ""}", alt: \`${escapeStr(s.alt || "")}\` },`);
    } else if (s.type === "table") {
      lines.push(`      { type: "table", headers: [${s.headers.map((h) => `\`${escapeStr(h)}\``).join(", ")}], rows: [`);
      for (const row of s.rows) {
        lines.push(`        [${row.map((c) => `\`${escapeStr(c)}\``).join(", ")}],`);
      }
      lines.push(`      ]},`);
    }
  }
  lines.push(`    ],`);

  if (guide.faq && guide.faq.length > 0) {
    lines.push(`    faq: [`);
    for (const item of guide.faq) {
      lines.push(`      {`);
      lines.push(`        question: \`${escapeStr(item.question)}\`,`);
      lines.push(`        answer: \`${escapeStr(item.answer)}\`,`);
      lines.push(`      },`);
    }
    lines.push(`    ],`);
  }

  if (guide.internalLinks && guide.internalLinks.length > 0) {
    lines.push(`    internalLinks: [`);
    for (const link of guide.internalLinks) {
      lines.push(`      { label: \`${escapeStr(link.label)}\`, href: "${link.href}" },`);
    }
    lines.push(`    ],`);
    lines.push(`    internalLinksTitle: "Guías relacionadas",`);
  }

  lines.push(`  },`);
  return lines.join("\n");
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const clusterDir = __dirname;
const guidesFile = join(ROOT, "src", "data", "guides.ts");
const outputFile = join(ROOT, "src", "data", "guides-freidoras-additions.ts");

const mdFiles = findMdFiles(clusterDir);
console.log(`Found ${mdFiles.length} .md files\n`);

const guideObjects = [];

for (const filePath of mdFiles) {
  const raw = readFileSync(filePath, "utf-8");
  const fm = parseFrontmatter(raw);
  const body = extractBody(raw);
  const parsed = parseBody(body);

  if (!fm.slug) {
    console.warn(`⚠  No slug found in ${basename(filePath)}, skipping`);
    continue;
  }

  const guide = {
    slug: fm.slug,
    title: fm.title || parsed.h1 || fm.slug,
    seoTitle: fm.title || parsed.h1 || fm.slug,
    metaDescription: fm.description || "",
    h1: parsed.h1 || fm.title || fm.slug,
    publishedDate: fm.publishDate || "2026-04-15",
    intro: parsed.intro.length > 0 ? parsed.intro : [""],
    sections: parsed.sections,
    faq: parsed.faq,
    internalLinks: parsed.internalLinks,
    affiliateCta: parsed.affiliateCta,
  };

  // Inject hero image as first section (from the ![...](src) line right after H1)
  // Fallback to featuredImage from frontmatter if body image wasn't captured
  const heroSrc = parsed.heroImage?.src || fm.featuredImage;
  const heroAlt = parsed.heroImage?.alt || guide.title;
  if (heroSrc) {
    guide.sections.unshift({ type: "image", src: heroSrc, alt: heroAlt });
  }

  // Inject affiliate CTA as a card section at the end if found
  if (guide.affiliateCta) {
    guide.sections.push({
      type: "card",
      card: {
        heading: "Dónde comprarlo",
        paragraphs: [],
        ctas: [{ label: guide.affiliateCta.label, href: guide.affiliateCta.href }],
      },
    });
  }

  guideObjects.push(guide);
  console.log(`✓ ${fm.slug} (intro: ${guide.intro.length}p, sections: ${guide.sections.length}, faq: ${guide.faq.length})`);
}

// Generate output
const tsBlocks = guideObjects.map(guideToTs).join("\n\n");
const output = `// ─────────────────────────────────────────────────────────────────────────────
// CLUSTER: Freidoras de Aire (${guideObjects.length} artículos)
// Generated by convert-to-guides.mjs — do not edit manually, re-run converter
// ─────────────────────────────────────────────────────────────────────────────
${tsBlocks}`;

writeFileSync(outputFile, output, "utf-8");
console.log(`\n✅ Generated ${guideObjects.length} Guide objects → ${outputFile}`);
console.log(`\nNext step: copy the contents of that file into the guides array in src/data/guides.ts`);
console.log(`Or run: node -e "
  const fs = require('fs');
  const additions = fs.readFileSync('${outputFile}', 'utf-8');
  let guides = fs.readFileSync('${guidesFile}', 'utf-8');
  guides = guides.replace(/];\\s*$/, additions + '\\n];');
  fs.writeFileSync('${guidesFile}', guides);
  console.log('Done!');
"`);
