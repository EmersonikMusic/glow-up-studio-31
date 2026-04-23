

## Move Game Copy Up + Scale Mascot Up (Mobile Only)

### Goal
Anchor the question/answer text near the top of the card (~40px from inner top edge) and enlarge the mobile mascot by ~15px while keeping its bottom-right corner pinned in place.

### Math (390×799 mobile)
- Mascot height: `clamp(140px, 36vw, 195px)` → **155px** floor (was 140px, +15px). Cap stays 195px.
- Mascot anchor unchanged: `bottom: 28px`, `right: 12px`. Growth happens up + left.
- New mascot peak above card outer bottom: `28 + 155 + 10 (float)` = **193px**.
- Card padding stays `p-[28px]` on all 4 sides.
- Inner text wrapper bottom margin: `193 − 28` = **165px** (was 150px). Keeps text exactly at mascot's highest float frame, zero overlap.
- Top offset: card padding 28px + inner wrapper `mt-[12px]` = **40px** from card's inner top edge.

### Changes

**1. `src/components/QuestionCard.tsx`**
- Card root flex: `justify-center` → `justify-start md:justify-center` (top-align text on mobile, keep desktop centered).
- Inner text wrapper: `mb-[150px]` → `mt-[12px] mb-[165px] md:mt-0 md:mb-0` (12px top offset → ~40px total from card top; 165px bottom for new mascot clearance).

**2. `src/components/TriviaGame.tsx`**
- Mobile mascot wrapper `width` and `height`: `clamp(140px, 36vw, 195px)` → `clamp(155px, 40vw, 195px)`.
  - Floor +15px (140 → 155). `40vw` at 390px = 156px so ≥155 floor; scales smoothly to the 195px ceiling.
- `bottom: 28px` and `right: 12px` unchanged — bottom-right corner stays pinned, mascot grows up and to the left.
- Desktop mascot column unchanged.

### Invariants verified (390×799, longest sample)
- Mascot bottom-right corner: identical pixel position.
- Mascot top peak: now 193px above card outer bottom; inner text wrapper ends exactly there.
- Question top: 40px below card inner top edge.
- Available text band: ~579 − 12 (mt) − 165 (mb) = ~402px → still comfortably fits longest Q+A at the existing reduced font sizes.
- No scroll: card outer dimensions and `var(--app-vh)` lock unchanged.

### Files Edited
- `src/components/QuestionCard.tsx`
- `src/components/TriviaGame.tsx`

