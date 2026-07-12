## Root cause

When the app is on the Start screen, `TriviaGame` returns early with just `<StartScreen>` and never renders `GameHeader` with `onOpenProfile` or the `<ProfilePanel>` itself. `StartScreen` renders its own `GameHeader` but doesn't pass `onOpenProfile` — so `AuthButton`'s click handler runs but has nothing to call, and the panel is never mounted on that route.

The account button only works on the in-game screen (where `TriviaGame`'s main return does wire everything up). Since users typically log in from the Start screen, they see "nothing happens" regardless of provider (Google, Apple, or email — the bug is not auth-specific).

## Fix

Make the profile panel available on every screen that shows the header:

1. **`src/components/StartScreen.tsx`**
   - Add `onOpenProfile?: () => void` to `StartScreenProps`.
   - Pass it through to the inner `<GameHeader onOpenProfile={onOpenProfile} … />`.

2. **`src/components/TriviaGame.tsx`**
   - In the `gameState === "start"` branch, pass `onOpenProfile={() => setProfileOpen(true)}` into `<StartScreen>` and also render `<ProfilePanel open={profileOpen} onClose={() => setProfileOpen(false)} user={currentUser} />` inside that fragment (next to `AboutScreen` / `HowToPlayScreen`).
   - Leave the in-game render path (already correct) unchanged.

3. **Loading screen (`gameState === "loading"`, lines 573–624 of `TriviaGame.tsx`)** — this branch renders a bespoke header without `GameHeader`, so no change needed (the panel isn't reachable there anyway and only lasts a moment).

## Why this scope

The fix is a category fix (panel wasn't wired on the Start branch, so any auth method looks broken); no changes to `AuthButton`, `ProfilePanel`, auth flow, or database. The Result screen already renders inside the main `TriviaGame` return, so it inherits the working wiring automatically.

## Verification

Reload preview, land on Start screen while signed in, click the account button → profile panel slides in. Repeat after starting a game and after finishing (Result screen) to confirm it still works there.
