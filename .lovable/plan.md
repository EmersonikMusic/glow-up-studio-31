## Badge flip-to-reveal interaction

Replace the current tooltip on unlocked badges with a 3D card-flip animation that reveals the earning criteria on the back of the badge. Keep the label static beneath the badge.

### Interaction
- **Desktop (pointer)**: hover flips the badge; leaving flips it back.
- **Mobile / touch**: tap toggles the flip; tapping again (or tapping another badge) flips it back. Only one badge flipped at a time within the grid.
- **Locked badges**: no flip (nothing to reveal). Keep the lock icon and grayscale styling.
- **Label**: stays below the circle in both states, unchanged.

### Visual
- Increase badge circle from `w-16 h-16` → `w-20 h-20` so the requirement text is legible on the back. Grid stays 3-column; gap slightly increased.
- **Front**: current gold gradient + trophy icon (unchanged aesthetic).
- **Back**: dark glass panel (`rgba(0,0,0,0.4)` + subtle gold border) with the requirement text centered, ~10px font, tight leading, up to ~4 lines. No badge name on the back — the label under the badge already provides it, per the request ("only need to include the requirement description").
- Smooth 3D flip: ~500ms cubic-bezier, `transform-style: preserve-3d`, `backface-visibility: hidden`, `perspective` on the wrapper.
- Preserve the gold glow shadow on the front face only.

### Technical

Files:
- **`src/components/BadgeItem.tsx`** — rewrite the unlocked branch:
  - Remove `Tooltip`, `TooltipProvider`, `TooltipContent`, `TooltipTrigger` imports and usage.
  - Add local `flipped` state; toggle on click, and on `onMouseEnter` / `onMouseLeave` (pointer devices).
  - Render a `perspective` wrapper containing a flipper div with two absolutely-positioned faces (front = current circle, back = requirement panel).
  - `button` remains the interactive element for a11y; `aria-pressed={flipped}` and `aria-label` includes the requirement so screen readers still get it.
- **`src/components/AchievementsSection.tsx`** — lift a single `flippedId` state and pass `flipped` + `onFlip` down to `BadgeItem` so tapping one badge auto-closes another. Grid gap bumped from `gap-3` to `gap-4`.
- No changes to `ProfilePanel.tsx`, `badgeData.ts`, or data flow.

### Out of scope
- No changes to which badges are unlocked, filler logic, or the "View more" toggle.
- No changes to locked-badge appearance beyond size.
