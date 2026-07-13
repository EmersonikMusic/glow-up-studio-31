## Goal

Record every guest (not-signed-in) completed game in the backend, alongside the existing signed-in tracking. No UI changes.

## 1. Database migration

**`public.anonymous_plays`** — one row per guest game.
- `id` uuid PK default `gen_random_uuid()`
- `device_id` text not null — persistent per-device UUID from localStorage
- `settings_code` text not null — output of `encodeGameSettings(...)`
- `is_kids_mode` bool not null default false
- `is_quickplay` bool not null default false
- `is_custom` bool not null default false
- `is_minimum_timer` bool not null default false
- `completed_at` timestamptz not null default now()
- `created_at` timestamptz not null default now()

Grants + RLS:
- `GRANT INSERT ON public.anonymous_plays TO anon, authenticated;`
- `GRANT ALL ON public.anonymous_plays TO service_role;`
- Enable RLS.
- Policy: `INSERT` allowed for anon + authenticated (`WITH CHECK (true)`). No SELECT/UPDATE/DELETE policies, so rows are write-only from the client and only service_role can read them.

## 2. Client — per-device anon id

New `src/lib/deviceId.ts`:
- `getDeviceId()` — reads `triviolivia_device_id` from `localStorage`, generates + persists `crypto.randomUUID()` if missing.

## 3. Guest completion path

`src/lib/gameCompletion.ts` — add `handleAnonymousGameCompletion(session)`:
- Compute `settings_code = encodeGameSettings({...session, isKidsMode})`.
- `supabase.from("anonymous_plays").insert({ device_id: getDeviceId(), settings_code, is_kids_mode, is_quickplay, is_custom, is_minimum_timer, completed_at })`.
- No badge evaluation, no toasts, no return value needed.

`src/components/TriviaGame.tsx` completion effect:
- If `currentUser` → existing `handleGameCompletion(user.id, session)` unchanged.
- Else → fire-and-forget `handleAnonymousGameCompletion(session)`.

## 4. Files touched

- `supabase/migrations/<timestamp>_anonymous_plays.sql` (new)
- `src/lib/deviceId.ts` (new)
- `src/lib/gameCompletion.ts` — add `handleAnonymousGameCompletion`
- `src/components/TriviaGame.tsx` — route completion by auth state

## Out of scope

- Any Profile panel / UI changes.
- Reading guest rows back on the client.
- Tally / aggregate row (dropped per your feedback).
