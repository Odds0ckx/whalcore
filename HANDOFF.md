# Whal3Core website redesign, handoff

**Version:** v4 (current, edited in place). v2 first build, v3 on-brand palette.
**Date:** 2026-08-06
**Branch:** `claude/whale-core-redesign-1mt3as`

## Current state

**v4 is the working copy and is edited in place.** Versioned folders are no longer
used for this project. Earlier versions are kept only for reference:

- **v2** first build. Accent palette carried over from the reference CodePens.
- **v3** palette rebuilt on brand (blues, chrome, black), nothing else touched.
- **v4** motion system, stats layout, and the cursor-tracked spotlight on the
  use-case cards. Current.

The existing live site at the repo root (`index.html` + `assets/`) is untouched, per
the standing rule that existing files are never overwritten. All versions sit side by
side.

```
index.html          the current live site (Next.js export, unchanged)
assets/             its bundled css/js/images (unchanged)
v2/                 first build, off-brand palette, superseded
v3/                 on-brand palette, superseded by v4
v4/index.html       the redesign, current
v4/assets/style.css design system + all section styles
v4/assets/fonts.css self-hosted @font-face declarations
v4/assets/app.js    GSAP interaction layer
v4/assets/fonts/    woff2 files, latin subset only (192 KB)
v4/assets/vendor/   gsap.min.js + ScrollTrigger.min.js (120 KB)
v4/assets/*.png|svg brand logos copied from the current site
```

## v4 motion and layout

**Motion.** One easing vocabulary in `:root` (`--e-out`, `--e-soft`, `--e-inout`,
`--e-spring`) applied to every transition and GSAP tween. The default is a long soft
decelerating curve rather than the short back-out the first build used, which is what
made hover and reveal feel abrupt. Elastic entrances were replaced with a scale-from-
0.9 expo settle; elastic reads as springy at this scale.

The first pass at this was technically correct but too understated to notice, so the
amounts were raised: reveals travel 56px (84px in staggered rows) with a slight scale,
over 1.25s to 1.35s, and fire at 80 to 86 percent of viewport height rather than 90,
so the travel is watched instead of finishing off screen. Row stagger went to 0.14s so
the cascade is legible.

Several of the largest surfaces (integration steps, positioning columns, plans, the
founding banner, cost cards, verdict tiles, the AI-read panel) had no hover response
at all, which was most of why the page felt inert under the cursor. They now share one
lift. `.chip` had a transition declared but no hover rule to drive it.

Note that while a reveal tween is still running its element carries an inline
transform, which suppresses the CSS hover until `clearProps` releases it at the end of
the tween. This is brief and self-correcting, but it is why a card hovered the instant
it appears will not lift.

**Spotlight.** The use-case cards carry a cursor-tracked spotlight, from the supplied
reference. Two radial gradients centred on `--mouse-x/--mouse-y`: one behind a face
inset by 2px, so it reads as an illuminated border edge, and one soft sheen above it.
Revealed whenever the cursor is anywhere over the grid, so the highlight sweeps all
six cards as a single light source. One `pointermove` listener per grid, batched into
a rAF. The 3D tilt was removed from these cards; running both read as busy.

**Stats.** Were duplicated: the same two figures appeared in the chain strip, an
invented stats row, and the original stats row. The invented row is gone and the
chain strip no longer repeats the numbers, leaving one stats moment. The row now uses
subgrid so values share a baseline and labels start on the same line; previously a
two-line label dragged its neighbours out of alignment. Values and units are separate
elements so a value can never wrap away from its unit.

**Counters.** The real figure now lives in the markup. A counter only rewinds to zero
if it is below the fold when the script runs, so arriving at or stopping on a row
mid-tween can no longer leave "0 chains" on screen.

## v3 palette

Sampled from `assets/elogo-whal3core.png` (steel blue, ~`#2d5f8a`) and
`assets/logo-chrome.png` (silver). No third hue appears anywhere in the stylesheet;
this is enforced, every hex and rgba in `v4/assets/style.css` is blue, grey or black.

Because there is no hue variation to carry meaning, meaning is carried by luminance
and saturation instead:

| Surface       | Role                  | Treatment                     |
|---------------|-----------------------|-------------------------------|
| `.clay-azure` | value / VIP           | light, saturated blue         |
| `.clay-slate` | risk / attention      | dark, desaturated blue-grey   |
| `.clay-steel` | network / casinos     | mid brand blue                |
| `.clay-chrome`| neutral / unknown     | light metallic silver         |
| `.clay-dark`  | the product itself    | near-black                    |

Value and risk therefore stay clearly distinguishable (lightest vs dark) without
resorting to a green/red pairing, which matters because the product's whole claim is
that the two scores are never blended.

Canvas moved from warm paper to cool porcelain (`#eef1f5`) to sit with the blues.

All text/background pairs were contrast-audited; `--faint`, `--steel-light` and
`--slate-light` were darkened to clear WCAG AA at their smallest use.

## What was done this session (v2 build)

Rebuilt the site against two supplied references: the *Data Landing page* CodePen
(claymorphic tiles, GSAP node constellation, mono data labels)
and the *medical / biology hero* CodePen (glass pill nav, giant outlined background
word, clay panels, ambient glow).

All existing copy and the full section IA were kept. Nothing was cut. Em-dashes in
the old copy were replaced with commas, periods or parentheses.

Design decisions worth knowing:

- **Accent colours are semantic, not decorative.** See the v3 palette table above;
  the original v2 mapping used mint/amber/iris and was replaced for being off-brand.
- **The hero constellation is the wallet graph**, not an abstract decoration:
  deposit lands, wallet is read, four casinos are surfaced, two scores come out.
  The reference's best visual was reused to do real product work.
- **Steel blue is sampled from the logo** (`#2d5f8a`) rather than approximated.
- **Zero external requests.** Fonts and GSAP are self-hosted rather than pulled from
  Google Fonts and cdnjs. Faster, and no third-party dependency on a page that sells
  "zero third-party data dependency".

## Verified

Checked in headless Chromium at 390 / 768 / 1024 / 1440 px:

- No console or page errors, no horizontal overflow at any of the four widths.
- One `h1`, correct heading order, no missing `alt`, no broken internal anchors.
- Tab panel switching (Verdict / Casinos / Activity / Compliance) including
  arrow-key navigation and the address-bar text updating.
- Mobile nav dropdown, FAQ accordions, share-of-wallet bar animation.
- `prefers-reduced-motion: reduce` and JavaScript fully disabled both render the
  complete page with everything visible.

## Open items

- Nothing is blocking. The redesign has not been promoted to the site root, that is
  a deliberate decision left to Nathan.
- v2 and v3 are kept only as diff references. Both can be deleted once v4 is
  signed off.
- The "Request access" and "Book a demo" buttons point at
  `mailto:hello@whal3core.com`. Swap for the real form or Calendly link when there
  is one.
- The invented "51+ coins & tokens read" tile was removed with the duplicate stats
  row, so nothing on the page now claims a figure that was not in the original copy.

## Next steps

To promote the redesign to the live root, move `v4/index.html` to the root and
`v4/assets/*` into `assets/` (the current bundle filenames are hashed and will not
collide), or point the host at the `v4/` directory. Do not delete the old files,
version them instead.

## Commands

```bash
# preview locally
python3 -m http.server 8899 --directory v4
# then open http://localhost:8899/
```
