

## Plan: Refine mascot positioning across breakpoints

### 1. Desktop & tablet (md+): visually center mascot between card and screen edge

In `src/components/TriviaGame.tsx`, the desktop mascot column is `width: 30%` with the inner mascot block using `justify-center` + `marginRight: clamp(8px, 2vw, 32px)`. A right margin inside a centered flex pushes the element **leftward** (toward the card) — the opposite of what we want.

Fix: switch to `justify-end` on the column and use a right margin that equals roughly half the leftover whitespace, so the mascot sits in the optical center of the right gutter.

- Change the desktop column wrapper from `items-center justify-end` (vertical) — the horizontal centering happens on the inner block — to use `justify-end` horizontally with the inner block getting `marginRight: clamp(16px, 3.5vw, 56px)`.
- Concretely: replace the inner block's `my-auto` + `marginRight: clamp(8px, 2vw, 32px)` with a parent that horizontally aligns end, and an inner block with the larger right margin so the mascot sits roughly equidistant between the card's right edge and the viewport's right edge across the 768px–1920px range.

### 2. Mobile: add breathing room between footer pill and mascot

The mobile mascot is anchored at `-bottom-4 -right-4` (overflowing the screen by 16px on each side). The footer pill sits above it with no buffer, so they visually crowd.

- Raise the mascot: change `-bottom-4` → `bottom-24` (≈96px lift) so it clears the footer pill with comfortable breathing room.
- Keep `-right-4` so the mascot still hugs the right edge.
- Reduce the card's mobile bottom reservation slightly since the mascot no longer sits at the very bottom: `pb-[180px] sm:pb-[200px]` → `pb-[160px] sm:pb-[180px]` (the mascot's footprint shifted up, but still occupies vertical space in the lower-right).

### Files touched
- `src/components/TriviaGame.tsx` — desktop mascot column horizontal alignment + larger right margin; mobile mascot `bottom` offset; small reduction in mobile card bottom padding.

### Out of scope
Mascot scale, circle alignment, animations, header/footer, settings panel, game logic.

### Verification
1. Desktop 1280–1920: whitespace between card's right edge and mascot ≈ whitespace between mascot and screen's right edge (eyeball check at 1280, 1440, 1920).
2. Tablet portrait (768–1024): same visual centering holds; mascot doesn't kiss the screen edge or the card.
3. Mobile (360–414): clear visual gap between footer pill top and mascot; mascot still overlaps lower-right of card; longest question + answers still fit at 360×640, 390×844, 414×896.
4. Settings panel open on desktop: mascot still fades out as before (opacity transition unaffected).

