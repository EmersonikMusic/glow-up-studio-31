# Make guest plays visible

## What's actually happening

Guest plays are being recorded correctly. The `anonymous_plays` table currently holds 68 rows, including 9 recorded today — the most recent one minutes ago. So the tracking code is working and matches what Google Analytics shows.

The problem is read access, not writing: the table has an insert-only security policy and no policy that allows anyone to read it. Any read through the app's data API returns zero rows, so the data looks missing even though it's there.

Note that this table only covers players who are **not** signed in. Completed games from signed-in players are counted on their profile row instead, so guest-play counts will always be lower than total game completions in Analytics.

## The fix

Add proper admin read access:

1. Create a roles system (a separate `user_roles` table with an `admin` role) — the safe standard pattern, kept off the profile table so it can't be self-granted.
2. Add a security-definer `has_role()` helper function.
3. Add a read policy on `anonymous_plays` so only admins can view the rows, plus the matching data-API grants.
4. Assign the admin role to your account.

Guest inserts keep working exactly as they do now; nothing changes for players.

## Technical details

- Migration: `app_role` enum, `public.user_roles` table (unique on user_id+role) with grants (`SELECT` to authenticated, `ALL` to service_role), RLS enabled, self-read policy, and `public.has_role(uuid, app_role)` as `SECURITY DEFINER STABLE` with `SET search_path = public`.
- Migration: `GRANT SELECT ON public.anonymous_plays TO authenticated;` plus policy `USING (public.has_role(auth.uid(), 'admin'))`. No `anon` read grant.
- Seed one row in `user_roles` granting `admin` to your user account.
- No frontend changes required to fix visibility; the data becomes readable from the backend table view and any admin query.
