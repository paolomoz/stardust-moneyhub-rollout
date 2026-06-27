// Drive authoring across the roster. Two passes: content pages first (collect
// titles), then listing pages (cards reference collected titles).
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { ORIGIN, UA, roster, normPath, fetchSrc, extractMeta, extractContent, imgOk, renderArticle, renderListing } from './author.mjs';

const imgCache = new Map();
const ok = imgOk(imgCache);
const SKIP = new Set(['home']); // home authored bespoke

const CATEGORY = {
  'case-study': 'Case study', 'press-release': 'Press release', 'glossary-entry': 'Glossary',
  article: 'Article', webinar: 'Webinar', 'product-detail': 'Product', 'solution-detail': 'Solution',
  'solution-overview': 'Solutions', 'use-case-detail': 'Use case', policy: 'Policy', static: '', form: '',
};
// listing slug -> child template to list
const LISTING_CHILDREN = {
  'case-studies': 'case-study', products: 'product-detail', 'use-cases': 'use-case-detail',
  articles: 'article', 'press-and-partners': 'press-release', webinars: 'webinar', glossary: 'glossary-entry',
};

const titles = {}; // slug -> {title, desc, href, tag}
const results = [];

async function authorContentPage(page) {
  const html = await fetchSrc(page.url);
  const { title, desc } = extractMeta(html);
  const nodes = extractContent(html);
  const h1node = nodes.find((n) => n.t === 'h1');
  const h1 = h1node ? h1node.txt : (title || page.slug);
  // body = nodes after the h1, excluding the h1 itself
  let body = nodes.filter((n) => n !== h1node);
  // lead image = first image; remove from body (used in header)
  let leadImg = null;
  const firstImgIdx = body.findIndex((n) => n.t === 'img');
  if (firstImgIdx !== -1 && firstImgIdx < 4) { leadImg = body[firstImgIdx]; body = body.filter((n, i) => i !== firstImgIdx); }
  // verify images (drop broken)
  const kept = [];
  for (const n of body) { if (n.t === 'img') { if (await ok(n.src)) kept.push(n); } else kept.push(n); }
  if (leadImg && !(await ok(leadImg.src))) leadImg = null;
  // trim trailing related-posts noise: stop after we hit a 2nd h2 named "Related"/"More"
  const relIdx = kept.findIndex((n) => (n.t === 'h2') && /related|more (case|stories|articles|posts)|you might/i.test(n.txt));
  const finalNodes = relIdx > 3 ? kept.slice(0, relIdx) : kept;
  const category = CATEGORY[page.template] ?? '';
  const path = normPath(page.path);
  // PublishDate from article:published_time / og meta where present
  const pub = (html.match(/property="article:published_time" content="([^"]+)"/) || [])[1] || '';
  const meta = { category, template: page.template, publishDate: pub ? pub.slice(0, 10) : '' };
  const frag = renderArticle({ title: title || h1, desc, h1, category, leadImg, nodes: finalNodes, meta });
  const file = join('content', path + '.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, frag);
  titles[page.slug] = { title: h1, desc, href: '/' + path, tag: category };
  return { slug: page.slug, path, nodes: finalNodes.length, img: (leadImg ? 1 : 0) + finalNodes.filter((n) => n.t === 'img').length };
}

async function authorListing(page) {
  const html = await fetchSrc(page.url);
  const { title, desc } = extractMeta(html);
  const nodesAll = extractContent(html);
  const h1 = (nodesAll.find((n) => n.t === 'h1') || {}).txt || title || page.slug;
  const childTpl = LISTING_CHILDREN[page.slug];
  let cards = [];
  if (childTpl) {
    cards = roster.filter((r) => r.template === childTpl).map((r) => {
      const t = titles[r.slug];
      return { title: t ? t.title : r.slug.split('-').slice(-6).join(' '), href: '/' + normPath(r.path), excerpt: t ? (t.desc || '').slice(0, 120) : '', tag: CATEGORY[childTpl] };
    });
  }
  const path = normPath(page.path);
  const frag = renderListing({ title: title || h1, desc, h1, cards, meta: { category: 'Listing', template: 'listing' } });
  const file = join('content', path + '.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, frag);
  return { slug: page.slug, path, cards: cards.length };
}

const limitArg = process.argv.indexOf('--limit');
const limit = limitArg !== -1 ? +process.argv[limitArg + 1] : Infinity;
const arg2 = process.argv[2];
const only = arg2 && arg2 !== 'all' && !arg2.startsWith('--') ? arg2 : null;

const listingSlugs = new Set(Object.keys(LISTING_CHILDREN));
let work = roster.filter((p) => !SKIP.has(p.slug));
if (only) work = work.filter((p) => p.slug === only);

const contentPages = work.filter((p) => !listingSlugs.has(p.slug));
const listingPages = work.filter((p) => listingSlugs.has(p.slug));

let n = 0;
for (const p of contentPages) {
  if (n >= limit) break; n++;
  try { const r = await authorContentPage(p); results.push(r); console.log(`auth ${r.path.padEnd(58)} nodes=${r.nodes} img=${r.img}`); }
  catch (e) { results.push({ slug: p.slug, err: e.message }); console.log(`FAIL ${p.slug} :: ${e.message}`); }
}
for (const p of listingPages) {
  try { const r = await authorListing(p); results.push(r); console.log(`list ${r.path.padEnd(58)} cards=${r.cards}`); }
  catch (e) { results.push({ slug: p.slug, err: e.message }); console.log(`FAIL ${p.slug} :: ${e.message}`); }
}
const fails = results.filter((r) => r.err);
console.log(`\nAuthored ${results.length - fails.length}/${results.length}  (fails: ${fails.length})`);
writeFileSync('stardust/deploy-tools/_author-titles.json', JSON.stringify(titles, null, 2));
