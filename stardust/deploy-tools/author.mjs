// Author EDS body-fragments for the migration roster by curling each source page
// and mapping verbatim content into the block library.
// Usage: node author.mjs <slug|all> [--limit N]
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

const ORIGIN = 'https://moneyhub.com';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0 Safari/537.36';
const roster = JSON.parse(readFileSync('stardust/migration-roster.json', 'utf8')).roster;

const NAMED = { amp: '&', nbsp: ' ', pound: '£', euro: '€', hellip: '…', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”', ndash: '–', mdash: '—', quot: '"', apos: "'", lt: '<', gt: '>', copy: '©', reg: '®', trade: '™', deg: '°' };
const dec = (s) => s
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => { try { return String.fromCodePoint(parseInt(h, 16)); } catch { return ''; } })
  .replace(/&#(\d+);/g, (_, d) => { try { return String.fromCodePoint(+d); } catch { return ''; } })
  .replace(/&([a-z]+);/gi, (m, n) => (NAMED[n] !== undefined ? NAMED[n] : m));
const strip = (h) => dec(h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// path normalisation per prompt: lowercase, collapse, no double slash, trim -/_
function normPath(p) {
  let s = p.toLowerCase().replace(/\/+$/, '').replace(/^\/+/, '/');
  s = s.split('/').map((seg) => seg.replace(/_/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '')).join('/');
  s = s.replace(/\/+/g, '/');
  return s === '' ? 'index' : s.replace(/^\//, '');
}

async function fetchSrc(url) {
  const r = await fetch(url, { headers: { 'user-agent': UA } });
  if (r.status !== 200) throw new Error('HTTP ' + r.status);
  return r.text();
}

function extractMeta(html) {
  const title = strip((html.match(/<title>([^<]*)<\/title>/i) || [])[1] || '');
  const desc = strip((html.match(/<meta name="description" content="([^"]*)"/i) || [])[1] || '');
  return { title: title.replace(/\s*[-|]\s*Moneyhub\s*$/, ''), desc };
}

// Pull main content region; collect ordered content nodes.
function extractContent(html) {
  let main = (html.match(/<main[^>]*>([\s\S]*?)<\/main>/i) || [])[1] || html;
  // drop scripts/styles/forms/svg/header/footer/nav remnants
  main = main.replace(/<(script|style|noscript|svg|form|header|footer|nav|button|select)[^>]*>[\s\S]*?<\/\1>/gi, ' ');
  main = main.replace(/<!--[\s\S]*?-->/g, ' ');
  const nodes = [];
  const re = /<(h1|h2|h3|h4|p|li|blockquote)[^>]*>([\s\S]*?)<\/\1>|<img\b[^>]*>/gi;
  let m;
  const seen = new Set();
  while ((m = re.exec(main))) {
    if (m[0].startsWith('<img')) {
      const src = (m[0].match(/\bsrc="([^"]+)"/) || [])[1];
      const alt = strip((m[0].match(/\balt="([^"]*)"/) || [])[1] || '');
      if (src && !src.startsWith('data:') && /\.(jpg|jpeg|png|webp)(\?|$)/i.test(src) && !/logo|icon|favicon|avatar|spacer|placeholder/i.test(src)) nodes.push({ t: 'img', src, alt });
      continue;
    }
    const tag = m[1].toLowerCase();
    const txt = strip(m[2]);
    if (!txt || txt.length < 2) continue;
    if (/^(read more|share|menu|search|cookie|accept|reject|skip to|block settings|toggle|previous|next|loading|follow us|london office)\b/i.test(txt)) continue;
    if (/^(block settings|settings|contents|categories|linkedin|connections status)$/i.test(txt)) continue;
    if (/70 gracechurch|all rights reserved|financial conduct authority|©\s*20/i.test(txt)) continue;
    const key = tag + '|' + txt.slice(0, 60);
    if (seen.has(key)) continue; seen.add(key);
    // preserve inline links/em/strong in p/li/blockquote
    let inner = m[2].replace(/<(?!\/?(a|em|strong|b|i)\b)[^>]+>/gi, ' ').replace(/\s+/g, ' ').trim();
    inner = dec(inner).replace(/\sclass="[^"]*"/g, '').replace(/<a\s+href="([^"]*)"[^>]*>/gi, (mm, h) => `<a href="${h.replace(ORIGIN, '')}">`);
    nodes.push({ t: tag, txt, html: inner });
  }
  return nodes;
}

function imgOk(cache) { return async (src) => {
  if (cache.has(src)) return cache.get(src);
  try { const r = await fetch(src, { method: 'GET', headers: { 'user-agent': UA } }); const ok = r.status === 200; cache.set(src, ok); return ok; } catch { cache.set(src, false); return false; }
}; }

function metaBlock(title, desc, meta = {}) {
  let rows = `        <div><div>Title</div><div>${esc(title).slice(0, 70)}</div></div>
        <div><div>Description</div><div>${esc(desc || title).slice(0, 175)}</div></div>\n`;
  if (meta.category) rows += `        <div><div>Category</div><div>${esc(meta.category)}</div></div>\n`;
  if (meta.template) rows += `        <div><div>Template</div><div>${esc(meta.template)}</div></div>\n`;
  if (meta.publishDate) rows += `        <div><div>PublishDate</div><div>${esc(meta.publishDate)}</div></div>\n`;
  return `    <div>
      <div class="metadata">
${rows}      </div>
    </div>\n`;
}

function bodyFrag(inner) {
  return `<body>\n  <header></header>\n  <main>\n${inner}  </main>\n  <footer></footer>\n</body>\n`;
}

// Render article-style page (article-header + article-body)
function renderArticle({ title, desc, h1, category, leadImg, nodes, meta }) {
  let s = metaBlock(title, desc, meta);
  s += `    <div>\n      <div class="article-header${leadImg ? '' : ''}">\n        <div><div>\n`;
  if (category) s += `          <p><em>${esc(category)}</em></p>\n`;
  s += `          <h1>${esc(h1)}</h1>\n`;
  if (leadImg) s += `          <img src="${leadImg.src}" alt="${esc(leadImg.alt || h1)}">\n`;
  s += `        </div></div>\n      </div>\n    </div>\n`;
  // body
  s += `    <div>\n      <div class="article-body">\n        <div><div>\n`;
  for (const n of nodes) {
    if (n.t === 'img') { s += `          <img src="${n.src}" alt="${esc(n.alt)}">\n`; continue; }
    if (n.t === 'blockquote') { s += `          <blockquote>${n.html}</blockquote>\n`; continue; }
    if (n.t === 'li') { s += `          <ul><li>${n.html}</li></ul>\n`; continue; }
    if (n.t === 'h2' || n.t === 'h3' || n.t === 'h4') { s += `          <${n.t === 'h4' ? 'h3' : n.t}>${esc(n.txt)}</${n.t === 'h4' ? 'h3' : n.t}>\n`; continue; }
    s += `          <p>${n.html}</p>\n`;
  }
  s += `        </div></div>\n      </div>\n    </div>\n`;
  return bodyFrag(s);
}

// Render listing page (hero default-content + listing-grid of cards)
function renderListing({ title, desc, h1, cards, meta }) {
  let s = metaBlock(title, desc, meta);
  s += `    <div>\n      <h1>${esc(h1)}</h1>\n      <p>${esc(desc || '')}</p>\n    </div>\n`;
  s += `    <div>\n      <div class="listing-grid">\n`;
  for (const c of cards) {
    s += `        <div><div>\n`;
    if (c.tag) s += `          <p><em>${esc(c.tag)}</em></p>\n`;
    s += `          <h3>${esc(c.title)}</h3>\n`;
    if (c.excerpt) s += `          <p>${esc(c.excerpt)}</p>\n`;
    s += `          <p><a href="${c.href}">Read more</a></p>\n        </div></div>\n`;
  }
  s += `      </div>\n    </div>\n`;
  return bodyFrag(s);
}

export { ORIGIN, UA, roster, normPath, fetchSrc, extractMeta, extractContent, imgOk, renderArticle, renderListing, bodyFrag, metaBlock, strip, dec, esc };
