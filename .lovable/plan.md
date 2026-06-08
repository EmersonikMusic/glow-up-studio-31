## Goal
Track every button click and every slider movement in Google Analytics (GA4 `G-7T5D6V0V38`, already loaded in `index.html`) with semantic, named events. Sliders fire on every step.

## Approach
Manual per-control instrumentation using a tiny typed helper, so each control sends a meaningful event name and payload (clean GA4 reports).

### 1. New helper: `src/lib/analytics.ts`
- `trackEvent(name: string, params?: Record<string, any>)` — guards `window.gtag`, no-ops in SSR/dev if missing.
- Convenience wrappers:
  - `trackClick(id: string, params?)` → `gtag('event', 'ui_click', { control_id, ...params })`
  - `trackToggle(id: string, value: boolean)` → `ui_toggle`
  - `trackSlider(id: string, value: number)` → `ui_slider_change`
  - `trackSelect(id: string, value: string, active: boolean)` → `ui_select`

Single source of truth so event names stay consistent.

### 2. Instrument buttons (manual, semantic IDs)
For each button below, add `onClick` (or wrap existing handler) with `trackClick('<id>')`:

- `PrimaryCTA.tsx` → wrap the underlying `onClick` so every primary CTA fires `ui_click` with `control_id` derived from `aria-label` (or a new optional `trackId` prop, falls back to label text).
- `SecondaryCTA.tsx` → same pattern.
- `GameHeader.tsx` → `header_settings`, `header_about`, `header_how_to_play`, `header_login`, etc. (one per icon button present).
- `GameFooter.tsx` → any footer buttons (`footer_pause`, `footer_next`, etc., based on what exists).
- `StartScreen.tsx` → `start_play`, plus any secondary buttons.
- `ResultScreen.tsx` → `result_play_again`, `result_share`, etc.
- `SettingsPanel.tsx` → `settings_close`, `settings_back`, `settings_apply`, `settings_apply_confirm`, `settings_apply_cancel`, plus section headers `settings_section_<key>` and `settings_select_all_<group>`.
- `AboutScreen.tsx`, `HowToPlayScreen.tsx`, `LoginScreen.tsx`, `PauseOverlay.tsx`, `KeyboardShortcutsHelp.tsx` → close/CTA buttons.
- `ReadAloudToggle.tsx` → `trackToggle('read_aloud', enabled)`.
- `SoundToggle.tsx` → `trackToggle('sound', enabled)`.
- Category/difficulty/era `ToggleRow`s in `SettingsPanel` → `trackSelect('category' | 'difficulty' | 'era', opt, active)`.

`MascotDebugOverlay.tsx` (dev tool) and shadcn UI primitives (`ui/*.tsx`) are **not** instrumented — only app-level components.

### 3. Instrument sliders (every step)
`StepSlider` in `SettingsPanel.tsx` is the only range input. Add an optional `trackId` prop and call `trackSlider(trackId, v)` inside `onChange` (fires on every `input`/step). Pass `trackId` from the three usages:
- `slider_num_questions`
- `slider_time_per_question`
- `slider_time_per_answer`

Drag-handle / drag-to-dismiss gestures on the bottom sheet are not tracked (not a button/slider).

### 4. Type declaration
Add `src/types/gtag.d.ts` declaring `window.gtag` and `window.dataLayer` so TS is happy.

### 5. Validation
- Build passes.
- In preview, open DevTools Network → filter `google-analytics.com/g/collect`; clicking each instrumented control and dragging each slider emits requests with the expected `en` (event name) and `control_id`.

## Out of scope
- No new GA property/ID, no consent banner changes.
- No tracking of keyboard shortcuts, hover, drag-to-dismiss, or shadcn primitives used elsewhere.
- No backend/edge-function changes.

## Files touched
- new: `src/lib/analytics.ts`, `src/types/gtag.d.ts`
- edited: `PrimaryCTA.tsx`, `SecondaryCTA.tsx`, `GameHeader.tsx`, `GameFooter.tsx`, `StartScreen.tsx`, `ResultScreen.tsx`, `SettingsPanel.tsx`, `AboutScreen.tsx`, `HowToPlayScreen.tsx`, `LoginScreen.tsx`, `PauseOverlay.tsx`, `KeyboardShortcutsHelp.tsx`, `ReadAloudToggle.tsx`, `SoundToggle.tsx`
