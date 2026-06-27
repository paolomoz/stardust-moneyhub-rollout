# Stardust journal — moneyhub.com → AEM Edge Delivery

Project: full production migration of https://moneyhub.com to AEM EDS.
EDS repo: `paolomoz/stardust-moneyhub-rollout` (branch `main`).
DA folder: `paolomoz/stardust-moneyhub-rollout`.
Run mode: fully hands-off (no approval gates, single design direction).
Volume cap: 100 pages overall / 20 per template / header-linked first.

---

## 2026-06-27 — Phase 0 (Setup) + Phase 1 (Extract)

**Phase 0 — Setup.**
- Confirmed repo is vanilla `aem-boilerplate` → ran the Runtime bootstrap from
  `stardust:deploy`: ported the AuthorKit runtime (`ak.js`, `lazy.js`,
  `postlcp.js`, `scripts.js`, `scripts/utils/*`, `deps/`, `tools/`,
  `blocks/fragment`, `blocks/section-metadata`, `.hlxignore`) from the
  Hirslanden reference project (the canonical "latest test branch" carrying
  BOTH mandatory edits). Removed boilerplate (`aem.js`, `delayed.js`,
  demo blocks header/footer/cards/columns/hero/widget, `fonts.css`,
  `lazy-styles.css`). Verified edit #1 (no `utils/footer` import in lazy.js)
  and edit #2 (`el.className = name` in postlcp.js). Wrote clean `head.html`,
  updated `.eslintignore` for the vendored runtime.
- DA_TOKEN present in `.env` (1485 chars) → smoke-tested: `GET /list/...` = 200.
  DA folder already had boilerplate `index.html`/`nav.html`/`footer.html`.
- `.gitignore` updated to exclude `.env*`, `qa/`, `samples/`.

**Phase 1 — Extract.**
- moneyhub.com is a WordPress (Yoast) site, server-rendered → `medium` wait.
- Sitemaps: ~146 URLs across post(21)/page(28)/press-releases(19)/
  case-studies(11)/use-cases(6)/products(6)/glossary(5)/webinars(4)/faqs(46).
- Crawled **20 archetype pages** with Playwright (consent dismissed, scroll +
  reveal pass, full capture list). **20/20 OK, 0 failures**, 8 fonts saved.
- Brand DNA: **Raleway** (headings, 700/800) + **Lato** (body); accent
  **orange #EF5520**, ink **slate #293338**, white canvas, **0px corners**,
  flat depth, **geometric-confetti** motif, alternating full-bleed color
  blocks, customer trust strip, dark footer. Voice: "Build for real life",
  confident outcome-led B2B.
- Wrote `current/PRODUCT.md`, `current/DESIGN.md`, `current/DESIGN.json`,
  `current/_brand-extraction.json`, `current/_crawl-log.json`, `state.json`,
  `assets/logo.svg`, per-page JSON + screenshots.
- Built **migration roster** (`migration-roster.json`): 102 pages verified
  200, capped to **100** across 14 templates (2 dropped over-cap).

**Decisions:** Header nav targets (`/about/`, `/articles/`, `/press-and-partners/`,
section listings) are NOT in the page sitemap — captured explicitly and flagged
nav-linked (Phase 8 priority). Bulk page content will be curled fresh at author
time during rollout (per prompt), not Playwright-extracted for all 100.

**Next:** Phase 2 — direct (set one canonical redesign direction).

## 2026-06-27 — Phase 2 (Direct)

Resolved ONE canonical direction (hands-off, no gate): **Mode A brand-faithful,
single variant, verbatim IA, balanced density** — "faithful redesign, modernized."
No divergence roll (brand signal strong). Deltas are modernization-only: real
`:root` token system, WCAG-AA orange (#C8430F for on-white text), fluid clamp()
type scale, calmed spacing on a 1200px grid, +4px interactive radius (structure
stays square). Wrote target `PRODUCT.md`, `DESIGN.md`, `DESIGN.json`,
`stardust/direction.md`; state.json direction set, 20 pages → directed.

**Next:** Phase 3 — prototype home, then one page per template.
