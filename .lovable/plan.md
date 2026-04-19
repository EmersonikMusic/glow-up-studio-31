
## Plan: Add "How Do I Play?" link + modal

### 1. New component: `HowToPlayScreen.tsx`
Mirror `AboutScreen.tsx` exactly (same modal shell, animation, close button, typography, glassmorphism). Only the content differs.

**Content sections** (headings + short paragraphs):
- **Customize Your Game** — pick categories & eras, set difficulty, choose number of questions per game, and the speed at which they rotate.
- **How to Play** — apply your settings and start. Each question displays for the time you chose. Try to answer before the timer runs out — the answer reveals when time is up.
- **Pause Anytime** — you can pause the game at any time.
- **Changing Settings Mid-Game** — open the settings panel, choose new settings, and apply. Note: this starts a new game.

Before writing, I'll read `AboutScreen.tsx` to copy its exact modal structure (overlay, container classes, close button SVG, animation classes, heading font).

### 2. Wire modal state in `Index.tsx`
- Read `Index.tsx` to confirm how `AboutScreen` is currently toggled (likely a `showAbout` boolean + `onAbout` handler passed to `StartScreen`).
- Add a parallel `showHowToPlay` state and an `onHowToPlay` handler.
- Render `<HowToPlayScreen open={showHowToPlay} onClose={...} />` alongside `AboutScreen`.

### 3. Add link in `StartScreen.tsx`
- Add a new prop `onHowToPlay: () => void` to `StartScreenProps`.
- Render a `<button>` directly below the Start Game CTA:
  - Text: "How Do I Play?"
  - Classes: `mt-3 text-xs underline underline-offset-4 text-[hsl(185_70%_55%)] hover:text-[hsl(45_90%_55%)] transition-colors animate-fade-in`
  - `text-xs` = 12px (well above the 9px minimum, still small/secondary).
  - Turquoise matches the tagline color already in use; gold hover matches the existing gold accent token.
  - `animationDelay: "240ms"` so it fades in just after the CTA.

### Files touched
- **New**: `src/components/HowToPlayScreen.tsx`
- **Edit**: `src/components/StartScreen.tsx` (add prop + link)
- **Edit**: `src/pages/Index.tsx` (state + render modal + pass prop)

### Out of scope
- No changes to AboutScreen, header, CTA button, settings panel, or any gameplay logic.
- No new fonts or design tokens.
