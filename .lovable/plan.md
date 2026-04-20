

## Plan: Six targeted UI/UX polish changes

### 1. Remove mobile tap-highlight ("transparent purple line")
`src/index.css` — add to base layer:
```css
* { -webkit-tap-highlight-color: transparent; }
```
Eliminates the translucent purple/pink flash on every interactive element (toggles, section headers, sliders) when tapping in the mobile settings menu. No effect on desktop.

### 2. Remove dynamic Apply CTA label swap
`src/components/SettingsPanel.tsx` (line 341): remove the conditional `applyLabel`. Always render `"Apply Settings"`. The confirmation dialog already communicates the restart, so the swapped label is redundant.

### 3. Sync confirmation dialog button styling
`src/components/SettingsPanel.tsx` — in the AlertDialog footer (lines 486–489):
- **Restart Game**: replace the plain `AlertDialogAction` with one wrapping/rendering `<PrimaryCTA>` (same gradient, Rubik 800, gold shadow as the "Play Again" button on the result screen). Use `asChild` on `AlertDialogAction`.
- **Cancel**: replace plain `AlertDialogCancel` styling with the header "About" pill look — `nav-btn` class + rounded-full + `rgba(255,255,255,0.08)` bg, `rgba(255,255,255,0.15)` border, `font-body font-bold uppercase tracking-wider` text in `hsl(var(--game-gold))`. Use `asChild` to attach to a styled `<button>`.

No changes to `alert-dialog.tsx` primitives; styling lives in the consumer.

### 4. Fix mobile footer pill — show Difficulty
`src/components/GameFooter.tsx`:
- Currently the "·" and Difficulty span are `hidden sm:inline` (lines 73, 75). Remove `hidden sm:inline` so they render at all sizes.
- Reduce horizontal padding on the pill from `px-10` → `px-4 sm:px-10` so content fits on 390px-wide viewports.
- Reduce the right-anchored timer offset from `right-4` → `right-3` to free a few more pixels.
- Keep `truncate` on category to absorb any remaining overflow.

### 5. Uppercase footer pill metadata
`src/components/GameFooter.tsx`: add `uppercase` to the pill content classes (Q#, category, difficulty, timer span). Single-class addition per span; no other change.

### 6. Spacebar pause/play (desktop)
`src/components/TriviaGame.tsx`: add a `useEffect` that listens to `keydown` on `window`:
- Trigger only when `gameState === "playing" || gameState === "answered"`.
- Trigger only when `e.code === "Space"` (and not when focus is in an input/textarea/contenteditable — guards against typing in future inputs; the existing slider already calls `stopPropagation` on keydown so it won't fire there).
- `e.preventDefault()` to suppress page scroll, then call `setPaused((p) => !p)`.
- Cleanup listener on unmount / dep change.

Effect deps: `[gameState]` (reads/sets via setter callback so no stale `paused`).

### Files touched
- `src/index.css` — 1-line tap-highlight rule.
- `src/components/SettingsPanel.tsx` — drop label swap; restyle dialog buttons.
- `src/components/GameFooter.tsx` — show Difficulty on mobile, tighten padding, uppercase text.
- `src/components/TriviaGame.tsx` — add spacebar listener effect (~10 lines).

### Out of scope
Anything else. No layout, color token, timer, fetch, or game-state changes beyond what's listed.

### Verification
Mobile (390px): open Settings → tap any toggle → no purple flash. Footer pill shows `Q1/10 · CATEGORY · DIFFICULTY` and timer all uppercase, all visible.
Desktop: start game → press Space → pause icon flips to play, timer freezes; press Space again → resumes. Open Settings mid-game with changes → click Apply Settings → dialog appears with gradient "Restart Game" CTA + glassy gold "Cancel" pill matching the header.

