

## Plan: Fix mascot lag, add fade animation, enlarge mascot

### 1. Eliminate the swap lag (root cause)
The `<img>` waits for the network/decode of each new SVG the first time it's requested, so text + background swap before the image catches up. Fix in two layers:

**a. Preload all mascots once at app boot** — in `src/data/categoryMascots.ts`, after the eager `import.meta.glob`, loop the resolved URLs and instantiate `new Image()` per URL (browser caches them). Runs once on module import. Zero render cost, all 25 SVGs warm in the HTTP cache before the first question swap.

**b. Force a fresh `<img>` element per category** — give each `<img>` a `key={currentQuestion.category}` so React unmounts/mounts on category change. Combined with the warm cache, the new src paints in the same frame as the question text swap.

### 2. Subtle on-swap animation (matches site language)
Existing site animations: `animate-fade-in` (opacity + translateY 10px, 0.3s ease-out — already used by other transitions). Apply it to both mascot `<img>` elements via the same `key={currentQuestion.category}`. Removes the current `transition-opacity duration-300` on the img (it never fires because the element doesn't re-render — only `src` changes). The float idle animation on the parent stays untouched.

### 3. Enlarge the mascot (both breakpoints)

**Desktop (≥768px)** — currently `clamp(140px, 18vw, 240px)` inside a 30%-width column. Bump to `clamp(180px, 24vw, 320px)`. Column width stays 30%; the `-mr-6/-mr-8` negative margins already let it bleed to the edge, and the question card sits in the 70% column so no overlap is possible.

**Mobile (<768px)** — currently bottom-right overlay at `clamp(90px, 26vw, 130px)`. Increase to `clamp(120px, 32vw, 170px)`. Risk: this overlay sits inside `<main>` over the card. To guarantee the longest question + longest answer never get covered:
- Reserve safe space at the bottom of the card by adding `pb-[140px] sm:pb-[160px] md:pb-0` to the QuestionCard's outer container in `TriviaGame.tsx` (only on mobile — desktop mascot is in its own column, so 0 padding there).
- The card uses `flex flex-col justify-center`, so reserved bottom padding shifts content upward and prevents the mascot from overlapping text even with the longest strings. Question text uses `clamp(1.6rem, 4.5vw, 2.4rem)` and the divider+answer reveal stay inside the padded region.

Verification target strings (the two you provided) will be tested at 360×640, 390×844, 414×896 and confirmed not to be obscured by the mascot.

### Files touched
- `src/data/categoryMascots.ts` — add one-time `new Image()` preload loop after the glob.
- `src/components/TriviaGame.tsx` — add `key={currentQuestion.category}` + `animate-fade-in` to both mascot `<img>` tags; bump desktop and mobile size clamps; add mobile-only bottom padding wrapper around the QuestionCard column so text never sits behind the mascot.

### Out of scope
No changes to background gradients, layout grid, header/footer, timers, float animation, default-mascot screens, or game logic. The default `Mascot.svg` still shows on Start/About/Result screens.

### Verification
1. Start a game → question text, background, and mascot all swap in the same frame (no visible delay on Q1→Q2→Q3…).
2. Mascot fades in subtly on each new question, matching the site's existing fade-in feel.
3. With the longest question and longest answer rendered (forced via test data), no character is covered by the mascot at 360×640, 390×844, 414×896, 768×1024, 1280×720, 1920×1080.
4. Default `Mascot.svg` still appears on Start/About/Result.
5. `npm run test` and `npm run test:e2e` still pass — no test selectors or card heights change.

