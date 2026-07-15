# Sign in with Apple

Since you're on Lovable Cloud, we should use the managed `lovable.auth.signInWithOAuth("apple", ...)` helper — not the raw `supabase.auth.signInWithOAuth` snippet Gemini gave you. The Lovable helper handles the popup / redirect handoff and session setup for you, mirrors how Google sign-in already works in this app, and works correctly inside the preview iframe. The redirect target should be `window.location.origin`, not `/auth/callback` (that route doesn't exist here — Lovable's OAuth broker handles the callback).

We'll also drop the existing Apple JS SDK popup path (`appleid.auth.js`, `#appleid-signin`, `VITE_APPLE_SERVICES_ID` gate). That was a placeholder pre-integration; it's incompatible with Lovable-managed Apple auth and would collide with it.

## What changes

**Backend**
- Enable the Apple provider on Lovable Cloud managed social login (via `configure_social_auth` with `providers: ["apple"]`). Google stays enabled; email stays enabled.

**`src/components/AuthModal.tsx`**
- Remove Apple JS SDK bits: `APPLE_SERVICES_ID` / `APPLE_AUTH_READY` constants, the `useEffect` that injects `appleid.auth.js`, the `AppleID.auth.init` call, and the `#appleid-signin` div.
- Add `handleApple` that mirrors `handleGoogle`:
  ```ts
  const result = await lovable.auth.signInWithOAuth("apple", {
    redirect_uri: window.location.origin,
  });
  if (result.error) { setError("Apple sign-in failed. Please try again."); return; }
  if (result.redirected) return;
  onOpenChange(false);
  ```
- Replace the SDK-rendered Apple div with a plain `<button>` styled to match Google's pill (`SOCIAL_BTN_WIDTH` × `SOCIAL_BTN_HEIGHT`, black background, white "Sign in with Apple" label + Apple glyph). Reuse the existing `apple-logo-white.svg` asset already in `src/assets/`. Always visible now (no feature flag).
- Analytics: keep `trackClick("click_sign_in_apple")` at the top of `handleApple`.

## Why not Gemini's snippet

1. It calls `supabase.auth.signInWithOAuth` directly. On Lovable Cloud managed auth, all social sign-in must go through `lovable.auth.signInWithOAuth` so the wrapper can set the session after the popup returns tokens via `web_message`. Calling Supabase directly bypasses that and breaks preview-iframe sign-in.
2. `redirectTo: ${origin}/auth/callback` points at a route that doesn't exist in this project and isn't in the OAuth allow-list — the managed broker uses its own callback. `window.location.origin` is the correct value and works on custom domains too.

## Verification
- Type-check and build pass.
- Open the login modal → Apple button appears next to Google → click opens Apple sign-in → returning to the app leaves you signed in (avatar/username visible in the header).

No design direction options needed — the button matches the existing Google pill's size and shape.
