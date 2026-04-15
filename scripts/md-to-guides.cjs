const fs = require('fs');
const path = require('path');

const base = 'cluster-freidoras-de-aire';
const schedule = [
  ['pilar/mejores-freidoras-de-aire-argentina.md', '2026-04-15'],
  ['reviews/atma-freidoras-de-aire-review.md', '2026-04-18'],
  ['reviews/peabody-freidoras-de-aire-review.md', '2026-04-22'],
  ['informacionales/recetas-freidora-de-aire.md', '2026-04-25'],
  ['reviews/philips-freidoras-de-aire-review.md', '2026-04-29'],
  ['informacionales/accesorios-para-freidora-de-aire.md', '2026-05-02'],
  ['reviews/oster-freidoras-de-aire-review.md', '2026-05-06'],
  ['comparativas/atma-vs-peabody-freidora-de-aire.md', '2026-05-09'],
  ['informacionales/como-usar-una-freidora-de-aire.md', '2026-05-13'],
  ['reviews/gadnic-freidora-review.md', '2026-05-16'],
  ['reviews/kanji-home-freidora-review.md', '2026-05-20'],
  ['reviews/ninja-crispi-review.md', '2026-05-23'],
  ['comparativas/ninja-vs-philips-freidora-de-aire.md', '2026-05-27'],
  ['comparativas/mejores-freidoras-de-aire-doble-canasta.md', '2026-05-30'],
  ['comparativas/freidoras-de-aire-con-grill-argentina.md', '2026-06-03'],
  ['comparativas/mejores-freidoras-de-aire-economicas-argentina.md', '2026-06-07'],
  ['comparativas/freidoras-de-aire-gran-capacidad.md', '2026-06-11'],
  ['informacionales/cuanto-consume-freidora-de-aire.md', '2026-06-14'],
  ['informacionales/freidora-de-aire-vs-horno.md', '2026-06-18'],
  ['informacionales/vale-la-pena-comprar-freidora-de-aire.md', '2026-06-21'],
  ['reviews/powerxl-freidora-review.md', '2026-06-25'],
  ['reviews/suono-airfryer-review.md', '2026-06-28'],
  ['informacionales/freidora-de-aire-desventajas.md', '2026-07-02'],
];

// --- tiny YAML frontmatter parser (enough for these files) ---
function parseFrontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { data: {}, body: src };
  const raw = m[1];
  const body = src.slice(m[0].length);
  const data = {};
  const lines = raw.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const mm = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (mm) {
      const key = mm[1];
      let val = mm[2].trim();
      if (val === '') {
        // nested object or list
        const nested = {};
        const arr = [];
        i++;
        while (i < lines.length && /^(\s+)/.test(lines[i])) {
          const L = lines[i];
          if (/^\s+- /.test(L)) arr.push(L.replace(/^\s+- /, '').replace(/^"|"$/g, ''));
          i++;
        }
        data[key] = arr.length ? arr : nested;
        continue;
      }
      val = val.replace(/^"|"$/g, '');
      data[key] = val;
    }
    i++;
  }
  return { data, body };
}

// --- string escape for TS literal ---
function tsStr(s) {
  if (s == null) return '""';
  return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"';
}

// --- clean inline content ---
function cleanInline(s) {
  return s
    .replace(/\s*\{rel="[^"]*"\}/g, '')
    // normalize /freidoras-de-aire/<slug> to /guias/<slug>
    .replace(/\]\(\/freidoras-de-aire\//g, '](/guias/')
    .replace(/\]\(https:\/\/productosvirales\.com\.ar\/guias\//g, '](/guias/')
    .replace(/\]\(https:\/\/productosvirales\.com\.ar\/producto\//g, '](/producto/')
    .trim();
}

// --- parse a markdown body into sections + intro + faq ---
function parseBody(body) {
  // strip the first h1
  body = body.replace(/^\s*#\s+.+\n+/, '');
  const rawLines = body.split('\n');

  // tokenize into blocks separated by blank lines, preserving headings/tables/lists
  const blocks = [];
  let cur = [];
  for (const ln of rawLines) {
    if (ln.trim() === '') {
      if (cur.length) { blocks.push(cur); cur = []; }
    } else if (ln.trim() === '---') {
      if (cur.length) { blocks.push(cur); cur = []; }
      // skip horizontal rule
    } else {
      cur.push(ln);
    }
  }
  if (cur.length) blocks.push(cur);

  const intro = [];
  const sections = [];
  const faq = [];
  let inFaq = false;
  let introDone = false;

  for (const blk of blocks) {
    const first = blk[0];
    // H2
    const h2m = first.match(/^##\s+(.+)$/);
    if (h2m && !first.startsWith('###')) {
      introDone = true;
      const title = h2m[1].trim();
      if (/^faq|preguntas/i.test(title)) {
        inFaq = true;
        continue;
      }
      inFaq = false;
      sections.push({ type: 'h2', title: cleanInline(title) });
      // remaining lines in same block after heading are paragraph text
      const rest = blk.slice(1).join(' ').trim();
      if (rest) sections.push({ type: 'p', content: cleanInline(rest) });
      continue;
    }
    // H3
    const h3m = first.match(/^###\s+(.+)$/);
    if (h3m) {
      introDone = true;
      const title = h3m[1].trim();
      if (inFaq) {
        const question = cleanInline(title);
        const answer = cleanInline(blk.slice(1).join(' ').trim());
        faq.push({ question, answer });
        continue;
      }
      sections.push({ type: 'h3', title: cleanInline(title) });
      const rest = blk.slice(1).join(' ').trim();
      if (rest) sections.push({ type: 'p', content: cleanInline(rest) });
      continue;
    }
    // Table
    if (first.startsWith('|')) {
      introDone = true;
      const rows = blk.filter(l => l.startsWith('|'));
      if (rows.length >= 2) {
        const parseRow = r => r.replace(/^\||\|$/g, '').split('|').map(c => cleanInline(c.trim()));
        const headers = parseRow(rows[0]);
        const dataRows = rows.slice(2).map(parseRow); // skip separator
        if (!inFaq) sections.push({ type: 'table', headers, rows: dataRows });
      }
      continue;
    }
    // List
    if (/^[\-*]\s+/.test(first)) {
      introDone = true;
      const items = blk
        .filter(l => /^[\-*]\s+/.test(l))
        .map(l => cleanInline(l.replace(/^[\-*]\s+/, '')));
      if (!inFaq) sections.push({ type: 'list', items });
      continue;
    }
    // FAQ mode: detect **Question?** / answer pattern inside a block
    if (inFaq) {
      const boldQ = first.match(/^\*\*(.+?)\*\*\s*$/);
      if (boldQ) {
        const question = cleanInline(boldQ[1]);
        const answer = cleanInline(blk.slice(1).join(' ').trim());
        faq.push({ question, answer });
        continue;
      }
      // otherwise continuation of previous answer
      const text = cleanInline(blk.join(' '));
      if (text && faq.length) faq[faq.length - 1].answer += ' ' + text;
      continue;
    }
    // Paragraph
    const text = cleanInline(blk.join(' ').replace(/^\s*\*(.+)\*\s*$/, '$1'));
    if (!text) continue;
    if (!introDone) {
      intro.push(text);
    } else {
      sections.push({ type: 'p', content: text });
    }
  }

  // cap intro at first 3 paragraphs
  const finalIntro = intro.slice(0, 3);
  const leftoverIntro = intro.slice(3);
  if (leftoverIntro.length) {
    // prepend leftovers as paragraphs at top of sections
    const pre = leftoverIntro.map(p => ({ type: 'p', content: p }));
    sections.unshift(...pre);
  }

  return { intro: finalIntro, sections, faq };
}

function serializeObj(obj, indent = '    ', firstIndent = '') {
  const lines = [firstIndent + '{'];
  const entries = Object.entries(obj);
  for (let i = 0; i < entries.length; i++) {
    const [k, v] = entries[i];
    const comma = i < entries.length - 1 ? ',' : '';
    if (Array.isArray(v)) {
      if (v.length === 0) { lines.push(`${indent}  ${k}: []${comma}`); continue; }
      if (typeof v[0] === 'string') {
        lines.push(`${indent}  ${k}: [`);
        v.forEach((s, j) => lines.push(`${indent}    ${tsStr(s)}${j < v.length - 1 ? ',' : ''}`));
        lines.push(`${indent}  ]${comma}`);
      } else if (Array.isArray(v[0])) {
        lines.push(`${indent}  ${k}: [`);
        v.forEach((row, j) => {
          lines.push(`${indent}    [${row.map(tsStr).join(', ')}]${j < v.length - 1 ? ',' : ''}`);
        });
        lines.push(`${indent}  ]${comma}`);
      } else {
        lines.push(`${indent}  ${k}: [`);
        v.forEach((o, j) => lines.push(serializeObj(o, indent + '    ', indent + '    ') + (j < v.length - 1 ? ',' : '')));
        lines.push(`${indent}  ]${comma}`);
      }
    } else if (typeof v === 'boolean' || typeof v === 'number') {
      lines.push(`${indent}  ${k}: ${v}${comma}`);
    } else {
      lines.push(`${indent}  ${k}: ${tsStr(v)}${comma}`);
    }
  }
  lines.push(`${indent}}`);
  return lines.join('\n');
}

function buildGuide(frontmatter, parsed, publishDate) {
  const title = frontmatter.title || '';
  const desc = frontmatter.description || '';
  const slug = frontmatter.slug;
  const h1 = title.replace(/\s*\[2026\]\s*/g, ' 2026').replace(/:\s*Gu[ií]a completa.*/i, '').trim() || title;

  return {
    slug,
    category: 'freidoras-de-aire',
    title,
    seoTitle: title,
    metaDescription: desc,
    ogTitle: title,
    ogDescription: desc,
    h1: title,
    publishedDate: publishDate,
    updatedDate: publishDate,
    hasDisclosure: true,
    intro: parsed.intro,
    sections: parsed.sections,
    faq: parsed.faq,
  };
}

// --- run ---
const out = [];
for (const [rel, date] of schedule) {
  const fp = path.join(base, rel);
  const src = fs.readFileSync(fp, 'utf8');
  const { data, body } = parseFrontmatter(src);
  const parsed = parseBody(body);
  const guide = buildGuide(data, parsed, date);
  out.push(guide);
  console.log(`OK ${rel} -> slug=${guide.slug}, sections=${guide.sections.length}, faq=${guide.faq.length}, intro=${guide.intro.length}`);
}

// emit as TS entries ready to paste inside the guides[] array
const ts = out.map(g => serializeObj(g, '  ', '  ')).join(',\n');
fs.writeFileSync('scripts/freidoras-guides.generated.txt', ts);
console.log('\nWrote scripts/freidoras-guides.generated.ts (' + out.length + ' guides)');
