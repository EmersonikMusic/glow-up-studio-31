## Loading Screen Adjustments

File: `src/components/TriviaGame.tsx`, loading state block (~lines 468-496).

### 1. Remove white border
The spinner currently has a `border-4` ring with `rgba(255,255,255,0.15)` — the white border you see. Replace it with a borderless gold indicator: a gold arc (transparent base ring, gold top) or a row of three pulsing gold dots. No white ring will remain.

### 2. Apply site typography hierarchy
Replace the current small uppercase body label with the same title treatment used elsewhere (e.g. Settings "CUSTOMIZE YOUR EXPERIENCE"):
- `font-heading` (Fredoka One), extrabold, uppercase, tight tracking
- Gold gradient text fill via `linear-gradient(160deg, hsl(42 100% 62%) 0%, hsl(35 90% 48%) 45%, hsl(28 90% 40%) 100%)` with `WebkitBackgroundClip: text`
- Size `text-xl md:text-3xl` to match other page titles

Copy stays "Loading next round…".

### Out of scope
No changes to background, layout, animation timing, or any other screen.
