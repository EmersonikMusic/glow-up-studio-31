# Add Google Ads Conversion Tracking (AW-18392006298)

## Goal
Incorporate Google Ads conversion tracking. Fire the sign-up/account-creation conversion using label `2HaOCLCCq-IcEJr9_sFE`. No other changes.

## Change 1 — Register the conversion ID (index.html)
The site already loads gtag.js and configures GA4 (`G-7T5D6V0V38`). Add one line so the same tag instance also sends to Google Ads:

```js
gtag('config', 'AW-18392006298');
```

Full block in `index.html`:
```html
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-7T5D6V0V38');
  gtag('config', 'AW-18392006298');
</script>
```

## Change 2 — Fire the conversion on account creation (AuthModal.tsx)
On successful email sign-up (the `toast.success("Account created! ...")` branch, ~line 189), fire the conversion event before closing the modal:

```js
gtag('event', 'conversion', {
  send_to: 'AW-18392006298/2HaOCLCCq-IcEJr9_sFE',
  value: 1.0,
  currency: 'CAD',
});
```

This uses the existing global `gtag` (already typed via `src/types/gtag.d.ts`), so no new import is needed.

## Scope & limitations
- Edits only `index.html` and `src/components/AuthModal.tsx`.
- Fires only for email sign-up — the clear "account created" success point.
- Social (Google/Apple) sign-ups redirect away to the provider and return with a session; there is no distinct "created vs signed in" signal client-side, so they are not captured by this single snippet. If you want those tracked, you'd need a server-side check or a separate conversion label.
- Game starts, kids mode, and replays are intentionally skipped until their conversion labels are provided.
