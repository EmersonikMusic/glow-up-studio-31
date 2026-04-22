

## Plan: Fix crash from MascotDebugOverlay (infinite render loop)

### Root cause
`MascotDebugOverlay` uses `useSyncExternalStore(subscribeMascotTimings, getMascotTimings)`. `getMascotTimings()` returns a **new array reference every call** (`Array.from(...).sort(...)`). React's `useSyncExternalStore` requires the snapshot to be referentially stable when the underlying data hasn't changed — otherwise it schedules an update on every render → infinite loop → "Maximum update depth exceeded" → error boundary shows "The app encountered an error".

### Fix

**`src/lib/mascotDebug.ts`** — cache the snapshot and only recompute it when `emit()` runs:
- Keep an internal `cachedSnapshot: MascotTiming[]` array.
- Initialize to `[]`.
- In `emit()`, rebuild the cached snapshot once (`Array.from(store.values()).sort(...)`), then notify listeners.
- `getMascotTimings()` returns the cached reference — same identity until the store actually changes.
- Fix `subscribeMascotTimings` return type: explicitly `(): void => { listeners.delete(fn); }` so the unsubscribe returns `void`, not `boolean`.

**`src/components/MascotDebugOverlay.tsx`** — small hardening:
- Pass the same `getMascotTimings` for both `getSnapshot` and `getServerSnapshot` (already correct).
- No other changes needed once the store returns a stable reference.

### Files touched
- `src/lib/mascotDebug.ts` — add cached snapshot, fix unsubscribe return type.

### Out of scope
No changes to mascot rendering, sizing, circle position, or `TriviaGame.tsx`. The visual work from the previous turn stays as-is; this purely restores the app from the crash introduced by the debug overlay's store contract.

### Verification
1. App loads without the error boundary screen.
2. No "Maximum update depth exceeded" in console.
3. `?mascotDebug=1` shows the overlay listing each category with `inline ✓ · ~0ms · ×N` and updates as questions advance.
4. Toggling Shift+D opens/closes the overlay without re-triggering the loop.
5. `npm run test` and `npm run test:e2e` still pass.

