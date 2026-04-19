
## Plan: Fix "Failed to fetch" on game start

### Root cause
`src/lib/triviaApi.ts` calls `https://www.triviolivia.com/api/questions?...` (no trailing slash). The server responds **301 → `/api/questions/?...`**. The browser fails the cross-origin redirect with `TypeError: Failed to fetch`. Verified via curl: the trailing-slash URL returns `200` with proper `access-control-allow-origin` for the preview origin.

### Fix (single file: `src/lib/triviaApi.ts`)

**1. Add trailing slash to base URL**
```ts
const API_BASE = "https://www.triviolivia.com/api/questions/";
```
And in `buildUrl`, change `${API_BASE}?${params}` → `${API_BASE}?${params}` (works as-is once the slash is in `API_BASE`).

**2. Adapt to current API response shape**
Live response uses `eras: number[]` (array of era IDs), not `era_name: string`. Update `RawApiQuestion` and `adaptQuestion`:
- Add `eras?: number[]` to the interface (keep `era_name?` as fallback for safety).
- Build a reverse lookup `ID_TO_ERA` from the existing `ERA_IDS` dict.
- In `adaptQuestion`: pick the first id from `raw.eras` (if present) → map to era name; else use `raw.era_name`; else `"2020s"`.

### Out of scope
- The unrelated `FadeIcon` ref warning in `SettingsPanel` console (cosmetic, no functional impact).
- No changes to gameplay flow, settings, or any UI component — game-state machine and timers in `TriviaGame.tsx` are intact and were working before; the only break is the network call.

### Verification after fix
End-to-end: open Settings → adjust questions/categories → Apply → Start Game → answer reveals on timer → pause works → finish → Play Again returns to start.

### Files touched
- `src/lib/triviaApi.ts` (URL + adapter only)
