# Track new account sign-ups (email, Google, Apple)

## What's happening today

The app already has a sign-up helper (`src/lib/conversion.ts`) that pushes a `sign_up` event to the GTM dataLayer:

- Email sign-up: called in `AuthModal.tsx` right after `supabase.auth.signUp()` succeeds.
- Google / Apple: called in `AuthButton.tsx` on the `SIGNED_IN` auth event, gated by an "account created in the last 5 minutes" check.

Two reasons you see nothing firing:

1. That push bypasses `trackEvent()`, so it never logs `[GA4] sign_up` in the console — there is no visible signal even when it works.
2. The button clicks that start each flow (`click_sign_up_email`, `click_sign_in_google`, `click_sign_in_apple`) are called but silently dropped: none of them are in the `ALLOWED_CLICK_EVENTS` allowlist in `src/lib/analytics.ts`.

Also, in GTM no tag is currently listening for `sign_up`, so even a correct push produces no GA4/Ads hit.

## Plan

### 1. Route the sign-up event through `trackEvent` (`src/lib/conversion.ts`)

Replace the raw `window.dataLayer.push({ event: "sign_up", ... })` with `trackEvent("sign_up", { method, user_id })`. Same dataLayer format, but it now logs `[GA4] sign_up` so it's verifiable in DevTools.

Add a `method` argument: `"email" | "google" | "apple"`, so GA4 can break sign-ups down by provider. For OAuth, the provider is read from `user.app_metadata.provider`; email sign-up passes `"email"` explicitly.

Keep both existing guards unchanged: fire-once per user id in `sessionStorage`, and the 5-minute account-age window that excludes returning sign-ins.

### 2. Call sites

- `AuthModal.tsx`: pass `"email"` on the existing call (no other change).
- `AuthButton.tsx`: unchanged — it already calls the helper on `SIGNED_IN`, which is the only reliable point after the OAuth redirect returns.

### 3. Make the sign-up click events visible (`src/lib/analytics.ts`)

Add to `ALLOWED_CLICK_EVENTS`:
- `click_sign_up_email`
- `click_sign_in_email`
- `click_sign_in_google`
- `click_sign_in_apple`
- `click_open_auth_modal`

These give a funnel: modal opened -> method clicked -> account created.

### 4. GTM configuration (your side, no code)

In container `GTM-N8WKMK2M`:

| Tag | Type | Trigger |
|---|---|---|
| GA4 Event - sign_up | GA4 Event, name `sign_up`, param `method` = `{{dlv - method}}` | Custom Event `sign_up` |
| Ads - Sign-up Conversion | Google Ads Conversion, ID `AW-18392006298`, label `2HaOCLCCq-IcEJr9_sFE` | Custom Event `sign_up` |

Create a Data Layer Variable named `method` for the breakdown.

## Note on email sign-ups

With email confirmation on, `signUp()` creates the account immediately but the user isn't signed in until they click the confirmation link. The event fires at form submission (account created), which is what "account creation" means for tracking. The dedupe guard prevents a second fire when they later confirm and sign in.

## Scope

- Edit `src/lib/conversion.ts` (route through `trackEvent`, add `method`)
- Edit `src/components/AuthModal.tsx` (pass `"email"`)
- Edit `src/lib/analytics.ts` (allowlist additions)
- No other files.
