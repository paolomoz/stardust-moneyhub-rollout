<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape
  writtenAt:        2026-06-27T00:00:00Z
  page:             home
  pageUrl:          https://moneyhub.com/
  againstDirection: stardust/direction.md (Active 2026-06-27, Mode A, verbatim IA)
  consumedBy:       impeccable:craft
  readArtifacts:
    - stardust/current/pages/home.json
    - stardust/current/_brand-extraction.json
    - DESIGN.md
    - DESIGN.json
    - stardust/direction.md
  stardustVersion:  0.13.0
  surprise:         low
  capturedSourceLineage: see ## Sections (every section cites its captured origin)
  antiTemplatePass:
    - { pattern: "hero", defaultReflex: "centered-stack hero + two-button pair", alternatives: ["split 6/5 type-left + confetti-right", "type-led full-bleed"], picked: "centered type-led with confetti field", rationale: "captured hero IS a centered type-led canvas with geometric confetti; it is the brand signature, not a reflex" }
    - { pattern: "product-cards", defaultReflex: "5-up image-card grid", alternatives: ["2-col bordered icon cards", "vertical ledger"], picked: "2-col bordered icon cards", rationale: "captured products section is a 2-col square bordered icon+title+desc+link grid" }
    - { pattern: "case-cards", defaultReflex: "3-up image grid", alternatives: ["horizontal scroll carousel", "stacked"], picked: "carousel of bordered story cards", rationale: "captured 'See what's possible' is a horizontal carousel of category+title+read-more cards" }
  substrateTransitions: { default: "white", exceptions: ["slate for Banking solution + Explore band (captured dark sections)", "orange accents only"] }
  voiceClassification: all body/headline copy classified captured-verbatim (sourced from current/pages/home.json); see notes
  copyCadenceBypass: { rules: ["em-dash-overuse","marketing-buzzword"], basis: "captured-verbatim copy under ia-fidelity:verbatim (Discipline 9)" }
  reflexRejectAudit: { bypassed: true, reason: "Mode A — display=Raleway, body=Lato pinned from capture" }
-->
---
slug: home
url: https://moneyhub.com/
register: brand
mode: A
iaFidelity: verbatim
surprise: low
---

# Page shape: home

Faithful reproduction of moneyhub.com home with the modernized token system.
Every section maps 1:1 to a captured region; copy is captured-verbatim.

## Sections (in render order)

1. **header** (system-component role: `header`) — site-wide nav, carried from
   `_brand-extraction.json#systemComponents.header`. Composition: sticky, white,
   wordmark left, nav (Banking and Lending Solutions · Pension and Wealth
   Solutions · Products · Developers · Discover · About), CONTACT primary button
   right. *Note: rendered as the static prototype's `<header>`; becomes the EDS
   header fragment at deploy.*

2. **hero** — captured from `pages/home.json#landmarks[main].children[0]`
   (`hero-home`). Centered type-led canvas. H1 "Build for **real life**" (orange
   highlight on "real life"). Sub: "We collect, enrich, and contextualise the
   data fragments. Enabling you to deliver intelligent personalised financial
   journeys and drive better customer outcomes." Primary CTA "Get started" →
   `/contact/`. **Geometric-confetti motif** (orange triangles + grey blobs),
   CSS/SVG, `aria-hidden`. captured-verbatim.

3. **trust-strip** — captured customer logos (`_brand-extraction.json#trustedBy`):
   Lloyds, Scottish Widows, Admiral Money, Mercer, Nationwide, Standard Life,
   Paragon, L&G. Row of logos on white. Eyebrow "Trusted by". *Logos rendered as
   real `<img>` from source uploads where resolvable; otherwise text wordmarks.*

4. **solution-banking** — captured `children[4]` (`text-image`, dark). Split
   image+text on **slate**. H2 "Banking and lending solutions". Two body paras
   (verbatim). CTA "Explore" → `/solutions/banking-and-lending-solutions/`. Image:
   captured lifestyle photo (right). captured-verbatim.

5. **solution-pension** — captured `children[5]` (`text-image`, light). Split
   text+image on **white**. H2 "Pension and wealth solutions". Two body paras
   (verbatim). CTA "Learn more" → `/solutions/pension-and-wealth-solutions/`.
   Image left/right per captured. captured-verbatim.

6. **cta-explore** — captured `children[6]` (`cta`). Slate band. H2 "Explore your
   potential with Moneyhub". CTAs "Products" → `/products/`, "Developers" →
   `/developers/`. captured-verbatim.

7. **testimonials** — captured `children[7]+[8]`. Lead "Find out how Moneyhub
   builds for real life" + testimonial quotes (verbatim, with attribution):
   Admiral (Tim Parry), Mercer (Tim Adams), Nationwide (Daniel King). CTA "Read
   case study" / "All case studies" → `/case-studies/`. captured-verbatim.

8. **products** — captured `children[9]` (`products`). Eyebrow "Products" (orange),
   intro para (verbatim), 2-col bordered icon cards: Categorisation and Enrichment
   Engine · Data Aggregation · Data Explorer · Data Insights and Recommendations ·
   Embedded Solutions and Portals · Payments — each title + captured description +
   link to its `/products/<slug>/`. captured-verbatim.

9. **cta-closing** — captured `children[10]` (`cta`). H2 "Ready to build for real
   life?" + confetti, CTA "Get started" → `/contact/`. captured-verbatim.

10. **case-cards** — captured `children[11]` (`suggested-content`). H2 "See what's
    possible with Moneyhub". Horizontal carousel of case-study cards (category tag
    + customer + title + "Read more"): Paragon (Spring), Admiral Money, WPS
    Advisory, etc. Links to each `/case-studies/<slug>/`. captured-verbatim.

11. **footer** (system-component role: `footer`) — site-wide, carried from
    `_brand-extraction.json#systemComponents.footer`. Deep slate, columns
    Solutions / Products / Policies & Info, London office, LinkedIn. *Becomes the
    EDS footer fragment at deploy.*

## Layout strategy
- Density: balanced — section padding `clamp(56px, 8vw, 88px)`, max-width 1200px.
- 12-col grid, 32px gutters desktop; collapses to single column < 768px.
- Split rows (solution-banking/pension) stack at < 1024px.
- Products grid 2-col → 1-col < 768px. Case-cards carousel → horizontal scroll-snap.

## Key states
- Default — above. Carousel: CSS scroll-snap (no JS dependency for content).
- Empty (no testimonials/cases) — render section heading + "Contact us →". For migrate's from-scratch path.

## Interaction model
- All CTAs link to existing local paths (see per-section hrefs).
- Confetti is decorative, non-interactive, `aria-hidden`.
- Case-cards: CSS scroll-snap carousel; keyboard-scrollable.

## Data attributes
- `header[data-section="header"][data-intent="navigate"][data-layout="sticky-bar"]`
- `section[data-section="hero"][data-intent="primary-action"][data-layout="type-led-centered"]`
- `section[data-section="trust-strip"][data-intent="social-proof"][data-layout="logo-row"][data-items="8"]`
- `section[data-section="solution-banking"][data-intent="explain"][data-layout="split-image-text"][data-variant="dark"]`
- `section[data-section="solution-pension"][data-intent="explain"][data-layout="split-image-text"][data-variant="light"]`
- `section[data-section="cta-explore"][data-intent="navigate"][data-layout="band"][data-variant="slate"]`
- `section[data-section="testimonials"][data-intent="social-proof"][data-layout="quote-carousel"]`
- `section[data-section="products"][data-intent="explore"][data-layout="grid-2"][data-items="6"]`
- `section[data-section="cta-closing"][data-intent="primary-action"][data-layout="band"][data-variant="confetti"]`
- `section[data-section="case-cards"][data-intent="proof"][data-layout="card-carousel"]`
- `footer[data-section="footer"][data-intent="navigate"][data-layout="columns"]`

## Unsourced content (placeholder list)
- **None of the prose.** All copy is captured-verbatim from `pages/home.json`.
- Customer logo image files: use real source uploads when the URL resolves 200;
  where a specific logo asset is not resolvable, render the customer name as a
  text wordmark (NOT a fabricated logo). No invented stats — the home has none.
