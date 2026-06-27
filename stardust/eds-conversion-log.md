# EDS conversion log — block names & reuse decisions

Rule: **one prototype `<section>` = one EDS block**; collapse genuinely
same-pattern sections into ONE block + variant classes. Never name a block a
reserved class (`section`, `default-content`, `block-content`, `wrap`, `button`).

Canon-author: `home-proposed.html`. Tokens live in `styles/styles.css :root`.

## Block names (locked)

| Block | Source section(s) | Variants | Notes |
|-------|-------------------|----------|-------|
| (chrome) header | `header` system-component | — | static fragment `fragments/header.html` (postlcp.js) |
| (chrome) footer | `footer` system-component | — | static fragment `fragments/footer.html` |
| `hero` | hero (home), page heroes | `confetti` (home), `compact` (inner) | type-led heading + sub + CTAs + confetti motif |
| `logo-strip` | trust-strip | — | row of customer logos; eyebrow + grid |
| `text-image` | solution-banking, solution-pension, detail splits | `dark`, `media-left` | split image+text row |
| `cta-band` | cta-explore, cta-closing | `slate`, `confetti` | centered heading + CTA row |
| `testimonials` | testimonials | — | quote grid (1–3 quotes) |
| `cards` | products grid, generic feature grids | `products` | bordered icon+title+desc+link grid |
| `case-cards` | suggested-content (case studies) | — | scroll-snap carousel of story cards |
| `article-header` | article/case-study/press hero | — | eyebrow(category) + h1 + meta + lead image |
| `article-body` | article/case-study/press/glossary/policy body | — | long-form prose, headings, lists, quotes |
| `listing-grid` | products/use-cases/case-studies/articles/press/webinars/glossary indexes | per-type | card grid reading a query-index (dynamic, Phase 7) |
| `key-facts` | solution/product feature lists | — | small stat/feature rows where present |
| `form-embed` | contact / demo-request | — | contact form (links to source form action) |
| `metadata` | (all pages) | — | Title/Description + header/footer toggles |

## Reuse decisions
- `text-image` collapses the two home solution sections + every detail-page split
  into one block; `dark` + `media-left` are variant classes.
- `cta-band` covers both home CTA bands (explore, closing) via `slate`/`confetti`.
- `cards` covers the products grid and generic feature grids; `case-cards` is kept
  separate (image-led carousel, different shape).
- Listing pages share ONE `listing-grid` block driven by a query-index, scoped by
  content type (Phase 4.5 metadata contract + helix-query.yaml).

## Reserved-name avoidance
None of the above collide with `section`/`default-content`/`block-content`/`wrap`/`button`.
