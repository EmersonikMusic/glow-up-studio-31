# Add Google Ads Conversion Tracking (AW-18392006298)

## Goal
Incorporate Google Ads conversion tracking into the existing gtag.js setup. No other changes.

## Current state
`index.html` already loads gtag.js and configures GA4:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-7T5D6V0V38"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-7T5D6V0V38');
</script>
```
The gtag.js library is shared — a single tag instance can send data to both GA4 and Google Ads by calling `gtag('config', ...)` with each measurement ID.

## Change
Add one line to the gtag config block in `index.html`:
```js
gtag('config', 'AW-18392006298');
```
Full block becomes:
```html
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-7T5D6V0V38');
  gtag('config', 'AW-18392006298');
</script>
```

This registers the Google Ads conversion-measurement ID alongside the existing GA4 config. Google Ads will now be able to attribute conversions (page views and any future labeled conversion events) to ad clicks that led to this site.

## Scope
- Edit `index.html` only.
- No new scripts, no other files, no UI changes.
- No conversion label/event added — only the ID was provided. Specific conversion events (e.g., firing on game_complete) can be added later once a conversion label is supplied from the Google Ads UI.
