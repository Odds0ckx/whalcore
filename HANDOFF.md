# Whal3Core website redesign, handoff

**Version:** v3 (current). v2 was the first build; v3 rebuilds the palette on-brand.
**Date:** 2026-08-06
**Branch:** `claude/whale-core-redesign-1mt3as`

## Current state

**v3 is the version to look at.** v2 shipped with an accent palette (mint / amber /
iris) carried over from the reference CodePens, which is off-brand: Whal3Core is
blues and blacks only. v3 is v2 with the palette rebuilt from the brand, everything
else unchanged, so v2 and v3 diff cleanly.

The existing live site at the repo root (`index.html` + `assets/`) is untouched, per
the standing rule that existing files are never overwritten. All three sit side by
side.

```
index.html          the current live site (Next.js export, unchanged)
assets/             its bundled css/js/images (unchanged)
v2/                 first build of the redesign, off-brand palette, superseded
v3/index.html       the redesign, current
v3/assets/style.css design system + all section styles
v3/assets/fonts.css self-hosted @font-face declarations
v3/assets/app.js    GSAP interaction layer
v3/assets/fonts/    woff2 files, latin subset only (192 KB)
v3/assets/vendor/   gsap.min.js + ScrollTrigger.min.js (120 KB)
v3/assets/*.png|svg brand logos copied from the current site
```

## v3 palette

Sampled from `assets/elogo-whal3core.png` (steel blue, ~`#2d5f8a`) and
`assets/logo-chrome.png` (silver). No third hue appears anywhere in the stylesheet;
this is enforced, every hex and rgba in `v3/assets/style.css` is blue, grey or black.

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
- v2 is kept only as the diff reference for the palette change. It can be deleted
  once v3 is signed off.
- The "Request access" and "Book a demo" buttons point at
  `mailto:hello@whal3core.com`. Swap for the real form or Calendly link when there
  is one.
- Stat tiles in the second stats row ("51+ coins & tokens read") were derived by
  counting the coverage tables (26 + 16 + 9 = 51). Confirm that is the number the
  business wants to publish.

## Next steps

To promote the redesign to the live root, move `v3/index.html` to the root and
`v3/assets/*` into `assets/` (the current bundle filenames are hashed and will not
collide), or point the host at the `v3/` directory. Do not delete the old files,
version them instead.

## Commands

```bash
# preview locally
python3 -m http.server 8899 --directory v3
# then open http://localhost:8899/
```
