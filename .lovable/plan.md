# Migrate conversion tracking from gtag.js to Google Tag Manager

## Goal

Move all Google Ads conversion tracking out of the app code and into a GTM container. The app stops knowing about Ads labels entirely — it emits clean semantic events (`game_complete`, `sign_up`, `game_start`, click events) to the data layer, and GTM translates those into Ads conversions. Only `Xo0pCKn31-IcEJr9_sFE` fires on game completion. The two extra labels (`y8ggCNWF6…`, `eqgwCJvR7…`) are dropped entirely.

## Prerequisite (user action, outside code)

1. Create a GTM container at tagmanager.google.com for triviolivia.com.
2. Share the container ID (format `GTM-XXXXXXX`) — the code uses it in `index.html`.
3. After the code changes are deployed, configure these tags in the GTM dashboard (detailed in "GTM configuration" below).

## Code changes

### 1. `index.html` — replace gtag.js with GTM container

Remove lines 32–56 (the gtag.js script, both `gtag('config', ...)` calls, and the `gtag_report_conversion` function).

Replace with the standard GTM container snippet in `<head>`:
```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
<!-- End Google Tag Manager -->
```
And the GTM `<noscript>` iframe in `<body>` (right after the opening `<body>` tag, before `#root`):
```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

`GTM-XXXXXXX` is a placeholder — replaced with the real container ID once the user provides it.

### 2. `src/lib/analytics.ts` — emit events to dataLayer instead of gtag

`trackEvent` currently calls `gtag("event", name, params)`. With GTM there is no global `gtag` function. Change it to push in GTM's native format:

```ts
export function trackEvent(name: string, params?: GtagParams): void {
  if (typeof window !== "undefined") {
    console.log(`[GA4] ${name}`, params ?? {});
    window.dataLayer = window.dataLayer || [];
    try {
      window.dataLayer.push({ event: name, ...(params ?? {}) });
    } catch {
      // swallow — analytics must never break the app
    }
  }
}
```

Remove `getGtag()` — no longer needed. Everything else in the file (`trackClick`, `trackGameStart`, `trackGameComplete`) stays unchanged; they all go through `trackEvent`.

### 3. `src/lib/conversion.ts` — keep sign-up dedupe logic, drop everything else

The sign-up conversion has app-level logic (sessionStorage dedupe + 5-minute account-age check) that GTM cannot replicate. Keep that logic, but change the final action from calling `window.gtag_report_conversion()` to pushing a `sign_up` dataLayer event:

```ts
export function fireSignUpConversionForUser(user: User): void {
  if (typeof window === "undefined") return;

  const already = sessionStorage.getItem(FIRED_KEY);
  if (already === user.id) return;

  const created = user.created_at ? Date.parse(user.created_at) : NaN;
  if (!Number.isFinite(created)) return;
  const ageMs = Date.now() - created;
  if (ageMs < 0 || ageMs > NEW_ACCOUNT_WINDOW_MS) return;

  sessionStorage.setItem(FIRED_KEY, user.id);
  window.dataLayer = window.dataLayer || [];
  try {
    window.dataLayer.push({ event: "sign_up", user_id: user.id });
  } catch {
    // swallow
  }
}
```

Delete `fireQuizConversion`, `fireSearchGameConversion`, and `fireGameStartConversion` entirely. No Ads labels remain in the codebase.

### 4. `src/components/TriviaGame.tsx` — remove conversion calls

In the `isLastNow` branch of `advanceOrFinish` (lines 294–296), remove all three `fire*Conversion()` calls. Keep `trackGameComplete({...})` — it already pushes the `game_complete` event that GTM triggers on. Change the import line (26) to drop all three conversion imports.

### 5. `src/components/AuthModal.tsx` and `src/components/AuthButton.tsx`

No logic changes — `fireSignUpConversionForUser` is still called from the same places (email sign-up in AuthModal, OAuth SIGNED_IN in AuthButton). The import stays; the function just pushes a dataLayer event instead of calling `gtag_report_conversion`.

### 6. `src/types/gtag.d.ts` — update type declarations

Remove `gtag` and `gtag_report_conversion` from the `Window` interface (no longer defined). Keep `dataLayer`:

```ts
export {};

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}
```

## GTM configuration (user sets up in GTM dashboard)

After the code is deployed, create these in the GTM container:

| Tag | Type | Settings | Trigger |
|---|---|---|---|
| GA4 Measurement | Google Analytics: GA4 Configuration | Measurement ID `G-7T5D6V0V38` | Initialization – All Pages |
| Quiz Completion Conversion | Google Ads Conversion Tracking | Conversion ID `AW-18392006298`, Label `Xo0pCKn31-IcEJr9_sFE`, Value `1.0`, Currency `CAD` | Custom Event – `game_complete` |
| Sign-up Conversion | Google Ads Conversion Tracking | Conversion ID `AW-18392006298`, Label `2HaOCLCCq-IcEJr9_sFE`, Value `1.0`, Currency `CAD` | Custom Event – `sign_up` |

Do NOT create a conversion tag for `game_start` — that event is for GA4 funnel measurement only, and creating a conversion on it is what caused the false "conversion on start" reports.

The two dropped labels (`y8ggCNWF6…` "Search Game Completions" and `eqgwCJvR7…` "Other") are intentionally not recreated in GTM.

## What this changes

- **Code**: zero Ads labels or `gtag('event', 'conversion', ...)` calls remain. The app emits pure semantic events.
- **GTM**: all conversion definitions, values, and triggers live in one dashboard — editable without a code deploy.
- **Game completion**: only `Xo0pCKn31-IcEJr9_sFE` fires (via the `game_complete` trigger).
- **Sign-up**: `2HaOCLCCq-IcEJr9_sFE` fires (via the `sign_up` trigger), preserving the dedupe + account-age logic.
- **Game start**: `game_start` reaches GA4 for funnel analytics but creates no Ads conversion.
- **Click events**: all existing `trackClick` events continue to work through the same dataLayer push.

## Verification

- `tsgo` typecheck passes (no references to removed functions remain).
- Confirm no `gtag(` or `gtag_report_conversion` references remain anywhere in `src/` or `index.html`.
- Confirm `dataLayer` push format in GTM Preview mode: `game_complete` and `sign_up` events appear, and only the intended conversion tags fire.
