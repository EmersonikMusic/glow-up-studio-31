## 404 Page tweaks

File: `src/pages/NotFound.tsx`

1. Remove the paragraph: "We searched every category, every era, every difficulty. Nothing here. Let's get you back to the questions."
2. Change the H2 from a single line to two lines:
   - Line 1: "This page wandered off"
   - Line 2: "the trivia trail."
   Implementation: insert a `<br />` between the two halves so it breaks cleanly on all viewports.
3. Update the CTA button label and aria-label from "Back to the Game" to "Back to Game".

No other styling or layout changes.