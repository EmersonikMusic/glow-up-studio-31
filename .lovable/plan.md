## Why the bar looks choppy

The timer bar in `GameFooter.tsx` animates the CSS `width` property (`@keyframes bar-deplete` / `bar-fill` in `src/index.css`). Animating `width` forces the browser to run layout + paint on every frame, which is the textbook cause of jank for progress bars.

It gets worse because the bar sits inside a pill that uses `backdrop-blur-md`. Backdrop blur re-samples the pixels underneath every frame, so any movement above it amplifies the cost (this matches a known pattern we've fixed before).

## Fix

1. **Switch the bar animation to `transform: scaleX(...)`** — GPU-composited, no layout, smooth at 60fps.
   - In `src/index.css`, rewrite the keyframes:
     ```css
     @keyframes bar-deplete {
       from { transform: scaleX(1); }
       to   { transform: scaleX(0); }
     }
     @keyframes bar-fill {
       from { transform: scaleX(0); }
       to   { transform: scaleX(1); }
     }
     ```
   - In `GameFooter.tsx`, set the bar element to full width with `transform-origin: left`, and add `will-change: transform` and `backface-visibility: hidden` to promote it to its own layer:
     ```tsx
     style={{
       width: "100%",
       transformOrigin: "left center",
       willChange: "transform",
       backfaceVisibility: "hidden",
       background: "rgba(0, 0, 0, 0.3)",
       animation: isAnswerPhase
         ? `bar-fill ${totalAnswerTime}s linear forwards`
         : `bar-deplete ${totalQuestionTime}s linear forwards`,
       animationPlayState: paused ? "paused" : "running",
     }}
     ```

2. **Reduce backdrop-blur cost on the pill** — replace `backdrop-blur-md` on the metadata pill with a slightly more opaque solid background (e.g. `rgba(0,0,0,0.5)`) so the bar underneath doesn't keep re-triggering an expensive blur pass. Text legibility is preserved via the darker background; we can add a subtle `text-shadow` if needed.

## Files touched

- `src/index.css` — rewrite `bar-deplete` and `bar-fill` keyframes to use `transform: scaleX`.
- `src/components/GameFooter.tsx` — update bar element styles (width 100%, transform-origin, will-change); drop `backdrop-blur-md` from the pill and bump background opacity.

No game-logic, state, or timing changes — purely a rendering performance fix. The visual result is identical but smooth.
