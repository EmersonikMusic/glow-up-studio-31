# Mascot Showcase Video — 9:16, 15 seconds

A vertical 1080x1920 MP4 that cycles through all 25 category mascots in alphabetical order, each on its own category background gradient, ending on the Triviolivia logo card.

## Structure

- 25 mascot cards, alphabetical (Art → Video Games), each held for the same beat, filling roughly the first 12.5 seconds (~15 frames / 0.5s each at 30fps).
- Each card: the category's gradient from `src/data/categoryColors.ts` as a full-bleed background, the mascot SVG large and centred, and the category name in Rubik below it.
- Final ~2.5 seconds: end card with the Triviolivia logo lockup (the version that includes Olivia) and the line `Play now at www.TRIVIOLIVIA.com` beneath it.

## No animation

Mascots are static — hard cuts between cards, no entrance motion, no scaling, no drifting. The only motion in the piece is the cut itself. The end card is likewise a static hold.

## Assets

- 25 mascot SVGs copied from `src/assets/mascots/` into the video project's public folder.
- Category gradients reused verbatim from `src/data/categoryColors.ts` so backgrounds match the app.
- Logo: the full Triviolivia lockup already in the video project (`remotion/public/images/logo.svg`); if that version doesn't include Olivia, the mascot SVG is placed beside it to match.

## Technical

- New composition `mascots-9x16` (1080x1920, 30fps, 450 frames) registered in the existing `remotion/src/Root.tsx`, alongside the current PMax compositions.
- One new scene component that maps over the alphabetical category list and renders the card whose index matches the current frame.
- Rendered headlessly to `/mnt/documents/triviolivia-mascots-9x16.mp4`.

## Note

Your message says `www.TRIVIOLIVA.com` — the live domain is `triviolivia.com`, so I'll use `www.TRIVIOLIVIA.com` unless you want the shorter spelling exactly as written.
