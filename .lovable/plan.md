# Match landing-page CTA spacing to the home screen

## Goal
On every `/play/<slug>` ad-landing page, the "Switch Game Mode" / "Play All Categories" SecondaryCTA should sit directly under the "START GAME" PrimaryCTA, and the "How to Play" link should sit below the CTA pair — with the same spacing used on the home screen (`StartScreen.tsx`).

## Current state (verified by reading both files)

Home screen (`src/components/StartScreen.tsx`, lines 136–191):
- CTA stack wrapper: `mt-8 flex flex-col items-stretch w-fit mx-auto` — makes both buttons share one width.
- `PrimaryCTA` (`w-full`) → `SecondaryCTA` with `mt-3 w-full` (the Quick Play → Customize Game gap).
- `How to Play` link is a separate element after the stack with `mt-[22px]`.

Landing page (`src/components/PlayLandingScreen.tsx`, lines 100–138):
- `PrimaryCTA` at `mt-7` with no shared-width wrapper.
- A `mt-5 flex flex-col items-center gap-2` container that holds the "How to Play" button first, then the `SecondaryCTA` at `mt-3 w-full`.
- So the SecondaryCTA is NOT directly under Start Game, and How to Play sits between the two CTAs.

## Changes (single file: `src/components/PlayLandingScreen.tsx`)

Restructure the CTA block (lines ~100–138) to mirror the home-screen layout:

1. Wrap `PrimaryCTA` + `SecondaryCTA` in a shared-width CTA stack:
   `mt-8 flex flex-col items-stretch w-fit mx-auto`
2. `PrimaryCTA`: remove the standalone `mt-7`, add `w-full`; keep `animate-fade-in` and `animationDelay: 160ms`.
3. `SecondaryCTA`: place directly after `PrimaryCTA` with `mt-3 w-full`; keep `animate-fade-in` and `animationDelay: 160ms` (matching home). Keep the Kids/Custom vs. other-preset label + trackId logic unchanged.
4. Move the "How to Play" link out of the CTA container to a separate element after the stack, using `mt-[22px]` (matching the home screen). Keep its existing teal/gold hover styling and `onHowToPlay` handler; add `trackClick("click_how_to_play")` so engagement tracking matches the home screen.

No other spacing, the headline, mascot, legal footer, or tracking behavior changes. Only this one CTA block is restructured.

## Verification
- `npx tsgo --noEmit` passes.
- Playwright at 390×844 and 1280×1800 on `/play/movies`, `/play/kids`, `/play/custom`:
  - SecondaryCTA renders directly under START GAME with the same gap as the home-screen Quick Play → Customize Game pair.
  - "How to Play" sits below the CTA pair at the same gap as the home screen.
  - Both CTAs share equal width (no full-width SecondaryCTA stretching past the PrimaryCTA).
