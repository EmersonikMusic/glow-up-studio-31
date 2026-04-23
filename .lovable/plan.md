

## Equalize Mobile Card Padding (Mobile Only)

### Goal
Vertically anchor the longest question + answer block exactly between the card's top inner edge and the highest point of the mascot's head (including float animation), on **mobile only**. Desktop and tablet (≥768px) layouts remain byte-identical.

### Math (mobile)
- Mobile mascot: `clamp(140px, 36vw, 195px)` → 140px at 390px viewport.
- Anchored at `bottom: 28px`. Float animation translates `0 → -10px → 0`.
- Mascot's top edge at highest float frame = `28 + 140 + 10` = **178px** above card's bottom inner edge.
- Equal top + bottom padding of **178px** centres the text band between card top and mascot peak.

### Changes

**`src/components/QuestionCard.tsx` — symmetric mobile-only paddings**
- Replace asymmetric mobile padding utilities with symmetric pair, keeping desktop `md:` overrides intact:
  - Old: `pt-[calc(clamp(0.75rem,2.5vw,2.5rem)+40px)] pb-[calc(clamp(0.75rem,2.5vw,2.5rem)+181px)] md:pt-[clamp(0.75rem,2.5vw,2.5rem)] md:pb-[clamp(0.75rem,2.5vw,2.5rem)]`
  - New: `pt-[178px] pb-[178px] md:pt-[clamp(0.75rem,2.5vw,2.5rem)] md:pb-[clamp(0.75rem,2.5vw,2.5rem)]`
- Tailwind's `md:` prefix activates at ≥768px, so the `178px` values apply only at mobile widths. Tablet (768px+) and desktop are unaffected.
- `justify-start md:justify-center` flex alignment unchanged.

**No changes** to `TriviaGame.tsx`. Mascot size, `bottom: 28px`, `right: 12px`, and float animation must remain as-is — the 178px figure is derived directly from those values.

### Verification (after switch to default mode)
At 390×799 with the longest sample (fascism question + hockey teams answer):
- Question top sits exactly 178px below card's top inner edge.
- Answer bottom sits exactly 178px above card's bottom inner edge — flush with mascot's highest float frame, zero overlap.
- Equal whitespace above question and below answer (visual symmetry).
- At 768px+ (tablet/desktop), padding falls back to `clamp(0.75rem, 2.5vw, 2.5rem)` — identical to current.

If the longest sample overflows the available band (text height > card_height − 356px) at 390px, a follow-up will lower the `clamp(1.6rem, 4.5vw, 2.4rem)` font-size ceiling.

### Files Edited
- `src/components/QuestionCard.tsx`

