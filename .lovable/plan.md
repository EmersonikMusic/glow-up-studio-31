# Add gtag_report_conversion Function

## Goal
Add the Google Ads `gtag_report_conversion(url)` helper function so conversion tracking uses the standard event_callback pattern (ensures the conversion pixel fires before any navigation). Only the sign-up conversion is affected; nothing else changes.

## Change 1 — Add the function to index.html
Add `gtag_report_conversion` inside the existing gtag script block in `index.html` (after the two `gtag('config', ...)` lines). This makes it a global function:

```js
function gtag_report_conversion(url) {
  var callback = function () {
    if (typeof(url) != 'undefined') {
      window.location = url;
    }
  };
  gtag('event', 'conversion', {
    send_to: 'AW-18392006298/2HaOCLCCq-IcEJr9_sFE',
    value: 1.0,
    currency: 'CAD',
    event_callback: callback
  });
  return false;
}
```

## Change 2 — Add type declaration (gtag.d.ts)
Add `gtag_report_conversion` to the global `Window` interface in `src/types/gtag.d.ts` so TypeScript recognizes it:

```ts
gtag_report_conversion?: (url?: string) => boolean;
```

## Change 3 — Use the function in AuthModal.tsx
Replace the direct `window.gtag("event", "conversion", {...})` call (lines 190-196) with a call to `window.gtag_report_conversion()`. No `url` argument is passed since sign-up doesn't navigate away — the modal just closes and shows a toast. The `event_callback` no-ops safely when `url` is undefined.

```ts
if (typeof window !== "undefined" && typeof window.gtag_report_conversion === "function") {
  window.gtag_report_conversion();
}
```

## Scope & limitations
- Edits only `index.html`, `src/types/gtag.d.ts`, and `src/components/AuthModal.tsx`.
- Only the sign-up conversion (`2HaOCLCCq-IcEJr9_sFE`) is tracked, as already established.
- No other events, no other files.
