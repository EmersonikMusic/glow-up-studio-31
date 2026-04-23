
## Mobile: +2px Fonts, Remove Landscape Branch, Lock Portrait, Center Mascot

### Goals
1. Increase mobile question/answer font sizes by ~2px.
2. Remove phone-landscape detection from `useIsMobile`.
3. Lock app to portrait so content never flips on rotation.
4. Center the mobile mascot horizontally (keep current vertical position).

### Changes

**1. `src/components/QuestionCard.tsx` — bump mobile font sizes**
- Mobile question: `clamp(1.25rem, 3.6vw, 2.4rem)` → `clamp(1.375rem, 4.1vw, 2.525rem)` (~+2px across the scale).
- Mobile answer: same change.
- Auto-fit fallback (`--q-font-scale` / `--a-font-scale`, floor 0.7) unchanged — re-verified longest samples (229-char Q, 140-char A) still fit the 414px text band.
- Desktop / tablet font sizes unchanged.

**2. `src/hooks/use-mobile.tsx` — drop landscape branch**
- Remove `LANDSCAPE_MAX_HEIGHT` / `LANDSCAPE_MAX_WIDTH` and the landscape detection block.
- Simplify `computeIsMobile` to: `return window.innerWidth < MOBILE_BREAKPOINT;`
- Remove the `orientationchange` listener.

**3. Lock portrait orientation**
- `index.html`: add `<meta name="screen-orientation" content="portrait" />` and `<meta name="x5-orientation" content="portrait" />` for Android/legacy WebView hints.
- `src/main.tsx`: call `screen.orientation.lock('portrait').catch(() => {})` on load (works on Android Chrome / installed PWAs).
- `src/index.css`: add a fallback overlay for iOS Safari (which ignores `screen.orientation.lock`):
  ```css
  @media (orientation: landscape) and (max-width: 950px) {
    body::before {
      content: "Please rotate your device to portrait";
      position: fixed; inset: 0; z-index: 9999;
      display: flex; align-items: center; justify-content: center;
      background: hsl(var(--background)); color: hsl(var(--foreground));
      font-family: 'Fredoka One', sans-serif; font-size: 1.25rem;
      text-align: center; padding: 2rem;
    }
    body > #root { display: none; }
  }
  ```

**4. `src/components/TriviaGame.tsx` — center mobile mascot horizontally**
- Current mobile mascot wrapper: `bottom: 28px; right: 12px;` (bottom-right anchored).
- Change to centered: replace `right: 12px` with `left: 50%; transform: translateX(-50%);`.
- Keep `bottom: 28px` and the `clamp(155px, 40vw, 195px)` size — vertical position and scale unchanged; only horizontal anchor shifts to center.
- Desktop mascot column unchanged.

### Invariants
- Mascot vertical position and size: identical.
- Card 28px padding, divider Y, 165px mascot reserve: unchanged.
- Desktop / tablet (≥768px) byte-identical.
- No scroll: `var(--app-vh)` lock unchanged.

### Files Edited
- `src/components/QuestionCard.tsx`
- `src/hooks/use-mobile.tsx`
- `src/components/TriviaGame.tsx`
- `src/main.tsx`
- `src/index.css`
- `index.html`
