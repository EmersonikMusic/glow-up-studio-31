

## Fix mobile screen-height clipping on Start & Result screens

Two viewport bugs, both isolated to mobile:

### 1. Start screen scrolls on iOS Chrome / Firefox

**Root cause:** `StartScreen` root uses `min-h-screen` which resolves to `100vh` — the **large** viewport in Chrome/Firefox iOS (URL bar collapsed). When the page first loads with the URL bar visible, the actual viewport is shorter, so content overflows and the page scrolls. Safari uses the small viewport for `100vh` so it's already correct.

**Fix — `src/components/StartScreen.tsx`:**
- Change root `<div>` from `min-h-screen` to `min-h-[100svh]` and add inline style locking it to the live visual viewport on mobile only:
  ```tsx
  className="min-h-[100svh] flex flex-col relative overflow-hidden"
  style={{
    background: "hsl(var(--game-bg))",
    minHeight: "var(--app-vh, 100svh)",
    maxHeight: "var(--app-vh, 100svh)",
  }}
  ```
- This reuses the existing `--app-vh` CSS variable already maintained by the `useEffect` in `TriviaGame.tsx` (lines 137–165), which tracks `visualViewport.height`. No new listeners needed.
- Add `overflow-hidden` is already present — combined with the locked max-height, this prevents the body scroll on Chrome/Firefox iOS without affecting Safari (where `100svh` already matches).

### 2. Result screen scrolls on Safari / clips on Firefox (mobile)

**Root cause:** `ResultScreen` renders inside the `grid grid-rows-[auto_1fr_auto]` container in `TriviaGame.tsx` whose total height is locked to `--app-vh` with `overflow-hidden`. The result card stack (mascot 128px + heading + divider + two CTAs + mailto link + `gap-8` + `py-10`) is ~560px tall, plus root `py-8` (64px). On a 667–700px visual viewport (Firefox iOS with chrome) the card is taller than the row, so Firefox clips the bottom. Safari's body absorbs the overflow → unwanted scroll.

**Fix — `src/components/ResultScreen.tsx`:**
- Make the screen consume only the available row height and shrink padding on mobile:
  - Root container: change `py-8` → `py-4 sm:py-8`, add `min-h-0 overflow-hidden`.
- Tighten the card vertical rhythm on mobile so it always fits:
  - Card inner `<div className="px-8 py-10 flex flex-col items-center gap-8">` → `px-8 py-6 sm:py-10 flex flex-col items-center gap-5 sm:gap-8`
  - Mascot wrapper image `w-32 h-32` → `w-24 h-24 sm:w-32 sm:h-32`, glow `w-40 h-40` → `w-32 h-32 sm:w-40 sm:h-40`
  - Heading `text-4xl sm:text-5xl` → `text-3xl sm:text-5xl`
- These changes only affect screens narrower than the `sm` breakpoint (640px); desktop is unchanged.

### Why both fixes are mobile-only

- `100svh` resolves identically to `100vh` on desktop browsers (no URL bar collapse), and `--app-vh` always equals the window height there — so the StartScreen lock is a no-op on desktop.
- The ResultScreen padding/sizing reductions are gated on `sm:` Tailwind prefixes (≥640px reverts to current values), so tablets and desktop look identical.

### Files to edit

- `src/components/StartScreen.tsx` — swap `min-h-screen` for `--app-vh`-locked `min-h-[100svh]` with `maxHeight` lock.
- `src/components/ResultScreen.tsx` — mobile padding/gap/icon-size reductions, add `min-h-0 overflow-hidden` on root.

### Post-implementation verification

After the changes, take screenshots at 390×844 (iPhone 12/13/14 portrait, the current viewport target) for both Start and Result screens and confirm:
- No vertical scroll on either screen.
- Card content fully visible top-to-bottom (mascot, heading, divider, both CTAs, mailto link).
- No layout regression at desktop sizes.

