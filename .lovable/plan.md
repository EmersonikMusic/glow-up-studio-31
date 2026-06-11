## Letter-by-letter bounce animation for "Loading Triviolivia…"

Scoped to `index.html` only — the heading sits in the pre-mount fallback, so the animation must be pure CSS (no JS, no Motion, no React).

### Changes to `index.html`

1. **Split the heading into per-character spans.**
   Replace the existing `<h1>Loading Triviolivia…</h1>` with the same text wrapped one character at a time in `<span class="bounce-char">…</span>`. Spaces become `&nbsp;` inside their own span so the wave continues over the gap. The ellipsis `…` is included as its own bouncing span.

2. **Add a keyframe + staggered delays in the existing `<style>` block in `<head>`.**

   ```css
   @keyframes triviaBounce {
     0%, 60%, 100% { transform: translateY(0); }
     30% { transform: translateY(-14%); }
   }
   .bounce-char {
     display: inline-block;
     animation: triviaBounce 1.4s cubic-bezier(.5,.05,.3,1) infinite;
     will-change: transform;
   }
   @media (prefers-reduced-motion: reduce) {
     .bounce-char { animation: none; }
   }
   ```

3. **Stagger each letter by ~70ms via inline `style="animation-delay:Xms"`** on each span (0, 70, 140, 210… through the last character). This produces a left-to-right wave that loops smoothly.

4. **Preserve the existing typography.** The gold gradient, uppercase, Fredoka-style fallback font, size, and line-height stay exactly as they are — they are applied on the parent `<h1>`, and `inline-block` spans inherit the `background-clip:text` fill correctly because the gradient is painted on the `<h1>` (each `<span>` will pick it up since it inherits `color: transparent` and the clipped background extends across all inline children). If the gradient does not render across spans in any tested browser, fall back to setting the gradient on each `.bounce-char` instead of the `<h1>`.

5. **Respect reduced motion** via the media query above — no bounce for users who opt out.

### Out of scope

- No change to layout, header bar, helper paragraph, background, or React code.
- No new fonts, scripts, or assets.

### Verification

Hard-refresh the preview. Confirm a gentle left-to-right wave runs continuously across the gold heading, the ellipsis bounces last, the gold gradient stays intact across all letters, and users with `prefers-reduced-motion: reduce` see a static heading.
