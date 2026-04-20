
## Plan: Even spacing around CATEGORIES and APPLY SETTINGS

### Issue
Three highlighted vertical gaps in the Settings panel are uneven:
- **A** Below the gold divider, above CATEGORIES card
- **B** Below the GAME SETTINGS card, above APPLY SETTINGS button
- **C** Below APPLY SETTINGS button (bottom of panel)

Currently sourced from a mix of `mb-2/mb-3`, the FilterSection's own `mb-3`, and the apply container's `pt-3 pb-3`, which don't add up consistently.

### Fix — `src/components/SettingsPanel.tsx`

Target: same gap (~16px / Tailwind `4`) in all three locations.

1. **Gap A — divider → first card** (line 376):
   - Change `mb-2 md:mb-3` → `mb-4` so the spacing below the divider matches the others. The first FilterSection (Categories) has no top margin, so this single value controls gap A.

2. **Gap B — last card → Apply button** (line 471):
   - The last `<section>` (Game Settings) ends with `mb-3` (12px). The apply container adds `pt-3` (12px) → total 24px. Reduce so combined gap = 16px:
   - Change apply container `px-5 pt-3 pb-3 md:pb-3` → `px-5 pt-1 pb-4` (pt-1 = 4px + section's mb-3 = 12px → 16px total; pb-4 = 16px for gap C).

3. **Gap C — below Apply button**:
   - Handled by `pb-4` above. Remove the `md:pb-3` override.

Net result: all three highlighted bands equal ~16px on both mobile and desktop. The mobile scrollable container's `pb-safe` (line 566) still handles iOS safe area below.

### Files touched
- `src/components/SettingsPanel.tsx` — two className changes (lines 376 and 471).

### Out of scope
- Spacing between filter cards (uniform `mb-3` between sections — not highlighted).
- Internal card padding, slider spacing, header padding.

### Verification
Open Settings on mobile and tablet/desktop. Measure (or eyeball) the three highlighted bands: divider→Categories, Game Settings card→Apply, Apply→panel bottom. All three should look visually identical.
