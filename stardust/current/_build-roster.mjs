// Build the migration roster from moneyhub.com sitemaps.
// Classify by design template, apply caps (100 overall / 20 per template),
// prioritize header/footer-linked + landing/overview, verify 200.
import { writeFileSync } from 'node:fs';

const ORIGIN = 'https://moneyhub.com';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0 Safari/537.36';
const SITEMAPS = ['post', 'page', 'press-releases', 'webinars', 'case-studies', 'use-cases', 'glossary', 'products'];

const navLinked = new Set([
  '/', '/about/', '/careers/', '/contact/', '/products/', '/use-cases/', '/articles/',
  '/press-and-partners/', '/case-studies/', '/webinars/', '/glossary/',
  '/solutions/banking-and-lending-solutions/', '/solutions/pension-and-wealth-solutions/',
  '/policies/privacy-policy/', '/policies/environmental-social-and-governance-report/',
  '/policies/modern-slavery-and-human-trafficking-policy/', '/policies/security-and-trust-at-moneyhub/',
  '/policies/global-terms-of-use/', '/policies/api-terms-of-use/', '/status/',
]);

function classify(path) {
  if (path === '/') return 'home';
  if (path.startsWith('/products/')) return path === '/products/' ? 'listing' : 'product-detail';
  if (path.startsWith('/use-cases/')) return path === '/use-cases/' ? 'listing' : 'use-case-detail';
  if (path.startsWith('/solutions/')) return /\/solutions\/[^/]+\/$/.test(path) ? 'solution-overview' : 'solution-detail';
  if (path.startsWith('/case-studies/')) return path === '/case-studies/' ? 'listing' : 'case-study';
  if (path.startsWith('/articles/')) return path === '/articles/' ? 'listing' : 'article';
  if (path.startsWith('/press-releases/')) return path === '/press-releases/' ? 'listing' : 'press-release';
  if (path.startsWith('/press-and-partners')) return 'listing';
  if (path.startsWith('/webinars/')) return path === '/webinars/' ? 'listing' : 'webinar';
  if (path.startsWith('/webinar-open/')) return 'webinar';
  if (path.startsWith('/glossary/')) return path === '/glossary/' ? 'listing' : 'glossary-entry';
  if (path.startsWith('/policies/')) return 'policy';
  if (path.startsWith('/discover/')) return 'article';
  if (path === '/about/') return 'static';
  if (path === '/careers/') return 'static';
  if (path === '/status/') return 'static';
  if (path === '/contact/' || path.includes('demo-request') || path.includes('-form')) return 'form';
  return 'page';
}

function slugify(path) {
  let s = path.replace(/^\/+|\/+$/g, '').replace(/\//g, '-');
  return s === '' ? 'home' : s.toLowerCase();
}

async function fetchSitemap(name) {
  try {
    const r = await fetch(`${ORIGIN}/${name}-sitemap.xml`, { headers: { 'user-agent': UA } });
    const xml = await r.text();
    return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  } catch { return []; }
}

async function verify(url) {
  try {
    const r = await fetch(url, { method: 'GET', headers: { 'user-agent': UA }, redirect: 'manual' });
    return r.status;
  } catch { return 0; }
}

(async () => {
  const urlSet = new Set();
  // listing/index pages not always in sitemaps
  ['/', '/about/', '/articles/', '/press-and-partners/', '/case-studies/', '/webinars/', '/glossary/', '/use-cases/', '/products/'].forEach((p) => urlSet.add(ORIGIN + p));
  for (const sm of SITEMAPS) {
    const urls = await fetchSitemap(sm);
    urls.forEach((u) => urlSet.add(u.replace(/\/$/, '/')));
  }
  let all = [...urlSet].map((u) => {
    const path = new URL(u).pathname;
    return { url: u, path, slug: slugify(path), template: classify(path), navLinked: navLinked.has(path) };
  });
  // dedup by slug
  const bySlug = {}; all.forEach((p) => { bySlug[p.slug] = p; }); all = Object.values(bySlug);

  // verify 200 (concurrency 8)
  const out = [];
  for (let i = 0; i < all.length; i += 8) {
    const batch = all.slice(i, i + 8);
    const codes = await Promise.all(batch.map((p) => verify(p.url)));
    batch.forEach((p, j) => { p.status = codes[j]; if (codes[j] === 200) out.push(p); });
  }

  // priority sort: navLinked first, then listing/overview, then details
  const tierOf = (p) => {
    if (p.template === 'home') return 0;
    if (p.navLinked) return 1;
    if (p.template === 'listing' || p.template.endsWith('overview')) return 2;
    return 3;
  };
  out.sort((a, b) => tierOf(a) - tierOf(b) || a.template.localeCompare(b.template));

  // caps: 100 overall, 20 per template
  const perTemplate = {}; const roster = [];
  for (const p of out) {
    perTemplate[p.template] = (perTemplate[p.template] || 0);
    if (roster.length >= 100) break;
    if (perTemplate[p.template] >= 20) continue;
    perTemplate[p.template]++;
    roster.push(p);
  }

  const byTemplate = {};
  roster.forEach((p) => { byTemplate[p.template] = (byTemplate[p.template] || 0) + 1; });
  const dropped = out.filter((p) => !roster.includes(p));

  writeFileSync('stardust/migration-roster.json', JSON.stringify({
    _provenance: { writtenBy: 'stardust:extract roster builder', writtenAt: new Date().toISOString() },
    caps: { overall: 100, perTemplate: 20 },
    counts: { discovered200: out.length, inRoster: roster.length, dropped: dropped.length },
    byTemplate, roster, droppedSlugs: dropped.map((p) => p.slug),
  }, null, 2));

  console.log('200-OK pages:', out.length, '| roster:', roster.length, '| dropped:', dropped.length);
  console.log('By template in roster:'); Object.entries(byTemplate).sort().forEach(([k, v]) => console.log(`  ${k.padEnd(20)} ${v}`));
  if (dropped.length) console.log('Dropped (over-cap):', dropped.map((p) => p.slug).join(', '));
})();
