## Goal

Send each key interaction to GA4 as its **own named event** (no more `ui_click` + `control_id` bundling) so each one shows up in GA4's Events list and can be marked as a Key Event individually.

## Final allowlist of events sent to GA4

Funnel events (named, with parameters):
- `game_start`
- `game_complete`

Click events (each fires as its own named event, no parameters):
- `cta_primary_start_game`
- `cta_primary_settings_apply`
- `click_pause`
- `click_resume`
- `click_about`
- `about_close`
- `click_how_to_play`
- `how_to_play_close`
- `click_settings`
- `settings_close`
- `result_play_again`

Everything else currently calling `trackClick(...)` (secondary CTAs, settings section open/close, settings_back, settings_apply_cancel, change_settings) will become **no-ops** — silently dropped by the allowlist so GA4 stays clean.

### Naming reconciliation with existing call sites

| Current call | Action |
|---|---|
| `trackClick("howtoplay_close")` in `HowToPlayScreen.tsx` | Rename to `how_to_play_close` |
| `trackClick("click_settings_open")` in `GameHeader.tsx` | Rename to `click_settings` |
| `trackClick("click_settings_close")` in `GameHeader.tsx` | Rename to `settings_close` |
| `trackClick(\`cta_primary_${id}\`)` in `PrimaryCTA.tsx` for Play Again (`id="result_play_again"`) | Today this emits `cta_primary_result_play_again`. You listed the new name as `result_play_again`. **This plan emits `result_play_again`** (drops the `cta_primary_` prefix only for this one) and removes `cta_primary_result_play_again`. If you'd rather keep both, say so. |

## Code changes

**`src/lib/analytics.ts`**
- Replace `trackClick(controlId)` (which sent `ui_click` + `control_id`) with a version that emits the name directly: `trackEvent(name, params)`.
- Add an allowlist constant containing the 12 click event names above. Calls with any other name become no-ops.
- `trackGameStart` / `trackGameComplete` unchanged.

**`src/components/PrimaryCTA.tsx`**
- Special-case `id === "result_play_again"` to emit `result_play_again` instead of `cta_primary_result_play_again`. All other primary CTAs keep the `cta_primary_` prefix (only `cta_primary_start_game` and `cta_primary_settings_apply` will actually fire; others get dropped by the allowlist).

**`src/components/HowToPlayScreen.tsx`**
- Change `trackClick("howtoplay_close")` → `trackClick("how_to_play_close")`.

**`src/components/GameHeader.tsx`**
- Change settings button: `click_settings_open` → `click_settings`, `click_settings_close` → `settings_close`.

No other call-site edits required. No JSX/UI changes.

## GA4 UI (after deploy)

1. Trigger each interaction once (live or via DebugView) so GA4 registers the names.
2. Admin → Data display → **Events**: 13 names appear within ~24h.
3. Admin → Data display → **Key events**: toggle each of the 13 on.
4. Delete the now-unused `control_id` custom dimension.

## Out of scope

- No new tracking instrumentation beyond renames.
- No visual/UI changes.
- `game_start` / `game_complete` parameter payloads stay as-is.
