# Plan: Review modal styling + CTA placement

## 1. `ResultScreen.tsx` — move "Review Your Game" out of the CTA stack

- Remove the existing "Review Your Game" `<button>` from inside the `flex-col` CTA stack (between "Play Again" and "Change Settings").
- Render it instead as a text link **below** the CTA stack, just above (or replacing the position next to) the "Contact us" mailto link.
- Style to match the "How Do I Play?" link in `StartScreen.tsx`:
  - `className="howto-link mt-[22px] text-xs font-body font-semibold underline underline-offset-[5px] text-[hsl(185_70%_55%)] hover:text-[hsl(var(--game-gold))] transition-colors"`
  - Plain `<button>` (no pill, no border, no background).
- Keep `trackClick("click_review_game")` + `setReviewOpen(true)` behavior unchanged.
- Only render when `hasList`.

## 2. `ResultScreen.tsx` — restyle the Review modal to match About/HowToPlay

Update `DialogContent` styling:
- Background: `rgba(0, 0, 0, 0.25)` with `backdropFilter: blur(24px)` (matches About card glass).
- Border: `1.5px solid rgba(255, 255, 255, 0.18)`.
- Title: keep gold (`hsl(var(--game-gold))`), `font-heading font-extrabold uppercase`, tracking tight — same family of treatment as About's "Endless Trivia World!" but without the gradient (gold solid is fine to match current).
- Above the title, add the small teal eyebrow used on About: `text-xs font-subheading font-bold tracking-[0.2em] uppercase` in `hsl(185 70% 55%)`, e.g. "Round recap".
- `DialogDescription`: `text-sm font-body font-semibold` in white/80.

Update the table styling so it reads like the game UI rather than default shadcn:
- Table wrapper border: `border-white/10` → `rgba(255,255,255,0.1)`; rounded `2xl`.
- Header row: teal eyebrow style — `text-xs font-subheading font-bold tracking-[0.18em] uppercase` in `hsl(185 70% 55%)`. Sticky top with `rgba(0,0,0,0.6)` backdrop.
- Body cells: `font-body font-semibold` in white/90, question column slightly larger weight, index in tabular-nums white/60.
- "Skipped" pill: keep gold text, but use the same eyebrow `tracking-[0.2em]` and `text-[10px]` for consistency.
- Row dividers: `border-white/10`.
- No hover background on rows (per request, hover lives on the icons only).

## 3. `ResultScreen.tsx` — move thumbs to the right + restyle interaction

Column order becomes: `#` | `Question` | `Answer` | `Feedback (thumbs)`.

Thumbs cell:
- Right-aligned, `w-24`, flex row `gap-2 justify-end`.
- Each thumb button:
  - Default: `ThumbsUp`/`ThumbsDown` outline icons (current lucide stroke), color `text-white/70`.
  - Hover (pointer fine only — wrap in `@media (hover:hover)` via `md:hover:` is not enough; use `[@media(hover:hover)]:hover:text-[hsl(var(--game-gold))]` to honor the "Hover effects pointer-only" core rule). Remove the current `hover:bg-white/10` background.
  - Active/selected state (local component state, no persistence): on click, set `feedback[i] = "up" | "down"` (toggle off if same clicked again). When active:
    - Scale bump animation: add a transient class that runs `transition-transform`, set `scale-110` for ~180ms then back to `scale-100` (use `setTimeout` + state, or CSS `animate-bounce-in`-style; reuse Tailwind's `animate-[bounce_0.4s]` is too much — use existing `active:scale-95` plus a one-shot `scale-110` toggle).
    - Icon becomes solid/filled: lucide icons don't auto-fill, so add `fill="currentColor"` to the active variant and set color via gradient. Apply the PrimaryCTA gradient as text color using:
      ```
      background: linear-gradient(0deg,#e93e3a 0%,#ed683c 11%,#f3903f 33%,#fdc70c 72%,#fff33b 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      ```
      Because lucide icons render as SVG strokes (not text), this won't paint them. Instead, wrap the icon in a span and apply the gradient as `background` with `mask-image` using the icon as mask — OR simpler: apply gradient via SVG `<defs><linearGradient>` is overkill. The pragmatic approach: when active, render the icon with `fill="url(#thumb-gradient)" stroke="url(#thumb-gradient)"` and inject one shared `<svg>` `<defs>` `<linearGradient id="thumb-gradient">` at the top of the modal body matching the PrimaryCTA color stops.
- Wire `feedback` state as `Record<number, "up" | "down" | undefined>` local to `ResultScreen`. No persistence, no analytics — placeholder per earlier scope.

## Out of scope

- Persisting feedback, sending it anywhere, or analytics events on thumb clicks.
- Touching any other screen, CTA, or copy.
- Changing modal width/height behavior (10-row scroll cap stays).

## Technical notes

- Files touched: `src/components/ResultScreen.tsx` only.
- No new dependencies. No changes to `analytics.ts`, `index.css`, or shadcn primitives.
- Gradient `<defs>` lives once inside the `DialogContent` so both thumb columns reference the same `url(#thumb-gradient)`.
