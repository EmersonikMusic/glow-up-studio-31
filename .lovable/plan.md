

## Plan: Decode prewarm + size normalization

### 1. Decode prewarm (eliminate residual swap delay)

Current preload only triggers HTTP fetch — the browser still **decodes** the SVG on first paint, which is what you see as lag on slower devices.

Update `src/data/categoryMascots.ts`:
- Replace the basic `new Image(); img.src = url` loop with a prewarm that calls `img.decode()` on each (including the default `Mascot.svg`).
- Wrap each `decode()` in `Promise.race([decode, timeoutPromise(2000)])` so a slow/failed decode never blocks others.
- Run inside `requestIdleCallback` (with `setTimeout` fallback) so prewarm doesn't compete with first paint of the Start screen.
- Keep the function fire-and-forget — no exports change, no callers touched.

Result: by the time the user clicks Start, every SVG is already fetched **and** GPU-decoded. The first paint of any new category is synchronous.

### 2. Size normalization (root cause: viewBox variance)

Confirmed via inspection — the 25 SVGs have wildly different viewBox aspect ratios:
- Narrowest: `286 × 486` (≈0.59 ratio) — sports, science, miscellaneous, etc.
- Widest: `409 × 577` (≈0.71 ratio) — television
- Tallest relative: `300 × 589` (food-and-drink)

With the current square container + `object-contain`, narrower mascots render smaller and shorter ones sit lower. That's the visual inconsistency, not a rendering bug.

**Fix (no re-uploads needed)** — normalize at render time in `src/components/TriviaGame.tsx`:
- Change container `height` to `auto` and let the image set its own intrinsic ratio, OR
- Better: keep the container square (cyan circle stays a circle) but add a uniform **height-based sizing rule** to the `<img>`: switch from `w-[85%] h-auto` to `h-[110%] w-auto` so every mascot is sized by its **height** (the more consistent dimension across the set — all heights cluster 467–589, ratio variance ~25%, vs widths 286–409 with ~43% variance). This makes every character appear at the same visual height regardless of body width.
- Adjust `marginBottom` from `-2%` to `-8%` so the slightly taller render still anchors at the circle's lower edge.
- Apply identical rule to mobile `<img>` so both breakpoints stay in sync.

If after this the visual size still varies more than you like, you can re-export the SVGs with a shared canvas (e.g. all `400 × 580`, character centered), which would be the cleanest long-term fix — but the render-time normalization above gets us 90% there with zero asset work.

### Files touched
- `src/data/categoryMascots.ts` — replace simple preload with `decode()` prewarm + idle-callback scheduling + per-image timeout.
- `src/components/TriviaGame.tsx` — both mascot `<img>` tags: switch from width-based to height-based sizing, adjust `marginBottom`.

### Out of scope
No changes to the float animation, fade-in, gradient sync, container dimensions, default-mascot screens, or game logic. No SVG file edits.

### Verification
1. Cold reload → click Start → cycle Q1→Q5 across mixed categories. Mascot, background, and question text appear in the same frame on every transition (test on a throttled CPU profile too).
2. Visually compare 5 random categories side-by-side — character heights match within a few pixels at both breakpoints.
3. Longest question + longest answer test strings still render fully visible at 360×640, 390×844, 414×896 (mobile padding unchanged).
4. `npm run test` and `npm run test:e2e` still pass.

### Optional follow-up (only if you still see size jitter)
You re-export all 25 SVGs onto a shared canvas (`400 × 580` recommended). Tell me the new dimensions and I'll drop the height-based hack — assets become the single source of truth.

