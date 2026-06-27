// Phase 8 — link audit. Collect every internal href from authored content +
// fragments, resolve each against the live tree, report non-200s.
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const HOST = 'https://main--stardust-moneyhub-rollout--paolomoz.aem.live';

function walk(d, out = []) {
  readdirSync(d).forEach((f) => { const p = join(d, f); if (statSync(p).isDirectory()) walk(p, out); else if (f.endsWith('.html')) out.push(p); });
  return out;
}

const files = [...walk('content'), ...walk('fragments')];
const links = new Map(); // href -> [files]
for (const f of files) {
  const html = readFileSync(f, 'utf8');
  for (const m of html.matchAll(/href="(\/[^"#]*)"/g)) {
    const href = m[1];
    if (href.startsWith('/blocks') || href.startsWith('/styles') || href.startsWith('/scripts')) continue;
    if (!links.has(href)) links.set(href, []);
    links.get(href).push(f.replace('content/', '').replace('.html', ''));
  }
}

const hrefs = [...links.keys()].sort();
console.log(`Auditing ${hrefs.length} unique internal links across ${files.length} files...\n`);
const broken = [];
const batch = 12;
for (let i = 0; i < hrefs.length; i += batch) {
  const slice = hrefs.slice(i, i + batch);
  // eslint-disable-next-line no-await-in-loop
  const codes = await Promise.all(slice.map(async (h) => {
    const url = h === '/' ? `${HOST}/` : `${HOST}${h}`;
    try { const r = await fetch(url, { method: 'GET', headers: { 'accept-encoding': 'gzip' } }); return [h, r.status]; } catch { return [h, 'ERR']; }
  }));
  codes.forEach(([h, c]) => { if (c !== 200) { broken.push({ href: h, code: c, from: links.get(h) }); console.log(`  ${c}  ${h}   (linked from ${links.get(h).slice(0, 3).join(', ')}${links.get(h).length > 3 ? ` +${links.get(h).length - 3}` : ''})`); } });
}
console.log(`\n${hrefs.length - broken.length}/${hrefs.length} links OK${broken.length ? `, ${broken.length} BROKEN` : ' — all resolve ✓'}`);
writeFileSync('stardust/deploy-tools/_link-audit.json', JSON.stringify({ total: hrefs.length, broken }, null, 2));
