
## Plan: Settings drawer polish (3 fixes)

### 1. Remove Back button on mobile
The Back button is rendered in `panelContent`, so it appears in both layouts. Wrap the back-button block (lines 287–295) so it only renders on desktop — gate with the existing `isMobile` flag (`{!isMobile && (...)}`), since mobile already has the drag handle + tap-backdrop dismiss.

### 2. Reduce desktop drawer height to avoid initial scrollbar
On desktop load, "Game Settings" is the only open accordion. To eliminate the scrollbar in the default state:
- Trim vertical padding around the title block: `pt-2 pb-3 md:pt-3 md:pb-5` → `pt-2 pb-2 md:pt-2 md:pb-3`.
- Reduce divider wrapper margin: `mb-3 md:mb-5` → `mb-2 md:mb-3`.
- Reduce Apply button container bottom padding on desktop: `pb-10 md:pb-8` → `pb-6 md:pb-5`, and top padding `pt-4` → `pt-3`.
- Trim Game Settings inner padding: `px-5 py-5` (line 445) → `px-5 py-4` and inner gap `gap-6` → `gap-5`.

These are the smallest-impact reductions that keep the visual rhythm intact. The desktop panel keeps `overflow-y-auto`, so when a long accordion (Categories / Eras) opens, the scrollbar appears as needed.

### 3. Remove the bottom "purple" divider on the last toggle row
Root cause: `ToggleRow` sets `borderBottom` via **inline `style`**, which inline styles always win over the Tailwind `[&>*:last-child]:border-b-0` utility. That's why the `--game-card-border` line (a desaturated purple/blue at `240 35% 38%`) still shows under the last row.

Fix: move the border to a className so the last-child override actually applies.
- In `ToggleRow`: replace inline `borderBottom` with the class `border-b border-[hsl(var(--game-card-border))]`. Keep `padding` and `minHeight` inline (or move padding to className too — simplest is just border).
- The existing `[&>*:last-child]:border-b-0` wrapper on lines 336 / 372 / 408 will then correctly strip the border on the last `ToggleRow` in each accordion.

### Files touched
- `src/components/SettingsPanel.tsx` — three localized edits as described above.

### Out of scope
- No layout/behavior changes on mobile beyond hiding the Back button.
- No change to Game Settings being open by default.
