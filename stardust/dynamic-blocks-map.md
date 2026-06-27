# Dynamic blocks map (Phase 4.5 — defined BEFORE bulk import)

The blocks that LIST other pages must read an EDS **query-index**, not static
cards. Decided up front so the metadata contract is emitted inline at author
time and the indexes are rich at import.

## Listing blocks → query-index

| Listing page | Block | Index (`helix-query.yaml`) | Source glob |
|---|---|---|---|
| `/case-studies/` | `listing-grid` | `/case-studies-index.json` | `/case-studies/**` |
| `/articles/` | `listing-grid` | `/articles-index.json` | `/articles/**` |
| `/press-and-partners/` | `listing-grid` | `/press-releases-index.json` | `/press-releases/**` |
| `/products/` | `listing-grid` | `/products-index.json` | `/products/**` |
| `/use-cases/` | `listing-grid` | `/use-cases-index.json` | `/use-cases/**` |
| `/glossary/` | `listing-grid` | `/glossary-index.json` | `/glossary/**` |
| `/webinars/` | `listing-grid` | (static — only 3 items) | — |

## Metadata contract (emitted inline at author time, per content type)

Every content page's `metadata` block carries:
- **Title** (≤60 chars, from the real `<h1>`)
- **Description** (≤160 chars)
- **Category** — human label (e.g. "Case study", "Article", "Press release")
- **Template** — the design template key (case-study, article, …) for filtering
- **PublishDate** (ISO, articles + press releases only — from `article:published_time`)

A query-index row carries only **page-intrinsic DOM** (og:title/og:image via
selectors) + **page metadata** (Category, Template, PublishDate via `<meta>`).
No many-to-many relationships (Tier-3 kept static).

## Index build
- `helix-query.yaml` authored at repo root (6 scoped indexes).
- Indexes build against the **LIVE** tree → every page is **published** (POST /live/)
  in the deploy loop, not preview-only.
- Phase 7 rewrites `listing-grid` to fetch its `*-index.json` (chunked, filter/
  sort, graceful static fallback). One flagship validated (case-studies) before
  converting the rest.
