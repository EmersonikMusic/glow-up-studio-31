
## Plan: Settings menu UX polish

### 1. Back button in Settings header
Add a back button at the top of the panel content (above the "CUSTOMIZE YOUR EXPERIENCE" title) that calls `onClose` — this collapses the drawer and returns the user to whatever screen is behind it (start or gameplay). 
- Style: small ghost button with a left-chevron + "Back" label, aligned left, using the existing teal accent on hover. Visible on both desktop drawer and mobile bottom sheet.
- No new routing — `onClose` already handles the dismiss for both layouts.

### 2. Consistent spacing below divider
Currently:
- Title block: `pb-3 md:pb-5`
- Divider wrapper: `mb-3 md:mb-4`
- Categories section: `mb-3` (no top margin)

The visual gap above the divider (title→divider) is larger than below (divider→Categories). Equalize by setting the divider wrapper's bottom margin to match the title's bottom padding (`mb-3 md:mb-5`), and remove redundant top spacing. Result: symmetric breathing room around the divider.

### 3. Game Settings expanded by default
**Already implemented** — `useState<SectionKey>("game")` on line 178. No change needed. Will verify in the live preview after the other edits ship.

### 4. Dynamic Apply button label
Change "Apply Settings" to "Apply New Game Settings" when:
- A game is currently in progress (`gameState === "playing"` or `"answered"`), AND
- The user has modified any setting vs. the currently-active settings.

Implementation:
- `TriviaGame` passes a new prop `gameInProgress: boolean` to `<SettingsPanel>` (true when `gameState` is `"playing"` or `"answered"`).
- `TriviaGame` also passes `currentSettings` (the active settings snapshot). 
- Inside `SettingsPanel`, compute `hasChanges` by deep-comparing the local draft (`numQuestions`, `timePerQuestion`, `timePerAnswer`, the three selected arrays) against `currentSettings`. Arrays compared as sorted sets.
- Button label: `gameInProgress && hasChanges ? "Apply New Game Settings" : "Apply Settings"`.
- Click handler unchanged — still calls `onApply(...)` then `onClose()`. The existing `handleStart` path is what actually restarts gameplay; this PR only adjusts copy.

### Files touched
- `src/components/SettingsPanel.tsx` — add Back button JSX, fix divider spacing, accept `gameInProgress` + `currentSettings` props, compute `hasChanges`, swap button label.
- `src/components/TriviaGame.tsx` — pass `gameInProgress` and `currentSettings={settings}` to `<SettingsPanel>`.

### Out of scope
- No change to apply behavior, no auto-restart of in-progress game.
- No change to `StartScreen`'s SettingsPanel instance (gameInProgress will be false there, so label stays "Apply Settings").
