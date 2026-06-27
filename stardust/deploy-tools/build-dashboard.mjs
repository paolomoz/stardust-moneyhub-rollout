// Phase 9 — verify every roster page live, emit coverage dashboard + report.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const HOST = 'https://main--stardust-moneyhub-rollout--paolomoz.aem.live';
const roster = JSON.parse(readFileSync('stardust/migration-roster.json', 'utf8')).roster;

function norm(p) {
  let s = p.toLowerCase().replace(/\/+$/, '').replace(/^\/+/, '/');
  s = s.split('/').map((seg) => seg.replace(/_/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '')).join('/').replace(/\/+/g, '/');
  return s === '' ? 'index' : s.replace(/^\//, '');
}

// content files actually authored
const authored = new Set();
(function walk(d) { readdirSync(d).forEach((f) => { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else if (f.endsWith('.html')) authored.add(p.replace(/^content\//, '').replace(/\.html$/, '')); }); })('content');

const pages = roster.map((r) => ({ slug: r.slug, template: r.template, path: norm(r.path) }));
// ensure home is index
const results = [];
const batch = 12;
for (let i = 0; i < pages.length; i += batch) {
  const slice = pages.slice(i, i + batch);
  // eslint-disable-next-line no-await-in-loop
  const r = await Promise.all(slice.map(async (pg) => {
    const url = pg.path === 'index' ? `${HOST}/` : `${HOST}/${pg.path}`;
    try {
      const res = await fetch(`${url.replace(/\/$/, '')}.plain.html`.replace(`${HOST}.plain.html`, `${HOST}/index.plain.html`), { headers: { 'accept-encoding': 'gzip' } });
      const body = res.status === 200 ? await res.text() : '';
      return { ...pg, code: res.status, h1: (body.match(/<h1/g) || []).length, err: (body.match(/about:error/g) || []).length, img: (body.match(/<img/g) || []).length, authored: authored.has(pg.path) };
    } catch (e) { return { ...pg, code: 'ERR', h1: 0, err: 0, img: 0, authored: authored.has(pg.path) }; }
  }));
  results.push(...r);
  process.stdout.write('.');
}
process.stdout.write('\n');

const ok = results.filter((r) => r.code === 200 && r.err === 0 && r.h1 >= 1);
const byTpl = {};
results.forEach((r) => { (byTpl[r.template] ||= { total: 0, ok: 0 }).total += 1; if (ok.includes(r)) byTpl[r.template].ok += 1; });

console.log(`\nLive & healthy: ${ok.length}/${results.length}`);
Object.entries(byTpl).sort().forEach(([t, v]) => console.log(`  ${t.padEnd(20)} ${v.ok}/${v.total}`));
const bad = results.filter((r) => !ok.includes(r));
if (bad.length) { console.log('\nNeeds attention:'); bad.forEach((r) => console.log(`  ${r.code} h1=${r.h1} err=${r.err}  /${r.path}`)); }

writeFileSync('stardust/deploy-tools/_verify.json', JSON.stringify({ ok: ok.length, total: results.length, byTpl, results }, null, 2));

// dashboard HTML
const rows = results.map((r) => `<tr class="${ok.includes(r) ? 'ok' : 'bad'}"><td>${r.code === 200 && r.err === 0 && r.h1 >= 1 ? '✓' : '✗'}</td><td><a href="${HOST}/${r.path === 'index' ? '' : r.path}" target="_blank">/${r.path === 'index' ? '' : r.path}</a></td><td>${r.template}</td><td>${r.code}</td><td>${r.h1}</td><td>${r.img}</td></tr>`).join('\n');
const tplRows = Object.entries(byTpl).sort().map(([t, v]) => `<tr><td>${t}</td><td>${v.ok}/${v.total}</td></tr>`).join('\n');
const html = `<!doctype html><html><head><meta charset="utf-8"><title>Moneyhub migration — coverage</title>
<style>body{font:14px/1.5 -apple-system,system-ui,sans-serif;margin:2rem;color:#293338}h1{font-size:1.5rem}table{border-collapse:collapse;margin:1rem 0;width:100%}td,th{padding:4px 10px;border-bottom:1px solid #e2e6e8;text-align:left}.ok td:first-child{color:#1a8f3c}.bad td:first-child{color:#c8430f;font-weight:700}.summary{display:flex;gap:2rem;flex-wrap:wrap}.card{background:#f4f6f7;padding:1rem 1.5rem;border-radius:4px}.big{font-size:2rem;font-weight:800;color:#ef5520}a{color:#c8430f}</style></head>
<body><h1>Moneyhub → AEM Edge Delivery — migration coverage</h1>
<div class="summary"><div class="card"><div class="big">${ok.length}/${results.length}</div>pages live &amp; healthy</div><div class="card"><div class="big">${Object.keys(byTpl).length}</div>templates</div></div>
<h2>By template</h2><table><tr><th>Template</th><th>OK</th></tr>${tplRows}</table>
<h2>All pages</h2><table><tr><th></th><th>Path</th><th>Template</th><th>HTTP</th><th>H1</th><th>Img</th></tr>${rows}</table>
<p style="color:#5c686e">Generated against ${HOST}</p></body></html>`;
writeFileSync('stardust/deploy-tools/coverage-dashboard.html', html);
console.log('\nDashboard: stardust/deploy-tools/coverage-dashboard.html');
