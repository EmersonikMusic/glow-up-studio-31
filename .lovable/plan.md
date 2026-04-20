
## Plan: Mobile dynamic viewport + Fullscreen toggle

### Part 1 — Mobile viewport fits browser chrome

**Problem:** `min-h-screen` on the game container uses `100vh`, which on iOS Safari (incl. iPhone 17 Pro) ignores the dynamic browser UI (URL bar, bottom toolbar). Header/footer get pushed off-screen.

**Fix — `src/components/TriviaGame.tsx`** (root container, ~line 197):
- Replace `min-h-screen` with `min-h-[100svh]` (small viewport height — accounts for browser chrome).
- Keep `grid-rows-[auto_1fr_auto]` so header + footer hold their slots and the middle row shrinks.

**Fix — `index.html`:**
- Update viewport meta to `width=device-width, initial-scale=1.0, viewport-fit=cover` so the page respects safe-areas on notched devices.

**Fix — `src/index.css`:**
- Add a small `@supports (height: 100svh)` fallback rule isn't needed since Tailwind compiles `100svh` directly; just rely on the class. No additional CSS required.

This guarantees the game container is exactly the visible viewport height (recalculated as the iOS toolbar collapses/expands), keeping header and footer on-screen at all times.

### Part 2 — Fullscreen toggle button

**New button in `src/components/GameHeader.tsx`:**
- Add a new icon button placed **to the right of the Settings gear**.
- Use Lucide `Maximize2` / `Minimize2` icons, swapping based on state.
- Same styling as the other nav buttons (`nav-btn`, 9×9, glass background, gold icon).
- aria-label toggles between "Enter fullscreen" / "Exit fullscreen".

**Logic — handled inside `GameHeader.tsx`** (self-contained, no parent wiring needed):
- `const [isFullscreen, setIsFullscreen] = useState(false)`
- `onClick` calls `document.documentElement.requestFullscreen()` or `document.exitFullscreen()` (with vendor fallbacks for Safari: `webkitRequestFullscreen`, `webkitExitFullscreen`).
- `useEffect` listens to `fullscreenchange` + `webkitfullscreenchange` to sync state if user exits via Esc/swipe.
- Hide the button if Fullscreen API is unsupported (`!document.documentElement.requestFullscreen && !(...)webkitRequestFullscreen` → render nothing).

### Files touched
- `index.html` — viewport meta tweak.
- `src/components/TriviaGame.tsx` — `min-h-screen` → `min-h-[100svh]`.
- `src/components/GameHeader.tsx` — new fullscreen button + state/effect.

### Out of scope
No layout, color, padding, or other component changes.

### Verification (browser test after build)
1. Mobile viewport (390×844, iPhone 14 Pro proxy): confirm header + footer both fully visible, no clipping.
2. Click new fullscreen button → enters fullscreen, icon swaps to "shrink".
3. Click again (or press Esc) → exits, icon swaps back to "expand".
4. Verify on desktop the button sits to the right of the gear icon, matches glass nav style.
