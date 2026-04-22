

## Plan: Remove fade, reposition turquoise circle, center desktop mascot

### 1. Remove the fade transition on mascot swap
The `animate-fade-in` class is the visible delay — it runs a 0.3s opacity+translateY animation on every category change, trailing the instantaneous text/background swap.

In `src/components/TriviaGame.tsx`, both desktop and mobile mascot `<img>` tags:
- Remove `animate-fade-in`.
- Remove `key={currentQuestion.category}` (without an animation, remounting serves no purpose; letting React patch the `src` attribute makes the swap fully synchronous against the prewarmed cache).
- Keep the parent float animation untouched.

### 2. Reposition the turquoise circle (lower-body anchor)
Reference shows the circle framing the **torso/lower body**, with head and hat extending well above its top edge. Currently the circle is `inset-0` (fills the whole square), so it's too tall and head sits inside it.

In both mascot blocks:
- Change the circle `<div>` from `absolute inset-0 rounded-full` to a smaller, bottom-anchored circle:
  - `width: 70%`, `height: 70%`
  - `bottom: 0`, `left: 50%`, `transform: translateX(-50%)`
  - Same cyan color, still `rounded-full`.
- Bump the `<img>` so head/hat clearly extend above the circle:
  - `h-[110%]` → `h-[125%]`
  - `marginBottom` from `-8%` → `0` so the body anchors at the circle's bottom.
- Apply identical changes to mobile so both breakpoints match.

### 3. Center the desktop mascot in its column
Currently the desktop mascot column uses `md:-mr-6 lg:-mr-8` (negative right margins that bleed it toward the screen edge) **plus** `items-center justify-center` on the column — but the negative margin pulls the whole flex content rightward, and visually the mascot still reads as sitting closer to the card (left side) than the edge. Fix:

- Remove `md:-mr-6 lg:-mr-8` from the desktop mascot column wrapper. With those gone, the inner `flex items-center justify-center` correctly centers the mascot horizontally within the 30% column — equal whitespace on both sides between the card and the screen edge.
- No other layout changes; column width stays 30%, card column stays 70%.

### Files touched
- `src/components/TriviaGame.tsx` — both mascot blocks: drop fade + key on `<img>`, resize/reposition the cyan circle, bump image height, zero out marginBottom; on the desktop wrapper, remove the negative right margins so the mascot truly centers in its column.

### Out of scope
No changes to prewarm logic, float animation, gradient sync, mascot mappings, mobile overlay position, settings panel, header/footer, or game logic. SVG files unchanged.

### Verification
1. Cycle through 5+ questions on desktop (1147×774) and mobile (390×844) — mascot, background, and text all swap in the same paint frame, no trailing fade.
2. Visual check vs. reference: circle frames the torso, head + hat extend above on every category, both breakpoints.
3. Desktop mascot is visually centered within its column — equal gap between the right edge of the card and the mascot, and between the mascot and the right edge of the screen.
4. Longest question + answer strings still fully visible at 360×640, 390×844, 414×896.
5. `npm run test` and `npm run test:e2e` still pass.

