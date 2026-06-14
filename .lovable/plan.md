## Problem

`SettingsPanel` initializes its local state (categories, difficulties, eras, counts, timings) to the all-selected defaults, ignoring the `currentSettings` prop. So when the user opens the gear mid-game, the panel shows defaults instead of their active selections.

## Fix

In `src/components/SettingsPanel.tsx`:

1. Seed all six `useState` hooks from `currentSettings` when provided, falling back to current defaults:
   - `numQuestions`, `timePerQuestion`, `timePerAnswer`
   - `selectedCategories`, `selectedDifficulties`, `selectedEras`
2. Add an effect that, whenever the panel transitions from closed → open, resyncs local state to `currentSettings` (so reopening after an external change or after canceling stale edits reflects the latest applied settings).
3. No changes to apply/confirm logic, layout, or callers — `Index.tsx`/`TriviaGame.tsx` already pass `currentSettings`.

## Files

- `src/components/SettingsPanel.tsx` (state init + open-sync effect)
