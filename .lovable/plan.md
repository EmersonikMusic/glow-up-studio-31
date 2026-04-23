
## Mobile: Anchored Divider + Smooth Question Shrink + Auto-Fit Fallback

### Goals (mobile only, ≤767px)
1. **Pin the divider** to a fixed Y inside the card. Question grows **upward** from divider; answer grows **downward** from it.
2. **Question top edge** never crosses the card's 28px inner top padding.
3. **Answer bottom edge** never crosses the mascot's float peak (193px above card outer bottom).
4. **Auto-shrink fallback** for question and answer if content would overflow its band.
5. **Smoother question shrink** when the answer reveals — no jarring line-count snap.

### Dataset measurements (user-confirmed)
- Longest question: **229 chars** ("Which form of far-right, authoritarian ultranationalism…")
- Longest answer: **140 chars** ("The Toronto Maple Leafs, the Montreal Canadiens, the Boston Bruins, the Detroit Red Wings, the New York Rangers, and the Chicago Blackhawks.")

### Layout math (390×799 mobile)
- Card outer ≈ 635px → inner content area ≈ 579px (after 28px top + 28px bottom padding).
- Mascot peak = 28 + 155 + 10 (float) = **193px** above card outer bottom → text wrapper bottom must sit **165px** above card inner bottom.
- Available text wrapper height = 579 − 165 = **414px** total.
- Split via flex weights: question band ~60% (~248px) above divider, answer band ~40% (~166px) below divider.

### Content-fit verification (390px width, ~334px text width)
**Question (229 chars, base font ≈ 14.04px @ clamp floor, line-height 1.4 ≈ 19.7px/line):**
- ~25 chars/line → 229 ÷ 25 ≈ **10 lines × 19.7 = 197px** → fits 248px band with 51px slack pre-shrink.
- After answer reveals: scale(0.85) from bottom-center → visual height ~167px → still fits comfortably.

**Answer (140 chars, base font ≈ 14.4px @ clamp floor, line-height 1.45 ≈ 20.9px/line):**
- ~24 chars/line → 140 ÷ 24 ≈ **6 lines × 20.9 = 125px** → fits 166px band with 41px slack.

Both longest samples fit without fallback. Fallback handles future content additions.

### Changes — `src/components/QuestionCard.tsx`

**1. Restructure inner wrapper into 3 anchored zones**
- Replace the current inner `<div className="… mt-[12px] mb-[165px] …">` with a flex column wrapper (mobile) that has:
  - `mb-[165px] md:mb-0` (mascot reserve preserved).
  - `mt-[12px] md:mt-0` (top offset preserved → ~40px from card top).
  - `flex-1 flex flex-col` so it fills the card's available height.
- Inside it (mobile structure):
  - **Question container**: `flex-[3] flex items-end justify-center min-h-0 overflow-hidden` — question text bottom-aligned to divider, grows upward.
  - **Divider**: always rendered, `flex-shrink-0`. Height stays 1px; opacity transitions 0 → 1 when answered (no layout shift; divider Y is constant whether answered or not).
  - **Answer container**: `flex-[2] flex items-start justify-center min-h-0 overflow-hidden` — answer top-aligned to divider, grows downward.
- Desktop branch unchanged: keep current single-flow layout via conditional rendering on `isMobile`.

**2. Smooth question shrink (replace font-size animation with transform)**
- Remove the mobile `fontSize` swap (`clamp(0.95rem, 2.7vw, 1.8rem)` when answered).
- Add `transform: scale(0.85)` with `transformOrigin: "bottom center"` when `isMobile && answered`. Identity `scale(1)` otherwise.
- Transition: `transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease, color 0.5s ease`. Drop `font-size` from transition list.
- Why smoother: `transform: scale` does NOT reflow text → line breaks stay identical → reads as a smooth zoom toward the divider rather than a re-layout snap.
- Trade-off (visual side padding asymmetry from scale): mitigated by the mild 0.85 ratio (vs prior 0.65) and bottom-center origin, which collapses the question *toward the divider* and gives clear visual hierarchy.

**3. Auto-fit fallback (CSS-variable font scale)**
- Add `useLayoutEffect` in `QuestionCard`:
  - Refs on question `<p>` and answer `<p>`.
  - On mount + on `question.text` / `correctAnswer` change + on resize, measure each element's `scrollHeight` vs its parent container's `clientHeight`.
  - If overflow: decrement `--q-font-scale` (or `--a-font-scale`) from `1` in 0.05 steps down to floor `0.7` until it fits.
- Apply via inline style on each `<p>`:
  - Question: `fontSize: "calc(clamp(1.25rem, 3.6vw, 2.4rem) * var(--q-font-scale, 1))"`
  - Answer:   `fontSize: "calc(clamp(1.25rem, 3.6vw, 2.4rem) * var(--a-font-scale, 1))"`
- Mobile-only (skip when `!isMobile`); desktop uses existing `md:` font sizes unchanged.
- Reset scale to 1 before each measurement pass so growing back to fit after a content swap works correctly.

**4. Preserve "Time's up!" indicator**
- Render inside the answer container when `answered && !correctAnswer`. Same animation (`animate-answer-reveal`).

### Invariants verified
- Card 28px padding all sides — unchanged.
- Mascot bottom-right anchor + 155–195px clamp — unchanged.
- Divider Y constant before/after answer reveal — no shift.
- Question never crosses 28px top inner padding (overflow-hidden + flex-end + auto-shrink).
- Answer never crosses mascot float peak (165px reserve + overflow-hidden + auto-shrink).
- No scroll: total wrapper height stays at 414px; `var(--app-vh)` lock unchanged.
- Desktop / tablet (≥768px) byte-identical.

### Files Edited
- `src/components/QuestionCard.tsx`
