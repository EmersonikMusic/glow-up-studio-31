## UI polish pass

### 1. About header on one line (desktop/tablet)
`src/components/AboutScreen.tsx` — remove the `<br/>` between "Endless Trivia" and "World!" and add `sm:whitespace-nowrap`. Keep the mobile-stacked look by either leaving the line break only on mobile (conditional via `useIsMobile`) or by letting it wrap naturally on narrow widths. Tighten size on smallest desktop with `text-4xl sm:text-3xl md:text-4xl` if needed to keep one line in the 70vw card.

### 2. Settings empty-state copy
`src/components/SettingsPanel.tsx` line 587 — change to:
"In order to begin a game you must first select at least 1 **category**, 1 **difficulty**, and 1 **era**." (swap order; highlight `difficulty` in teal instead of `era`/`difficulty` wording).

### 3. Back icon → double chevron
Replace `ArrowLeft` with `ChevronsLeft` (mirror of the existing `ChevronsRight` skip icon) in:
- `src/components/AboutScreen.tsx`
- `src/components/HowToPlayScreen.tsx`
- `src/components/SettingsPanel.tsx` (desktop back button)
- `src/components/ResultScreen.tsx` (Review dialog close)
- `src/components/GameFooter.tsx` (back-question button — currently `ChevronLeft`)

### 4. Footer pill text shrink on mobile
`src/components/GameFooter.tsx` — pill currently `text-[11px] sm:text-xs px-4 sm:px-10 gap-x-2`. Reduce mobile only:
- Pill text: `text-[10px] sm:text-xs`
- Padding: `px-3 sm:px-10`
- Gap: `gap-x-1.5 sm:gap-x-2`
- Timer: `text-[10px] sm:text-xs`
Desktop sizing untouched.

### 5. Mailto + spacing on end screen
`src/components/ResultScreen.tsx`:
- Remove `underline underline-offset-[5px]` from mailto link (line 147), keep teal/gold hover.
- Increase gap between "Review Your Game" button and "Contact us at" block: change `mt-3` on the contact `<p>` to `mt-6 sm:mt-7`.

### 6. Mobile spacing between Play Again & Change Settings
`src/components/ResultScreen.tsx` line 126 — SecondaryCTA `mt-3` → `mt-2 sm:mt-3`.

### 7. Copyright line on end screen
Currently only on `StartScreen.tsx`. Add the same fixed bottom-positioned copyright element to the end-game screen so it appears in the same position. Approach: lift the copyright into the shared layout that wraps both screens (the page container that renders `StartScreen` / `ResultScreen` via `TriviaGame.tsx` or `Index.tsx`) so it's always pinned to the bottom on both states. Alternative if structural lift is risky: duplicate the absolute-positioned `<div>` from `StartScreen.tsx` into `ResultScreen.tsx` with the same classes/position.

Recommended: lift to the shared layout (single source of truth, no duplication).

### 8. Sticky Apply Settings CTA (recommendation)
Yes, recommend making it sticky. Today (`SettingsPanel.tsx` lines 512–593), the Apply block sits at the end of the scrollable content, so on long sections users must scroll to find it.

Implementation:
- Wrap the Apply footer block (`<div className="px-5 pt-3 pb-3 ...">`) in a sticky footer outside the scroll area, mirroring `AboutScreen.tsx`'s footer pattern (`shrink-0` + `borderTop`).
- Mobile bottom sheet: move the Apply block out of the scrolling `<div className="flex-1 overflow-y-auto …">` (line 645) and render it as a sibling below it, with `padding-bottom: env(safe-area-inset-bottom)`.
- Desktop side panel: same — split `panelContent` into `scrollableContent` + `footerContent`; put footer as a `shrink-0` sibling below the `overflow-y-auto` div (lines 669–680).
- Helper text ("In order to begin a game…") stays above the CTA inside the sticky footer so users always see why it's disabled.

### Verification
Playwright at 390×800 and 1280×900: open About, Settings (empty + valid), end-game screen; capture screenshots to confirm one-line header, double-chevron back icons, footer pill fit, mailto no-underline, spacing, copyright placement, and sticky Apply CTA behavior.
