## Goal
GA4 receives only these events going forward:
`cta_primary_start_game`, `game_start`, `click_pause`, `click_resume`, `click_about`, `cta_primary_settings_apply`, `game_complete`, `cta_primary_result_play_again` — all fired via the existing `ui_click` or funnel events (`game_start`, `game_complete`).

## Code changes

**`src/lib/analytics.ts`**
- Remove `trackToggle`, `trackSelect`, `trackQuestionRevealed`, `trackSettingsApplied` exports.
- Remove `trackGameStart`'s second `game_start_categories` event — keep only the core `game_start` event.
- Drop unused helpers (`buildCategoriesPayload`, `toBoolMap`, related imports of `ALL_CATEGORIES/DIFFICULTIES/ERAS`) and stray `console.log` debug lines.
- Keep `trackEvent`, `trackClick`, `trackGameStart` (single event), `trackGameComplete`.

**`src/components/SettingsPanel.tsx`**
- Remove `trackSelect` calls (lines ~173, 178) and `trackSettingsApplied(next)` (line ~312).
- Update import to only pull `trackClick`.
- Leave the existing `trackClick("cta_primary_settings_apply")` (already fired via the Apply PrimaryCTA's `trackId`) untouched.

**`src/components/SoundToggle.tsx`**
- Remove the `trackToggle("sound", …)` call and its import.

**`src/components/TriviaGame.tsx`**
- Remove `trackQuestionRevealed` import and its call site (~line 301).
- Verify `click_pause` and `click_resume` are fired via `trackClick` on the pause/resume buttons; add `trackClick` calls there if missing (PauseOverlay resume button + header/pause trigger).

## GA4 UI (after deploy)
Admin → Data display → Key events → ensure only these 8 are toggled on; turn off any others currently marked. Custom dimensions/metrics for removed parameters can be deleted or left dormant.

## Out of scope
No visual/UI changes. No new events added. Custom domain & GA config untouched.
