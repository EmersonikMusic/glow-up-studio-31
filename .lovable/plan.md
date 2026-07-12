# Add Password Reset Flow

Add a "Forgot password?" link to the sign-in view of `AuthModal`, plus a dedicated `/reset-password` page so users can actually set a new password after clicking the email link.

## User flow

1. On the Sign In view of the auth modal, user clicks **Forgot password?**
2. Modal switches to a "Reset password" view: single email field + Send reset link button (+ Back to sign in).
3. On submit, call `supabase.auth.resetPasswordForEmail(email, { redirectTo: ${origin}/reset-password })`. Show a success toast ("Check your email for a reset link") and return to sign-in view. Always show the same confirmation regardless of whether the email exists (avoid account enumeration).
4. User clicks link in email → lands on `/reset-password` with a recovery session.
5. Page shows New password + Confirm password fields. On submit, call `supabase.auth.updateUser({ password })`. On success, toast + redirect to `/`.

## Changes

**`src/components/AuthModal.tsx`**
- Extend `mode` union to `"signin" | "signup" | "forgot"`.
- Add "Forgot password?" text link below the password field, visible only in signin mode.
- Add a `forgot` view: heading "Reset Password", email input, submit button, "Back to sign in" link. Reuse the existing glassmorphism styling.
- Add `handleForgotSubmit` calling `resetPasswordForEmail` with `redirectTo: ${window.location.origin}/reset-password`.
- Add allowlisted analytics events `click_forgot_password` and `click_send_reset_link` to `src/lib/analytics.ts`.

**`src/pages/ResetPassword.tsx`** (new)
- Public route. Listens for `onAuthStateChange` with event `PASSWORD_RECOVERY` (Supabase fires this after processing the recovery hash) to confirm a recovery session is present.
- If no recovery session detected after mount, show an "Invalid or expired link" state with a button back to `/`.
- Form: new password + confirm password, with the same show/hide toggles and gradient CTA used in `AuthModal`. Validates non-empty and match; enforces min length 8.
- On submit: `supabase.auth.updateUser({ password })`. On success: toast, sign out to force a clean re-login, then `navigate('/')`.
- Reuses the same glassmorphism card styling as the modal for visual consistency, wrapped in a full-screen centered layout.

**`src/App.tsx`**
- Register `<Route path="/reset-password" element={<ResetPassword />} />` above the catch-all NotFound route.

## Notes / non-goals

- No backend/schema changes. Supabase auth handles token exchange from the URL hash automatically when the SDK loads on `/reset-password`.
- No auth email template customization in this task — default Lovable auth emails are fine. Can be branded later via `scaffold_auth_email_templates` if the user wants.
- The Site URL / redirect URL allowlist in the auth config must include the deployed origin(s); this is already the case for this project's preview and custom domains.
