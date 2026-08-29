# Stop bot sign-ups with an invisible bot check

## What's actually happening

Looking at the accounts: 33 total, and most recent ones came in through **Google sign-in**, not the email form. That matters, because a captcha only protects the email/password form — Google's own flow already blocks scripted sign-ups. So the plan does two things: block scripted email sign-ups, and make it possible to tell real humans from drive-by accounts.

## What gets built

**1. Invisible bot check on the email sign-up form**

Cloudflare Turnstile (free, invisible for real people, no puzzle to solve) is added to the Create Account form. The account is only created after the check passes, verified on our server — not just in the browser, so it can't be faked by a script.

**2. Honeypot + timing guard**

A hidden field no human ever fills in, plus a minimum time-on-form. Both are free to add and catch the simple bots that don't even load the page properly.

**3. Leaked-password protection**

Turn on the built-in check that rejects passwords found in known breach lists.

**4. A "real player" signal**

Sign-ups already get recorded; the plan adds a simple way to see which accounts have actually started a game, so you can judge ad quality rather than guess. No accounts are deleted (per your choice).

## What this will not fix

If the junk accounts keep arriving via Google sign-in, the cause is ad traffic quality, not app security — the fix there is campaign-side (placement exclusions, audience tightening). We'll know within days of shipping, because the signal in step 4 will show which channel the non-players come from.

## Technical detail

- New secret: `TURNSTILE_SECRET_KEY` (requested via the secret tool). Site key is public, kept in code.
- New edge function `signup-verify`: validates the Turnstile token against Cloudflare, applies honeypot/timing checks, and only then creates the account using admin privileges; returns a clean error otherwise. Input validated with Zod; CORS included.
- `src/components/AuthModal.tsx`: renders the Turnstile widget (email sign-up mode only), holds the token in state, blocks submit until it resolves, and routes sign-up through the edge function instead of calling `signUp` directly. Sign-in, forgot-password, Google, and Apple flows are untouched. Existing `sign_up` conversion tracking still fires on success.
- `configure_auth` with `password_hibp_enabled: true`.
- Reporting: a read-only SQL view joining accounts to `game_starts` so non-playing accounts and their provider are visible in the backend table viewer.
- Styling matches the existing glassmorphism modal; widget sized to the 320px form column.
