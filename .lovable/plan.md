# Category Landing Pages for Targeted Ads

Give each of the 25 trivia categories its own URL (e.g. `/play/movies`, `/play/history`) that shows a themed landing screen with a single big Start button. Clicking it launches a game using only that category's questions — no settings, no extra steps.

## What the visitor sees

Landing at `/play/movies`:

- Same dark/glass Triviolivia look, background gradient and mascot for that category
- Headline: "Free Movie Trivia" with the category mascot
- One line of supporting copy: how it works (say your answer aloud before the timer)
- Primary CTA: "Play Movie Trivia" — starts instantly, movies-only questions
- Secondary link: "Play all categories" back to the home game
- Standard header (settings gear, profile) and legal footer

Pressing the CTA runs the exact same game flow as Quick Play, with the category filter locked to that one category. Everything after that — timers, results, Play Again, badges — is unchanged. Play Again keeps the same single-category filter.

```text
/                -> full game (unchanged)
/play/movies     -> Movies landing -> movies-only game
/play/history    -> History landing -> history-only game
... 25 total
```

## Slugs

Generated from the existing category list, lowercased and hyphenated:
`art, economy, food-and-drink, games, geography, history, human-body, language, law, literature, math, miscellaneous, movies, music, nature, performing-arts, philosophy, politics, pop-culture, science, sports, technology, television, theology, video-games`

An unknown slug falls through to the existing 404 page.

## SEO

- Each page gets its own title, meta description, canonical URL, and `Game` JSON-LD (e.g. "Free Movie Trivia — Play Online | Triviolivia").
- All 25 URLs added to `public/sitemap.xml`.
- Note: this app is a client-rendered single-page app, so per-page titles/descriptions are set at runtime and are read by Google but not by social-preview crawlers (Facebook/X link cards will still show the site-level preview). Full per-page crawler metadata would require the SSR template — worth considering later, not needed for Google Ads traffic.

## Analytics

- Existing `game_start` / `game_complete` events and Google Ads conversions fire exactly as they do today — no change to conversion behaviour.
- The recorded `settings_code` naturally encodes the single-category selection, so `game_starts` and `anonymous_plays` rows are already attributable per landing page.
- Landing CTA click is emitted as the existing engagement event with an action name like `cta_primary_play_movies`.

## Technical notes

- `src/data/categorySlugs.ts` (new): slug ↔ category name mapping derived from `ALL_CATEGORIES`, plus per-category ad headline/description copy.
- `src/pages/CategoryLanding.tsx` (new): resolves the slug, renders Helmet metadata and the themed landing UI, and renders `TriviaGame` with a new optional prop.
- `src/components/TriviaGame.tsx`: accept optional props `presetCategory` and `landing` — when set, initial `settings` use `selectedCategories: [category]` (all difficulties except Kids, all eras), and the start screen is replaced by the landing screen. `runFetchAndStart`, `handlePlayAgain`, kids mode and settings-panel logic stay as-is.
- `src/App.tsx`: add `<Route path="/play/:slug" element={<CategoryLanding />} />` above the catch-all.
- `public/sitemap.xml`: add the 25 URLs.
