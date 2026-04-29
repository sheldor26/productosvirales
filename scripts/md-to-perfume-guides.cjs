const fs = require('fs');
const path = require('path');

const INPUT = 'docs/clusters/perfumes-arabes/articulos_lote_1.md';
const IMG_DIR = 'public/images/perfumes-imagenes';
const PUBLISH_DATE = '2026-04-17';

// Build map: filename-prefix "NN" → ml_id from the editorial plan
const plan = JSON.parse(fs.readFileSync('plan_editorial.json', 'utf8'));
const prefixToMla = {};
for (const p of plan.productos) {
  prefixToMla[String(p.id).padStart(2, '0')] = p.ml_id;
}
function mlaFromFilename(filename) {
  const m = filename.match(/^(\d{2})-/);
  return m ? prefixToMla[m[1]] : null;
}

// Build map of existing image filenames (case-insensitive lookup)
const existingImages = new Set(fs.readdirSync(IMG_DIR));
const lcMap = new Map();
for (const f of existingImages) lcMap.set(f.toLowerCase(), f);

function resolveImage(name) {
  if (existingImages.has(name)) return name;
  const lc = lcMap.get(name.toLowerCase());
  if (lc) return lc;
  // Try fuzzy: strip extra hyphens, normalize separators
  const norm = name.toLowerCase().replace(/[-_]/g, '');
  for (const f of existingImages) {
    if (f.toLowerCase().replace(/[-_]/g, '') === norm) return f;
  }
  return null;
}

function imgPath(name) {
  const resolved = resolveImage(name);
  if (!resolved) {
    console.warn('  ! IMAGE MISSING: ' + name);
    return '/images/perfumes-imagenes/' + name;
  }
  return '/images/perfumes-imagenes/' + resolved;
}

const src = fs.readFileSync(INPUT, 'utf8');

// Split by `# ARTÍCULO N:`
const articleBlocks = src.split(/^# ARTÍCULO \d+:.*$/m).filter(b => b.trim());
const articleHeaders = [...src.matchAll(/^# ARTÍCULO (\d+):\s*(.+)$/gm)].map(m => m[2].trim());

const guides = [];

for (let i = 0; i < articleBlocks.length; i++) {
  const blk = articleBlocks[i].trim();
  const headerName = articleHeaders[i];
  const guide = parseArticle(blk, headerName);
  guides.push(guide);
  console.log(`[${i + 1}] ${guide.slug} — sections=${guide.sections.length}, faq=${guide.faq?.length || 0}`);
}

function parseArticle(text, headerName) {
  // Extract metadata block (lines like **slug:** ...)
  const meta = {};
  const metaRe = /^\*\*([a-z_]+):\*\*\s*(.+)$/gm;
  let m;
  while ((m = metaRe.exec(text)) !== null) meta[m[1]] = m[2].trim();

  // Find h1 line: "## H1: ..."
  const h1Match = text.match(/^## H1:\s*(.+)$/m);
  const h1 = h1Match ? h1Match[1].trim() : headerName;

  // Find body start (after the H1 line)
  const bodyStart = h1Match ? text.indexOf(h1Match[0]) + h1Match[0].length : 0;
  const body = text.slice(bodyStart);

  // Parse hero from meta: "filename | alt"
  let heroSection = null;
  if (meta.hero) {
    const [fn, alt] = meta.hero.split('|').map(s => s.trim());
    heroSection = { type: 'image', src: imgPath(fn), alt: alt || '', imageSize: 'hero' };
  }

  // Tokenize body into blocks separated by blank lines, preserving multi-line braces
  const lines = body.split('\n');
  const blocks = [];
  let cur = [];
  let inGrid = false;
  let inCompactCard = false;
  let inCallout = false;
  for (const ln of lines) {
    if (inCallout) {
      cur.push(ln);
      if (ln.trim() === ':::') {
        blocks.push(cur); cur = []; inCallout = false;
      }
      continue;
    }
    if (inCompactCard) {
      cur.push(ln);
      if (ln.trim() === '{{/PRODUCT-CARD-COMPACT}}') {
        blocks.push(cur); cur = []; inCompactCard = false;
      }
      continue;
    }
    if (inGrid) {
      cur.push(ln);
      if (ln.includes('}}')) { blocks.push(cur); cur = []; inGrid = false; }
      continue;
    }
    if (/^:::(note|warning|tip|update|pull-quote|trust)(\s|$)/.test(ln.trim())) {
      if (cur.length) { blocks.push(cur); cur = []; }
      cur.push(ln);
      inCallout = true;
      continue;
    }
    if (ln.trim().startsWith('{{PRODUCT-CARD-COMPACT')) {
      if (cur.length) { blocks.push(cur); cur = []; }
      cur.push(ln);
      inCompactCard = true;
      continue;
    }
    if (ln.trim().startsWith('{{IMG-GRID')) {
      if (cur.length) { blocks.push(cur); cur = []; }
      cur.push(ln);
      if (ln.includes('}}')) { blocks.push(cur); cur = []; }
      else inGrid = true;
      continue;
    }
    if (ln.trim() === '') {
      if (cur.length) { blocks.push(cur); cur = []; }
    } else if (ln.trim() === '---') {
      if (cur.length) { blocks.push(cur); cur = []; }
    } else {
      cur.push(ln);
    }
  }
  if (cur.length) blocks.push(cur);

  const intro = [];
  const sections = [];
  const faq = [];
  let introDone = false;
  let inFaqMode = false;

  if (heroSection) sections.push(heroSection); // hero before intro

  for (const blk of blocks) {
    const first = blk[0].trim();
    const blockText = blk.join('\n').trim();

    // H2: lines like `### H2: title`
    const h2m = first.match(/^###\s*H2:\s*(.+)$/);
    if (h2m) {
      introDone = true;
      const title = h2m[1].trim();
      if (/preguntas frecuentes|preguntas/i.test(title) && /\?/.test(blockText)) {
        inFaqMode = true; // (not used for these articles, FAQ optional)
      } else {
        inFaqMode = false;
      }
      sections.push({ type: 'h2', title });
      continue;
    }

    // H3: lines like `#### H3: title`
    const h3m = first.match(/^####\s*H3:\s*(.+)$/);
    if (h3m) {
      sections.push({ type: 'h3', title: h3m[1].trim() });
      continue;
    }

    // Fences: :::note / :::warning / :::tip / :::update / :::pull-quote / :::trust
    const fenceM = first.match(/^:::(note|warning|tip|update|pull-quote|trust)(.*)$/);
    if (fenceM) {
      const variant = fenceM[1];
      const attrs = {};
      const attrRe = /(\w+)="([^"]+)"/g;
      let am;
      while ((am = attrRe.exec(fenceM[2])) !== null) attrs[am[1]] = am[2];
      const contentLines = [];
      for (let k = 1; k < blk.length; k++) {
        const ln = blk[k].trim();
        if (ln === ':::') break;
        contentLines.push(blk[k]);
      }
      const content = contentLines.join(' ').replace(/\s+/g, ' ').trim();

      if (variant === 'pull-quote') {
        sections.push({ type: 'pull-quote', content });
      } else if (variant === 'trust') {
        const out = { type: 'trust-block', content };
        const tv = attrs.variant;
        if (tv === 'methodology' || tv === 'credentials' || tv === 'pricing') out.trustVariant = tv;
        if (attrs.titulo || attrs.title) out.title = attrs.titulo || attrs.title;
        sections.push(out);
      } else {
        const out = { type: 'callout', calloutVariant: variant, content };
        if (attrs.fecha || attrs.date) out.date = attrs.fecha || attrs.date;
        if (attrs.titulo || attrs.title) out.calloutTitle = attrs.titulo || attrs.title;
        sections.push(out);
      }
      continue;
    }

    // PRODUCT-CARD-COMPACT
    if (first.startsWith('{{PRODUCT-CARD-COMPACT')) {
      const attrs = {};
      const attrRe = /(\w+)="([^"]+)"/g;
      let am;
      while ((am = attrRe.exec(first)) !== null) attrs[am[1]] = am[2];
      // Description = all lines between opening and closing tag
      const descLines = [];
      for (let k = 1; k < blk.length; k++) {
        const ln = blk[k].trim();
        if (ln === '{{/PRODUCT-CARD-COMPACT}}') break;
        if (ln) descLines.push(ln);
      }
      const description = descLines.join(' ');
      const card = {
        type: 'product-card',
        variant: 'compact',
        productMlaId: attrs.mlaId,
        description,
      };
      if (attrs.label) card.label = attrs.label;
      if (attrs.color) card.labelColor = attrs.color;
      sections.push(card);
      continue;
    }

    // IMG-GRID
    if (first.startsWith('{{IMG-GRID')) {
      const items = [];
      const itemRe = /^-\s+([^\s|]+\.webp)\s*\|\s*(.+?)\s*$/gm;
      let im;
      while ((im = itemRe.exec(blockText)) !== null) {
        items.push({ src: imgPath(im[1]), alt: im[2], caption: im[2] });
      }
      sections.push({ type: 'image-grid', gridImages: items });
      continue;
    }

    // Single IMG
    const imgM = first.match(/^\{\{IMG\s+(hero|inline-lg|inline-md|inline-sm):\s*([^\s|]+\.webp)\s*\|\s*alt:\s*"([^"]+)"\s*\}\}$/);
    if (imgM) {
      sections.push({ type: 'image', src: imgPath(imgM[2]), alt: imgM[3], imageSize: imgM[1] });
      continue;
    }

    // Table
    if (first.startsWith('|')) {
      const rows = blk.filter(l => l.trim().startsWith('|'));
      if (rows.length >= 2) {
        const parseRow = r => r.replace(/^\||\|$/g, '').split('|').map(c => c.trim());
        const headers = parseRow(rows[0]);
        const dataRows = rows.slice(2).map(parseRow);
        sections.push({ type: 'table', headers, rows: dataRows });
      }
      continue;
    }

    // List
    if (/^[-*]\s+/.test(first)) {
      const items = blk.filter(l => /^[-*]\s+/.test(l.trim())).map(l => l.trim().replace(/^[-*]\s+/, ''));
      sections.push({ type: 'list', items });
      continue;
    }

    // Paragraph
    const paragraph = blockText.replace(/\s+/g, ' ').trim();
    if (!paragraph) continue;
    if (!introDone) {
      intro.push(paragraph);
    } else {
      sections.push({ type: 'p', content: paragraph });
    }
  }

  // Post-process: collapse (image inline-lg) + (p description) + (p with only meli.la link) → product-card
  const collapsed = [];
  let i = 0;
  while (i < sections.length) {
    const s = sections[i];
    const next1 = sections[i + 1];
    const next2 = sections[i + 2];

    const isImageLg = s.type === 'image' && s.imageSize === 'inline-lg';
    const isDescParagraph = next1 && next1.type === 'p' && !/^\[[^\]]+\]\(https:\/\/meli\.la\//.test(next1.content.trim());
    const linkMatch = next2 && next2.type === 'p'
      ? next2.content.trim().match(/^\[([^\]]+)\]\((https:\/\/meli\.la\/[^)]+)\)$/)
      : null;

    if (isImageLg && isDescParagraph && linkMatch) {
      const filename = s.src.split('/').pop();
      const mlaId = mlaFromFilename(filename);
      if (mlaId) {
        // Derive ranking from most recent h3 title (like "1. Lattafa Asad Intense")
        let ranking;
        for (let k = collapsed.length - 1; k >= 0; k--) {
          if (collapsed[k].type === 'h3' && collapsed[k].title) {
            const rm = collapsed[k].title.match(/^(\d+)\.\s+/);
            if (rm) ranking = parseInt(rm[1], 10);
            break;
          }
          if (collapsed[k].type === 'h2') break;
        }

        const card = {
          type: 'product-card',
          productMlaId: mlaId,
          description: next1.content,
        };
        if (ranking != null) card.ranking = ranking;
        collapsed.push(card);
        i += 3;
        continue;
      }
    }

    collapsed.push(s);
    i++;
  }

  // Replace sections with collapsed version
  sections.length = 0;
  sections.push(...collapsed);

  // Cap intro at first 3 paragraphs after H1
  const finalIntro = intro.slice(0, 3);
  const overflow = intro.slice(3);
  if (overflow.length) {
    const pre = overflow.map(p => ({ type: 'p', content: p }));
    // insert just after hero (sections[0] if hero exists)
    const insertIdx = heroSection ? 1 : 0;
    sections.splice(insertIdx, 0, ...pre);
  }

  return {
    slug: meta.slug,
    category: 'perfumes-arabes',
    title: meta.meta_title || h1,
    seoTitle: meta.meta_title || h1,
    metaDescription: meta.meta_description || '',
    ogTitle: meta.meta_title || h1,
    ogDescription: meta.meta_description || '',
    h1,
    publishedDate: PUBLISH_DATE,
    updatedDate: PUBLISH_DATE,
    hasDisclosure: true,
    intro: finalIntro,
    sections,
    faq: [],
  };
}

// Serialize to TS
function tsStr(s) {
  if (s == null) return '""';
  return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"';
}
function serObj(obj, indent, firstIndent = '') {
  const lines = [firstIndent + '{'];
  const entries = Object.entries(obj);
  entries.forEach(([k, v], i) => {
    const comma = i < entries.length - 1 ? ',' : '';
    if (Array.isArray(v)) {
      if (v.length === 0) { lines.push(`${indent}  ${k}: []${comma}`); return; }
      if (typeof v[0] === 'string') {
        lines.push(`${indent}  ${k}: [`);
        v.forEach((s, j) => lines.push(`${indent}    ${tsStr(s)}${j < v.length - 1 ? ',' : ''}`));
        lines.push(`${indent}  ]${comma}`);
      } else if (Array.isArray(v[0])) {
        lines.push(`${indent}  ${k}: [`);
        v.forEach((row, j) => lines.push(`${indent}    [${row.map(tsStr).join(', ')}]${j < v.length - 1 ? ',' : ''}`));
        lines.push(`${indent}  ]${comma}`);
      } else {
        lines.push(`${indent}  ${k}: [`);
        v.forEach((o, j) => lines.push(serObj(o, indent + '    ', indent + '    ') + (j < v.length - 1 ? ',' : '')));
        lines.push(`${indent}  ]${comma}`);
      }
    } else if (typeof v === 'boolean' || typeof v === 'number') {
      lines.push(`${indent}  ${k}: ${v}${comma}`);
    } else {
      lines.push(`${indent}  ${k}: ${tsStr(v)}${comma}`);
    }
  });
  lines.push(`${indent}}`);
  return lines.join('\n');
}

const ts = guides.map(g => serObj(g, '  ', '  ')).join(',\n');
fs.writeFileSync('scripts/perfumes-guides.generated.txt', ts);
console.log(`\nWrote ${guides.length} guides to scripts/perfumes-guides.generated.txt`);
