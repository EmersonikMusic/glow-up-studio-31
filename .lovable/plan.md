## Goal
Bring the Sign in with Apple button into full compliance with Apple's web guidance (the page you linked). That page documents Apple's SDK-rendered button (`<div id="appleid-signin">` styled via `data-*` attributes) — not custom HTML. Our current button is hand-built, so switching to the SDK-rendered variant matches the on-brand reference and Apple's rules automatically (logo size, font, kerning, localization).

## Changes in `src/components/AuthModal.tsx`

1. Remove the custom `<button>` + `<img>` + `<span>` block for Apple.
2. Render Apple's official element instead:
   ```tsx
   <div
     id="appleid-signin"
     className="mx-auto cursor-pointer"
     style={{ width: 180, height: 40 }}
     data-color="black"
     data-border="false"
     data-type="sign-in"
     data-mode="center-align"
     data-border-radius="20"   // pill, matches Google button
     onClick={handleAppleClick}
   />
   ```
   - `data-border-radius="20"` on a 40px-high button yields a full pill matching the Google pill.
   - `data-color="black"` + `data-border="false"` = solid black, no outline.
   - Width 180 / height 40 stays inside Apple's allowed ranges (130–375 / 30–64) and keeps parity with the Google button.
3. After `AppleID.auth.init(...)` runs in the existing `useEffect`, call `window.AppleID.auth.renderButton?.()` so the SDK paints the button into `#appleid-signin`. Keep the click-swallow behavior (`handleAppleClick`) until `VITE_APPLE_SERVICES_ID` is set — the SDK still renders the visual even with a placeholder client ID.
4. Keep `SOCIAL_BTN_WIDTH` / `SOCIAL_BTN_HEIGHT` for the Google button; the Apple sizing now lives on the `#appleid-signin` div directly.
5. Remove the now-unused `appleLogoWhite` import and the local `appleContainerRef` (SDK targets the element by id).

## Notes
- No changes needed to `index.html`; Apple's `appleid.auth.js` script is already loaded.
- Google button is unaffected.
- Layout (side-by-side on ≥sm, stacked on mobile) is unchanged.

## Verification
Playwright screenshots at 1280×900 and 390×850 with the modal open, confirming the SDK-rendered Apple pill matches the Google pill in height and radius and shows the correct Apple logo + "Sign in with Apple" label.
