## Goal
Show a custom-styled tooltip listing the sub-topics for each Category, Difficulty, and Era row. Trigger:
- **Desktop:** on hover (with a short delay).
- **Mobile:** on long-press (~500ms press-and-hold) on the row label; suppress the toggle when a long-press fires so the switch doesn't flip.

## Files

### 1. `src/data/optionDescriptions.ts` (new)
Three maps of sub-topic strings, verbatim from the previous message:
- `CATEGORY_DESCRIPTIONS` — 25 entries. Splits the "Magicians Philosophy" run-on into separate **Performing Arts** and **Philosophy** entries.
- `DIFFICULTY_DESCRIPTIONS` — 5 entries.
- `ERA_DESCRIPTIONS` — 12 entries.

### 2. `src/components/InfoTooltip.tsx` (new)
Small reusable tooltip component matching the site's glassmorphism aesthetic.

- Wraps arbitrary children (the row) and renders a portalled floating panel when active.
- Positioning: fixed, anchored to the trigger's bounding rect. Prefers `right` side on desktop panel width, flips to `top`/`bottom` if it would clip the viewport (simple rect math, no library).
- Styling (matches SettingsPanel look):
  - `background: rgba(10, 12, 20, 0.92)` with `backdrop-filter: blur(16px)`
  - `border: 1px solid hsl(185 70% 55% / 0.35)` (teal accent)
  - `border-radius: 12px`, padding `10px 14px`, `max-width: 280px`
  - Text: `font-body` `text-xs` `leading-snug` in `hsl(0 0% 90%)`
  - Subtle shadow: `0 10px 30px rgba(0,0,0,0.45)`
  - Small teal caret pointing at the trigger
  - Fade + 4px slide-in transition (120ms)
- Triggers:
  - **Pointer (mouse):** `pointerenter`/`pointerleave` with 250ms open delay, 100ms close delay.
  - **Touch:** `touchstart` starts a 500ms timer; if it fires, tooltip opens and we set a suppress flag; `touchend`/`touchmove(>8px)`/`touchcancel` clears the timer. Dismiss on next tap anywhere or after 4s auto-hide.
  - Escape key closes it.
- Accessibility: trigger gets `aria-describedby` pointing to the tooltip's id; tooltip has `role="tooltip"`.

### 3. `src/components/SettingsPanel.tsx`
- Extend `ToggleRow` with optional `tooltip?: string`.
- When `tooltip` is present, wrap the row in `<InfoTooltip content={tooltip} suppressClickRef={...}>`. The wrapper exposes a ref flag (`didLongPress`) that `ToggleRow`'s `onClick` checks — if a long-press just fired, we skip the toggle so the switch doesn't flip on mobile.
- Extend `FilterSection` with optional `descriptions?: Record<string, string>` and pass `tooltip={descriptions?.[opt]}`.
- Wire the three FilterSections (Categories, Difficulties, Eras) to their respective description maps. Select/Deselect All row gets no tooltip.

## Out of scope
No visual redesign of the settings rows themselves. No changes to gameplay, filters, or non-settings screens. No new libraries.
