<!-- _provenance: stardust:direct — resolved direction + reasoning trace for moneyhub.com. -->

# Direction — Moneyhub redesign

**Resolved:** 2026-06-27 · **Phrase:** "faithful redesign, modernized" (run default; no brand notes supplied) · **Mode:** A (brand-faithful) · **Variant mode:** single · **Brand signal:** signal-strong

## Movements (dimensional)
- **register:** brand (B2B marketing site, multi-audience IA)
- **ia-fidelity:** **verbatim** — this is a production migration; sections, sequence, and content beats are reproduced from the source. We modernize the *surface*, never the IA.
- **density:** balanced (default for brand register) — section padding `clamp(56px, 8vw, 88px)`.
- **color:** inherited (orange #EF5520 / slate #293338 / white). Added: AA-safe orange `#C8430F` for orange-on-white text, soft surface `#F4F6F7`, deep slate `#1C2429` for dark blocks, hairline border `#E2E6E8`.
- **type:** inherited — Raleway 700/800 headings, Lato 400/700 body. Regularised into a fluid clamp() scale.
- **shape:** inherited square (0px) on structure; +4px on interactive elements only (was ~2px).
- **motion:** subtle (not cinematic) — confetti is static decoration; transitions calm.

## Why Mode A (no divergence roll)
The captured brand surface is `signal-strong`: a clear three-tone palette, two named Google-Font families, a clean modular type scale, and distinctive motifs (confetti, alternating color blocks, trust strip). A faithful migration must *reproduce* this brand, so there is no divergence-seed roll. Deltas are modernization-only:
1. Introduce a real `:root` token system (the live WordPress build ships none — only `--wp-*`/`--tw-*` presets).
2. Fix contrast to WCAG AA (orange was used for some on-white text below threshold).
3. Replace fixed px sizes with a fluid clamp() scale.
4. Calm and standardise spacing to a balanced rhythm on a 1200px grid.
5. Add a restrained 4px interactive radius; keep structure square.

## What stays exactly
Logo, Raleway+Lato, orange-on-slate-and-white, square geometry, geometric-confetti motif, alternating full-bleed color blocks, customer trust strip, dark multi-column footer, voice ("Build for real life", outcome-led).

## Plan → downstream
- **prototype:** home first (single direction), then one page per template; tokens from the home `:root`.
- **migrate/rollout:** apply tokens + canon to the 100-page roster; content curled verbatim per page at author time.

## Decisions log
- No clarifying questions asked (hands-off run; intent unambiguous: faithful + modernized).
- Volume cap honored: 100 pages / 20 per template / header-linked first (see `stardust/migration-roster.json`).
