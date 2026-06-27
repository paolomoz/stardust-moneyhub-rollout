// Deploy one or more EDS content body-fragments to DA: sanitise → PUT → preview → live → verify.
// Usage: node deploy.mjs <path-without-ext>[,<path2>,...]   (reads content/<path>.html)
//   or:  node deploy.mjs --all   (deploys every content/**/*.html)
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

const ORG = 'paolomoz';
const REPO = 'stardust-moneyhub-rollout';
const BRANCH = 'main';
const HOST = `${BRANCH}--${REPO}--${ORG}`;
const TOKEN = (readFileSync('.env', 'utf8').match(/DA_TOKEN=(.+)/) || [])[1]?.trim();
if (!TOKEN) { console.error('NO DA_TOKEN'); process.exit(1); }
const AUTH = { Authorization: `Bearer ${TOKEN}` };

function listContent() {
  const out = [];
  const walk = (d) => readdirSync(d).forEach((f) => { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else if (f.endsWith('.html')) out.push(p.replace(/^content\//, '').replace(/\.html$/, '')); });
  walk('content');
  return out;
}

async function deployOne(path) {
  const file = `content/${path}.html`;
  // 1. sanitise (in place)
  execSync(`node stardust/deploy-tools/sanitise.js ${file}`, { stdio: 'pipe' });
  const html = readFileSync(file);
  // 2. PUT to DA source (multipart, field `data`)
  const fd = new FormData();
  fd.append('data', new Blob([html], { type: 'text/html' }), `${path.split('/').pop()}.html`);
  const put = await fetch(`https://admin.da.live/source/${ORG}/${REPO}/${path}.html`, { method: 'PUT', headers: AUTH, body: fd });
  if (![200, 201].includes(put.status)) return { path, ok: false, stage: 'PUT', code: put.status, msg: (await put.text()).slice(0, 120) };
  // 3. preview
  const prev = await fetch(`https://admin.hlx.page/preview/${ORG}/${REPO}/${BRANCH}/${path}`, { method: 'POST', headers: AUTH });
  if (prev.status !== 200) return { path, ok: false, stage: 'preview', code: prev.status, msg: (await prev.text()).slice(0, 120) };
  // 4. live (publish)
  const live = await fetch(`https://admin.hlx.page/live/${ORG}/${REPO}/${BRANCH}/${path}`, { method: 'POST', headers: AUTH });
  if (live.status !== 200) return { path, ok: false, stage: 'live', code: live.status, msg: (await live.text()).slice(0, 120) };
  // 5. verify rendered .plain.html
  const url = `https://${HOST}.aem.live/${path}.plain.html`;
  const r = await fetch(url, { headers: { 'accept-encoding': 'gzip' } });
  const body = r.status === 200 ? await r.text() : '';
  const h1 = (body.match(/<h1/g) || []).length;
  const err = (body.match(/about:error/g) || []).length;
  const imgs = (body.match(/<img/g) || []).length;
  return { path, ok: r.status === 200 && err === 0, stage: 'verify', code: r.status, h1, err, imgs };
}

const arg = process.argv[2];
const paths = arg === '--all' ? listContent() : arg.split(',');
const results = [];
for (const p of paths) {
  try { const r = await deployOne(p); results.push(r); console.log(`${r.ok ? 'OK  ' : 'FAIL'} ${p.padEnd(60)} ${r.stage} ${r.code} h1=${r.h1 ?? '-'} err=${r.err ?? '-'} img=${r.imgs ?? '-'}${r.msg ? ' :: ' + r.msg : ''}`); }
  catch (e) { results.push({ path: p, ok: false, msg: e.message }); console.log(`FAIL ${p} :: ${e.message}`); }
}
const ok = results.filter((r) => r.ok).length;
console.log(`\nDeployed ${ok}/${results.length} OK`);
writeFileSync('stardust/deploy-tools/_last-deploy.json', JSON.stringify(results, null, 2));
if (ok < results.length) process.exitCode = 1;
