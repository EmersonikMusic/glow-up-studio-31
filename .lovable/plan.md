
## Plan: Settings dropdown refinements

All changes in `src/components/SettingsPanel.tsx`.

### 1. Remove bottom border on last item of each dropdown
The `ToggleRow` currently uses `borderBottom` on every row. I'll remove the border from the last rendered row of each section using a `isLast` prop, or wrap each section's row list with a `[&>*:last-child]:border-b-0` Tailwind selector on the container. The container approach is cleanest — one class on the flex column wrapping the rows.

### 2. Remove "Show more" / `…` expand-button feature
Remove for **all** sections (Categories and Eras currently use it):
- Delete `ExpandButton` component usage in Categories and Eras.
- Render `categories.map(...)` in full (no `catsVisible`/`catsExtra` split).
- Render `eras.map(...)` in full (no `erasVisible`/`erasExtra` split).
- Remove related state: `catExpanded`, `eraExpanded`, `diffExpanded`.
- Remove unused vars: `catsVisible`, `catsExtra`, `diffsVisible`, `diffsExtra`, `erasVisible`, `erasExtra`, `EXTRA_ROW_H`, `SECTION_MAX`.
- Optionally remove the `ExpandButton` component definition entirely (unused).

### 3. Rename "Difficulty" → "Difficulties"
Single string change in `SectionHeader` label prop for the difficulty section.

### 4. "All X" rows become dynamic "Deselect All" / "Select All"
- "All Categories" → label = `allCatsSelected ? "Deselect All" : "Select All"`
- "All Difficulties" → label = `allDiffsSelected ? "Deselect All" : "Select All"`
- "All Eras" → label = `allErasSelected ? "Deselect All" : "Select All"`
- Toggles remain on by default (state already initializes with all selected).

### 5. Accordion behavior — opening one section closes others
Replace four independent open booleans (`catOpen`, `diffOpen`, `eraOpen`, `gameOpen`) with a single `openSection` state of type `"categories" | "difficulty" | "eras" | "game" | null`, defaulting to `"game"`. Each `SectionHeader.onToggle` sets `openSection` to its own key, or `null` if it was already open. The existing grid-rows transition continues to drive the smooth collapse/expand.

### 6. Lowercase trailing "s" on "1950s" and later eras
Currently `ToggleRow` applies the Tailwind `uppercase` class, so "1950s" renders as "1950S". Two options:
- (a) Add an optional `preserveCase` prop on `ToggleRow` that swaps `uppercase` for `normal-case` and apply it to era rows from "1950s" onwards.
- (b) Replace the `uppercase` class on ToggleRow with a per-row decision.

I'll go with (a) — add `preserveCase?: boolean` and pass `true` for eras whose label matches `/^\d{4}s$/` (i.e. 1950s, 1960s, … 2020s). Pre-1500 / 1500-1800 / 1800-1900 / 1900-1950 stay uppercase as before (no trailing letter to worry about).

### Technical notes
- No visual / spacing regressions: only border-on-last-child, label string swaps, and case toggle for specific eras.
- Existing animation system (`grid-template-rows: 0fr ↔ 1fr`, 0.4s cubic-bezier) is reused unchanged for accordion behavior.
- File reduces by ~40 lines after removing expand-button logic and unused helpers.
