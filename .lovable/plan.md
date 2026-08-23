# Plan: Dynamic social button labels + Google account chooser

## Problem
Two issues on the auth modal (`src/components/AuthModal.tsx`):

1. **Static labels.** The Google and Apple buttons always read "Sign in with Google" / "Sign in with Apple", even in **Create Account** (signup) mode. They should say "Sign up with …" when the user is signing up.
2. **No account choice for Google.** Clicking the Google button silently signs the user in with whatever Google account is already active in the browser. There's no way to pick a different Google account.

## Solution

### 1. Dynamic button labels (signup vs. signin)
Change the hardcoded "Sign in with Google" / "Sign in with Apple" text to derive from `isSignup`:
- Signup mode → **"Sign up with Google"** / **"Sign up with Apple"**
- Sign-in mode → **"Sign in with Google"** / **"Sign in with Apple"**

Both phrases are on Google's and Apple's approved branding lists, so this complies with their guidelines. Also update the `aria-label` to match the visible text.

### 2. Force Google account selection
Pass `prompt: "select_account"` via `extraParams` in the Google OAuth call:

```ts
const result = await lovable.auth.signInWithOAuth("google", {
  redirect_uri: window.location.origin,
  extraParams: { prompt: "select_account" },
});
```

This makes Google show the account chooser every time, so users can pick any of their accounts (or add a new one). The `extraParams` are already passed through by the lovable wrapper (`src/integrations/lovable/index.ts`) — no change needed there.

Apple sign-in always shows Apple's own account sheet, so no equivalent is needed.

## Files to change
- `src/components/AuthModal.tsx` — dynamic button text + aria-labels; add `extraParams` to `handleGoogle`.

## Verification
- Typecheck (`tsgo`) after edits.
- Visual check on the preview: toggle between Create Account and Welcome Back, confirm button text and gradient CTA sizing stay consistent.
