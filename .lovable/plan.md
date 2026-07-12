Update the custom Sign in with Apple button text to match the Google button.

1. In `src/components/AuthModal.tsx`, change the Apple button label span:
   - Reduce `fontSize` from `16` to `14` (matches the standard Google Sign-In button text size).
   - Keep the label text as `"Sign in with Apple"` at all times; remove the `isSignup` conditional so it no longer switches to `"Sign up with Apple"`.
   - Update the `aria-label` to always read `"Sign in with Apple"`.

2. Verify by opening the login modal at desktop and mobile widths and confirming the Apple text is smaller and reads "Sign in with Apple" in both sign-in and sign-up modes.

No changes to the main yellow CTA, Google button, or the modal header styling introduced in the previous task.