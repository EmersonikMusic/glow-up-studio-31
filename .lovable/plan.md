## Plan

### 1. Result screen: line break before the mailto link
In `src/components/ResultScreen.tsx`, insert an unconditional `<br />` between "Contact us at" and the email hyperlink so the address sits on its own line on all breakpoints. The existing paragraph stays centered and styled exactly as it is today.

### 2. Game review screen: new subline with "Play Again" CTA
In `src/components/ResultScreen.tsx`:
- Add a new optional prop `onBackToStart?: () => void` to `ResultScreenProps`.
- Replace the review dialog's `DialogDescription` text from:  
  "Take a look back at the questions from this round."  
  with:  
  "Think you can do better? Play Again."
- Render "Think you can do better?" in white using the existing `text-sm font-body font-semibold text-white` styling.
- Render "Play Again" as an inline text CTA that matches the "We got you" treatment in `AboutScreen.tsx`: `font-black` with color `hsl(185 70% 55%)` and a hover state that shifts to `hsl(var(--game-gold))`. Clicking it calls `onBackToStart` and is tracked with a `trackClick` event.

### 3. Wire up the new action in `TriviaGame.tsx`
In `src/components/TriviaGame.tsx`, pass the existing `handleRestart` callback to `ResultScreen` as the new `onBackToStart` prop. This returns the user to the game start screen when the review subline's "Play Again" is clicked.

### Technical details
- Files changed: `src/components/ResultScreen.tsx`, `src/components/TriviaGame.tsx`.
- No backend, no data model, no new dependencies, no changes to other screens or styling tokens.
- The "Play Again" CTA will be an inline `<button>` element styled as text (same visual weight as the About screen's "We got you" span), not a primary button.