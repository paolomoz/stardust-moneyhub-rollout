<!-- _provenance: stardust:extract — descriptive visual system of the EXISTING moneyhub.com (cross-page aggregation of 20 pages). Not the target. -->

# Moneyhub — Design (current state)

---
colors:
  primary: "#EF5520"      # Moneyhub orange — accent, buttons, highlights, motif
  ink: "#293338"          # slate ink — headings, dark sections, footer
  text: "#212121"         # body copy
  background: "#FFFFFF"   # page background, cards
  surface: "#666666"      # muted bands, secondary text
  border: "#000000"
typography:
  heading: "Raleway"      # 700 / 800
  body: "Lato"            # 400 / 700
  scale: ["64px", "48px", "32px", "24px", "18px", "16px"]
rounded: "0px"            # sharp corners; ~2px on buttons only
spacing: "generous, full-bleed color-block sections"
components: ["sticky header", "trust logo strip", "split image+text rows", "bordered card grid", "case-study quote", "case-study card carousel", "alternating color blocks", "geometric confetti motif", "dark footer with link columns"]
---

## Color
A disciplined three-tone system: **white** canvas, **slate ink (#293338)** for type and dark full-bleed sections, and a single **orange (#EF5520)** accent for highlights, primary buttons, section eyebrows/headings, and the floating geometric motif. Mid-grey (#666) for muted bands. No gradients.

## Typography
**Raleway** (700/800) for all headings — geometric, confident, slightly condensed feel at large sizes. **Lato** (400/700) for body — humanist, highly legible. Clean descending scale (64 → 48 → 32 → 24). Both are Google Fonts (OFL), captured under `assets/fonts/`.

## Shape & depth
Square corners throughout (0px), buttons barely rounded (~2px). Near-flat — almost no drop shadows. Separation is achieved by alternating section background colors (white / slate / orange) rather than elevation.

## Signature motifs
1. **Geometric confetti** — small floating orange triangles and soft grey rounded blobs scattered around the hero and closing CTA. The most distinctive brand-visual element.
2. **Alternating full-bleed color blocks** — solution sections alternate white and slate backgrounds, each a split image+text row with an orange CTA.
3. **Trust strip** — row of customer logos (Lloyds, Scottish Widows, Admiral, Mercer, Nationwide, Standard Life, Paragon, L&G) on white cards.
4. **Bordered card grids** — products and case studies as square-cornered, thin-bordered cards.

## Chrome
- **Header:** sticky; white on load, condenses to an orange bar on scroll. Wordmark left, nav center/right, CONTACT button.
- **Footer:** dark slate, multi-column link lists (Solutions / Products / Policies & Info), London office address, LinkedIn.

## Imagery
Real lifestyle photography (people, advisers, customers) + product UI screenshots. Image-led, not illustration-led.
