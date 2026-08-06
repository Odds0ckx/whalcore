# Whal3Core website redesign, handoff

**Version:** v2 (first build of the redesign)
**Date:** 2026-08-06
**Branch:** `claude/whale-core-redesign-1mt3as`

## Current state

The redesign is complete and self-contained in `v2/`. The existing live site at the
repo root (`index.html` + `assets/`) is untouched, per the standing rule that
existing files are never overwritten. The two versions sit side by side so they can
be compared before anything is swapped.

```
index.html          the current live site (Next.js export, unchanged)
assets/             its bundled css/js/images (unchanged)
v2/index.html       the redesign
v2/assets/style.css design system + all section styles
v2/assets/fonts.css self-hosted @font-face declarations
v2/assets/app.js    GSAP interaction layer
v2/assets/fonts/    woff2 files, latin subset only (192 KB)
v2/assets/vendor/   gsap.min.js + ScrollTrigger.min.js (120 KB)
v2/assets/*.png|svg brand logos copied from the current site
```

## What was done this session

Rebuilt the site against two supplied references: the *Data Landing page* CodePen
(claymorphic tiles, warm paper canvas, GSAP node constellation, mono data labels)
and the *medical / biology hero* CodePen (glass pill nav, giant outlined background
word, clay panels, ambient glow).

All existing copy and the full section IA were kept. Nothing was cut. Em-dashes in
the old copy were replaced with commas, periods or parentheses.

Design decisions worth knowing:

- **Accent colours are semantic, not decorative.** mint = value / VIP,
  amber = attention / risk, iris = cross-casino network, black clay = the product.
  This is deliberate: the product's core claim is that value and risk are never
  blended, so the palette should not blend them either.
- **The hero constellation is the wallet graph**, not an abstract decoration:
  deposit lands, wallet is read, four casinos are surfaced, two scores come out.
  The reference's best visual was reused to do real product work.
- **Steel blue (`--steel: #1f5c93`) is carried over from v1** as the primary brand
  accent, on a warmer paper canvas than the original.
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
- The "Request access" and "Book a demo" buttons point at
  `mailto:hello@whal3core.com`. Swap for the real form or Calendly link when there
  is one.
- Stat tiles in the second stats row ("51+ coins & tokens read") were derived by
  counting the coverage tables (26 + 16 + 9 = 51). Confirm that is the number the
  business wants to publish.

## Next steps

To promote the redesign to the live root, move `v2/index.html` to the root and
`v2/assets/*` into `assets/` (the current bundle filenames are hashed and will not
collide), or point the host at the `v2/` directory. Do not delete the old files,
version them instead.

## Commands

```bash
# preview locally
python3 -m http.server 8899 --directory v2
# then open http://localhost:8899/
```
