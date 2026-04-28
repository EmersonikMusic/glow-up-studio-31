## Plan: Make Google/Apple login actually work

### Current problem
The login UI is currently only simulated. Clicking Google or Apple waits briefly and then creates a fake in-memory user like `GoogleUser` or `AppleUser`. Nothing is connected to a real auth provider, so it cannot persist sessions, redirect through Google/Apple, or authenticate real users.

### Goal
Implement real authentication for:
- Google sign-in
- Apple sign-in
- Email/password login and signup already shown in the modal
- Logout
- Session persistence after refresh / redirect

Without breaking:
- Instant no-login gameplay
- Existing start/game/result screens
- Recent Samsung Smart TV compatibility work
- Existing visual style of the login modal/header

### Implementation steps

#### 1. Add Supabase client integration
- Install/use `@supabase/supabase-js`.
- Add `src/integrations/supabase/client.ts` using Vite env vars:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`
- Keep auth storage guarded for older/restricted browsers so TV browsers do not crash if storage is blocked.

#### 2. Replace fake `AuthContext` with real auth state
Update `src/contexts/AuthContext.tsx` to:
- Listen to `supabase.auth.onAuthStateChange`.
- Load the initial session with `supabase.auth.getSession()`.
- Map the Supabase user into the current app shape:
  - `id`
  - `email`
  - `username` from user metadata, email prefix, or provider metadata
  - `provider`
- Implement:
  - `login(email, password)` via `supabase.auth.signInWithPassword`
  - `signup(email, password, username)` via `supabase.auth.signUp`
  - `loginWithGoogle()` via `supabase.auth.signInWithOAuth({ provider: "google" })`
  - `loginWithApple()` via `supabase.auth.signInWithOAuth({ provider: "apple" })`
  - `logout()` via `supabase.auth.signOut()`
- Use redirect URL `window.location.origin` so preview and published domains return to the correct app.

#### 3. Keep profile storage out of scope for now
Because the app only needs a display username in the header and no database-backed profile data has been requested, I will not add a profiles table or roles table.

User data will come from Supabase Auth metadata/session only. This avoids adding database schema, RLS, or role-related risk unnecessarily.

#### 4. Improve login modal behavior and messages
Update `src/components/LoginScreen.tsx` so real auth failures show useful messages:
- Invalid email/password
- OAuth redirect failure
- Signup confirmation message if email confirmation is required
- Loading state remains on buttons while Supabase is processing

The existing visual design will remain the same.

#### 5. OAuth provider setup requirements
Code can initiate the real Google/Apple flows, but the project backend must also have Google and Apple providers enabled.

After implementation, you will need to verify in Lovable Cloud/Supabase auth settings that:
- Google provider is enabled.
- Apple provider is enabled.
- Redirect URLs include the published domain:
  - `https://triviolivia.com`
  - `https://www.triviolivia.com`
  - `https://triviolivia.lovable.app`
  - preview URL if testing from preview

If the provider is not enabled, the UI will show a clear auth error instead of pretending login worked.

### Technical notes
- I will not add protected routes; gameplay remains public.
- I will keep `BrowserRouter` and current page flow unchanged.
- I will preserve the legacy-browser hardening from the Smart TV compatibility pass.
- I will avoid client-side admin/role logic entirely.

### Verification
After implementation:
- Open login modal and confirm Google/Apple buttons call real OAuth redirects.
- Confirm email/password signup/login uses Supabase Auth.
- Confirm returning from OAuth shows the logged-in username in the header.
- Confirm logout clears the session.
- Confirm start screen still loads for logged-out users.
- Confirm no new direct use of fragile browser APIs that could reintroduce TV blank-screen issues.