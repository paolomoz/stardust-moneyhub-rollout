// Generate a self-contained brand-review.html for the current state.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
const be = JSON.parse(readFileSync('stardust/current/_brand-extraction.json', 'utf8'));
const pages = readdirSync('stardust/current/pages').filter((f) => f.endsWith('.json'));

// Tensions detectors
const tensions = [];
const home = JSON.parse(readFileSync('stardust/current/pages/home.json', 'utf8'));
if (home.cssCustomProperties.filter((v) => !v.name.startsWith('--wp') && !v.name.startsWith('--tw')).length === 0) {
  tensions.push({ t: 'No first-party design tokens', d: 'All --custom-properties come from WordPress/Tailwind presets; the site ships no authored token system. The redesign should introduce a clean :root token set.' });
}
if (be.motifs.borderRadius.dominant === '0px') {
  tensions.push({ t: 'Sharp vs. soft', d: 'Corners are square (0px) but buttons carry a tiny 2px radius and avatars are circular — the rounding language is inconsistent. Pick one radius scale.' });
}
tensions.push({ t: 'og:image is the logo', d: 'The home og:image is the Moneyhub logo PNG, not a hero image. Share cards will look thin; the redesign should set a real social image per page.' });
tensions.push({ t: 'Consent banner pollutes the fold', d: 'The cookie banner overlays the hero and its buttons dominate the CTA inventory — accounted for during extraction, but a sign the consent UX competes with the value prop.' });

const swatch = (c) => `<div class="sw"><div class="chip" style="background:${c.hex};border:1px solid #ddd"></div><div><b>${c.name}</b><br><code>${c.hex}</code><br><span class="muted">${c.role} · ${c.usage}</span></div></div>`;
const shot = (s) => `<figure><img loading="lazy" src="assets/screenshots/${s}" alt="${s}"><figcaption>${s.replace('.png', '')}</figcaption></figure>`;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Moneyhub — current-state brand review</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<style>
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@700;800&family=Lato:wght@400;700&display=swap');
:root{--orange:#EF5520;--ink:#293338;--grey:#666}
*{box-sizing:border-box}body{font-family:Lato,system-ui,sans-serif;color:var(--ink);margin:0;line-height:1.55}
h1,h2,h3{font-family:Raleway,sans-serif;font-weight:800;color:var(--ink);letter-spacing:-.01em}
header.hd{background:var(--ink);color:#fff;padding:48px 6vw}header.hd h1{color:#fff;font-size:48px;margin:0 0 8px}
header.hd .accent{color:var(--orange)}
section{padding:40px 6vw;border-bottom:1px solid #eee}
h2{font-size:30px;margin:0 0 20px}
.muted{color:var(--grey);font-size:13px}
.sw{display:flex;gap:14px;align-items:center;margin:10px 0}.chip{width:54px;height:54px;flex:0 0 54px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px}
figure{margin:0;border:1px solid #e5e5e5}figure img{width:100%;display:block;max-height:360px;object-fit:cover;object-position:top}
figcaption{padding:8px 10px;font-size:12px;color:var(--grey)}
.tension{border-left:4px solid var(--orange);background:#fff7f3;padding:12px 16px;margin:12px 0}
.specimen .big{font-family:Raleway;font-weight:800;font-size:64px;line-height:1}
.specimen .mid{font-family:Raleway;font-weight:700;font-size:32px}
.specimen p{font-family:Lato;font-size:18px;max-width:60ch}
code{background:#f3f3f3;padding:1px 5px;font-size:12px}
.btn{display:inline-block;background:var(--orange);color:#fff;padding:12px 22px;border-radius:2px;font-family:Raleway;font-weight:700;text-decoration:none}
ul.cols{columns:3;font-size:14px}
</style></head><body>
<header class="hd"><h1>Moneyhub — build for <span class="accent">real life</span></h1>
<div>Current-state brand review · register: <b>${be.site.register}</b> · 20 pages crawled · ${new Date().toISOString().slice(0, 10)}</div></header>

<section><h2>Positioning</h2><p style="max-width:70ch">${be.site.positioning}</p></section>

<section><h2>Palette</h2>${be.palette.map(swatch).join('')}</section>

<section class="specimen"><h2>Typography</h2>
<div class="big">Build for real life</div>
<div class="mid" style="margin:18px 0">Raleway 700 · Lato body</div>
<p>${be.voice.leadParagraph}</p>
<p class="muted">Heading: <b>${be.type.heading.family}</b> (${be.type.heading.weights.join('/')}) · Body: <b>${be.type.body.family}</b> (${be.type.body.weights.join('/')}) · scale ${be.type.heading.scale.join(' / ')} · ${be.type.scaleAudit.kind}</p>
<a class="btn" href="#">Get started</a></section>

<section><h2>Motifs</h2><ul>${be.motifs.patterns.map((p) => `<li>${p}</li>`).join('')}</ul>
<p class="muted">Border-radius: ${be.motifs.borderRadius.dominant} (${be.motifs.borderRadius.note}) · Shadows: ${be.motifs.shadows.note}</p></section>

<section><h2>System components</h2>
<h3>Header nav</h3><p>${be.systemComponents.header.nav.map((n) => n.label).join(' · ')}</p>
<h3>Footer</h3><p class="muted">${be.systemComponents.footer.office}</p>
<ul class="cols">${Object.entries(be.systemComponents.footer.columns).map(([k, v]) => `<li><b>${k}</b><ul>${v.map((x) => `<li>${x}</li>`).join('')}</ul></li>`).join('')}</ul>
<h3>Trusted by</h3><p>${be.trustedBy.join(' · ')}</p></section>

<section><h2>Tensions (${tensions.length})</h2>${tensions.map((x) => `<div class="tension"><b>${x.t}</b><br>${x.d}</div>`).join('')}</section>

<section><h2>Page screenshots (${pages.length})</h2><div class="grid">${readdirSync('stardust/current/assets/screenshots').filter((f) => f.endsWith('.png')).map(shot).join('')}</div></section>
</body></html>`;

writeFileSync('stardust/current/brand-review.html', html);
console.log('brand-review.html written,', tensions.length, 'tensions');
