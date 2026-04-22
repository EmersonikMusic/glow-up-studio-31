

## Plan: Apply mobile circle alignment to desktop + previously approved mascot updates

### Context
The mobile turquoise circle is correctly anchored to the lower body. The desktop circle uses the same code but the desktop mascot square is larger and centered differently in its column, so the circle reads as misaligned. We'll apply the same proportional anchoring to desktop, plus carry through the rest of the previously approved updates.

### 1. Desktop circle alignment (match mobile)
In `src/components/TriviaGame.tsx` desktop mascot block:
- Confirm the circle div uses identical proportions to mobile: `width: 70%`, `height: 70%`, `bottom: 0`, `left: 50%`, `transform: translateX(-50%)`.
- Verify the SVG uses the same `h-[125%]` and `marginBottom: 0` as mobile so the body anchors flush to the container's bottom (= circle's bottom edge).
- If alignment still reads off after matching mobile exactly, switch the inline SVG approach (#3 below) which guarantees pixel-accurate body-bottom anchoring via `preserveAspectRatio="xMidYMax meet"`.

### 2. Inline-SVG mascots (kills the residual swap lag at the source)
The remaining lag isn't the fade — it's the `<img>` lifecycle. Even cached, `<img src>` swap forces an extra layout/paint pass that lands a frame after the React state update. Inline SVG renders in the same React commit as the text and background.

Bundle math: 25 SVGs × ~3 KB gzipped ≈ ~75 KB. Smaller than one hero JPEG, ships once. Worth it.

- `src/data/categoryMascots.ts`: switch glob to raw imports — `import.meta.glob("../assets/mascots/*.svg", { eager: true, query: "?raw", import: "default" })` returning markup strings. Also raw-import default `Mascot.svg`. Add `getMascotMarkupForCategory(category)`. Keep the URL-based `getMascotForCategory` for Start/About/Result.
- New `src/components/MascotSvg.tsx`: takes `category`, strips root `width`/`height` attrs, injects `preserveAspectRatio="xMidYMax meet"` on the `<svg>`, renders via `dangerouslySetInnerHTML` inside a div that fills its parent. The `xMidYMax` flag bottom-aligns every mascot's body deterministically — solves the per-file padding problem that's making the circle look off across the 25 SVGs.
- Replace both `<img>` blocks in `TriviaGame.tsx` with `<MascotSvg category={...} className="h-[125%] w-auto" />`.
- Drop the prewarm code path (no longer needed).

### 3. Debug overlay (mascot timing)
- New `src/lib/mascotDebug.ts`: per-category timing store + pub/sub. Records inline-vs-img path, swap latency (state change → next paint via rAF).
- New `src/components/MascotDebugOverlay.tsx`: fixed bottom-left card, lists each used category with path (inline ✓), swap ms. Toggle via `?mascotDebug=1` or `Shift+D`. Mounted from `TriviaGame.tsx`. Dev/opt-in only.

### 4. Larger mobile mascot
- Bump mobile overlay from `clamp(120px, 32vw, 170px)` to `clamp(150px, 42vw, 220px)`.
- Increase card bottom reservation from `pb-[140px] sm:pb-[160px]` to `pb-[180px] sm:pb-[200px]` so longest question + longest answer still clear at 360×640, 390×844, 414×896.

### 5. Visually center desktop mascot in its column
Geometric center reads close to the card because the heavy element on one side throws off perceived balance. Offset the mascot rightward in its 30% column with `marginRight: clamp(8px, 2vw, 32px)` (use a `justify-end` flex parent or right margin on the inner block) so whitespace between card edge and mascot ≈ whitespace between mascot and screen edge.

### Files touched
- `src/data/categoryMascots.ts` — raw SVG imports, drop prewarm, add markup getter.
- `src/lib/mascotDebug.ts` (new) — timing store.
- `src/components/MascotSvg.tsx` (new) — inline SVG renderer with `xMidYMax` anchoring.
- `src/components/MascotDebugOverlay.tsx` (new) — debug UI + toggle.
- `src/components/TriviaGame.tsx` — swap `<img>` → `<MascotSvg>` in both blocks; ensure desktop circle matches mobile (70%/70%/bottom 0); add desktop right-offset; bump mobile mascot size + card bottom padding; mount overlay.

### Out of scope
Game logic, timers, gradient sync, header/footer, settings panel, Start/About/Result screens. SVG files unchanged.

### Verification
1. `?mascotDebug=1` shows `inline • ~0 ms` for every category — confirms zero swap latency.
2. Cycle Q1→Q5 with CPU throttled 6×: mascot, background, and text swap in the same paint frame on desktop and mobile.
3. Turquoise circle wraps the lower body identically on desktop and mobile across all 25 categories (spot-check Nature, Television, Food & Drink — the viewBox extremes).
4. Desktop mascot reads visually centered between card edge and screen edge.
5. Larger mobile mascot — no overlap with longest question or longest answer at 360×640, 390×844, 414×896.
6. `npm run test` and `npm run test:e2e` still pass.

