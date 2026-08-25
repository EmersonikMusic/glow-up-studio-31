# Google Ads conversion fires on game_start, not game_complete

## Root cause (verified live)

A deep live-site trace against `www.triviolivia.com` confirms the bug. On the
wall clock, in order:

1. The `game_start` dataLayer event is pushed (the only custom event in the run).
2. The Google Ads conversion pixel immediately fires:
   - `https://www.googleadservices.com/pagead/conversion/18392006298/?...&en=conversion...`
   - `https://googleads.g.doubleclick.net/pagead/viewthroughconversion/18392006298/?...&en=conversion...`

No `game_complete` event was ever pushed during that run (the game did not
finish), yet the conversion fired. The conversion is gated on **game_start**,
not on game completion.

This is the source of the symptom you reported — "conversion firing when game
start happens" and the mismatch between GA4 plays and recorded completions.
Every started game registers a Google Ads conversion, including abandoned ones.

## Why the app code is NOT the cause

`src/lib/analytics.ts` and `src/lib/conversion.ts` are correct and unchanged:

- `trackGameStart` pushes only the `game_start` event (GA4 funnel metric, no
  conversion label in code).
- `trackGameComplete` pushes `game_complete` exactly once per completed round,
  behind a sessionStorage dedupe guard. No `game_complete` was emitted during the
  trace because the game never finished — yet the conversion still fired.
- The codebase contains zero Ads labels. All conversion definitions live in GTM.

So the misfire is entirely a GTM trigger configuration: the Google Ads
Conversion Tracking tag is firing on the `game_start` custom event (or a
pageview/consent trigger that happens to coincide with start) instead of the
`game_complete` custom event.

## The fix (GTM dashboard — no code change)

In your GTM container `GTM-N8WKMK2M`:

1. Open **Triggers**. Find the trigger attached to the Google Ads Conversion
   Tracking tag for conversion ID `AW-18392006298` / label
   `Xo0pCKn31-IcEJr9_sFE`.
2. Confirm what it currently fires on. It is expected to be set to a Custom
   Event named `game_start` (the bug) rather than `game_complete`.
3. Change that trigger's Custom Event name from `game_start` to
   `game_complete` (use "Equals to" matching, Custom Event type).
4. Delete or disable any other trigger on the same tag that could cause an
   early fire (e.g. a Page View / DOM Ready / All Pages trigger).
5. Preview in GTM (Preview mode): start a game and verify NO conversion fires at
   start. Then complete a full round and verify the conversion fires exactly
   once, only when the `game_complete` dataLayer event pushes.
6. Publish the container.

After publishing, re-run this trace: start a game and confirm zero
`en=conversion` requests until the round is fully completed.

## Why no code change is proposed

The app already emits exactly the right semantic events (`game_start` for the
funnel, `game_complete` for conversions). Moving any conversion logic back into
the code would undo the GTM migration. The single defect is the GTM trigger's
event name, which only you can edit in the GTM dashboard.

## Verification (after the GTM fix)

- Live trace: a started-but-uncompleted game fires zero conversion pixels.
- Live trace: a fully completed game fires the conversion pixel exactly once,
  coincident with the `game_complete` dataLayer push.
- GA4 still receives `game_start` for funnel measurement; only `game_complete`
  produces an Ads conversion.
