## Goal

Replace the off-brand AI-generated og:image with a 1200×630 card built from the **actual Start Screen assets**, so social previews match the in-app brand.

## Source of truth (from `StartScreen.tsx`)

- Logo: `src/assets/img-TO-logo-full-desktop-v2.svg` (full color Triviolivia wordmark)
- Tagline: "Earth's Deepest Trivia Source" — Rubik 800, uppercase, letter-spacing 0.16em, teal `hsl(185 70% 55%)`, on the same concave-up arc used in-app (`M 30 46 Q 300 14 570 46`), with the same drop shadow
- Background: `hsl(240 45% 16%)` (the `--game-bg` token), no gradients or extra ornamentation

## Build approach

Use Playwright (already in the sandbox) to render an HTML page that mirrors the Start Screen's hero block, then screenshot at exactly 1200×630. This guarantees pixel-for-pixel brand fidelity — same SVG, same font, same arc, same color token — instead of an AI re-interpretation.

Steps:

1. Write a small standalone HTML at `/tmp/og/og.html`:
   - Body sized 1200×630, background `hsl(240 45% 16%)`
   - Centered column: inline the logo SVG (copied from `src/assets/img-TO-logo-full-desktop-v2.svg`) at ~880px wide
   - Below it, the curved tagline SVG using the exact `<textPath>` + arc + filter + Rubik 800 styling from `StartScreen.tsx` lines 91–123
   - Load Rubik 700/800 from Google Fonts (same `<link>` as `index.html`) and wait for `document.fonts.ready` before screenshotting
2. Run Playwright headless Chromium at viewport 1200×630, `page.screenshot({ path: "/tmp/og/og.jpg", type: "jpeg", quality: 90 })` (no `full_page`)
3. Verify the rendered PNG/JPG visually by viewing the screenshot
4. Upload via `lovable-assets create --file /tmp/og/og.jpg --filename triviolivia-og-card.jpg` and overwrite `public/og-card.jpg.asset.json` with the CLI output
5. Update `index.html` `og:image` and `twitter:image` URLs to the new CDN URL (width/height/alt tags already correct at 1200×630)
6. Delete the old CDN asset using `assets--delete_asset` on the previous pointer if it's no longer referenced

## Out of scope

- No changes to Start Screen, no new brand assets, no copy changes
- No SSR / per-route og:image work
- Heads-up to user: social platforms (LinkedIn, Slack, X, Facebook) cache previews — already-shared links won't update until each platform re-scrapes or the user forces a refresh in that platform's link debugger
