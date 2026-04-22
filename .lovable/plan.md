

## Plan: Balance mascot whitespace on tablet too

### Problem
The previous change reduced `marginRight` for the desktop mascot, but at tablet widths (md breakpoint, 768–1024px) the mascot still looks off-center within its 30% column. The two whitespace gaps (card↔mascot vs mascot↔screen edge) need to look visually equal across tablet AND desktop.

### Root cause
Mascot column is `items-end` aligned at 30% width. The mascot itself is `clamp(180px, 24vw, 320px)`. At tablet (~768–1024px), 24vw ≈ 184–245px, so the mascot fills most of the 30% column (~230–307px). With even a small `marginRight`, it gets pushed left of where visual centering would place it.

True visual centering = mascot horizontally centered within its 30% column, regardless of viewport size. That makes the left gap (card→mascot) and right gap (mascot→edge) automatically equal at every breakpoint.

### Change
In `src/components/TriviaGame.tsx`, desktop/tablet mascot wrapper:

- Change column alignment from `items-end` → `items-center` so the mascot centers horizontally within its 30% column at every md+ width.
- Remove the `marginRight` style entirely (no longer needed once centered).

This produces equal left/right whitespace automatically across tablet (768px) through desktop (1920px+), since the gaps are determined by the column geometry, not a fixed offset.

### Files touched
- `src/components/TriviaGame.tsx` — desktop mascot column: `items-end` → `items-center`; remove `marginRight` from inner wrapper style.

### Out of scope
- Mobile mascot (separate overlay, already correct).
- Mascot scale (`clamp(180px, 24vw, 320px)` unchanged).
- 70/30 card/mascot column split.
- Vertical positioning, float animation, settings-panel fade.

### Verification
1. Tablet 768×1024 and 820×1180: gap between card's right edge and mascot ≈ gap between mascot and right screen edge.
2. Desktop 1280, 1440, 1920: same visual balance maintained.
3. Settings panel open: mascot fade-out behavior unchanged.
4. Mobile: no visual change.

