# Plan: Bring /play/<slug> landing screen in line with site standards

## Goal
On the themed ad-landing pages (`/play/movies`, `/play/history`, etc.), fix three things so the screen matches the rest of the site:

1. Remove the supporting text under the headline (e.g. under "FREE MOVIE TRIVIA").
2. Make the "How to Play" and "Play all categories" links teal with a gold hover, matching the homepage "How to Play" link.
3. Make the headline use the standard red-to-yellow gradient treatment used by every other screen heading (About, How To Play, Result, Settings "CUSTOMIZE YOUR EXPERIENCE").

## Verified current state
File: `src/components/PlayLandingScreen.tsx`

- Lines 90-95: `<p>` rendering `preset.subhead` ("Say your answer out loud…"). This is the text under the headline. (`preset.subhead` stays defined in `src/data/playSlugs.ts` for the `<meta name="description">`; only the on-screen `<p>` is removed.)
- Lines 83-88: headline `<h1>` using `text-white` + `textShadow` — the only heading on the site NOT using the gradient.
- Lines 119-130: "How to Play" button is `text-white hover:text-gold`; "Play all categories" link is `text-white/80 hover:text-teal`. Both are inconsistent with the homepage link.

## Site standards (confirmed by reading other components)
- **Standard headline** (AboutScreen L224-230, HowToPlayScreen L84-90, ResultScreen L162-168, SettingsPanel L444-458):
  `font-heading font-extrabold uppercase leading-none tracking-tight` with
  `background: linear-gradient(0deg, #e93e3a 0%, #ed683c 11%, #f3903f 33%, #fdc70c 72%, #fff33b 100%)`,
  `WebkitBackgroundClip: text`, `WebkitTextFillColor: transparent`, `backgroundClip: text`. No text-shadow.
- **Standard link** (StartScreen L187, the homepage "How to Play"):
  `text-xs font-body font-semibold underline underline-offset-[5px] text-[hsl(185_70%_55%)] hover:text-[hsl(var(--game-gold))] transition-colors`.

## Changes (single file: `src/components/PlayLandingScreen.tsx`)

1. **Remove the subhead.** Delete the `<p>` block (lines 90-95) that renders `preset.subhead`.

2. **Convert the headline to the standard gradient.** Replace the `text-white` + `textShadow` treatment on the `<h1>` (lines 83-88) with the standard gradient block:
   - className: `mt-4 text-center font-heading font-extrabold uppercase leading-none tracking-tight text-3xl sm:text-4xl md:text-5xl animate-fade-in`
   - style: `{ background: "linear-gradient(0deg, #e93e3a 0%, #ed683c 11%, #f3903f 33%, #fdc70c 72%, #fff33b 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }`
   - Remove `textShadow`. Keep the `animate-fade-in`.

3. **Make both links teal with gold hover.** On the "How to Play" button (lines 119-124) and the "Play all categories" `<Link>` (lines 125-130), replace the color/hover classes with the standard link classes: `text-[hsl(185_70%_55%)] hover:text-[hsl(var(--game-gold))]` (keeping `underline underline-offset-[5px]`, `text-xs`, `font-body font-semibold`, `transition-colors`). This matches the homepage "How to Play" link exactly.

No changes to `playSlugs.ts`, routing, analytics, sitemap, or gameplay. The `preset.subhead` data remains for SEO meta only.

## Verification
- `npx tsgo --noEmit` passes.
- Playwright: load `/play/movies` on desktop (1280) and mobile (390), screenshot, confirm: no text under the headline; headline shows the red-to-yellow gradient (not white); both links are teal and turn gold on hover.
