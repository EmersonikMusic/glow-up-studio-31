# /play/custom — landing page with the customize panel open

Yes, this works with the existing preset system. Add one more slug, `custom`, that renders the same themed landing screen but opens the "Customize Your Experience" panel automatically on arrival.

## What the visitor sees

Landing at `/play/custom`:

- Standard Triviolivia landing layout (header, mascot, white headline, START GAME CTA, How to Play / Play all categories links)
- Headline: "CUSTOM TRIVIA"
- The settings panel is already open — desktop/tablet: slid in from the right; mobile: bottom sheet sitting flush under the header
- Visitor tweaks categories / difficulties / eras / timers, hits Apply, then START GAME (or Start Game from within the panel, as today)
- No filter is pre-narrowed: all settings start at the current defaults

## Behaviour details

- Nothing about the game flow changes — Apply, start, timers, results, Play Again, badges all behave exactly as they do from the home screen.
- On mobile the panel still opens as a bottom sheet under the header; the CTA remains reachable when the panel is dismissed.
- Analytics unchanged: game_start / game_complete, engagement events and Ads conversions fire the same way as on every other landing page.

## Technical notes

- `src/data/playSlugs.ts`: add a `"custom"` kind to `PlayKind` and one hand-written preset entry (`slug: "custom"`, headline "Custom Trivia", CTA "START GAME", meta title/description, a neutral theme category for mascot + gradient). `settingsForPreset` returns plain `DEFAULT_SETTINGS` for it; `isKidsPreset` stays false.
- `src/components/TriviaGame.tsx`: the `panelOpen` initial state is currently `false`. Initialize it to `true` when the preset is the custom one (both on mount and in the reset path at line ~614, which currently forces `!preset`). All other presets keep the panel closed.
- `src/pages/PlayLanding.tsx` needs no change — it already renders metadata + `TriviaGame preset={...}` from the slug.
- `public/sitemap.xml`: add `/play/custom`.

## Verification

- Load `/play/custom` on desktop and mobile widths: panel is open in final position (slid in, no fade/jump), headline and START GAME render.
- Change a setting, Apply, start a game — confirm the chosen filters are used.
- Confirm the other 43 `/play/*` pages still open with the panel closed.
