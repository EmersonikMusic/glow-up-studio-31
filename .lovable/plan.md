Three polish changes to the login modal.

## 1. Remove the redundant top-right close button

The shared `src/components/ui/dialog.tsx` bakes a `DialogPrimitive.Close` (X) into every `DialogContent`. The AuthModal already has its own back/close arrow in the top-left.

- Add an optional `hideClose?: boolean` prop to `DialogContent` in `src/components/ui/dialog.tsx`. When true, skip rendering the built-in close. Default false so other dialogs are unaffected.
- In `src/components/AuthModal.tsx`, pass `hideClose` on `DialogContent`.

## 2. Make the Apple button match the on-brand reference

Reference: black pill, Apple logo sitting tight beside bold "Sign in with Apple" text, logo optically the same height as the text cap-height.

In `src/components/AuthModal.tsx`:

- Keep width/height parity with the Google pill (same `SOCIAL_BTN_WIDTH` / `SOCIAL_BTN_HEIGHT`, black background, white text, fully rounded).
- Render the Apple logo at ~16px tall (not the full 40px button height) with a small right margin, so it hugs the label instead of floating in whitespace.
- Bump the label to `fontWeight: 600`, keep the SF/system font stack, tighten letter-spacing slightly, and center icon+text as a single inline group.
- Keep the existing click behavior (toast "coming soon" until `VITE_APPLE_SERVICES_ID` is set).

## 3. Default the modal to Sign Up

In `src/components/AuthModal.tsx`, change the initial `useState<"signin" | "signup">("signin")` to `"signup"` so the modal opens on the Sign Up view by default. The toggle link at the bottom still lets users switch to Sign In. No other logic changes — the primary CTA elsewhere in the app that opens this modal is unaffected (it just opens the modal; it no longer implies a specific mode).

## Verification

Playwright screenshot at desktop (1280×900) and mobile (390×850) with the login modal open, confirming:
- No X in the top-right.
- Apple button matches the reference and lines up with the Google pill.
- Modal opens on "Create Account" / "Sign Up" by default.
