Update two UI elements in the trivia app.

1. Settings panel Apply Settings CTA footer
   - Lighten the dark background behind the Apply Settings button.
   - Center the button within the footer.
   - Slightly increase the footer height if needed.
   - File: `src/components/SettingsPanel.tsx`.
   - Changes: reduce the footer `background` alpha (e.g., `rgba(0, 0, 0, 0.15)`), increase vertical padding, and keep the existing `items-center` flex alignment.

2. Result screen mobile header
   - Reduce the "Trivia Complete!" font size on mobile so it stays on one line instead of stacking.
   - File: `src/components/ResultScreen.tsx`.
   - Changes: replace `text-4xl` with a responsive size such as `text-3xl sm:text-4xl` (or `text-[28px] sm:text-4xl`) for the "Trivia Complete!" heading.

Verification: open the settings panel and game-complete screen on mobile (390 px width) and desktop/tablet to confirm the CTA background is lighter, the button is centered, and the result header is single-line on mobile.