# Moneyhub → AEM Edge Delivery — Migration Report

**Source:** https://moneyhub.com/
**Target:** `paolomoz/stardust-moneyhub-rollout` (DA) → `main--stardust-moneyhub-rollout--paolomoz.aem.live`
**Mode:** A — brand-faithful, verbatim IA
**Date:** 2026-06-27

## Result

**100 / 100 pages live & healthy** — HTTP 200, exactly one `<h1>`, zero
`about:error`, expected images, across all 14 templates. **89 / 89 internal
links resolve.** Zero deploy failures.

| Template | Live | | Template | Live |
|---|---|---|---|---|
| article | 20/20 | | press-release | 18/18 |
| case-study | 10/10 | | product-detail | 6/6 |
| solution-detail | 12/12 | | policy | 6/6 |
| listing | 8/8 | | use-case-detail | 5/5 |
| glossary-entry | 4/4 | | webinar | 3/3 |
| static | 3/3 | | solution-overview | 2/2 |
| form | 2/2 | | home | 1/1 |

## Pipeline

- **Extract** — Playwright crawl, 20 archetype pages + brand surface (logo,
  palette, fonts, system components) → `stardust/current/`.
- **Direct** — single Mode-A variant. Tokens: orange `#EF5520` (links
  `#C8430F` for AA on white), slate ink `#293338`, deep slate `#1C2429`
  dark sections, surface `#F4F6F7`. Raleway (head) + Lato (body). Square
  structure, 4px interactive radius. → root `PRODUCT.md` / `DESIGN.md` /
  `DESIGN.json` / `stardust/direction.md`.
- **Prototype** — home + 3 archetypes rendered via impeccable craft.
- **Migrate (4 + 4.5)** — 100 roster pages authored from live source (curl
  → verbatim content → block markup). Metadata contract (Title, Description,
  Category, Template, PublishDate) emitted inline. 6 query-indexes defined
  **before** import (`helix-query.yaml`, `dynamic-blocks-map.md`).
- **Deploy / Rollout (5-6)** — `sanitise → PUT → preview → live → verify`
  per page; verified against rendered `.plain.html`, not admin 200s.
- **Dynamic blocks (7)** — `listing-grid` renders static authored cards as a
  graceful fallback, then enhances from its `*-index.json` (validated on the
  case-studies flagship: 11 cards from the live index, image-rich, sorted).
- **Link audit (8)** — every internal href resolved against the live tree.
- **Verify (9)** — `coverage-dashboard.html` + this report.

## Foundation

- AuthorKit runtime (`ak.js`/`lazy.js`/`postlcp.js`), self-hosted Raleway +
  Lato, static header/footer fragments with scoped styles + mobile nav.
- 12 blocks: hero (confetti), logo-strip, text-image (dark/media-left),
  cta-band (slate/confetti), testimonials, cards, case-cards, article-header,
  article-body, listing-grid (dynamic), key-facts, form-embed.
- Clean ESLint + Stylelint.

## Key fixes found in delivery (see ~/.claude memory)

1. **Trailing-slash 404** — EDS documents have no trailing slash; `/path/`
   404s. Stripped trailing slashes from every internal link (149 content +
   19 fragment). `href="/"` is the only exception.
2. **AuthorKit button classes** — `ak.js` emits `a.btn` / `.btn-primary` /
   `.btn-secondary` in `p.btn-group`, not the stock `.button` family. CSS
   aligned.
3. **Admin 200 ≠ delivered** — verification GETs the rendered `.plain.html`
   and asserts h1/error/img counts; a headless render checks decoration.

## Decisions (hands-off judgment calls)

- **Volume cap 100** — prioritised header/footer-linked + section landing +
  representative detail spread (≤20/template).
- **4 dangling links** — 3 targets live but un-migrated (outside cap) →
  repointed to absolute `moneyhub.com` source; 1 was **404 at source** (a
  pre-existing broken origin link) → unwrapped to plain text, not fabricated.
- **Detail pages** rendered as `article-header` + `article-body` for verbatim
  content completeness; home + listings get the richer bespoke/dynamic blocks.

## Artifacts

- `stardust/deploy-tools/` — `author.mjs`, `run-author.mjs`, `deploy.mjs`,
  `link-audit.mjs`, `build-dashboard.mjs`, `coverage-dashboard.html`,
  `_verify.json`, `_link-audit.json`.
- `content/` — 100 authored DA body fragments.
- `helix-query.yaml`, `stardust/dynamic-blocks-map.md`, `stardust/migration-roster.json`.
