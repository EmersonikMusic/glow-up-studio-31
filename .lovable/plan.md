

## Plan: Tighten mobile mascot-to-footer spacing

### Change
In `src/components/TriviaGame.tsx`, the mobile mascot is currently anchored at `bottom-24` (96px from viewport bottom). The footer pill sits roughly at the bottom edge, so there's ~80–90px of empty space between the mascot's bottom edge and the top of the footer pill — too much.

Reduce the offset so the gap lands in the requested 20–30px range:
- Change `bottom-24` (96px) → `bottom-20` (80px) on the mobile mascot wrapper.

That ~16px reduction brings the bottom of the mascot's circle closer to the top of the footer pill, leaving a comfortable ~20–30px breathing gap instead of the current ~80–90px.

### Files touched
- `src/components/TriviaGame.tsx` — mobile mascot `bottom-24` → `bottom-20`.

### Out of scope
Mascot scale, right offset, desktop mascot positioning, footer, card padding.

### Verification
1. Mobile 360×640, 390×844, 414×896: visible gap between bottom of mascot circle and top of footer pill is in the 20–30px range.
2. Mascot still overlaps the lower-right corner of the question card.
3. Footer pill uncovered and fully tappable (pause, next).

