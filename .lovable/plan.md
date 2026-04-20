

## Plan: Refactor + Typography Consolidation

Combines the previously approved refactor with a new typography pass. Zero behavior changes; visual changes limited to fonts.

### Part A — Refactor (unchanged from prior plan)

1. **NEW** `src/data/gameOptions.ts` — `ALL_CATEGORIES`, `ALL_DIFFICULTIES`, `ALL_ERAS`, `GameSettings`, `DEFAULT_SETTINGS` (single source of truth; remove duplicates from `TriviaGame.tsx` + `SettingsPanel.tsx`).
2. **NEW** `src/hooks/useCountdown.ts` — pausable interval hook used twice in `TriviaGame` (question + answer countdowns).
3. **MOD** `src/components/TriviaGame.tsx` — extract `runFetchAndStart` (shared by `handleStart`/`handleApply`) and `advanceOrFinish` (shared by `handleNext` + answer-timeout effect). Remove unused `isMobile` import.
4. **MOD** `src/components/SettingsPanel.tsx` — extract local `FilterSection` (Categories/Difficulties/Eras) and `StepSlider` (3 numeric sliders). Byte-identical rendered markup.

### Part B — Typography Consolidation

Goal: every text element uses one of three font roles. No more ad-hoc `font-['Russo One']`, `font-['Fredoka One']`, `Nunito`, etc.

#### B1. Load Rubik + Quicksand, drop unused families
**`index.html`** — replace the current Google Fonts link:
```html
<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@700;800&family=Quicksand:wght@500;600;700&display=swap" rel="stylesheet" />
```
Remove Fredoka One, Russo One, Nunito.

#### B2. Add semantic font tokens
**`tailwind.config.ts`** — extend `theme.fontFamily`:
```ts
fontFamily: {
  heading: ['Rubik', 'system-ui', 'sans-serif'],     // weight 800
  subheading: ['Rubik', 'system-ui', 'sans-serif'],  // weight 700
  body: ['Quicksand', 'system-ui', 'sans-serif'],    // weight 600
}
```

**`src/index.css`** — set body default to Quicksand 600; remove old `font-family: 'Nunito', 'Russo One'` from `body`. Update `.btn-gameshow` and `.cta-glass` `font-family` to Rubik 800. Update `.about-scroll-area`/any other typography rules to use the new stack.

#### B3. Apply roles across components
Sweep these files and replace inline font classes with the new tokens:

| Role | Class | Where (examples) |
|---|---|---|
| **Heading** (Rubik 800) | `font-heading font-extrabold` | Page H1s, screen titles ("Results", "Game Over"), result score number, primary CTAs (`PrimaryCTA`, `btn-gameshow`, Start Game, Play Again, Apply New Game Settings, Next/Submit in QuestionCard) |
| **Subheading** (Rubik 700) | `font-subheading font-bold` | "Customize Your Game" header in `SettingsPanel`, section labels ("Categories", "Difficulties", "Eras", "Questions", "Time per Question"), About Us section titles, How To Play step titles, dialog titles (AlertDialog "Restart with new settings?") |
| **Body** (Quicksand 600) | `font-body font-semibold` (default via body) | Question text, answer choices, About paragraphs, How To Play paragraphs, footer pill text (Q#/category/difficulty/timer), settings descriptions, slider value labels |
| **Secondary CTA** (Quicksand 600/700) | `font-body font-semibold` | Header nav buttons (Login/Logout, About), "How Do I Play?" button under Start Game, Cancel button in dialogs, footer pause/play label if any |

Files to sweep (search-and-replace inline `font-['...']` and `font-family` styles):
- `src/components/PrimaryCTA.tsx` → heading
- `src/components/StartScreen.tsx` → CTA = heading; "How Do I Play?" = secondary
- `src/components/ResultScreen.tsx` → title = heading; body = body
- `src/components/QuestionCard.tsx` → question + answers = body; Next button = heading
- `src/components/SettingsPanel.tsx` → "Customize Your Game" = subheading; section labels = subheading; option rows = body; Apply button = heading
- `src/components/AboutScreen.tsx` → title = heading; section headers = subheading; paragraphs = body
- `src/components/HowToPlayScreen.tsx` → same pattern as AboutScreen
- `src/components/GameHeader.tsx` → nav buttons = secondary (body)
- `src/components/GameFooter.tsx` → pill text = body
- `src/components/LoginScreen.tsx` → title = heading; labels = subheading; inputs = body; submit = heading
- `src/index.css` `.btn-gameshow`, `.cta-glass` → Rubik 800

#### B4. Remove dead font references
After the sweep, grep for `Fredoka`, `Russo`, `Nunito` and delete any remaining occurrences.

### Files touched (combined)
- **NEW**: `src/data/gameOptions.ts`, `src/hooks/useCountdown.ts`
- **MOD**: `index.html`, `tailwind.config.ts`, `src/index.css`, `src/components/TriviaGame.tsx`, `src/components/SettingsPanel.tsx`, `src/components/PrimaryCTA.tsx`, `src/components/StartScreen.tsx`, `src/components/ResultScreen.tsx`, `src/components/QuestionCard.tsx`, `src/components/AboutScreen.tsx`, `src/components/HowToPlayScreen.tsx`, `src/components/GameHeader.tsx`, `src/components/GameFooter.tsx`, `src/components/LoginScreen.tsx`

### Out of scope
- No layout/spacing/color changes. No game logic changes. No new dependencies.
- Mobile bottom-sheet drag, timers, fetch logic, mascot logic — all untouched.

### Verification
- Build passes; no TS errors.
- Visual sweep at 1178px and mobile: every heading uses Rubik 800; subheadings Rubik 700; all body Quicksand 600; secondary CTAs Quicksand. No Fredoka/Russo/Nunito anywhere in the rendered output (DevTools computed font check).
- Functional sweep: full game → mid-game settings change w/ confirm dialog → Play Again → countdown resets full. Filters and sliders behave identically.

### Tradeoffs
- Tailwind `font-heading`/`font-subheading`/`font-body` tokens keep future edits centralized; if the brand changes a role, edit `tailwind.config.ts` only.
- Refactor and font pass land together — single review, one round of regression testing.

