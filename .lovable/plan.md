## 1. About Page — preserve mid-game state

**Problem:** Opening About mid-game sets `gameState = "about"`, which re-renders the StartScreen branch and effectively resets the round. Closing About sends the user back to `"start"`.

**Fix in `src/components/TriviaGame.tsx`:**
- Replace `gameState === "about"` as a top-level branch. Track About visibility with a separate `showAbout` boolean (similar to existing `showHowToPlay`).
- `GameHeader`'s `onAbout` handler:
  - If user is mid-game (`playing` / `answered`) and not already paused, auto-pause (`setPaused(true)`) and remember it (`pausedByAboutRef`).
  - Set `showAbout = true`.
- About close handler:
  - Set `showAbout = false`.
  - If we auto-paused on open, leave the game paused (user can resume via footer/space). Do not auto-resume — keeps behavior consistent with the existing "panel auto-pause" pattern and avoids jarring the player back into a live timer.
- Render `<AboutScreen />` as an overlay alongside whatever screen is active (start, playing, answered, finished). Its fixed/z-50 styling already supports this.
- Remove the now-unused `"about"` value from the `GameState` union and its dedicated render branch.

No design, copy, or AboutScreen internal changes.

## 2. 404 Page — on-brand restyle with mascot

**File:** `src/pages/NotFound.tsx`

- Match site theme: `hsl(var(--game-bg))` background with the same ambient blob gradients used by `AboutScreen` (purple top-left, blue bottom-right blurred radial blobs).
- Use the default Triviolivia mascot (`@/assets/Mascot.svg` via `MascotSvg` is category-bound; instead import `Mascot.svg` directly as an `<img>`) centered above the messaging, with the existing `float` animation.
- Typography: Fredoka One heading (`font-heading`), gold gradient on the "404" numeral matching About's headline treatment. Body copy in `font-body` semibold white/80.
- Copy (in Triviolivia voice):
  - Eyebrow: "Well, this is awkward…"
  - H1: "404"
  - Subhead: "This page wandered off the trivia trail."
  - Body: "We searched every category, every era, every difficulty. Nothing here. Let's get you back to the questions."
- CTA: reuse `PrimaryCTA` → "Back to the Game", links to `/` via `react-router-dom`'s `Link` / `navigate`.
- Keep existing `<Helmet>` SEO block as-is.
- Keep the `console.error` on mount.

### Technical notes
- New imports in `NotFound.tsx`: `Link` from `react-router-dom`, `PrimaryCTA`, default mascot SVG.
- Layout: single centered column, `min-h-screen`, `var(--app-vh)` height like other screens, glassmorphism card optional (kept minimal — mascot + text + CTA on the gradient background).
- No new dependencies, no changes to routing or analytics.

## Out of scope
Settings panel behavior, HowToPlay, gameplay logic, analytics events.
