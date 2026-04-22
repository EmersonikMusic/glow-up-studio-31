

## Plan: Restore (and grow) mobile game card height

### Root cause
On mobile, `<main>` is `flex items-center` and the game-area wrapper is `flex-none` with no height. With `items-center`, children shrink to content, so `h-full` on the card resolves against an auto-height parent and the card collapses to text size — smaller than the previous `min-h-[60vh]` build.

### Fix — `src/components/TriviaGame.tsx` `<main>` (line 255-268)

1. Change `<main>` classes:
   - `flex items-center md:items-stretch` → `flex items-stretch`
   - Keep `h-full min-h-0 py-3 sm:py-6 px-3 sm:px-6 md:px-8` (breathing room above/below preserved).

2. Change game-area wrapper (line 257):
   - `flex-none flex flex-col justify-center md:h-full w-full md:w-[70%]` → `flex-none flex flex-col justify-center h-full w-full md:w-[70%]`
   - `h-full` now applies on mobile too, so the column fills the `1fr` grid row minus the 12px top/bottom padding.

3. `QuestionCard.tsx` stays `h-full` — now resolves correctly against a real height, making the card span the full available row.

### Result
- Mobile card height = `100svh − header − footer − 24px` (12px top + 12px bottom padding). On 390×774 with ~64px header + ~80px footer, that's roughly **606px tall**, vs. ~464px previously (60vh − padding).
- Card height is **constant across all questions** (governed by viewport + grid, not content), matching the prior behavior the user wanted preserved.
- Visible 12px gap above and below the card — never flush against header or footer.
- Desktop (`md:`) layout unchanged: `items-stretch` was already its behavior via the override.

### Files touched
- `src/components/TriviaGame.tsx` — two className tweaks on `<main>` and the game-area wrapper.

### Out of scope
No changes to `QuestionCard.tsx`, footer, header, mascot, animations, colors, or any game logic.

### Verification (390×774 mobile)
1. Card visibly fills space between header and footer with ~12px gap on each side.
2. Card height identical on Q1, Q2, Q3 — does not change per question.
3. Footer fully visible whether iOS Safari URL bar is shown or hidden.
4. Desktop ≥768px layout unchanged.

