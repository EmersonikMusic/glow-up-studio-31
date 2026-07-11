## Goal

Replace the current header sign-in flow with a Triviolivia-branded auth modal that matches the attached mockups. The Lovable OAuth call stays under the hood — only the UI changes.

## Scope

**In:**
1. Update `AuthButton.tsx` header states to match the reference pills:
   - Signed out: gold outlined pill with `LogIn` icon + gold "LOGIN" label (image 16).
   - Signed in: teal outlined pill with `User` icon + teal uppercase username (image 17). Dropdown for sign-out stays.
2. New `AuthModal.tsx` — Triviolivia-branded sign-in dialog (image 15):
   - Dark rounded card with subtle gold glow, close/back button top-left, small TRIVIOLIVIA logo top-center.
   - Heading "WELCOME BACK" (Fredoka One, gold gradient), subtitle "Sign in to continue".
   - Two social buttons side-by-side: **Google** (functional, Google G icon) and **Apple** (rendered but disabled with a small "coming soon" tooltip — Apple provider is not configured).
   - "OR" divider.
   - Email + Password fields (password with show/hide eye).
   - Gold gradient "SIGN IN" primary button with arrow icon.
   - Footer link "Don't have an account? Sign up" — toggles the same modal into a sign-up variant (heading "CREATE ACCOUNT", CTA "SIGN UP", footer flips to "Already have an account? Sign in").
3. Wire the "LOGIN" header pill to open the modal (replaces the direct Google redirect).
4. Email/password auth via `supabase.auth.signInWithPassword` and `supabase.auth.signUp` (with `emailRedirectTo: window.location.origin`). Google button still calls `lovable.auth.signInWithOAuth("google", ...)`.
5. Basic form UX: inline error text under the form, disabled state while submitting, toast on success/failure, modal closes on successful session.

**Out of scope (not requested):**
- Apple sign-in wiring (button shown but disabled).
- Forgot-password flow / `/reset-password` route.
- Any change to the profile trigger, `profiles` table, or the account dropdown behavior beyond restyling the trigger pill.
- Gating game features behind auth.

## Technical notes

- New file: `src/components/AuthModal.tsx` using shadcn `Dialog` primitive already in the project.
- `AuthButton.tsx`: replace signed-out button with the gold "LOGIN" pill and open `<AuthModal />`; restyle signed-in trigger to the teal "GOOGLEUSER"-style pill (username uppercased, truncated). Dropdown content unchanged.
- Styling uses existing tokens: `hsl(var(--game-gold))` for the gold pill/heading/CTA gradient, `hsl(185 70% 55%)` (existing teal) for the signed-in pill. Fredoka One for the heading and SIGN IN label, matching the rest of the app.
- Gold gradient CTA reuses the same treatment as `PrimaryCTA` for consistency.
- `lovable.auth.signInWithOAuth` result handling unchanged (redirect vs error vs session set).
- Nothing changes in `src/integrations/lovable/*`, `src/integrations/supabase/client.ts`, migrations, or `GameHeader.tsx` layout beyond the pill it already renders.

## Open question

Email/password sign-in/sign-up is included because the mockup shows those fields. If you'd rather the modal be **Google-only** (drop email/password + Apple, keep the branded shell), say the word and I'll trim the plan before building.
