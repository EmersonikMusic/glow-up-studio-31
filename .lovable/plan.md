## Wire up Apple's official Sign in with Apple JS button (visual + inert until credentials arrive)

Replace the hand-rolled Apple button with Apple's own SDK-rendered button. The glyph, spacing, and typography then come from Apple directly and are guaranteed correct. Everything gets set up now except the two values the Apple Developer account will produce (Services ID + verified redirect URL).

### What we build now

1. **Load Apple's JS SDK** once, globally, via `index.html`:
   ```html
   <script type="text/javascript"
     src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
     defer></script>
   ```
   Placed at the end of `<body>` so it doesn't block first paint.

2. **Add ambient TS types** in `src/types/appleid.d.ts` declaring `window.AppleID.auth.init(...)`, `renderButton()`, and `signIn()` (the three methods we touch).

3. **Add a placeholder env var** `VITE_APPLE_SERVICES_ID` in `.env` set to an empty string, with a comment explaining it will be filled in once the Apple Developer account is ready. The Vite config already exposes `import.meta.env.VITE_*`.

4. **Update `src/components/AuthModal.tsx`**:
   - Delete the custom `<button>` + `AppleIcon` implementation and the `AppleIcon` component.
   - Add a `useEffect` that runs when the modal opens:
     - If `window.AppleID` exists, call `AppleID.auth.init({ clientId: import.meta.env.VITE_APPLE_SERVICES_ID || "pending.services.id", scope: "name email", redirectURI: window.location.origin, usePopup: true })`.
     - Then call `AppleID.auth.renderButton()` to paint the button into the placeholder div.
     - Re-run when `isSignup` toggles so the label swaps between "Sign in with Apple" / "Sign up with Apple".
   - Render Apple's placeholder div in the social buttons stack, using the exact snippet the user provided but adapted to fill the row:
     ```html
     <div
       id="appleid-signin"
       data-mode="center-align"
       data-type={isSignup ? "sign-up" : "sign-in"}
       data-color="black"
       data-border="false"
       data-border-radius="50"
       data-width="375"
       data-height="48"
     />
     ```
     Wrap it in a container styled `w-full h-12 rounded-full overflow-hidden` so it visually matches the Google button. Apple's SDK inserts an `<iframe>` inside the div — that's expected.
   - Wrap the container in a `<button>`-like clickable region that intercepts pointer events until credentials exist:
     - If `VITE_APPLE_SERVICES_ID` is empty (current state): overlay a transparent click-catcher that shows `toast("Apple sign-in coming soon")` and prevents the SDK's default flow.
     - If it's set: remove the overlay so the SDK's native `AppleID.auth.signIn()` flow runs on click. We handle the returned `id_token` in a small `onSuccess` handler that calls `lovable.auth.signInWithOAuth("apple", { redirect_uri: window.location.origin })` — or, if the user prefers to go entirely through Apple's JS SDK popup, we exchange the returned `id_token` with Supabase via `supabase.auth.signInWithIdToken({ provider: "apple", token })`. Decision deferred until credentials are in hand; today the button stays inert.

5. **Analytics + a11y**: `aria-label` on the container is set from `isSignup` for screen readers (Apple's iframe blocks external labeling of the inner button).

### What stays TODO until Apple Developer is ready

- Fill `VITE_APPLE_SERVICES_ID` with the Services ID (e.g. `com.triviolivia.web`).
- Register `https://triviolivia.com`, `https://www.triviolivia.com`, and `https://triviolivia.lovable.app` as Web Domains and their `/` (or `/auth/callback`) as Return URLs in the Apple Developer console.
- Choose the runtime path: (a) call Lovable Cloud managed Apple provider via `lovable.auth.signInWithOAuth("apple", ...)` — needs Apple provider enabled in the backend, or (b) use Apple's JS `AppleID.auth.signIn()` popup and pass the `id_token` to Supabase via `signInWithIdToken`. I'll recommend (a) once credentials arrive since we already use `lovable.auth.signInWithOAuth("google", ...)`.
- Remove the click-catcher overlay so the SDK button becomes live.

### Verification

- Typecheck.
- Load the modal in Playwright (Sign In + Sign Up) and screenshot. Confirm Apple's iframe renders the official button at the correct height, with the correct label per mode, matching the Google button width.
- Confirm clicking the button while `VITE_APPLE_SERVICES_ID` is empty triggers only the "coming soon" toast and does not open Apple's auth window.

### Out of scope

- Wiring `lovable.auth.signInWithOAuth("apple", ...)` end-to-end (waits on credentials).
- Any changes to the Google button, email form, or modal chrome.
- Enabling the Apple provider on Lovable Cloud (will do after Services ID exists).
