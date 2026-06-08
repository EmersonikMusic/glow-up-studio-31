# Streamline Analytics for a Cleaner GA4 View (v4)

## `header_settings_open` — investigation result

Verified in `TriviaGame.tsx`:
- Desktop initial open uses `useState(() => !matchesMedia("(max-width: 767px)", false))` on line 98 — sets `panelOpen` directly, never calls the gear button's `onClick`.
- "Change settings" from the result screen also calls `setPanelOpen(true)` directly.
- The keyboard shortcut at line 245 also bypasses `trackClick`.
- The only path that fires `trackClick("header_settings_open")` is a real click on the gear icon in `GameHeader.tsx`.

**Conclusion: no code change needed.** The event already fires only on user gear-button clicks. If you're seeing inflated counts in GA4, it's likely from your own testing sessions or from re-clicks (open → close → open), not from auto-open. We can add a one-line dev-mode guard to `trackEvent` if you want to suppress events from `localhost`/preview — say the word and I'll include it.

## Category tracking — final approach

Dropping the comma-joined `categories` string entirely (you're right, it can exceed GA4's 100-char param limit and gets truncated unhelpfully). Replacing with:

- **Per-category booleans, sent only on `game_start`** (and on `settings_applied`, which is also a real user action — clicking Apply). Names use lowercase snake_case derived from `ALL_CATEGORIES`:
  `art_on`, `economy_on`, `food_and_drink_on`, `games_on`, `geography_on`, `history_on`, `human_body_on`, `language_on`, `law_on`, `literature_on`, `math_on`, `miscellaneous_on`, `movies_on`, `music_on`, `nature_on`, `performing_arts_on`, `philosophy_on`, `politics_on`, `pop_culture_on`, `science_on`, `sports_on`, `technology_on`, `television_on`, `theology_on`, `video_games_on` (25 keys).
- `categories_count` — number selected (custom metric → averages, sums).
- `categories_all` — boolean, true when all 25 are selected (the common default).

These booleans **never** fire on toggling chips in the settings UI — only when a game actually starts (or settings are applied).

Same pattern, scoped down:
- **Difficulties** (5): `casual_on`, `easy_on`, `average_on`, `hard_on`, `genius_on` + `difficulties_count`, `difficulties_all`.
- **Eras** (12): `era_pre_1500_on`, `era_1500_1800_on`, `era_1800_1900_on`, `era_1900_1950_on`, `era_1950s_on`, `era_1960s_on`, `era_1970s_on`, `era_1980s_on`, `era_1990s_on`, `era_2000s_on`, `era_2010s_on`, `era_2020s_on` + `eras_count`, `eras_all`. (Prefix `era_` because GA4 param names can't start with a digit.)

GA4 caps each event at **25 custom parameters**. We'll split into two events fired back-to-back when a game starts, so we stay under the cap and keep all booleans:
- `game_start` — `num_questions`, `time_per_question`, `time_per_answer`, `categories_count`, `categories_all`, `difficulties_count`, `difficulties_all`, `eras_count`, `eras_all`, plus the 5 difficulty booleans and 12 era booleans (≈23 params).
- `game_start_categories` — fires immediately after, containing the 25 category booleans + `categories_count` so it can be analyzed independently.

(`settings_applied` mirrors the same split: `settings_applied` + `settings_applied_categories`.)

## Final event taxonomy

**Funnel (new)**
- `game_start` + `game_start_categories`
- `game_complete` — `num_questions`, `questions_played`, `duration_sec`
- `question_revealed` — engagement volume

**`ui_click` (kept)** — header (`header_about`, `header_settings_open`/`close`, `header_home_logo`, `header_fullscreen_enter`/`exit`, `header_kbd_help_open`/`close`), landing (`cta_primary__start_game`, `start_how_to_play`), footer (`footer_pause`, `footer_resume`), result (`result_change_settings`, `cta_primary__play_again`).
**`ui_toggle` (kept)** — `read_aloud`, `sound`.
**`ui_select` (kept)** — category/difficulty/era chip toggles in settings (`group`, `option`, `active`).
**Removed** — `ui_slider_change` per-step (final value lands in `game_start`/`settings_applied`), duplicate `cta_primary__settings_apply*` clicks.
**Low-priority** — `settings_applied` + `settings_applied_categories` (configuration intent without starting a game).

## Files to change

- `src/lib/analytics.ts` — add `trackGameStart(settings)`, `trackGameComplete(payload)`, `trackQuestionRevealed()`, `trackSettingsApplied(settings)`. Add a `toBoolMap(allList, selected, keyFn)` helper that produces the `<x>_on` object. Remove `trackSlider` export.
- `src/components/SettingsPanel.tsx` — drop `trackSlider` from `StepSlider`; call `trackSettingsApplied(settings)` inside `handleApply`. Section open/close stays.
- `src/components/TriviaGame.tsx` — add `startedAtRef`; emit `game_start` (+ `game_start_categories`) on first `playing` transition; `question_revealed` on `playing → answered`; `game_complete` on transition to `finished`.

No changes to `GameHeader.tsx`, `App.tsx`, screens, CTAs, or toggles.

## GA4 setup steps — register custom metrics and dimensions

Do this once, in the GA4 property for `G-7T5D6V0V38`. New definitions can take up to 24h to populate historical data, but new events arriving afterwards are processed immediately.

**1. Open custom definitions**
- GA4 → bottom-left **Admin** (gear icon) → under **Data display**, click **Custom definitions**.

**2. Create custom metrics** (tab: **Custom metrics** → **Create custom metrics**)
For each row below, fill in: Metric name (what shows in reports) · Scope = **Event** · Event parameter (must match the param name we send) · Unit of measurement = **Standard**.

| Metric name | Event parameter | Unit |
|---|---|---|
| Questions per game | `num_questions` | Standard |
| Time per question (sec) | `time_per_question` | Standard |
| Time per answer (sec) | `time_per_answer` | Standard |
| Categories selected | `categories_count` | Standard |
| Difficulties selected | `difficulties_count` | Standard |
| Eras selected | `eras_count` | Standard |
| Questions played | `questions_played` | Standard |
| Game duration (sec) | `duration_sec` | Seconds |
| Slider/toggle value | `value` | Standard |

Click **Save** after each.

**3. Create custom dimensions** (tab: **Custom dimensions** → **Create custom dimensions**)
Scope = **Event** for all. Description optional.

Required:
- `control_id`, `group`, `option`, `active`
- `categories_all`, `difficulties_all`, `eras_all`

Recommended (one per category — lets you build "Top played categories" reports):
- `art_on`, `economy_on`, `food_and_drink_on`, `games_on`, `geography_on`, `history_on`, `human_body_on`, `language_on`, `law_on`, `literature_on`, `math_on`, `miscellaneous_on`, `movies_on`, `music_on`, `nature_on`, `performing_arts_on`, `philosophy_on`, `politics_on`, `pop_culture_on`, `science_on`, `sports_on`, `technology_on`, `television_on`, `theology_on`, `video_games_on`

Optional (only if you want to slice by difficulty/era booleans in GA4 UI — otherwise rely on the `*_count` and `*_all` dimensions):
- difficulty + era booleans listed above

Note on the **50 custom-dimension cap per GA4 property**: required (7) + categories (25) = 32, leaving 18 slots for difficulty/era booleans (17 total) — fits, but tight. If you'd rather conserve slots, register only the category booleans and skip the per-difficulty / per-era booleans (the events still send them — you can promote any later).

**4. Verify events are firing**
- Admin → **DebugView** (left nav). Open the site in a browser with the **Google Analytics Debugger** Chrome extension on (or append `?debug_mode=1`).
- Start a game. You should see `game_start`, `game_start_categories`, `question_revealed` (per question), `game_complete` appear in real time with the params listed above.

**5. Build a "Top categories played" report**
- **Explore** → **Blank** exploration.
- Dimensions: add `event name` and each `<category>_on` you care about.
- Metrics: `Event count`, plus `Categories selected` (avg) once it has data.
- Filter: `event name` = `game_start_categories`.
- Drag `<category>_on` into Rows, `Event count` into Values; filter rows where `<category>_on` = `true` to see how many games included each category.

(Custom metrics/dimensions take a few hours to start appearing in Explorations.)

## Out of scope

- No backend, UI, GA4 property/ID, or consent changes.
