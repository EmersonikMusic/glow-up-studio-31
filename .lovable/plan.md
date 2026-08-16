# Fire sign-up conversion for Apple & Google sign-ups too

## Problem
The Google Ads sign-up conversion (`AW-18392006298/2HaOCLCCq-IcEJr9_sFE`) currently fires only on **email** sign-up. Apple and Google sign-ins redirect away to the OAuth provider and come back with a session, so the conversion is never recorded for those two methods.

The hard part: at the moment a social button is clicked we can't tell sign-up from sign-in — both go through the same OAuth redirect. The reliable signal arrives **after** the redirect returns, in the `SIGNED_IN` auth event, where the session user's `created_at` tells us whether the account was just created.

## Solution
Detect a freshly-created account after OAuth return and fire the conversion once, with a guard so a returning user (sign-in, not sign-up) never triggers it and the same user can't fire it twice.

### Change 1 — New helper: `src/lib/conversion.ts`
A tiny module that owns the "is this a new sign-up?" check and the fire-once guard:

```ts
import type { User } from "@supabase/supabase-js";

const FIRED_KEY = "google_ads_signup_conversion_fired_for";

// An account created within this window of the SIGNED_IN event counts as a
// brand-new sign-up (covers redirect round-trip latency).
const NEW_ACCOUNT_WINDOW_MS = 5 * 60 * 1000; // 5 min

export function fireSignUpConversionForUser(user: User): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag_report_conversion !== "function") return;

  // Fire-once per user id so a returning sign-in can't double-fire.
  const already = sessionStorage.getItem(FIRED_KEY);
  if (already === user.id) return;

  const created = user.created_at ? Date.parse(user.created_at) : NaN;
  if (!Number.isFinite(created)) return;
  const ageMs = Date.now() - created;
  if (ageMs < 0 || ageMs > NEW_ACCOUNT_WINDOW_MS) return; // not a new account

  sessionStorage.setItem(FIRED_KEY, user.id);
  window.gtag_report_conversion();
}
```

Rationale for the recency window: the OAuth round-trip (provider → back to app) takes seconds, but to absorb slow devices/networks we allow up to 5 minutes. A returning user's `created_at` is days/weeks old, so they're excluded. The `sessionStorage` key (scoped to the tab, cleared on close) prevents double-firing if `SIGNED_IN` fires twice for the same new user.

### Change 2 — Email sign-up reuses the same helper (`AuthModal.tsx`)
Replace the inline `gtag_report_conversion` call (~line 190) with the helper so all three paths share one definition of "fire the conversion":

```ts
fireSignUpConversionForUser(data.user);
```

Email sign-up's `data.user.created_at` is ~now, so it passes the recency check. (Keep the call right before `toast.success(...)`.)

### Change 3 — Fire after OAuth return (`AuthButton.tsx`)
The `onAuthStateChange` listener (line 34) is the single place a session is established after the OAuth redirect. Call the helper there on `SIGNED_IN`:

```ts
const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
  setUser(session?.user ?? null);
  if (event === "SIGNED_IN" && session?.user) {
    fireSignUpConversionForUser(session.user);
  }
});
```

This catches Google and Apple sign-ups (and would also re-confirm an email sign-up if the redirect path ran, but the `sessionStorage` guard prevents double-firing).

## What stays the same
- `index.html`: `gtag('config', 'AW-18392006298')` and `gtag_report_conversion()` are unchanged.
- `src/types/gtag.d.ts`: unchanged.
- Conversion fires only for new account creation across all three methods — not for returning sign-ins.

## Scope
- New file: `src/lib/conversion.ts`
- Edit: `src/components/AuthModal.tsx` (swap inline call for helper)
- Edit: `src/components/AuthButton.tsx` (call helper on `SIGNED_IN`)
- No other files, no other conversion labels, no other behavior.
