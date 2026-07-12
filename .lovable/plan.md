## Findings from runtime check

- `#appleid-signin` mounts at 180×40 with correct `data-*` attrs, `window.AppleID` is loaded, no console errors — but the SDK never paints into the div (empty innerHTML, transparent bg, 0px radius). Apple's `appleid.auth.js` only scans for `#appleid-signin` once at script load; because the modal mounts later, the scan misses it, and `AppleID.auth.renderButton?.()` is a no-op on the shipped SDK build.
- The Google button also failed to render in the same screenshot — needs a look while we're in there.

## Fix plan

### 1. `src/components/AuthModal.tsx` — force Apple SDK re-scan when modal opens
Replace the current `AppleID.auth.renderButton?.()` call (which does nothing) with a reliable re-injection of Apple's script tag *after* the `#appleid-signin` div is in the DOM. Apple's SDK re-scans and paints the button on each fresh script load.

- After the modal opens and `#appleid-signin` is mounted:
  - Remove any prior `<script data-appleid-injected>` tag from `<head>`.
  - Append a fresh `<script src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js" data-appleid-injected>`.
  - On its `load`, call `AppleID.auth.init({...})` (unchanged args) — the SDK auto-renders the button during its scan.
- Keep the existing `handleAppleClick` (still swallows clicks while `VITE_APPLE_SERVICES_ID` is unset).
- Clean up the injected script on `useEffect` cleanup.

Remove the now-unused polling `tryInit` block; the load event is deterministic.

### 2. Google button render regression
Investigate in the same session:
- Confirm `googleBtnAsset.url` resolves at runtime (log the src, check network 200).
- If the asset URL is empty/broken, restore a working source (e.g., inline the pill SVG or reference `src/assets/google-signin-dark-pill.svg` directly).
Only patch this if the log confirms the asset is the cause; otherwise report back before touching styling.

### 3. Re-verify with Playwright
Same script as before at 1280×900:
- Assert `#appleid-signin` has non-empty innerHTML AND either an `<iframe>` or `<svg>` child.
- Assert Google button `<img>` has `naturalWidth > 0`.
- Screenshot the modal + each button element; view screenshots.

## Follow-up (not this turn)
Add `state` (CSRF) and `nonce` (replay) to `AppleID.auth.init` — Apple lists both as optional but recommended for production. Do this once a real `VITE_APPLE_SERVICES_ID` is provisioned so we can test the full popup flow end-to-end.
