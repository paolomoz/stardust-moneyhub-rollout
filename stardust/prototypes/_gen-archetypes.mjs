// Generate article / listing / detail archetype prototypes sharing the home canon CSS.
import { readFileSync, writeFileSync } from 'node:fs';

// pull the canon CSS from the home prototype (everything inside the first <style>)
const home = readFileSync('stardust/prototypes/home-proposed.html', 'utf8');
const canonCss = home.match(/<style>([\s\S]*?)<\/style>/)[1];

const HEADER = `<header class="site-header" data-section="header" data-intent="navigate" data-layout="sticky-bar">
  <div class="wrap">
    <a class="brand" href="/" aria-label="Moneyhub home">moneyhub<span class="dot">.</span></a>
    <button class="nav-toggle" aria-expanded="false" aria-controls="site-nav" aria-label="Toggle navigation">☰</button>
    <nav class="site-nav" id="site-nav" aria-label="Primary">
      <a href="/solutions/banking-and-lending-solutions/">Banking &amp; Lending</a>
      <a href="/solutions/pension-and-wealth-solutions/">Pension &amp; Wealth</a>
      <a href="/products/">Products</a>
      <a href="/developers/">Developers</a>
      <a href="/discover/">Discover</a>
      <a href="/about/">About</a>
      <a class="btn btn-primary" href="/contact/">Contact</a>
    </nav>
  </div>
</header>`;

const FOOTER = home.match(/<footer class="site-footer"[\s\S]*?<\/footer>/)[0];
const NAVJS = `<script>(function(){var t=document.querySelector('.nav-toggle'),n=document.getElementById('site-nav');if(!t||!n)return;t.addEventListener('click',function(){var o=n.classList.toggle('open');t.setAttribute('aria-expanded',o?'true':'false');});})();</script>`;

const extraCss = `
/* article */
.article-header{padding-block:clamp(48px,7vw,80px) 0;background:var(--mh-surface);border-bottom:1px solid var(--mh-border)}
.article-header .wrap{max-width:820px}
.article-header .tag{font-family:var(--mh-font-head);font-weight:700;text-transform:uppercase;letter-spacing:.06em;font-size:.8125rem;color:var(--mh-orange-deep)}
.article-header h1{margin-top:.75rem;font-size:clamp(2rem,4vw,3.25rem)}
.article-header .meta{color:var(--mh-muted);font-size:.95rem;margin:.5rem 0 1.5rem}
.article-lead{margin-top:-1px}
.article-lead img{width:100%;max-height:460px;object-fit:cover}
.article-body{padding-block:clamp(40px,6vw,72px)}
.article-body .wrap{max-width:760px}
.article-body h2{font-size:clamp(1.5rem,2.6vw,2rem);margin-top:2rem}
.article-body h3{margin-top:1.75rem}
.article-body p,.article-body li{font-size:1.0625rem;color:var(--mh-text)}
.article-body blockquote{border-left:3px solid var(--mh-orange);margin:1.5rem 0;padding:.5rem 0 .5rem 1.25rem;font-size:1.25rem;color:var(--mh-ink);font-family:var(--mh-font-head);font-weight:600}
.related{background:var(--mh-surface);border-top:1px solid var(--mh-border)}
/* listing */
.listing-hero{padding-block:clamp(48px,7vw,80px) 0;text-align:center}
.listing-hero p{margin-inline:auto}
.listing-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.5rem}
.lcard{border:1px solid var(--mh-border);background:#fff;display:flex;flex-direction:column}
.lcard img{width:100%;aspect-ratio:8/5;object-fit:cover}
.lcard .body{padding:1.5rem;display:flex;flex-direction:column;gap:.5rem;flex:1}
.lcard .tag{font-family:var(--mh-font-head);font-weight:700;text-transform:uppercase;letter-spacing:.06em;font-size:.75rem;color:var(--mh-orange-deep)}
.lcard h3{font-size:1.125rem}
.lcard p{font-size:.95rem;color:var(--mh-muted)}
.lcard .more{font-family:var(--mh-font-head);font-weight:700;font-size:.875rem;color:var(--mh-orange-deep);margin-top:auto}
/* key-facts */
.key-facts{background:var(--mh-surface)}
.kf-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;margin-top:1rem}
.kf{border:1px solid var(--mh-border);background:#fff;padding:1.75rem}
.kf h3{color:var(--mh-orange-deep);font-size:1.5rem;margin-bottom:.25rem}
.kf p{font-size:.95rem;color:var(--mh-text);margin:0}
@media(max-width:768px){.kf-grid{grid-template-columns:1fr}}
`;

function doc({ title, desc, prov, body }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<!-- stardust:provenance
${prov}
  voiceClassification: all copy captured-verbatim (source page) / curled live
  copyCadenceBypass: [em-dash-overuse, marketing-buzzword] (verbatim, Discipline 9)
  reflexRejectAudit: bypassed (Mode A — Raleway/Lato pinned)
-->
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Raleway:wght@500;600;700;800&family=Lato:wght@400;700&display=swap" rel="stylesheet">
<style>${canonCss}${extraCss}</style>
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
${HEADER}
<main id="main">
${body}
</main>
${FOOTER}
${NAVJS}
</body>
</html>`;
}

// ---- ARTICLE archetype (Mercer case study, verbatim curled body) ----
writeFileSync('stardust/prototypes/case-study-proposed.html', doc({
  title: 'Transforming pensions engagement through Mercer Money — Moneyhub',
  desc: 'Mercer Money, powered by Moneyhub, transforms pension engagement for Master Trust members, providing a holistic financial wellbeing view.',
  prov: '  page: case-studies-mercer-money\n  template: article\n  pageUrl: https://moneyhub.com/case-studies/transforming-pensions-engagement-through-mercer-money/',
  body: `
  <section class="article-header" data-section="article-header" data-intent="introduce" data-layout="stacked">
    <div class="wrap">
      <span class="tag">Case study · Pensions</span>
      <h1>Transforming pensions engagement through Mercer Money</h1>
      <p class="meta">How Mercer white-labelled Moneyhub's PFM platform to lift Master Trust member engagement.</p>
    </div>
  </section>
  <section class="article-lead" data-section="lead-image" data-intent="illustrate" data-layout="full">
    <img src="https://moneyhub.com/wp-content/uploads/2025/09/shutterstock_2636134361-1500x1034-c-default.jpg" alt="People reviewing pension and financial wellbeing information" loading="eager" fetchpriority="high">
  </section>
  <section class="article-body" data-section="article-body" data-intent="explain" data-layout="prose">
    <div class="wrap">
      <p>Mercer is a global consulting firm that specialises in providing advice and solutions in the areas of talent, health, retirement, and investments.</p>
      <p>Mercer understands the impact poor financial health can have on someone's work life, and their retirement. Mercer was looking for an innovative way to help support financial wellbeing for members of its Mercer Master Trust pension scheme.</p>
      <p>It also wanted to make it easy for members to engage with and understand their pensions, and to view retirement savings in the context of their wider financial wellness.</p>
      <h2>The solution</h2>
      <p>Mercer has white-labelled our Personal Financial Management platform to develop 'Mercer Money', enabling Mercer Master Trust members to build a holistic view of their finances including earnings, savings, investments and pensions.</p>
      <p>Mercer Money provides details of each member's Mercer Master Trust retirement savings and investments. Its features include pension modelling capabilities and an in-app pension transfer request service.</p>
      <p>Moneyhub's analytics and intelligence ensure Mercer Money users are continually engaged through personalised, actionable nudges that keep them on track to meet their goals.</p>
      <h2>The results</h2>
      <p>Following an extensive User Experience (UX) overhaul, completed in partnership with Mercer and digital agency Hugo &amp; Cat, app engagement soared.</p>
      <p>We partnered with Idomoo's Next Generation Video Platform to roll out personalised pension statement videos on Mercer Money. The new integration sends users dynamic, personalised videos that explain their personal pension statements in an easily digestible manner.</p>
      <blockquote>"As we continue our journey to equip Mercer Master Trust members to achieve the best possible pension savings outcomes, Moneyhub's commitment and cutting-edge solutions remain integral to our success."</blockquote>
      <p>— Tim Adams, Head of Digital, Mercer</p>
    </div>
  </section>
  <section class="section related" data-section="related" data-intent="navigate" data-layout="card-grid">
    <div class="wrap">
      <h2>Related case studies</h2>
      <div class="listing-grid" style="margin-top:1.5rem">
        <a class="lcard" href="/case-studies/improving-pension-engagement-and-financial-wellbeing-with-scottish-widows/"><div class="body"><span class="tag">Pensions</span><h3>Improving pension engagement with Scottish Widows</h3><span class="more">Read more →</span></div></a>
        <a class="lcard" href="/case-studies/building-the-uks-most-engaging-pensions-app-for-standard-life/"><div class="body"><span class="tag">Pensions</span><h3>Building the UK's most engaging pensions app for Standard Life</h3><span class="more">Read more →</span></div></a>
        <a class="lcard" href="/case-studies/the-well-one-money-financial-wellbeing-proposition/"><div class="body"><span class="tag">Wellbeing</span><h3>The Well One Money financial wellbeing proposition</h3><span class="more">Read more →</span></div></a>
      </div>
    </div>
  </section>`,
}));

// ---- LISTING archetype (case studies index) ----
const cards = [
  ['Banking', 'How Spring app transformed digital savings with Moneyhub', '/case-studies/how-spring-app-transformed-digital-savings-with-moneyhub/', 'Paragon-case-study-thumbnail-800x500-c-default.png'],
  ['Lending', 'Refining loan approvals and reducing risk with Admiral Money', '/case-studies/refining-loan-approvals-and-reducing-risk-with-admiral-money-personal-loans/', 'Admiral-Money-case-study-thumbnail-800x500-c-default.jpg'],
  ['Wealth', 'Bridging the advice gap with WPS Advisory', '/case-studies/bridging-the-advice-gap-with-wps-advisory/', 'WPS-Advisory-case-study-thumbnail-800x500-c-default.jpg'],
  ['Pensions', 'Transforming pensions engagement through Mercer Money', '/case-studies/transforming-pensions-engagement-through-mercer-money/', null],
  ['Pensions', 'Improving pension engagement and financial wellbeing with Scottish Widows', '/case-studies/improving-pension-engagement-and-financial-wellbeing-with-scottish-widows/', null],
  ['Payments', 'Nationwide deploys real-time savings account funding through Open Banking payments', '/case-studies/nationwide-deploys-real-time-savings-account-funding-through-open-banking-payments/', null],
].map(([t, h, href, img]) => `<a class="lcard" href="${href}">${img ? `<img src="https://moneyhub.com/wp-content/uploads/2025/09/${img}" alt="${h}" loading="lazy">` : ''}<div class="body"><span class="tag">${t}</span><h3>${h}</h3><span class="more">Read more →</span></div></a>`).join('\n        ');

writeFileSync('stardust/prototypes/case-studies-proposed.html', doc({
  title: 'Case Studies — Moneyhub',
  desc: 'Discover how banks, lenders, pension and wealth providers build for real life with Moneyhub open finance data.',
  prov: '  page: case-studies\n  template: listing\n  pageUrl: https://moneyhub.com/case-studies/',
  body: `
  <section class="listing-hero section" data-section="listing-hero" data-intent="introduce" data-layout="centered">
    <div class="wrap" style="max-width:760px">
      <p class="eyebrow">Case studies</p>
      <h1>Discover case studies</h1>
      <p>See how leading financial institutions partner with Moneyhub to deliver intelligent, personalised financial journeys.</p>
    </div>
  </section>
  <section class="section" data-section="listing-grid" data-intent="browse" data-layout="card-grid" data-dynamic="case-study-index">
    <div class="wrap">
      <div class="listing-grid">
        ${cards}
      </div>
    </div>
  </section>`,
}));

// ---- DETAIL archetype (Targeted Support solution detail) ----
writeFileSync('stardust/prototypes/solutions-targeted-support-proposed.html', doc({
  title: 'Targeted Support — Moneyhub',
  desc: 'Approach the incoming Targeted Support regulations with confidence in data segmentation to make customised recommendations.',
  prov: '  page: solutions-targeted-support\n  template: detail (program)\n  pageUrl: https://moneyhub.com/solutions/pension-and-wealth-solutions/targeted-support/',
  body: `
  <section class="hero" data-section="hero" data-intent="introduce" data-layout="type-led-centered" data-variant="compact" style="padding-block:clamp(56px,8vw,96px)">
    <div class="confetti" aria-hidden="true"><i class="tri c1"></i><i class="blob c2"></i><i class="tri sm c3"></i></div>
    <div class="wrap" style="position:relative;z-index:2">
      <p class="eyebrow">Pension and Wealth Solutions</p>
      <h1>Targeted Support: make personalised recommendations</h1>
      <p>Approach the incoming Targeted Support regulations with confidence. Use accurate data segmentation to make customised recommendations at scale.</p>
      <div class="cta-row" style="margin-top:2rem;display:flex;gap:1rem;justify-content:center;flex-wrap:wrap"><a class="btn btn-primary" href="/contact/">Get started</a></div>
    </div>
  </section>
  <section class="section split" data-section="text-image" data-intent="explain" data-layout="split-image-text">
    <div class="wrap">
      <div class="copy">
        <h2>Plug and play</h2>
        <p>Firms need accurate segmentation to get their Targeted Support right. This extensive cohort segmentation is built on Moneyhub's market-leading data, ready to plug into your existing journeys.</p>
        <a class="btn btn-primary" href="/contact/">Learn more</a>
      </div>
      <div class="media"><img src="https://moneyhub.com/wp-content/uploads/2025/09/shutterstock_2475092117-e1757699337718-1358x936-c-center.jpg" alt="Adviser and client reviewing targeted support options" loading="lazy"></div>
    </div>
  </section>
  <section class="section key-facts" data-section="key-facts" data-intent="impact" data-layout="grid-3">
    <div class="wrap">
      <p class="eyebrow">Why it matters</p>
      <div class="kf-grid">
        <div class="kf"><h3>62%</h3><p>Boost user engagement by 62%. Cohort segmentation might feel like rocket science, but Moneyhub is already using it to lift engagement.</p></div>
        <div class="kf"><h3>Compliance</h3><p>Meet compliance requirements. Firms that proactively respond to Targeted Support will be held to high regulatory standards — Moneyhub helps you meet them.</p></div>
        <div class="kf"><h3>Real-time</h3><p>Segment in real time on enriched data, so recommendations stay relevant to each customer's circumstances.</p></div>
      </div>
    </div>
  </section>
  <section class="section testimonials" data-section="testimonials" data-intent="social-proof" data-layout="quote-grid" style="background:#fff">
    <div class="wrap">
      <div class="quote-grid" style="grid-template-columns:1fr;max-width:760px;margin-inline:auto">
        <figure class="quote"><blockquote>"As we continue our journey to equip Mercer Master Trust members to achieve the best possible pension savings outcomes, Moneyhub's commitment and cutting-edge solutions remain integral to our success."</blockquote><figcaption class="who">Tim Adams<span>Head of Digital, Mercer</span></figcaption></figure>
      </div>
    </div>
  </section>
  <section class="section band accent" data-section="cta-closing" data-intent="primary-action" data-layout="band" data-variant="confetti">
    <div class="confetti" aria-hidden="true"><i class="tri c1"></i><i class="blob c2"></i><i class="blob dark c4"></i></div>
    <div class="wrap" style="position:relative;z-index:2"><h2>Ready to build for real life?</h2><div class="cta-row" style="display:flex;gap:1rem;justify-content:center;margin-top:1.5rem"><a class="btn btn-primary" href="/contact/">Get started</a></div></div>
  </section>`,
}));

console.log('Wrote 3 archetype prototypes: case-study, case-studies (listing), solutions-targeted-support (detail)');
