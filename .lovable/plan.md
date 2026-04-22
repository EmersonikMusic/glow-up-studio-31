

## Plan: Lower mobile mascot to clear answer text

### Problem
On mobile, the mascot's head/glasses overlap the answer text ("On the Waterfront."). Below the mascot there's ~80px of empty space above the footer pill (the green-highlighted region). Solution: shift the mascot down so it stops covering copy and the gap below it is halved.

### Change
In `src/components/TriviaGame.tsx`, the mobile mascot wrapper is anchored at `bottom-20` (80px from viewport bottom). Lower it to `bottom-10` (40px) — a 40px downward shift that:
- Pulls the mascot's head/glasses below the answer text line.
- Reduces the empty space between the mascot's bottom edge and the top of the footer pill from ~80px to ~40px (half).

### Files touched
- `src/components/TriviaGame.tsx` — mobile mascot wrapper class `bottom-20` → `bottom-10`.

### Out of scope
Mascot scale, right offset, desktop mascot positioning, footer styling, card padding.

### Verification
1. Mobile 360×640, 390×844, 414×896: mascot's head/glasses no longer overlap question or answer text.
2. Gap between bottom of mascot circle and top of footer pill is roughly half what it was (~40px).
3. Mascot still overlaps the lower-right corner of the question card (background only, not text).
4. Footer pill remains uncovered and fully tappable.

