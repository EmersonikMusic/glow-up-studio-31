## Shorten loading headline + speed up bounce + animate each dot individually

Single file: `index.html`.

### Changes

1. **Headline text** — replace the current 20 bouncing spans with `Loading` followed by three separate `.` dots (no single `…` glyph, so each dot can bounce on its own delay).
   - Letters: `L` (0ms), `o` (60ms), `a` (120ms), `d` (180ms), `i` (240ms), `n` (300ms), `g` (360ms)
   - Dots: `.` (420ms), `.` (480ms), `.` (540ms)
   - Update `<h1 aria-label>` to `"Loading..."` (plain ASCII so screen readers announce three periods consistently).

2. **Speed up wave** — change `.bounce-char` animation duration from `1.4s` to `1s`; per-letter stagger tightens from `70ms` to `60ms` (already reflected in the delays above).

3. **No other changes** — keep the gold gradient on each span, keyframes shape, reduced-motion fallback, header bar, helper paragraph, and React code as-is.

### Verification

Hard-refresh preview. Confirm headline reads `LOADING...` in gold, all 10 spans (7 letters + 3 dots) bounce in sequence with a snappier rhythm, dots clearly animate one after another rather than together, and reduced-motion still freezes the bounce.
