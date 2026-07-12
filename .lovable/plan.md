# Auth modal polish + reset-password UX

Small, focused changes in `src/components/AuthModal.tsx` and `src/pages/ResetPassword.tsx`, plus guidance on the reset-email sender.

## 1. Apple button disappears after "Back to sign in" from forgot-password

Cause: the whole social row (including `#appleid-signin`) is inside `{!isForgot && (...)}`. Switching to `forgot` unmounts the div; switching back re-mounts an empty div, but Apple's SDK only paints the button on script load, so the re-mounted node stays empty.

Fix: keep the social row mounted and hide it with `hidden` / `display: none` when `isForgot`. The painted Apple node is never destroyed, so toggling `forgot ↔ signin` reveals the same button. Same treatment for the OR divider.

## 2. Back/close button style mismatch with Settings / About

Modal currently uses a bare rounded button with `ArrowLeft` and raw `rgba`. Settings and About share this pattern:

```tsx
<button
  className="nav-btn ... w-9 h-9 rounded-full ..."
  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
>
  <ChevronsLeft className="w-4 h-4" style={{ color: "hsl(var(--game-gold))" }} strokeWidth={2.5} />
</button>
```

Update the modal's top-left close button to match: `nav-btn` class, same bg/border tokens, `ChevronsLeft` icon, `strokeWidth={2.5}`.

## 3. Link hovers: teal, not gold

Three links use `hover:text-[hsl(var(--game-gold))]`:
- "Forgot password?"
- "Sign up" / "Sign in" toggle
- "Back to sign in"

Swap to teal `hover:text-[hsl(185_70%_55%)]` to match the teal accent used on the About screen "Welcome to your" label.

## 4. "Resend reset email" with throttle

Today the forgot-password form auto-switches back to sign-in after submit, so a user who never got the email has to retype it. Change:

- After submit succeeds, stay on the forgot view and show an inline confirmation panel ("Check your inbox — we've sent a reset link to `<email>`") with a **Resend email** button and a **Back to sign in** link.
- Throttle Resend: 30-second countdown on the button (`Resend in 27s…`), disabled while counting. Store `lastSentAt` in a ref + state so remounts within the same modal session keep the cooldown.
- On resend, call the same `supabase.auth.resetPasswordForEmail` with the same `redirectTo`, reset the countdown, keep the toast, and never expose whether the email exists (same generic success message).
- Add analytics event `click_resend_reset_link` in `src/lib/analytics.ts`.
- Clear the "sent" panel state when the user manually returns to sign-in so a subsequent open of forgot starts fresh.

## 5. Dedicated success screen after password reset

`src/pages/ResetPassword.tsx` currently toasts + signs out + navigates to `/` on `updateUser` success. Users don't get clear confirmation.

Change:

- Add local state `status: "form" | "success" | "invalid"`.
- On successful `updateUser`, set `status = "success"` and render a dedicated success card inside the same glassmorphism layout: heading "Password updated", body copy ("You can now sign in with your new password."), and a primary CTA "Continue to sign in" that signs the user out and navigates to `/` (opening the auth modal on landing is out of scope — `/` already exposes sign-in).
- Keep the existing invalid/expired-link branch as `status = "invalid"` so the three states share one page.
- Fire analytics events `password_reset_success` and `click_continue_after_reset`.

## 6. Reset-password email sender (`no-reply@auth.lovable.cloud`) going to spam

This is the default Lovable auth sender used until the project has its own verified email domain. Yes — it can be changed, but it needs infra setup, not a modal tweak:

1. Configure an email domain the user owns (e.g. delegated subdomain of `triviolivia.com`) via the in-app Email Setup dialog (Cloud → Emails).
2. Once DNS is verified, scaffold custom auth email templates so reset/verify/magic-link mails route through the user's domain and can be branded (logo, colors, copy).
3. Deploy the resulting `auth-email-hook`.

Result: mails send from a domain with this app's own reputation, which is the actual fix for the spam-folder issue — default `auth.lovable.cloud` mails share reputation across many apps and are more likely to be filtered.

I'll only do this if the user confirms and completes the email-domain setup dialog. It's independent of items 1–5.

## Files touched

- `src/components/AuthModal.tsx` — keep social row mounted (hide in forgot), restyle close button (`ChevronsLeft` + `nav-btn`), teal link hovers, resend flow + 30s throttle, success/sent panel state.
- `src/pages/ResetPassword.tsx` — three-state view (`form` / `success` / `invalid`), dedicated success card with continue CTA.
- `src/lib/analytics.ts` — add `click_resend_reset_link`, `password_reset_success`, `click_continue_after_reset`.

No route, schema, or backend changes.
