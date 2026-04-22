

## Mobile Mascot: Account for Float Animation + Slight Size Bump

### Problem
The mobile mascot uses `animation: float 3s ease-in-out infinite`, which translates it vertically. At the animation's lowest point, the mascot dips below its anchored `bottom: 12px` position, breaking the "≥12px inside the card" rule. Also, the mascot should be slightly larger.

### Investigation Needed
The `float` keyframe isn't visible in the supplied context. I'll inspect `src/index.css` and `tailwind.config.ts` to find its definition and measure the downward translate so the new `bottom` offset compensates exactly. Assumption for now: `float` translates `±6px` to `±10px` on the Y axis (typical for this pattern). I'll confirm before writing the fix; if the float keyframe translates by `Npx` downward, mascot's `bottom` becomes `12px + Npx`.

### Changes (mobile only)

**`src/components/TriviaGame.tsx` — mobile mascot wrapper (the `md:hidden absolute …` div)**
- Increase size from `clamp(120px, 32vw, 170px)` to `clamp(140px, 36vw, 195px)` (~15% larger, still fits the card with the new bottom padding).
- Update `bottom` from `12px` to `12px + downwardTranslateOfFloat` so the mascot's lowest animation frame sits exactly 12px above the card's bottom inner edge.
  - If float dips 8px down → `bottom: 20px`
  - If float dips 10px down → `bottom: 22px`
  - Exact value finalized after reading the keyframe.
- Keep `right: 12px`, `pointer-events-none`, `z-20`, and `flex items-end justify-end` unchanged.
- Desktop mascot (the `hidden md:flex` block) is untouched.

**`src/components/QuestionCard.tsx` — bump mobile bottom padding to match larger mascot**
- The mobile bottom padding currently reserves `clamp(0.75rem,2.5vw,2.5rem) + 140px` for the 170px-tall mascot at `bottom: 12px`.
- Increase to `+165px` to keep ≥8px clearance between answer-reveal text and the larger mascot's top edge at its highest float frame.
- New class: `pb-[calc(clamp(0.75rem,2.5vw,2.5rem)+165px)]`. Desktop `md:pb-[clamp(0.75rem,2.5vw,2.5rem)]` unchanged.
- `paddingTop` rules unchanged.

### Verification (after switch to default mode)
At 471×702 with the longest question + revealed answer:
- Mascot's lowest float frame sits exactly 12px above card bottom inner edge.
- Mascot's highest float frame leaves ≥8px gap below answer-reveal text.
- Mascot is ~15% larger visually.
- Desktop layout (≥768px) is byte-identical to current.

### Files Edited
- `src/components/TriviaGame.tsx`
- `src/components/QuestionCard.tsx`

