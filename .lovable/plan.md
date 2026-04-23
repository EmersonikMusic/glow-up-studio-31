

## No-Scroll Mobile Fit + Doubled Side Padding + Recalculated Vertical Anchor

### Goals (mobile only, ≤767px)
1. **Never scroll**: Entire UI (header + game card + footer + mascot) always fits within `var(--app-vh)` (the live visual viewport) on every mobile browser.
2. **Doubled horizontal padding** on the question card.
3. **Game copy container** stays anchored above the mascot's highest float frame, with the longest Q + A sample fitting without overlap or overflow.

### Current state (390×799, mobile)
- Card horizontal padding: `clamp(0.875rem, 3vw, 2.5rem)` → ~14px at 390px.
- Card vertical padding: `pt-[178px] pb-[178px]` (fixed).
- Mascot: 140px tall, `bottom: 28px`, float up −10px → mascot top peak = 178px above card bottom (correct).
- Problem: fixed 356px combined vertical padding leaves only ~279px for text on a ~635px card. Longest sample ≈ 8 lines of question + divider + 4 lines of answer overflows that band → card stretches → page scrolls.

### Changes

**1. `src/components/QuestionCard.tsx` — doubled horizontal padding (mobile only)**
- `paddingLeft` / `paddingRight` go from `clamp(0.875rem, 3vw, 2.5rem)` to `clamp(1.75rem, 6vw, 5rem)` on mobile.
- Wrap original values in a `md:` override so tablet (≥768px) and desktop are unchanged.
- Implementation: move padding from inline `style` to Tailwind utilities so the `md:` prefix works:
  - `px-[clamp(1.75rem,6vw,5rem)] md:px-[clamp(0.875rem,3vw,2.5rem)]`
  - Remove `paddingLeft`/`paddingRight` from the inline `style`.

**2. `src/components/QuestionCard.tsx` — vertical padding becomes mascot-aware, not fixed**
- Replace `pt-[178px] pb-[178px]` with:
  - **Top padding (mobile):** `pt-[clamp(1rem,3vh,1.5rem)]` — minimal so text gets max vertical room.
  - **Bottom padding (mobile):** `pb-[178px]` — keeps the exact mascot-peak clearance (28 bottom + 140 height + 10 float = 178).
- This anchors the **bottom edge** of the text band exactly at the mascot's highest float frame (the previously calculated invariant). The text grows **upward** from there toward the top of the card, never overlapping the mascot.
- `justify-start md:justify-center` stays — text aligns to the top with the small top padding, leaving slack above for short questions and using all available height for the longest sample.
- Desktop overrides unchanged: `md:pt-[clamp(0.75rem,2.5vw,2.5rem)] md:pb-[clamp(0.75rem,2.5vw,2.5rem)]`.

**3. `src/components/QuestionCard.tsx` — make text fit without overflow**
- Add `min-h-0` and `overflow-hidden` to the card root (mobile only) so any residual oversize is clipped rather than stretching the grid row.
- Add `overflow-y-auto` to the inner text wrapper? **No** — would re-introduce scrolling. Instead:
- Lower the mobile font-size ceiling on the longest sample:
  - Question text: `clamp(1.25rem, 3.6vw, 2.4rem)` (was `clamp(1.6rem, 4.5vw, 2.4rem)`) → at 390px: ~14px smaller, fits ~10 lines in available band.
  - Answer text: same change.
- Tighter `lineHeight: 1.35` on mobile (was 1.5/1.45) using a media-aware inline value or duplicate class — simplest: drop `lineHeight: 1.5` to `lineHeight: 1.4` for both blocks. (Slight desktop impact only on line-height, no layout shift since `clamp` font scales differently above 768px.)
- Reduce mobile divider margin from `clamp(1rem, 2.5vw, 1.5rem)` to `clamp(0.5rem, 1.5vw, 1rem)`.

**4. `src/components/TriviaGame.tsx` — guarantee no page scroll on mobile**
- Root grid already has `overflow-hidden` and `minHeight: var(--app-vh, 100svh)`. Add `maxHeight: var(--app-vh, 100svh)` to lock total height to the live visual viewport so iOS Safari toolbars can't push content off-screen.
- `<main>` already has `min-h-0` semantics via `h-full` inside `1fr` row; ensure the mobile mascot's `absolute` positioning doesn't escape by leaving its anchor unchanged (28px / 12px / 140px clamp).

### Recalculated invariants (390×799, longest sample)
- App height: 799px (locked).
- Header: ~64px. Footer: ~76px. Main row: ~659px. Main py-3: 12+12 → card box: ~635px.
- Card mobile paddings: top 16–24px, bottom 178px → text band ~440px tall.
- Longest question text @ 1.25–1.5rem with line-height 1.4 + divider (~24px) + longest answer text → fits within 440px. (Verified by line-count math: question ~9 lines × ~28px = 252px, divider ~24px, answer ~4 lines × ~28px = 112px → total ~388px, leaves ~52px slack.)
- Mascot peak (top edge of mascot at highest float frame) sits exactly at the card's bottom inner padding edge — zero overlap, zero scroll.

### Files Edited
- `src/components/QuestionCard.tsx`
- `src/components/TriviaGame.tsx`

