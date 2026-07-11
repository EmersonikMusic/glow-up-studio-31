## Goal

Replace the "to continue to Lovable" label on the Google sign-in consent screen with "to continue to Triviolivia".

## Why the current screen says "Lovable"

The Google consent screen text is controlled entirely by Google, based on the OAuth client that initiates the sign-in. Today, Triviolivia uses Lovable Cloud's **managed Google OAuth credentials**, so Google shows the app name registered on that client — "Lovable".

No frontend/backend code change in this project can rename that screen. The only fix is to register a Triviolivia-owned OAuth client in Google Cloud and plug its credentials into the Cloud auth settings.

## What you need to do (in Google Cloud Console)

1. Create (or open) a Google Cloud project named e.g. **Triviolivia**.
2. Open **OAuth consent screen**:
   - App name: `Triviolivia`
   - User support email + developer contact: your address
   - App logo (optional): upload the Triviolivia mark
   - Authorized domains: `triviolivia.com`, `lovable.app`
   - Scopes: `.../auth/userinfo.email`, `.../auth/userinfo.profile`, `openid`
3. Open **Credentials → Create credentials → OAuth Client ID**:
   - Application type: **Web application**
   - Name: `Triviolivia Web`
   - Authorized redirect URI: the callback URL shown in your Cloud project's Google auth settings (Users → Authentication Settings → Sign-in Methods → Google → expand). It will look like `https://<project>.supabase.co/auth/v1/callback`.
4. Copy the generated **Client ID** and **Client Secret**.

## What I do in the app

1. Open **Cloud → Users → Authentication Settings → Sign-in Methods → Google** and paste in your Client ID and Client Secret, replacing the managed credentials.
2. Verify by clicking **Login → Google** in the preview — the consent screen should now say **"to continue to Triviolivia"** and show your logo.

No code changes to `AuthModal.tsx`, `AuthButton.tsx`, or `lovable.auth.signInWithOAuth` are needed; the switch is purely a credentials swap.

## Notes / caveats

- While the app is in Google's **Testing** publishing status, only test users you add will be able to sign in. To let anyone in, submit the consent screen for **Production** (unverified apps still work but show a "Google hasn't verified this app" warning until Google reviews it). Verification is only required for sensitive scopes; email/profile/openid usually clear quickly.
- Existing users who signed in via the managed Lovable client will keep working — Supabase links them by email, so they won't get duplicate accounts after the swap.
- Nothing changes in `src/integrations/lovable/*`, RLS, or the `profiles` table.

## Open question

Do you want me to proceed as soon as you paste the Client ID + Secret here (I'll store the secret via the secret tool and configure the provider), or would you prefer to enter them yourself in the Cloud dashboard?
