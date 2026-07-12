## Goal
Confirm the Sign in with Apple button (a) is configured per Apple's web guidance and (b) actually renders visibly in the login modal.

## What Apple's page actually requires

Two distinct sets of properties — do not conflate them:

1. **Auth configuration** (client ID, redirect URI, scope, state, nonce) — provided EITHER via `<meta name="appleid-signin-*">` tags in `<head>` OR via `AppleID.auth.init({...})`. We already use `AppleID.auth.init()` inside `AuthModal.tsx`, so `data-client-id` / `data-redirect-uri` / `data-state` on the div are not required and would be redundant.
2. **Appearance** `data-*` attributes on `#appleid-signin` — `data-color`, `data-border`, `data-type`, `data-mode`, `data-border-radius`, optional `data-width` / `data-height`. Our current div sets: `color=black`, `border=false`, `type=sign-in`, `mode=center-align`, `border-radius=20`. All valid per the doc.

Current `init` call passes `clientId`, `scope`, `redirectURI`, `usePopup`. It does NOT pass `state` or `nonce`. Apple's page lists both as optional; for a placeholder client id and popup-mode preview they can stay omitted, but for production we should add a random `state` (CSRF) and `nonce` (replay protection) — noting this as a follow-up, not a blocker for the visibility check.

## Verification steps (build mode)

1. **Static audit** — re-read `AuthModal.tsx` around the `#appleid-signin` div and the `AppleID.auth.init` call to confirm the attribute set above, and confirm `AppleID.auth.renderButton?.()` is invoked after `init`.
2. **Runtime verification via Playwright** at 1280×900:
   - Load `http://localhost:8080/`.
   - Open the login modal (click the auth entry point).
   - Wait for `#appleid-signin` and log:
     - `getBoundingClientRect()` (width/height > 0, visible in viewport)
     - `innerHTML` (Apple's SDK injects an `<iframe>` or inline SVG+text once `renderButton()` succeeds)
     - `getComputedStyle` background/border-radius
   - Screenshot the modal, then screenshot the Apple button element alone.
   - Capture console errors and any failed `appleid.cdn-apple.com` network requests.
3. **Report findings**:
   - Attributes present vs. Apple's spec.
   - Whether the SDK actually rendered content into `#appleid-signin` (not just an empty div).
   - Screenshot evidence of the visible button next to the Google pill.
   - Any errors (invalid_client is expected while `VITE_APPLE_SERVICES_ID` is unset; note it but don't treat as failure).

## Out of scope
No code changes unless the runtime check shows the button is missing or misconfigured — in which case I'll come back with a follow-up plan.
