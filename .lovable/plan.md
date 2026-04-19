
## Plan: Invert filter semantics — send EXCLUDED IDs

### The change
In `src/lib/triviaApi.ts` → `buildUrl`, flip from "send selected IDs" to "send deselected IDs".

For each of category / difficulty / era:
1. Compute `excluded = all IDs − selected IDs` (using the existing `*_IDS` dictionaries as the universe).
2. If `excluded.length > 0` → append `category=<comma-joined>` (or `difficulty=` / `era=`).
3. If `excluded.length === 0` (everything selected) → omit the param entirely.

Edge case — user deselects EVERYTHING in a group:
- `selected = []` → `excluded = all IDs` → URL contains `category=1,2,3,...,33` (every ID), backend returns nothing.
- This matches the new contract literally and surfaces the empty result via the existing "No questions matched your filters" toast. No extra guard needed.

### Example
With the full category list, only "Science" deselected:
```
?questions=10&category=18
```
With Science + Games deselected:
```
?questions=10&category=4,18
```
All categories selected, only "Easy" difficulty deselected:
```
?questions=10&difficulty=2
```

### Code shape (replaces the 3 selection blocks in buildUrl)
```ts
const allCatIds = Object.values(CATEGORY_IDS);
const selectedCatIds = new Set(
  settings.selectedCategories
    .map((n) => CATEGORY_IDS[n])
    .filter((v): v is number => typeof v === "number")
);
const excludedCats = allCatIds.filter((id) => !selectedCatIds.has(id));
if (excludedCats.length > 0) params.append("category", excludedCats.join(","));
```
Same pattern for difficulty and era. The `ALL_*_COUNT` constants are no longer needed and get removed.

### Files touched
- `src/lib/triviaApi.ts` — rewrite the 3 filter blocks inside `buildUrl`, drop the unused count constants.

### Out of scope
- No changes to `SettingsPanel`, `TriviaGame`, or the adapter — selection state stays as "what the user wants included".
- No client-side post-filter safety net.
