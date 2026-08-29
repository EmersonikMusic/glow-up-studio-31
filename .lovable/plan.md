# Plan: Clean up the /play/<slug> landing screen

## Goal
On the themed ad-landing pages (`/play/movies`, `/play/history`, etc.), remove two things the user flagged:

1. The supporting text directly under the headline (e.g. under "FREE MOVIE TRIVIA").
2. The stray-looking element between the "How to Play" and "Play all categories" links.

## Current state (verified)
File: `src/components/PlayLandingScreen.tsx`

- Lines 90-95: a `<p>` rendering `preset.subhead` ("Say your answer out loud before the timer runs out, then reveal it. Free, no signup, plays right in your browser."). This is the text under the headline.
- Lines 115-131: a `flex flex-col items-center gap-2` container holding the "How to Play" button and the "Play all categories" `<Link>`. The DOM contains only those two elements (confirmed via Playwright DOM dump) — there is no third node. The only visible artifact in that gap is the persistent white underline of the "How to Play" button, which sits detached from its text via `underline-offset-[5px]` and reads as a stray thin line/dash between the two links.

## Changes
File: `src/components/PlayLandingScreen.tsx`

1. **Remove the subhead.** Delete the `<p>` block (lines 90-95) that renders `preset.subhead`. The headline + mascot + CTA remain.
   - Note: `preset.subhead` is still defined in `src/data/playSlugs.ts` and used for `<meta name="description">`; leaving that data in place keeps SEO meta intact. No change to `playSlugs.ts`.

2. **Remove the stray underline mark.** Drop the persistent `underline underline-offset-[5px]` from both the "How to Play" button and the "Play all categories" link, so no thin detached line sits in the gap. Replace with a hover-only underline (`hover:underline`) to keep the affordance without the stray persistent line. Keep `gap-2` spacing so the two links remain visually distinct.

No other files change. Analytics, routing, sitemap, and gameplay are untouched.

## Verification
- `npx tsgo --noEmit` passes.
- Playwright: load `/play/movies` on desktop (1280px) and mobile (390px), screenshot, confirm the subtext is gone and no thin white line/dot sits between the two links.
