# Track new account sign-ups (email, Google, Apple)

## What's happening today

The app already has a sign-up helper (`src/lib/conversion.ts`) that pushes a `sign_up` event to the GTM dataLayer:

- Email sign-up: called in `AuthModal.tsx` right after `supabase.auth.signUp()` succeeds.
- Google / Apple: called in `AuthButton.tsx` on the `SIGNED_IN` auth event, gated by an "account created in the last 5 minutes" check.

Two reasons you see nothing firing:

1. That push bypasses `trackEvent()`, so it never logs `[GA4] sign_up` in the console — there is no visible signal even when it works.
2. In GTM no tag is currently listening for `sign_up`, so even a correct push produces no GA4/Ads hit.

## Plan — one holistic `sign_up` event

A single `sign_up` event covers all three methods. No per-step click events needed.

### 1. Route the sign-up event through `trackEvent` (`src/lib/conversion.ts`)

Replace the raw `window.dataLayer.push({ event: "sign_up", ... })` with `trackEvent("sign_up", { method, user_id })`. Same dataLayer format, but it now logs `[GA4] sign_up` so it's verifiable in DevTools.

Add a `method` value so GA4 can break sign-ups down by provider:
- Email sign-up: `"email"` (passed explicitly from `AuthModal.tsx`).
- Google / Apple OAuth: read from `user.app_metadata.provider` in `AuthButton.tsx` (the SIGNED_IN user carries this).

Keep both existing guards unchanged: fire-once per user id in `sessionStorage`, and the 5-minute account-age window that excludes returning sign-ins.

### 2. Call sites

- `AuthModal.tsx`: pass `"email"` on the existing call (one-line change).
- `AuthButton.tsx`: unchanged — it already calls the helper on `SIGNED_IN`, which is the only reliable point after the OAuth redirect returns. The `method` is derived from the session user inside the helper.

### 3. GTM configuration (your side, no code)

In container `GTM-N8WKMK2M`:

| Tag | Type | Trigger |
|---|---|---|
| GA4 Event - sign_up | GA4 Event, name `sign_up`, param `method` | Custom Event `sign_up` |
| Ads - Sign-up Conversion | Google Ads Conversion, ID `AW-18392006298`, label `CyidCKruzOYcEJr9_sFE`, value `1.0`, currency `CAD` | Custom Event `sign_up` |

Optionally create a Data Layer Variable named `method` if you want provider breakdowns in GA4 reports.

## Note on email sign-ups

With email confirmation on, `signUp()` creates the account immediately but the user isn't signed in until they click the confirmation link. The event fires at form submission (account created), which is what "account creation" means for tracking. The dedupe guard prevents a second fire when they later confirm and sign in.

## Scope

- Edit `src/lib/conversion.ts` (route through `trackEvent`, add `method`)
- Edit `src/components/AuthModal.tsx` (pass `"email"`)
- No other files.
