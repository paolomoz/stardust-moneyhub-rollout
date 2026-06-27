<!-- _provenance: stardust:direct — TARGET visual system for the moneyhub.com redesign. Mode A (brand-faithful). Anchored to stardust/current/_brand-extraction.json. "Faithful redesign, modernized." Single variant. -->

# Moneyhub — Design (target)

---
colors:
  primary: "#EF5520"        # Moneyhub orange — accent, primary buttons, highlights, motif
  primaryDeep: "#C8430F"    # AA-safe orange for text/links on white, hover
  ink: "#293338"            # slate ink — headings
  slateDeep: "#1C2429"      # deep slate — dark full-bleed section backgrounds
  text: "#33403F"           # body copy on light
  muted: "#5C686E"          # secondary text, captions
  background: "#FFFFFF"     # page background
  surface: "#F4F6F7"        # soft grey surface for cards / alternating light bands
  border: "#E2E6E8"         # hairline borders
typography:
  heading: "Raleway"        # 700 / 800
  body: "Lato"              # 400 / 700
  scale: ["clamp(2.5rem,5vw,4rem)", "clamp(2rem,3.5vw,3rem)", "clamp(1.5rem,2.2vw,2rem)", "1.5rem", "1.125rem", "1rem"]
rounded: "4px"              # buttons/inputs/chips; sections & cards stay square (0px) — the signature
spacing: "balanced — section padding clamp(56px, 8vw, 88px); 12-col max-width 1200px"
components: ["sticky-header", "trust-strip", "split-image-text", "card-grid", "case-study-quote", "case-study-carousel", "alternating-color-blocks", "geometric-confetti", "footer-columns", "metadata"]
---

## Intent
**Faithful redesign, modernized.** Keep everything that makes Moneyhub recognisably itself — Raleway + Lato, the single orange accent on slate-and-white, square geometry, the floating confetti motif, alternating full-bleed color blocks, the customer trust strip. Modernize the *execution*: introduce a real design-token system (the live site has none), fix contrast, regularise the type scale with fluid clamps, calm and standardise spacing, and tighten the grids. IA is preserved **verbatim** — this is a migration, not a re-authoring.

## Color
Three-tone discipline, unchanged in spirit:
- **White** canvas with a new soft **surface (#F4F6F7)** so light sections can layer without relying on pure-white-on-white.
- **Slate ink (#293338)** for headings; **deep slate (#1C2429)** for dark full-bleed sections.
- **Orange (#EF5520)** as the one accent — buttons, eyebrows, the confetti, highlight words. For orange *text/links on white*, use **#C8430F** (primaryDeep) so it clears WCAG AA. Never set long body copy in orange.
No gradients; flat depth preserved.

## Typography
**Raleway** 700/800 headings; **Lato** 400/700 body — both self-hosted (woff2 captured under `fonts/`), loaded after first paint via the `body.session` gate with a metric-matched fallback to avoid CLS. Fluid scale: hero `clamp(2.5rem,5vw,4rem)`, h2 `clamp(2rem,3.5vw,3rem)`, h3 `clamp(1.5rem,2.2vw,2rem)`. Body 1.125rem, line-height 1.6.

## Shape & depth
Square corners stay the signature: **0px on sections and cards**. A restrained **4px** on buttons, inputs, and chips is the only modernization (current site is ~2px) — enough to feel current without going bubbly. Depth from color-block contrast and hairline borders (#E2E6E8), not drop shadows.

## Signature motifs (preserved)
1. **Geometric confetti** — floating orange triangles + soft grey blobs around the hero and closing CTA. CSS/SVG, decorative, `aria-hidden`.
2. **Alternating full-bleed color blocks** — white → slate → orange, split image+text rows.
3. **Trust strip** — customer logos on a clean row.
4. **Bordered card grids** — square, hairline-bordered product/case-study cards.

## Chrome
- **Header:** sticky; white, condensing to a compact bar on scroll (keep the orange-on-scroll cue but lighter). Wordmark left, nav center/right, CONTACT primary button. Reserve header height to prevent CLS from the late fragment injection.
- **Footer:** deep slate, multi-column link lists (Solutions / Products / Policies & Info), London office, LinkedIn.

## Accessibility & performance
WCAG 2.1 AA contrast throughout (orange relegated to large text / UI / accents; primaryDeep for orange links). Eager-load only the LCP hero image; everything else lazy. Target Lighthouse 100.
