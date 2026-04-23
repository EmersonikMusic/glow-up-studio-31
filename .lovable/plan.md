
## Mascot: Verify Centering + Remove Height Cap + +10px Size

### Findings
- Mobile mascot is already centered horizontally (`left: 50%; translateX(-50%)`) — confirmed in `src/components/TriviaGame.tsx`. No fix needed.
- Current size clamp: `clamp(155px, 40vw, 195px)` — has both width and height capped at 195px.

### Changes — `src/components/TriviaGame.tsx`

**Mobile mascot (lines 305–306):**
- Remove the upper bound (height cap) and bump the floor by ~10px.
- `width`: `clamp(155px, 40vw, 195px)` → `clamp(165px, 44vw, 9999px)` (effectively uncapped; 9999px sentinel).
- `height`: same change.
- At 390px viewport: 44vw = ~172px (was ~156px → +~16px). Floor 165px guarantees +10px minimum vs prior 155px floor.
- Bottom anchor (`bottom: 28px`) and horizontal centering preserved.

**Mascot reserve in `QuestionCard.tsx`:**
- Current `mb-[165px]` on mobile text wrapper assumes 155px mascot + 28px bottom + 10px float peak ≈ 193px clearance.
- New mascot at 44vw on 390px = 172px → peak = 28 + 172 + 10 = 210px → bump `mb-[165px]` → `mb-[182px]` (165 + 17px) to keep the answer band from ever overlapping the mascot float peak. Auto-fit fallback already handles any residual overflow.

**Desktop mascot:** unchanged.

### Files Edited
- `src/components/TriviaGame.tsx`
- `src/components/QuestionCard.tsx`
