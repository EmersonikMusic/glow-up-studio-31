

## Mobile: Uniform 28px Card Padding + Match Question Width to Answer

### Goals (mobile only, ≤767px)
1. **Card has uniform 28px padding on all 4 edges** (top, right, bottom, left).
2. **Question text in answered state has the same effective horizontal width as the answer text** (currently the question shrinks via `scale(0.65)` so its visual side padding looks ~3× wider than the answer's).
3. **Text container repositioned lower** within the card, since the question takes less vertical space when scale is reduced/removed — but it must still never overlap the mascot's animated head.

### Math (390×799 mobile, mascot anchored to column not card)
- Mascot wrapper: `clamp(140px, 36vw, 195px)` → 140px tall, `bottom: 28px`, `right: 12px`, animation peak −10px.
- Mascot's top edge at highest float frame = `28 + 140 + 10` = **178px above the card's outer bottom edge**.
- New card padding: **28px** all sides.
- Available text band inside card: card height − 28 (top) − 28 (bottom) = card height − 56.
- To prevent the mascot (top peak 178px above card outer bottom) from intruding on text, the text content needs a **bottom margin of `178 − 28 = 150px`** inside the card (below the 28px card padding).

### Changes

**1. `src/components/QuestionCard.tsx` — uniform 28px card padding (mobile)**
- Replace mobile padding utilities:
  - Old: `pt-[clamp(1rem,3vh,1.5rem)] pb-[178px] px-[clamp(1.75rem,6vw,5rem)]`
  - New: `p-[28px]`
- Keep desktop overrides intact: `md:pt-[clamp(0.75rem,2.5vw,2.5rem)] md:pb-[clamp(0.75rem,2.5vw,2.5rem)] md:px-[clamp(0.875rem,3vw,2.5rem)]` (and add `md:p-0` reset is unnecessary because the `md:` overrides win on individual sides).
- Use `md:p-[unset]` is not needed — keep using direction-specific `md:` overrides which override `p-[28px]` per side at ≥768px. Result: mobile = 28px all sides, tablet/desktop = unchanged.

**2. `src/components/QuestionCard.tsx` — wrap text in inner container with mascot-clearance bottom margin (mobile)**
- Wrap the current `<p>` (question) + answer reveal block in a new `<div>` that:
  - Spans full width of card content area.
  - Has `mb-[150px] md:mb-0` to push text content above the mascot's animated peak (150 = 178 mascot peak − 28 card bottom padding).
  - Inherits `flex flex-col items-center` so internal layout (question, divider, answer) stacks identically.
- This anchors the bottom edge of the text content exactly at the mascot's highest float frame, with zero overlap, while the card itself maintains a clean 28px inset on all edges.

**3. `src/components/QuestionCard.tsx` — match question width to answer in answered state**
- Current: `transform: answered ? "scale(0.65)" : "scale(1)"` shrinks the question visually so its left/right edges sit ~17.5% inside the answer's edges (390 × 0.35 ÷ 2 ≈ 68px of extra apparent side padding vs the answer).
- Replace the scale transform with a font-size reduction that preserves full width:
  - Question text class on mobile: `text-[clamp(1.25rem,3.6vw,2.4rem)]`
  - When `answered`, switch the inline style to use a smaller font-size (e.g. `fontSize: "clamp(0.95rem, 2.7vw, 1.8rem)"`) instead of `transform: scale(0.65)`. This shrinks the text height ~30% but keeps the paragraph at full width, so its visual left/right padding equals the answer's (28px from card edge).
  - Remove `transform`, `transformOrigin`, `transition: transform`. Keep `color` + `opacity` transitions.
  - Apply only on mobile? Yes — gate the font-size swap behind a media query via a conditional inline value or a Tailwind class. Cleanest: keep the scale behavior on desktop (`md:` retains current look), drop it on mobile by setting `transform: none` at mobile widths via a small `data-answered` selector + media query in `index.css`, OR just use a `useIsMobile` hook to conditionally choose between the two styles. We'll use the existing `useIsMobile` hook (already imported elsewhere) for clarity and zero CSS additions.

**4. Card flex alignment**
- Change `justify-start md:justify-center` → `justify-center md:justify-center`. With uniform 28px padding + the `mb-[150px]` mascot-clearance offset on the inner wrapper, vertical centering inside the remaining band reads as the text being "positioned a little lower" (closer to the mascot's safe zone) compared to the current top-aligned layout.

### Recalculated invariants (390×799, longest sample)
- App height locked: 799px (from `--app-vh`).
- Card outer height: ~635px (header + footer + main padding subtract).
- Card inner content area: 635 − 56 = **579px tall × 334px wide** (390 − 24 main px − 56 card px).
- Inner text wrapper: 579 − 150 (mascot clearance margin) = **429px tall** for question + divider + answer.
- Longest question (~9 lines @ 1.25rem × 1.4 line-height) reduced font in answered state (~2.7vw → ~10.5px equivalent shrink → ~6 lines × 22px = 132px) + divider (~24px) + longest answer (~5 lines × 28px = 140px) = **~296px**, leaves ~133px of vertical slack inside the 429px band.
- Mascot's highest float frame sits exactly at the bottom edge of the text wrapper — zero overlap.
- Card has clean, visually uniform 28px padding on all 4 edges.

### Files Edited
- `src/components/QuestionCard.tsx`

