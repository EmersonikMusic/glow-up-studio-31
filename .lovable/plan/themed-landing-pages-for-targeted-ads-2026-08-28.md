# Themed Landing Pages for Targeted Ads

Give every category, difficulty and era its own URL (e.g. `/play/movies`, `/play/genius`, `/play/1980s`) that shows a themed landing screen with a single big Start button. Clicking it launches a game filtered to just that theme — no settings, no extra steps.

## What the visitor sees

Landing at `/play/movies`:

- Same dark/glass Triviolivia look, with the category's background gradient and mascot
- Headline: "Free Movie Trivia"
- One line of supporting copy: how it works (say your answer aloud before the timer)
- Primary CTA: "Play Movie Trivia" — starts instantly, movies-only questions
- Secondary link: "Play all categories" back to the home game
- Standard header (settings gear, profile) and legal footer

Difficulty and era pages use the same layout with themed copy ("Genius Trivia — Only for Experts", "80s Trivia Quiz") and a neutral/random mascot, since those aren't tied to one category.

Pressing the CTA runs the exact same game flow as Quick Play with only that one filter narrowed; everything else stays at defaults. Timers, results, Play Again, badges are unchanged, and Play Again keeps the same filter.

```text
/                -> full game (unchanged)
/play/movies     -> Movies landing      -> movies-only game
/play/genius     -> Genius landing      -> Genius-difficulty-only game
/play/1980s      -> 1980s landing       -> 1980s-era-only game
```

## The 42 pages

Categories (25): `art, economy, food-and-drink, games, geography, history, human-body, language, law, literature, math, miscellaneous, movies, music, nature, performing-arts, philosophy, politics, pop-culture, science, sports, technology, television, theology, video-games`

Difficulties (6): `casual, easy, average, hard, genius, kids` — `kids` uses the existing Kids Mode pool.

Eras (12): `pre-1500, 1500-1800, 1800-1900, 1900-1950, 1950s, 1960s, 1970s, 1980s, 1990s, 2000s, 2010s, 2020s`

All slugs are unique across the three groups, so one flat `/play/:slug` route covers them. An unknown slug falls through to the existing 404 page.

## SEO

- Each page gets its own title, meta description, canonical URL, and `Game` JSON-LD (e.g. "Free Movie Trivia — Play Online | Triviolivia", "80s Trivia Quiz — Free Online | Triviolivia").
- All 42 URLs added to `public/sitemap.xml`.
- Note: this app is a client-rendered single-page app, so per-page titles/descriptions are set at runtime and are read by Google but not by social-preview crawlers (Facebook/X link cards still show the site-level preview). Full per-page crawler metadata would need the SSR template — worth considering later, not needed for Google Ads traffic.

## Analytics

- Existing `game_start` / `game_complete` events and Google Ads conversions fire exactly as they do today — no change to conversion behaviour.
- The recorded `settings_code` already encodes which categories/difficulties/eras were active, so `game_starts` and `anonymous_plays` rows stay attributable per landing page.
- Landing CTA click is emitted as the existing engagement event with an action name like `cta_primary_play_movies`.

## Technical notes

- `src/data/playSlugs.ts` (new): one registry mapping each slug to `{ kind: "category" | "difficulty" | "era", value, headline, metaTitle, metaDescription, ctaLabel }`, derived from `ALL_CATEGORIES`, `ALL_DIFFICULTIES` (+ Kids) and `ALL_ERAS` with per-slug ad copy.
- `src/pages/PlayLanding.tsx` (new): resolves the slug, renders Helmet metadata and the themed landing UI, and renders `TriviaGame` with a new optional prop.
- `src/components/TriviaGame.tsx`: accept an optional `preset` prop — when set, the initial `settings` narrow the matching axis (`selectedCategories`, `selectedDifficulties`, or `selectedEras`) to the single value while the other two stay full, and `kids` maps to the existing kids-mode path. The landing screen replaces the start screen. `runFetchAndStart`, `handlePlayAgain` and settings-panel logic stay as-is.
- `src/App.tsx`: add `<Route path="/play/:slug" element={<PlayLanding />} />` above the catch-all.
- `public/sitemap.xml`: add the 42 URLs.
