## Root cause

Law's ID in `src/lib/triviaApi.ts` is wrong. I queried the live `/api/categories/` endpoint and the backend returns:

- **Law → id 67** (we had 33)
- Plus three alias categories not in our map: **Food (34)**, **Economics (35)**, **Theater (36)**

Because we send `category=33,…` as the exclude list, the backend silently ignores `33` (no such category) and keeps Law in the pool — so Law questions always leak through, even when Law is deselected. The aliases leak the same way: `Theater` already appeared in a probe response.

## Fix (frontend only, `src/lib/triviaApi.ts`)

1. **Correct the ID**: change `Law: 33` to `Law: 67` in `CATEGORY_IDS`.
2. **Cover backend aliases** so deselecting a canonical category also excludes its alias. Extend `buildExcluded` (or add a small alias map) so when the user deselects:
   - `Food & Drink` → also exclude `34` (Food)
   - `Economy` → also exclude `35` (Economics)
   - `Performing Arts` → also exclude `36` (Theater)
3. **Remove the defensive post-fetch category filter** added previously — no longer needed once IDs are correct, and it would silently shrink batches if any other mismatch appeared. (Optional: keep it as a safety net. Recommend removing so we surface future backend drift instead of hiding it.)

No UI, settings, or state changes. No other files touched.

## Technical notes

- Source of truth used: `GET https://triviolivia.herokuapp.com/api/categories/` (confirmed Law id = 67, plus the three aliases above).
- The alias categories aren't user-selectable in the UI; treating them as "always excluded unless their canonical category is selected" matches user intent.
- If you'd rather I just fix the Law ID and leave the aliases handled by the existing post-fetch filter, say so and I'll trim step 2.
