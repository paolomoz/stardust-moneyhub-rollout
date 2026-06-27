// stardust:extract — Playwright capture for moneyhub.com archetype set
// Implements the mandatory capture list from playwright-recipe.md
import pw from '/private/tmp/claude-502/-Users-paolo-stardust-rollout-stardust-moneyhub-rollout/21829465-ee8e-43f4-ada1-08cdd470f8fc/scratchpad/pw/node_modules/playwright/index.js';
const { chromium } = pw;
import { createHash } from 'node:crypto';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ORIGIN = 'https://moneyhub.com';
const OUT = 'stardust/current';
const VERSION = '0.13.0';

// archetype set: [slug, path, inferredType]
const PAGES = [
  ['home', '/', 'landing'],
  ['about', '/about/', 'static'],
  ['products', '/products/', 'listing'],
  ['products-data-explorer', '/products/data-explorer/', 'program'],
  ['solutions-pension-and-wealth', '/solutions/pension-and-wealth-solutions/', 'landing'],
  ['solutions-targeted-support', '/solutions/pension-and-wealth-solutions/targeted-support/', 'program'],
  ['use-cases', '/use-cases/', 'listing'],
  ['use-cases-increase-deposits-with-savings-goals', '/use-cases/increase-deposits-with-savings-goals/', 'program'],
  ['case-studies', '/case-studies/', 'listing'],
  ['case-studies-mercer-money', '/case-studies/transforming-pensions-engagement-through-mercer-money/', 'article'],
  ['articles', '/articles/', 'listing'],
  ['articles-democratising-financial-advice', '/articles/how-technology-is-democratising-financial-advice/', 'article'],
  ['press-and-partners', '/press-and-partners/', 'listing'],
  ['press-releases-uk-demands-payment-methods', '/press-releases/uk-demands-more-innovative-payment-methods/', 'article'],
  ['webinars', '/webinars/', 'listing'],
  ['glossary', '/glossary/', 'listing'],
  ['glossary-consumer-duty', '/glossary/consumer-duty/', 'article'],
  ['contact', '/contact/', 'form'],
  ['careers', '/careers/', 'static'],
  ['policies-privacy-policy', '/policies/privacy-policy/', 'static'],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const hash6 = (s) => createHash('sha1').update(s).digest('hex').slice(0, 6);

const fontResponses = new Map(); // url -> buffer
const crawlLog = { _provenance: { writtenBy: 'stardust:extract', writtenAt: new Date().toISOString() }, discovery: { origin: ORIGIN, source: 'sitemap_index.xml', fetchTechnique: 'headless-chromium' }, consent: {}, crawl: { successes: [], failures: [] } };

async function dismissConsent(context) {
  const page = await context.newPage();
  try {
    await page.goto(ORIGIN + '/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    const apiTried = await page.evaluate(() => {
      try { if (window.OneTrust?.RejectAll) { window.OneTrust.RejectAll(); return 'api:OneTrust.RejectAll'; } } catch {}
      try { if (window.Cookiebot?.dismiss) { window.Cookiebot.dismiss(); return 'api:Cookiebot.dismiss'; } } catch {}
      return null;
    });
    let method = apiTried;
    if (!method) {
      const chain = ['#onetrust-reject-all-handler', '#onetrust-accept-btn-handler', '#CybotCookiebotDialogBodyButtonDecline', '[aria-label*="reject" i]', '[aria-label*="accept" i]', 'button:has-text("Accept")', 'button:has-text("Allow")'];
      for (const sel of chain) {
        try { await page.click(sel, { timeout: 2500 }); method = `selector:${sel}`; break; } catch {}
      }
    }
    crawlLog.consent.method = method ?? 'none-detected';
  } catch (e) {
    crawlLog.consent.method = 'failed:' + e.message.slice(0, 60);
  } finally {
    await page.close();
  }
}

// In-page capture function (runs in browser)
const CAPTURE = () => {
  const norm = (s) => (s || '').replace(/\s+/g, ' ').trim();
  const cs = (el, pseudo) => getComputedStyle(el, pseudo || undefined);
  const domPath = (el) => {
    const parts = [];
    let n = el;
    while (n && n.nodeType === 1 && parts.length < 6) {
      let s = n.tagName.toLowerCase();
      if (n.id) { s += '#' + n.id; parts.unshift(s); break; }
      const cls = (n.className && typeof n.className === 'string') ? '.' + n.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
      parts.unshift(s + cls);
      n = n.parentElement;
    }
    return parts.join(' > ');
  };

  // headings
  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => {
    const st = cs(h);
    return { level: +h.tagName[1], text: norm(h.innerText), id: h.id || null, domPath: domPath(h),
      style: { fontFamily: st.fontFamily, fontWeight: st.fontWeight, fontSize: st.fontSize, lineHeight: st.lineHeight, letterSpacing: st.letterSpacing, color: st.color } };
  });

  // landmarks
  const lmSel = 'header,nav,main,aside,footer,[role=banner],[role=navigation],[role=main],[role=complementary],[role=contentinfo],[role=region]';
  const seen = new Set();
  const landmarks = [...document.querySelectorAll(lmSel)].filter((el) => { if (seen.has(el)) return false; seen.add(el); return true; }).map((el) => {
    const children = [...el.querySelectorAll(':scope > section, :scope > div')].slice(0, 30).map((c) => {
      const h = c.querySelector('h1,h2,h3,h4,h5,h6');
      const body = [...c.querySelectorAll(':scope > p, :scope > blockquote, :scope * > p')].slice(0, 25).map((p) => norm(p.textContent)).filter((t) => t.length > 0).slice(0, 15);
      const lists = [...c.querySelectorAll(':scope ul, :scope ol')].slice(0, 8).map((l) => ({ ordered: l.tagName === 'OL', items: [...l.querySelectorAll(':scope > li')].map((li) => norm(li.textContent)).filter(Boolean).slice(0, 20) })).filter((l) => l.items.length);
      const qa = [...c.querySelectorAll('details')].map((d) => ({ q: norm(d.querySelector('summary')?.textContent), a: norm([...d.childNodes].filter((n) => n.nodeName !== 'SUMMARY').map((n) => n.textContent).join(' ')) || null }));
      const quotes = [...c.querySelectorAll('blockquote, [class*="testimonial" i], [class*="quote" i]')].slice(0, 6).map((q) => ({ text: norm(q.textContent).slice(0, 600) })).filter((q) => q.text.length > 20);
      const txt = norm(c.innerText);
      return { tag: c.tagName.toLowerCase(), id: c.id || null, classes: (typeof c.className === 'string' ? c.className.split(/\s+/).filter(Boolean) : []).slice(0, 6),
        headlineText: h ? norm(h.innerText) : null, innerTextSummary: txt.slice(0, 240), wordCount: txt ? txt.split(/\s+/).length : 0, body, lists, qa, quotes };
    });
    return { tag: el.tagName.toLowerCase(), role: el.getAttribute('role') || null, id: el.id || null,
      classes: (typeof el.className === 'string' ? el.className.split(/\s+/).filter(Boolean) : []).slice(0, 6),
      innerText: norm(el.innerText), children };
  });

  // CTAs
  const isButtonish = (el) => {
    const st = cs(el); const r = parseFloat(st.borderRadius) || 0; const bg = st.backgroundColor;
    const hasBg = bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent';
    return (el.tagName === 'BUTTON' || el.getAttribute('role') === 'button' || (el.tagName === 'A' && hasBg && r > 2));
  };
  const vh = window.innerHeight;
  const ctas = [...document.querySelectorAll('a,button,[role=button]')].filter(isButtonish).slice(0, 40).map((el) => {
    const st = cs(el); const rect = el.getBoundingClientRect();
    return { label: norm(el.innerText) || el.getAttribute('aria-label') || '', href: el.getAttribute('href') || null, tag: el.tagName.toLowerCase(), domPath: domPath(el),
      style: { backgroundColor: st.backgroundColor, color: st.color, fontFamily: st.fontFamily, fontWeight: st.fontWeight, borderRadius: st.borderRadius, padding: st.padding, boxShadow: st.boxShadow },
      appearsAbove: rect.top < vh ? 'fold' : 'below-fold' };
  }).filter((c) => c.label);

  // links
  const host = location.host;
  const internal = [], external = [], li = new Set(), le = new Set();
  for (const a of document.querySelectorAll('a[href]')) {
    let href = a.getAttribute('href'); if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) continue;
    let u; try { u = new URL(href, location.href); } catch { continue; }
    const text = norm(a.innerText).slice(0, 80);
    const key = u.pathname + '|' + text;
    if (u.host === host) { if (!li.has(key)) { li.add(key); internal.push({ href: u.pathname + u.search, text, domPath: domPath(a) }); } }
    else { if (!le.has(u.host + key)) { le.add(u.host + key); external.push({ href: u.href, text, domPath: domPath(a) }); } }
  }

  // media: images
  const images = [...document.querySelectorAll('img')].map((img) => ({ src: img.currentSrc || img.src, srcset: img.getAttribute('srcset') || null, alt: img.getAttribute('alt') || '', naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight }))
    .filter((i) => i.src && !i.src.startsWith('data:'));
  // inline svg
  const inlineSvgCount = document.querySelectorAll('svg').length;
  // iframes / video
  const iframes = [...document.querySelectorAll('iframe')].map((f) => ({ src: f.src, title: f.getAttribute('title') || null }));
  const videos = [...document.querySelectorAll('video')].map((v) => ({ src: v.src || (v.querySelector('source')?.src) || null, poster: v.getAttribute('poster') || null }));
  // css backgrounds (visible-size filter >=100x80), incl pseudo
  const cssBackgrounds = [];
  const all = document.querySelectorAll('*');
  for (const el of all) {
    const rect = el.getBoundingClientRect();
    if (rect.width < 100 || rect.height < 80) continue;
    for (const pseudo of [null, '::before', '::after']) {
      let bi; try { bi = cs(el, pseudo).backgroundImage; } catch { continue; }
      if (!bi || bi === 'none' || !bi.includes('url(')) continue;
      const urls = [...bi.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map((m) => m[1]).filter((u) => !u.startsWith('data:'));
      if (!urls.length) continue;
      const st = cs(el, pseudo);
      cssBackgrounds.push({ urls, domPath: domPath(el) + (pseudo || ''), rect: { w: Math.round(rect.width), h: Math.round(rect.height), top: Math.round(rect.top) }, backgroundSize: st.backgroundSize, backgroundPosition: st.backgroundPosition, backgroundRepeat: st.backgroundRepeat });
    }
    if (cssBackgrounds.length > 60) break;
  }

  // forms
  const forms = [...document.querySelectorAll('form')].map((f) => ({ action: f.getAttribute('action') || null, method: (f.getAttribute('method') || 'get').toLowerCase(),
    fields: [...f.querySelectorAll('input,select,textarea')].map((i) => ({ type: i.type || i.tagName.toLowerCase(), name: i.name || null })).slice(0, 30) }));

  // widgets
  const widgets = { modals: document.querySelectorAll('[role=dialog],dialog').length, accordions: document.querySelectorAll('details,[aria-expanded]').length, tabs: document.querySelectorAll('[role=tablist]').length };

  // per-section style (per landmark)
  const perSectionStyle = landmarks.map((lm, i) => {
    const el = [...document.querySelectorAll(lmSel)][i]; if (!el) return null; const st = cs(el);
    return { landmark: lm.tag + (lm.id ? '#' + lm.id : ''), backgroundColor: st.backgroundColor, color: st.color, padding: st.padding, fontFamily: st.fontFamily };
  }).filter(Boolean);

  // css custom properties
  const rootStyle = cs(document.documentElement);
  const cssCustomProperties = [];
  for (let i = 0; i < rootStyle.length; i++) { const n = rootStyle[i]; if (n.startsWith('--')) cssCustomProperties.push({ name: n, value: rootStyle.getPropertyValue(n).trim() }); }

  // meta
  const meta = (sel, attr = 'content') => document.querySelector(sel)?.getAttribute(attr) || null;
  const og = { title: meta('meta[property="og:title"]'), description: meta('meta[property="og:description"]'), image: meta('meta[property="og:image"]'), type: meta('meta[property="og:type"]'), siteName: meta('meta[property="og:site_name"]') };
  const themeColor = { light: meta('meta[name="theme-color"]') };

  // logo candidate: inline svg in header, or img with logo-ish id in header
  let logo = null;
  const header = document.querySelector('header,[role=banner]');
  if (header) {
    const limg = [...header.querySelectorAll('img')].find((i) => /logo|brand|moneyhub/i.test(i.src + ' ' + i.alt + ' ' + i.className + ' ' + i.id));
    if (limg) logo = { type: 'img', src: limg.currentSrc || limg.src, alt: limg.alt };
    else { const svg = header.querySelector('svg'); if (svg) logo = { type: 'inline-svg', markup: svg.outerHTML.slice(0, 8000) }; }
  }

  const bodyText = norm(document.body.innerText);
  return { title: document.title, metaDescription: meta('meta[name="description"]'), og, themeColor, language: document.documentElement.lang || 'en',
    headings, landmarks, ctas, links: { internal, external }, media: { images, inlineSvgCount, iframes, videos, cssBackgrounds }, forms, widgets, perSectionStyle, cssCustomProperties, logo,
    stats: { wordCount: bodyText ? bodyText.split(/\s+/).length : 0, ctaCount: ctas.length, internalLinkCount: internal.length, externalLinkCount: external.length, imageCount: images.length } };
};

async function revealAndScroll(page) {
  // scroll bottom in 4 steps
  await page.evaluate(async () => {
    const h = document.body.scrollHeight; const step = window.innerHeight;
    for (let y = 0; y < h; y += step) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 300)); }
    window.scrollTo(0, 0);
  });
  await sleep(300);
  // reveal pass
  await page.evaluate(() => {
    document.querySelectorAll('details:not([open])').forEach((d) => { d.open = true; });
    document.querySelectorAll('[aria-expanded="false"]').forEach((b) => { if (!b.closest('[role=dialog]')) { try { b.click(); } catch {} } });
    document.querySelectorAll('[role=tab]').forEach((t) => { try { t.click(); } catch {} });
  });
  await sleep(400);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, colorScheme: 'light', locale: 'en-US', reducedMotion: 'reduce', ignoreHTTPSErrors: true, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36' });

  context.on('response', async (resp) => {
    const u = resp.url();
    if (/\.(woff2?|ttf|otf|eot)(\?|$)/i.test(u) && !fontResponses.has(u)) {
      try { const buf = await resp.body(); fontResponses.set(u, buf); } catch {}
    }
  });

  await dismissConsent(context);
  console.log('consent:', crawlLog.consent.method);

  const stateEntries = [];
  for (const [slug, path, type] of PAGES) {
    const url = ORIGIN + path;
    const page = await context.newPage();
    const t0 = Date.now();
    let resp, waitMode = 'domcontentloaded';
    try {
      resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      waitMode = 'medium';
      await sleep(2000); // grace
      await revealAndScroll(page);
      const status = resp ? resp.status() : 0;
      const ct = (resp?.headers()['content-type'] || '').split(';')[0];
      if (status >= 400) throw Object.assign(new Error('HTTP ' + status), { cls: 'HTTPError' });
      if (ct && !/text\/html|application\/xhtml/.test(ct)) throw Object.assign(new Error('ct ' + ct), { cls: 'ContentTypeError' });
      const data = await page.evaluate(CAPTURE);
      const waitMs = Date.now() - t0;
      // screenshot
      const shotPath = join(OUT, 'assets/screenshots', slug + '.png');
      await page.screenshot({ path: shotPath, fullPage: true }).catch(() => {});
      // save og image / hero to media (download a few key images)
      const rec = {
        _provenance: { writtenBy: 'stardust:extract', writtenAt: new Date().toISOString(), readArtifacts: [url], synthesizedInputs: [], stardustVersion: VERSION, renderedBy: 'playwright', fetchedAt: new Date(t0).toISOString(), waitMode, waitMs, httpStatus: status, contentType: ct, finalUrl: page.url() },
        slug, url, finalUrl: page.url(), type, ...data, screenshot: shotPath,
      };
      writeFileSync(join(OUT, 'pages', slug + '.json'), JSON.stringify(rec, null, 2));
      const bgCount = data.media.cssBackgrounds.length;
      const bigImgs = data.media.images.filter((i) => i.naturalWidth >= 600).length;
      console.log(`OK  ${slug.padEnd(48)} ${status} ${String(waitMs).padStart(5)}ms img/bg=${data.media.images.length}/${bgCount} big=${bigImgs} h=${data.headings.length}`);
      crawlLog.crawl.successes.push({ slug, url, status, waitMs });
      stateEntries.push({ slug, url, type, status: 'extracted', currentStatePath: join(OUT, 'pages', slug + '.json'), bgCount, bigImgs });
    } catch (e) {
      console.log(`FAIL ${slug} :: ${e.cls || 'Error'} :: ${e.message.slice(0, 80)}`);
      crawlLog.crawl.failures.push({ slug, url, errorClass: e.cls || 'Error', message: e.message.slice(0, 200) });
    } finally {
      await page.close();
    }
  }

  // save fonts
  let fontList = [];
  for (const [u, buf] of fontResponses) {
    const base = u.split('/').pop().split('?')[0];
    const p = join(OUT, 'assets/fonts', base);
    try { writeFileSync(p, buf); fontList.push({ url: u, localPath: p, family: null }); } catch {}
  }
  crawlLog.fonts = fontList;
  writeFileSync(join(OUT, '_crawl-log.json'), JSON.stringify(crawlLog, null, 2));
  writeFileSync(join(OUT, '_state-entries.json'), JSON.stringify(stateEntries, null, 2));
  console.log(`\nFonts saved: ${fontList.length}`);
  console.log(`Pages OK: ${crawlLog.crawl.successes.length}  FAIL: ${crawlLog.crawl.failures.length}`);
  await browser.close();
})();
