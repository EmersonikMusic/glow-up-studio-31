# Remove "FREE" from landing headlines; use standard START GAME CTA

Two content changes across all 43 ad-landing pages (`/play/:slug`), driven entirely by `src/data/playSlugs.ts`. No structural/layout changes.

## 1. Headline: drop the "Free " prefix

Currently every preset headline starts with "Free ":
- Categories: `Free ${label} Trivia` (e.g. "Free Movie Trivia")
- Difficulties: `Free ${copy.headline}` (e.g. "Free Genius Trivia")
- Eras: `Free ${label} Trivia` (e.g. "Free 80s Trivia")

Change to:
- Categories: `${label} Trivia` → "Movie Trivia"
- Difficulties: `${copy.headline}` → "Genius Trivia"
- Eras: `${label} Trivia` → "80s Trivia"

The standard gradient headline treatment (already applied to `PlayLandingScreen.tsx`) is unchanged.

`metaTitle` / `metaDescription` keep their existing "Free …" wording — those serve SEO/ad copy, not the on-screen header.

## 2. CTA: standard "START GAME" button

Currently `ctaLabel` per preset is "Play Movie Trivia", "Play Genius Trivia", etc., rendered via `PrimaryCTA`.

Change every preset's `ctaLabel` to `"Start Game"`. `PrimaryCTA` already applies `uppercase` + `tracking-[0.18em]`, so it renders as the standard **START GAME** button identical to the home screen's Quick Play/Start Game CTA. The `aria-label` and `trackId="landing_play"` in `PlayLandingScreen.tsx` stay as-is, so the engagement event `cta_primary_landing_play` is unchanged.

## Edits

`src/data/playSlugs.ts` — three generator blocks:
- Category headline: `` `Free ${label} Trivia` `` → `` `${label} Trivia` ``; ctaLabel: `` `Play ${label} Trivia` `` → `"Start Game"`
- Difficulty headline: `` `Free ${copy.headline}` `` → `` `${copy.headline}` ``; ctaLabel: `` `Play ${copy.headline}` `` → `"Start Game"`
- Era headline: `` `Free ${label} Trivia` `` → `` `${label} Trivia` ``; ctaLabel: `` `Play ${label} Trivia` `` → `"Start Game"`

No other files change. `PlayLandingScreen.tsx` already renders `preset.headline` and `preset.ctaLabel`, so the new values flow through automatically.

## Validation

- `npx tsgo --noEmit`
- Playwright: open `/play/movies`, `/play/genius`, `/play/1980s` — confirm headlines read "MOVIE TRIVIA", "GENIUS TRIVIA", "80S TRIVIA" and the CTA reads "START GAME"; desktop + mobile screenshots.
