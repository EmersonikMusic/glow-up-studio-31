

## Mobile Mascot Inside Card + Larger Top Padding (Mobile Only)

### Problem
On mobile, the mascot floats outside the QuestionCard (anchored to `<main>`, `bottom: 8px`, `right: 0`) and can drift over the card edges. The user wants it visually contained inside the card with ≥12px padding from the card's inner edges, and wants the question text pushed down by +40px more top padding. Both changes are mobile-only — desktop layout must remain untouched.

### Changes

**1. `src/components/TriviaGame.tsx` — Anchor mobile mascot to the card wrapper**
- Add `relative` to the game-area wrapper that holds `<QuestionCard>` (the `flex-none flex flex-col justify-center …` div, currently around line 288) so absolute children anchor to the card column instead of `<main>`.
- Move the existing `md:hidden` mascot `<div>` to be a sibling of `<QuestionCard>` *inside* that wrapper.
- Replace the `right-0` Tailwind class and `bottom: 8px` inline value with:
  - `bottom: 12px`
  - `right: 12px`
- Keep `pointer-events-none`, `z-20`, `flex items-end justify-end`, the float animation, and the cyan circle backdrop unchanged.
- Keep size at `clamp(120px, 32vw, 170px)` for now; if visual QA shows it crowding text, drop to `clamp(110px, 28vw, 150px)`.

**2. `src/components/QuestionCard.tsx` — Mobile-only padding bumps**
- Remove `paddingTop` and `paddingBottom` from the inline `style` object.
- Add Tailwind responsive padding utilities to the root `<div>` className so mobile gets the bumps and desktop keeps the original `clamp(0.75rem, 2.5vw, 2.5rem)` values:
  - `pt-[calc(clamp(0.75rem,2.5vw,2.5rem)+40px)] md:pt-[clamp(0.75rem,2.5vw,2.5rem)]`
  - `pb-[calc(clamp(0.75rem,2.5vw,2.5rem)+140px)] md:pb-[clamp(0.75rem,2.5vw,2.5rem)]`
- The +140px mobile bottom padding reserves clearance below the answer-reveal text so the in-card mascot (≤170px tall, anchored 12px from bottom) never overlaps content.

### Verification (after implementation)
At 472×702 with the longest question + revealed answer:
- Question top edge sits ~40px lower than current.
- Mascot is fully inside the card with ≥12px gap from card's right and bottom inner edges.
- Answer reveal text clears the mascot's top edge with ≥8px breathing room.
- Desktop (≥768px) layout is visually identical to current.

### Files Edited
- `src/components/TriviaGame.tsx`
- `src/components/QuestionCard.tsx`

