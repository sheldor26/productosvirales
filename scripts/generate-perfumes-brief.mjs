import fs from 'node:fs';

const TODAY = '2026-04-27';
const SITE = 'https://productosvirales.com.ar';

// ─── Catalog parse ────────────────────────────────────────────
const catSrc = fs.readFileSync('src/data/curated-products.ts', 'utf8');

function slugifyTitle(t) {
  return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80).replace(/-+$/, '');
}
function productSlug(p) { return slugifyTitle(p.title) + '-' + p.id.toLowerCase(); }

const productRe = /id:\s*["'](MLAU?\d+)["'][\s\S]{0,4000}?title:\s*["`]([^"`]+)["`][\s\S]{0,8000}?affiliateUrl:\s*["']([^"']+)["']/g;
const products = {};
let m;
while ((m = productRe.exec(catSrc)) !== null) {
  if (!products[m[1]]) products[m[1]] = { id: m[1], title: m[2], affiliateUrl: m[3] };
}

const PERFUME_BRANDS = /lattafa|afnan|rasasi|armaf|bharara|maison\s+alhambra|al\s+wataniah|hawas|khamrah|asad|yara|fakhar|mayar|emeer|qaed|kingdom|habik|9pm|sceptre|maahir|odyssey|mandarine\s+sky|erba\s+pura|bade'?e/i;
const perfumeProducts = Object.values(products).filter(p => PERFUME_BRANDS.test(p.title));

// ─── Guides parse ─────────────────────────────────────────────
const guidesSrc = fs.readFileSync('src/data/guides.ts', 'utf8');
const slugRe = /^    slug:\s*["']([a-z0-9-]+)["']/gm;
const guides = [];
while ((m = slugRe.exec(guidesSrc)) !== null) guides.push({ slug: m[1], offset: m.index });
for (let i = 0; i < guides.length; i++) {
  const g = guides[i];
  g.endOffset = (i + 1 < guides.length) ? guides[i + 1].offset : guidesSrc.length;
  const body = guidesSrc.slice(g.offset, g.endOffset);

  const get = (re) => { const x = body.match(re); return x ? x[1] : null; };
  g.title = get(/^    title:\s*["`]([^"`]+)["`]/m);
  g.h1 = get(/^    h1:\s*["`]([^"`]+)["`]/m);
  g.category = get(/^    category:\s*["`]([^"`]+)["`]/m);
  g.publishedDate = get(/publishedDate:\s*["'](\d{4}-\d{2}-\d{2})["']/);
  g.metaDescription = get(/^    metaDescription:\s*["`]([^"`]+)["`]/m);
  g.standfirst = get(/^    standfirst:\s*["`]([^"`]+)["`]/m);

  const mlaIds = new Set();
  const mlaRe = /productMlaId:\s*["'](MLAU?\d+)["']/g;
  let mm;
  while ((mm = mlaRe.exec(body)) !== null) mlaIds.add(mm[1]);
  g.productIds = [...mlaIds];

  const contentBlocks = body.match(/(?:content|answer|tagline|description|standfirst):\s*["`][^"`]+["`]/g) || [];
  g.wordCount = contentBlocks.reduce((sum, c) => sum + c.split(/\s+/).length, 0);
  g.h2Count = (body.match(/type:\s*["']h2["']/g) || []).length;
  g.h3Count = (body.match(/type:\s*["']h3["']/g) || []).length;
}

const perfumeGuides = guides
  .filter(g => g.category === 'perfumes-arabes' && g.publishedDate && g.publishedDate <= TODAY)
  .sort((a, b) => a.publishedDate.localeCompare(b.publishedDate));

// ─── Build markdown ───────────────────────────────────────────
const lines = [];
const w = (s) => lines.push(s);

w('# Brief de contenido — perfumes árabes');
w('');
w('> **Propósito:** documento vivo que resume el universo de contenido de perfumes árabes en productosvirales.com.ar. Sirve para briefar a una IA antes de pedirle un artículo nuevo: qué ya está cubierto, con qué cards, y qué productos del catálogo están disponibles para featurear.');
w('');
w(`> **Última actualización:** ${TODAY}  `);
w(`> **Artículos publicados:** ${perfumeGuides.length}  `);
w(`> **Productos en catálogo (perfumes árabes):** ${perfumeProducts.length}`);
w('');
w('---');
w('');

// ─── Sección 1 ───────────────────────────────────────────────
w('## 1. Artículos publicados');
w('');
w('Cada artículo cubre un ángulo específico. Antes de proponer uno nuevo, verificá que el ángulo no esté ya cubierto y que el slug sea único.');
w('');

for (const g of perfumeGuides) {
  w(`### ${g.h1 || g.title}`);
  w('');
  w(`- **Slug:** \`${g.slug}\``);
  w(`- **URL:** ${SITE}/guias/${g.slug}`);
  w(`- **Publicado:** ${g.publishedDate}`);
  w(`- **Estructura:** ${g.h2Count} H2 / ${g.h3Count} H3 / ~${g.wordCount} palabras`);
  if (g.metaDescription) w(`- **Meta description:** ${g.metaDescription}`);
  if (g.standfirst) w(`- **Standfirst:** ${g.standfirst}`);

  if (g.productIds.length > 0) {
    w(`- **Productos featureados (${g.productIds.length}):**`);
    for (const pid of g.productIds) {
      const p = products[pid];
      if (p) w(`  - ${p.title} (\`${pid}\`)`);
      else w(`  - **MISSING:** \`${pid}\` — no existe en catálogo`);
    }
  }
  w('');
}

w('---');
w('');

// ─── Sección 2 ───────────────────────────────────────────────
w(`## 2. Catálogo de perfumes árabes (${perfumeProducts.length} productos)`);
w('');
w('Para cada producto: link a la ficha interna del sitio (lleva al detalle con CTA al affiliate) + link directo de affiliate.');
w('');

const buckets = { 'Mujer': [], 'Hombre': [], 'Unisex': [], 'Sets': [] };
for (const p of perfumeProducts) {
  const t = p.title.toLowerCase();
  if (/^set\s|set lattafa|colección|collection/i.test(p.title)) buckets['Sets'].push(p);
  else if (/mujer|yara|mayar|fakhar woman|her confession|bade'?e/i.test(t)) buckets['Mujer'].push(p);
  else if (/unisex|khamrah|hawas black|fakhar lattafa pride/i.test(t)) buckets['Unisex'].push(p);
  else buckets['Hombre'].push(p);
}

for (const cat of Object.keys(buckets)) {
  w(`### ${cat} (${buckets[cat].length})`);
  w('');
  buckets[cat].sort((a, b) => a.title.localeCompare(b.title));
  w('| Producto | Ficha en el sitio | Affiliate ML |');
  w('|---|---|---|');
  for (const p of buckets[cat]) {
    const internal = `${SITE}/producto/${productSlug(p)}`;
    const safeTitle = p.title.replace(/\|/g, '\\|');
    w(`| ${safeTitle} | [${p.id}](${internal}) | [${p.affiliateUrl}](${p.affiliateUrl}) |`);
  }
  w('');
}

w('---');
w('');

// ─── Sección 3 ───────────────────────────────────────────────
w('## 3. Notas para la IA al pedir un artículo nuevo');
w('');
w('**Antes de generar:**');
w('');
w('1. **Verificar que el ángulo no esté cubierto** en la sección 1. Si hay overlap parcial, definir qué hace distinto el nuevo artículo.');
w('2. **Verificar que los productos a featurear estén en la sección 2.** No inventar MLAs.');
w('3. **Slug objetivo único:** chequear contra la lista de slugs publicados (sección 1).');
w('4. **Cross-link a artículos existentes:** todo artículo nuevo debe linkear a 3-5 de los publicados que sean temáticamente cercanos.');
w('');
w('**Convenciones del repo:**');
w('');
w('- Schema de Guide: `src/lib/types.ts:200-228`');
w('- Helpers de URL: `src/lib/product-url.ts` (productHref, productSlug, parseProductSlug)');
w('- Componente affiliate: `src/components/affiliate/AffiliateLink.tsx` (centraliza rel="sponsored nofollow noopener")');
w('- ProductCard variants: `default` (con foto + label) y `compact` (1 línea, listas densas)');
w('- LabelColor enum: `green | blue | amber | purple` (no hay otros)');
w('- Callout variants: `note | warning | tip | update`');
w('- Pull-quotes deben tener `attribution` con país + mes/año + cantidad útil cuando aplique');
w('- Affiliate links externos: el parser de markdown agrega `rel="sponsored nofollow noopener"` automático');
w('- URLs de producto: formato `/producto/<slug>-<mla-id-lowercase>` (legacy bare-MLA hace 308)');
w('');
w('**Voz editorial:**');
w('');
w('- Tono argentino directo. Vos, no tú.');
w('- Sin marketing huevo. Si polariza, decí que polariza.');
w('- Citar reseñas reales del catálogo (campo `customerReviews` en cada producto). Las que tienen `useful > 50` son oro.');
w('- Nombrar precios reales con fecha de verificación. Aclarar si están stale.');
w('- Comparaciones con perfumes de diseñador (YSL, Tom Ford, Creed, MFK) ayudan a posicionar.');
w('- Falsificaciones son tema crítico — incluir señales de autenticidad cuando aplique.');
w('');
w('**Bucket de slugs faltantes** (artículos referenciados pero no creados — oportunidades de contenido según último audit interno):');
w('');
w('- `perfumes-arabes-dupes` — 3 referencias internas pendientes');
w('- `perfumes-arabes-originales` — 2 referencias');
w('- `lattafa-guia-marca` — 2 referencias');
w('- `lattafa-asad-comparativa` — 1 referencia');
w('- `perfumes-arabes-mas-vendidos-argentina` — 1 referencia');
w('- `donde-comprar-perfumes-arabes-argentina` — 1 referencia');
w('- `donde-comprar-perfumes-arabes-buenos-aires` — 1 referencia');
w('');
w('---');
w('');
w(`*Documento generado por \`scripts/generate-perfumes-brief.mjs\`. Re-correr con \`node scripts/generate-perfumes-brief.mjs\` cuando se publique nuevo contenido o se sumen productos al catálogo.*`);

fs.writeFileSync('docs/perfumes-arabes-content-brief.md', lines.join('\n') + '\n');
console.log('Wrote docs/perfumes-arabes-content-brief.md');
console.log('Articulos:', perfumeGuides.length);
console.log('Productos:', perfumeProducts.length);
