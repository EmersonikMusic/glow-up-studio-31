## Fix the invisible bouncing "Loading Triviolivia…" headline

### Root cause
The gold gradient + `background-clip: text` + `-webkit-text-fill-color: transparent` are all set on the `<h1>`. Each letter is wrapped in a `<span class="bounce-char">` with `display: inline-block` (required for the bounce transform). An inline-block child creates its own background painting context, so the parent's clipped gradient does not cover the child's glyphs — the spans inherit `color: transparent` with no background of their own, rendering invisible. The "strange gradients" you see are the leftover `<h1>` background showing through the gaps between inline-block spans.

### Fix (single file: `index.html`)

1. **Move the gold gradient onto `.bounce-char`** so each span paints and clips its own gradient.

   In the `<style>` block, update `.bounce-char`:
   ```css
   .bounce-char{
     display:inline-block;
     animation:triviaBounce 1.4s cubic-bezier(.5,.05,.3,1) infinite;
     will-change:transform;
     color:#FFC93D;                                  /* fallback for browsers without bg-clip:text */
     background:linear-gradient(160deg,#FFC93D 0%,#E89412 45%,#C97114 100%);
     -webkit-background-clip:text;
     background-clip:text;
     -webkit-text-fill-color:transparent;
   }
   ```

2. **Strip the gradient + background-clip rules off the `<h1>`** so the parent no longer paints a fill behind the spans. Keep the h1's typographic rules (font-family, weight, uppercase, letter-spacing, line-height, font-size, margin). Set `color:#FFC93D` on the h1 too so any stray text (e.g. the `&nbsp;` span) stays on-brand.

3. **Keep the existing `<span class="bounce-char">` markup and staggered `animation-delay` values** — they are correct; only the styling was wrong.

4. **No other changes.** Header bar, body background, helper paragraph, keyframes, reduced-motion media query, and React code all stay as they are.

### Verification

Hard-refresh the preview. Confirm:
- "LOADING TRIVIOLIVIA…" is clearly visible in the gold gradient, on the dark background.
- A smooth left-to-right bounce wave runs across all letters and loops.
- No stray gradient streaks behind or between letters.
- `prefers-reduced-motion: reduce` still freezes the bounce (text remains fully visible).
