Two UI changes to temporarily disable login visibility:

1. In `src/components/GameHeader.tsx`, hide the `<AuthButton />` element so the Login button is not shown in the header until login is ready to launch.
2. In `src/components/AuthModal.tsx`, keep the Apple sign-in button hidden (gated on `APPLE_AUTH_READY`) and stop loading the Apple SDK while hidden; keep the Google button centered as the only social option for when login is re-enabled.