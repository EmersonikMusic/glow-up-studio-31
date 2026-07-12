## Changes

Prefix each `game_settings_history` entry with an ISO-like UTC timestamp `YYYY-MM-DDTHH:MMZ`, separated from the rest by `|`, and replace the `-` separators inside the code with spaces.

New entry example:
```
2026-07-12T21:40Z|ooooo ooooo ooooo ooooo ooooo|ooooo|oooooo oooooo|010|10|05
```

### 1. `src/lib/gameSettingsCode.ts`
- Add `formatTimestamp(date: Date)` returning `YYYY-MM-DDTHH:MMZ` (UTC, minute precision).
- `encodeGameSettings` accepts an optional `completedAt: Date`; joins category/era chunks with a space instead of `-`; prepends `${timestamp}|` to the result.

### 2. `src/lib/gameCompletion.ts`
- Pass `session.completedAt` into `encodeGameSettings`.

### 3. Migration — convert existing entries
- For each string entry in `profiles.game_settings_history`:
  - If it already starts with a `YYYY-MM-DDTHH:MMZ|` prefix, leave it.
  - Otherwise, split on `|`, replace `-` with space inside the categories segment (first) and eras segment (third), rejoin with `|`, and prepend `<profile.last_played_at or now, formatted YYYY-MM-DDTHH:MMZ>|`. Since we don't have per-game timestamps for historical entries, this is a best-effort backfill using the profile's `last_played_at`.
- Non-string (legacy object) entries are dropped, matching the previous migration.

No schema change; column stays `jsonb` array of strings.
