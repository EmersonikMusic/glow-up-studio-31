## Goal

Extend the User Profile panel with two new fields, add a Delete Account action, and require a unique **Username** at email signup.

---

## 1. Database

Migration adds:
- `profiles.created_at` is already present — reuse it as "Member since".
- Add a **unique index** on `profiles.username` (case-insensitive) so signup can enforce uniqueness. Trim + lowercase check.
- Add a `public.delete_current_user()` SECURITY DEFINER function that deletes the caller from `auth.users` (cascades to `profiles`). Called via RPC by the authenticated user.

No new columns needed — everything else already exists.

---

## 2. Signup screen (`AuthModal.tsx`)

Email signup flow only (Google/Apple unchanged — they keep auto-filling username from provider name, editable later in the panel).

- Add a **Username** field **above Email address**, required.
- Client validation (zod):
  - Trim, 3–20 chars, allowed: `a-z`, `0–9`, `_`, `.` (case-insensitive; stored as entered but uniqueness checked lowercase).
  - Not empty, no leading/trailing dot/underscore.
- Before calling `signUp`, run a `select` on `profiles` to check availability; show inline error "That username is taken" if it exists.
- Pass `username` into `options.data` so the `handle_new_user` trigger picks it up. Update the trigger to prefer `raw_user_meta_data->>'username'` over name/email fallback.
- Login and password reset screens: no change.
- Google/Apple: no change (they don't hit this form).

---

## 3. Profile panel (`ProfilePanel.tsx`)

Additions inside the existing profile header card, below the email line:

- **Member since** — small muted line, e.g. `Member since Jul 2026` (formatted from `profiles.created_at`).

New destructive action at the bottom of the panel, visually separated from the rest:

- **Delete account** button — outlined red, full width, inside its own section under Achievements.
- Clicking opens an AlertDialog (shadcn) with:
  - Title: "Delete your account?"
  - Body: "This permanently deletes your profile, progress, and achievements. This can't be undone."
  - Type-to-confirm: user must type `DELETE` to enable the confirm button.
  - Confirm → call `supabase.rpc('delete_current_user')` → on success, `supabase.auth.signOut()`, close panel, toast "Account deleted".

Existing "Sign out" button stays where it is.

Username edit (already implemented) keeps working; validation aligned with signup rules.

---

## 4. Verification

- Sign up with a fresh email + username → account created, username stored, profile row created via trigger with that username.
- Sign up with a duplicate username → inline error, no account created.
- Open profile panel → "Member since" shows the join date.
- Click Delete account → dialog → type `DELETE` → account is removed, user is signed out, and re-login with the same email fails ("user not found").
- Google/Apple sign-ins still work; username is auto-filled from the provider and editable in the panel as before.

---

## Out of scope

- Sign-in provider badge, extended stats (best streak, favorite category), password-change flow — not selected.
- No changes to Login screen or existing OAuth flows.
