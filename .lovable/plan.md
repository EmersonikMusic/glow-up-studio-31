# User Profile Panel

Add a slide-in Profile panel that mirrors the existing Settings panel's shell (desktop right-side slide, mobile bottom sheet, same backdrop, blur, borders, and transition). Opens when the logged-in account button in the header is clicked.

## 1. Database (Lovable Cloud)

Extend `public.profiles` with progress + username fields via a migration:

- `username text unique` — editable display name (defaults to email on signup).
- `games_completed int not null default 0`.
- `last_played_at timestamptz`.
- `first_game_completed_at timestamptz` — used to light up the First Game badge.

Update the existing `handle_new_user()` trigger function so new rows set `username = COALESCE(display_name, email)`. Keep existing RLS (users read/update own row). No new table needed — badges are derived from `games_completed`.

## 2. New component: `src/components/ProfilePanel.tsx`

Reuses the SettingsPanel shell verbatim (same widths, transforms, backdrop, mobile drag-to-dismiss). Props:

```ts
{ open: boolean; onClose: () => void; user: User; }
```

Sections, top-to-bottom:

**Profile header**
- Circular avatar: `profile.avatar_url` if present (Google/Apple provide it via user_metadata). Otherwise a default silhouette (lucide `UserCircle2`) or initial in a teal circle for email/password users.
- Username row: shows `profile.username`. Pencil (`Pencil` lucide) toggles inline edit → text input + Save/Cancel. On save, `UPDATE profiles SET username` for `auth.uid()`. Optimistic update, toast on error.
- Email (read-only, muted).
- Sign out button at the bottom of this block.

**Score Card** (visually separated card, same rounded-2xl / dark glass styling used by SettingsPanel sections)
- "Games Completed": large number.
- "Last Played": formatted `last_played_at` (e.g. `Jul 12, 2026`) or "Never" if null.

**Achievements & Awards** (rounded-2xl section, 3-column grid on desktop, 3 across on mobile too)
- Cards: `First Game Completed`, `10 Games Completed`, `25 Games Completed`.
- Each renders a circular badge icon (gold gradient when unlocked, greyscale + reduced opacity when locked) with label underneath.
- Unlock rules (client-side derived from `games_completed`):
  - First: `games_completed >= 1` (actively wired).
  - 10 / 25: rendered as locked placeholders regardless of count for now (per spec: only First is wired up).

Data loading: on `open === true`, fetch the current profile row; subscribe to `onAuthStateChange` for sign-out cleanup.

## 3. Header wiring — `src/components/AuthButton.tsx`

Replace the current dropdown menu on the logged-in state with a single button that calls `onOpenProfile()` (new prop) — same visual button as today. Remove the dropdown menu code path. The signed-out state (Login button + AuthModal) is unchanged.

## 4. Header wiring — `src/components/GameHeader.tsx`

Add a `profileOpen` piece of state managed by TriviaGame (mirrors `panelOpen`). Pass `onOpenProfile` down through GameHeader → AuthButton. Render `<ProfilePanel />` next to `<SettingsPanel />` in `TriviaGame.tsx`.

## 5. Game completion hook — `src/components/TriviaGame.tsx`

Where the game transitions to `finished`, if a user is signed in, call a small helper (`recordGameCompletion`) that runs one `update`:

```sql
UPDATE profiles
SET games_completed = games_completed + 1,
    last_played_at = now(),
    first_game_completed_at = COALESCE(first_game_completed_at, now())
WHERE id = auth.uid();
```

Fire once per finished game (guard with a ref to avoid double-counting on re-renders).

## Technical notes

- All copy, spacing, radii, colors reuse the existing SettingsPanel tokens — no new design system entries.
- Types: extend `Profile` interface (already in AuthButton) inline in ProfilePanel; regenerated `src/integrations/supabase/types.ts` will cover the new columns after the migration runs.
- Analytics: add `trackClick` for `profile_open`, `profile_username_save`, `profile_sign_out`.
- No changes to auth providers, AuthModal, or the Apple/Google gating.

## Out of scope

- Server-side badge table / server-verified achievements (locked badges are visual only).
- 10 / 25 game badge unlock logic.
- Avatar upload for email/password users.
