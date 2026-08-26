# Track engagement events via a single `user_engagement_action` dataLayer push

## Goal

Send 11 specific interactions to GA4 as **engagement events only** — never
conversions — using one consistent dataLayer shape so a single GTM tag handles
all of them:

```js
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'user_engagement_action',
  action_name: 'click_skip_question'
});
```

## Scope note

The Google Ads conversion behaviour stays exactly as-is: one conversion on
`game_start`, another on `game_complete`. This plan does not touch the
conversion tags, their triggers, or the `game_start` / `game_complete` events.

## The 11 tracked actions

```text
cta_primary_settings_apply       click_about
click_how_to_play                click_settings
cta_primary_result_play_again    cta_secondary__customize_game
click_skip_question              click_back_question
click_review_game                click_pause
click_resume
```

`click_pause` and `click_resume` already have `trackClick` calls in
`src/components/GameFooter.tsx` (line 138) but are currently dropped by the
allowlist — adding them to the list is all that is needed.

## Decision to confirm: five events drop off the list

The current allowlist contains five password-reset events that are **not** in
your list. Following your list exactly means they stop being sent to GA4:

```text
click_forgot_password      click_send_reset_link
click_resend_reset_link    password_reset_success
click_continue_after_reset
```

The plan implements your list as written (these five stop tracking). Say the
word if you want them kept and they will be added back to the set.

All other `trackClick` call sites in the app (auth, profile, settings sections,
about/privacy close, etc.) remain untracked, as they are today.

## Code changes

### `src/lib/analytics.ts`

1. Replace the contents of `ALLOWED_CLICK_EVENTS` with exactly the 11 names
   above, and rename it `ENGAGEMENT_ACTIONS` to reflect its new purpose.
2. Change `trackClick` so allowlisted events push the shared engagement shape
   instead of pushing the raw event name:

```ts
export function trackClick(eventName: string, params?: GtagParams): void {
  if (!ENGAGEMENT_ACTIONS.has(eventName)) return;
  trackEvent("user_engagement_action", { action_name: eventName, ...params });
}
```

`trackEvent` already performs `window.dataLayer = window.dataLayer || []`, the
`dataLayer.push({ event, ...params })`, the `[GA4]` console log, and the
try/catch guard — so the emitted object is exactly
`{ event: 'user_engagement_action', action_name: '<name>' }`.

No call sites change: every component keeps calling
`trackClick("click_pause")` and the shared shape is applied centrally.

### `src/components/PrimaryCTA.tsx` and `src/components/SecondaryCTA.tsx`

These derive their id from `trackId` → `aria-label` → raw button text, so raw
text can produce names like `cta_primary_START GAME` that never match the
allowlist. Lowercase the derived id and collapse non-alphanumeric runs to
underscores, so `cta_primary_settings_apply` and
`cta_primary_result_play_again` match reliably regardless of button casing.

### Unchanged

`trackGameStart`, `trackGameComplete`, `beginRound`, the round dedupe logic, and
`src/lib/conversion.ts` are all untouched.

## GTM configuration (single shared tag)

In container `GTM-N8WKMK2M`:

1. **Variable** — Data Layer Variable, name `DLV - action_name`, data layer
   variable name `action_name`.
2. **Trigger** — Custom Event, event name `user_engagement_action`. One trigger
   covers all 11 actions.
3. **Tag** — Google Analytics: GA4 Event
   - Measurement ID `G-7T5D6V0V38`
   - Event Name: `user_engagement_action`
   - Event Parameter: `action_name` = `{{DLV - action_name}}`
   - Trigger: the custom event trigger above
4. Publish.

**Keeping them non-conversions:** in GA4, an event only becomes a conversion if
you explicitly toggle it on under Admin → Events → "Mark as key event". Leave
`user_engagement_action` toggled **off**. Because all 11 actions share one GA4
event name, there is a single toggle to keep off — they cannot accidentally
become conversions individually.

To break the actions out in reports, register `action_name` as a custom
dimension (Admin → Custom definitions → Create custom dimension, event-scoped,
parameter `action_name`).

## Verification

- Click each of the 11 controls and confirm the console shows
  `[GA4] user_engagement_action { action_name: '<name>' }`.
- Confirm the dataLayer object is exactly
  `{ event: 'user_engagement_action', action_name: '<name>' }`.
- Confirm non-listed clicks (e.g. `profile_open`) still push nothing.
- Confirm in GTM Preview that one GA4 tag fires per action.
- Confirm conversions still fire on start and on complete, unchanged.
- `tsgo` typecheck passes.
