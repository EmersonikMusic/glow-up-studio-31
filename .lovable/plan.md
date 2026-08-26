# Fix click-event tracking: remove the allowlist that drops most events

## Scope note

The Google Ads conversion behaviour is **intentional and stays as-is**: one
conversion fires on `game_start` and another on `game_complete`. Nothing in this
plan changes the conversion tags, their triggers, or the `game_start` /
`game_complete` events. This plan is only about the click events that are being
silently dropped.

## What the live traces proved

Three traces against `www.triviolivia.com`:

1. **`game_start` fires only on click**, never on page load. It is called in
   `src/components/TriviaGame.tsx` (line 528) inside `runFetchAndStart`, after
   questions load and `setGameState("playing")` — the shared chokepoint for
   Quick Play, Custom, and Kids Mode. Correct as-is.
2. **`game_complete` fires reliably** on a played-to-the-end round. Correct as-is.
3. **Click events are being dropped by the app.** Clicking **Skip** pushed
   `click_skip_question` (it is allowlisted), but clicking **Pause** pushed
   nothing at all (it is not).

## Root cause

`src/lib/analytics.ts` defines `ALLOWED_CLICK_EVENTS`, a hardcoded 14-name set.
`trackClick` returns early and discards any event not in it. The app has ~34
`trackClick` call sites, so roughly 20 are thrown away before reaching the
dataLayer.

Currently allowed (14):

```text
cta_primary_settings_apply      click_about
click_how_to_play               click_settings
cta_primary_result_play_again   cta_secondary__customize_game
click_skip_question             click_back_question
click_review_game               click_forgot_password
click_send_reset_link           click_resend_reset_link
password_reset_success          click_continue_after_reset
```

Currently dropped (~20):

```text
click_pause                click_resume
click_sign_in_google       click_sign_in_apple
click_sign_up_email        click_sign_in_email
click_open_auth_modal      click_privacy_policy
click_terms_home           click_review_play_again
submit_question_ratings    about_close
how_to_play_close          privacy_close
profile_open               profile_back
profile_sign_out           profile_username_save
profile_delete_account     settings_back
settings_section_*_open / _close
plus dynamic cta_primary_* / cta_secondary__* names
```

## Two layers, two fixes

The app is the **sender**; GTM is the **router**. An event must clear both.

```text
app trackClick() --[allowlist]--> dataLayer --[GTM tag+trigger]--> GA4
        ^ fix #1 (code)                          ^ fix #2 (GTM)
```

This explains why `click_skip_question` is missing from your reports even though
it clears the allowlist: it reaches the dataLayer, but GTM has no tag to forward
it to GA4.

## Fix #1 — code: stop dropping events

In `src/lib/analytics.ts`:

- Delete the `ALLOWED_CLICK_EVENTS` set.
- Reduce `trackClick` to a thin pass-through to `trackEvent`, keeping the
  existing `[GA4]` console logging and try/catch guard.

GTM already decides which events matter via its own triggers, so a second
hardcoded filter in the app only causes silent data loss that needs a code
deploy to change. No call sites change.

In `src/components/PrimaryCTA.tsx` and `src/components/SecondaryCTA.tsx`:

- Normalize the derived event id. Both fall back to `trackId` → `aria-label` →
  raw button text, and raw text produces inconsistent names with spaces and
  capitals (e.g. `cta_primary_START GAME`). Lowercase the id and collapse
  non-alphanumeric runs to underscores, yielding stable names like
  `cta_primary_start_game`.

`trackGameStart`, `trackGameComplete`, `beginRound`, and the round dedupe logic
are untouched.

## Fix #2 — GTM: add a tag for the click events

In container `GTM-N8WKMK2M`, add **one** GA4 Event tag that forwards all click
events, rather than one tag per event:

- Tag type: Google Analytics: GA4 Event
- Measurement ID: `G-7T5D6V0V38`
- Event Name: the built-in `{{Event}}` variable (passes the name through)
- Trigger: Custom Event, **regex match**, pattern
  `^(click_|cta_|settings_|profile_|submit_|about_|privacy_|how_to_play_|password_)`

This covers every current and future click event with a single tag. Verify in
GTM Preview, then publish.

Do **not** touch the Google Ads conversion tags or their `game_start` /
`game_complete` triggers.

## Verification

- Click Pause, Resume, sign-in buttons, profile actions, and settings sections:
  each now appears in the dataLayer (after fix #1).
- Confirm in GTM Preview that those events reach GA4 (after fix #2).
- Confirm the conversion behaviour is unchanged: one conversion on start, one on
  complete.
- `tsgo` typecheck passes.
