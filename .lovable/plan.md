# Fix event tracking: allowlist drops most clicks; conversion fires on start

## What the live traces proved

Three traces against `www.triviolivia.com` settle all three of your points.

### 1. `game_start` is already correct — no code change needed

`game_start` fired **only** after clicking PLAY, never on page load. In the
trace, the page sat loaded for 2.5s with zero custom events; `game_start`
appeared only after the click. In `src/components/TriviaGame.tsx` it is called
at line 528 inside `runFetchAndStart`, after questions are fetched and
`setGameState("playing")` — i.e. only when gameplay actually begins. This path
is shared by Quick Play, Custom, and Kids Mode.

### 2. `game_complete` IS firing correctly — no code change needed

A full played-to-the-end round pushed:
`game_start → click_skip_question ×9 → game_complete`

So the app emits `game_complete` reliably on completion.

### 3. The conversion fires TWICE — at start AND at complete (GTM bug)

Counting Google Ads `en=conversion` pixels in the completed-game trace:
- **4 conversion pixels at game start**
- **8 conversion pixels total** by the end

The conversion tag is firing on `game_start` *in addition to* `game_complete`.
That is why your conversion numbers look inflated and untrustworthy.

### 4. Why "skip question etc." isn't tracking — the allowlist

`src/lib/analytics.ts` has `ALLOWED_CLICK_EVENTS`, a 14-name hardcoded set.
`trackClick` silently drops any event not in it. There are ~34 `trackClick`
call sites in the app, so most are discarded before ever reaching the dataLayer.

Proven live: clicking **Skip** pushed `click_skip_question` (it is on the list),
but clicking **Pause** pushed nothing at all (it is not).

Currently dropped events include:

```text
click_pause              click_resume
click_sign_in_google     click_sign_in_apple
click_sign_up_email      click_sign_in_email
click_open_auth_modal    click_privacy_policy
click_terms_home         click_review_play_again
submit_question_ratings  about_close
how_to_play_close        privacy_close
profile_open             profile_back
profile_sign_out         profile_username_save
profile_delete_account   settings_back
settings_section_*_open / _close
plus dynamic cta_primary_* / cta_secondary__* names
```

Note `click_skip_question` DOES reach the dataLayer. If it is missing from your
reports, that is the GTM side — see below.

## Two separate layers, two separate fixes

The app is the **sender**; GTM is the **router**. An event must clear both.

```text
app trackClick() --[allowlist]--> dataLayer --[GTM tag+trigger]--> GA4 / Ads
        ^ fix #1 (code)                          ^ fix #2 (GTM)
```

## Fix #1 — code: stop dropping events

In `src/lib/analytics.ts`, remove the `ALLOWED_CLICK_EVENTS` gate so every
`trackClick` call reaches the dataLayer. GTM already decides which events matter
via its own triggers, so a second hardcoded filter in the app only creates
silent data loss that requires a code deploy to change.

`trackClick` becomes a thin pass-through to `trackEvent`, keeping the existing
console `[GA4]` logging and the try/catch guard. No call sites change, and the
funnel events (`game_start`, `game_complete`) and their dedupe logic are
untouched.

Also normalize the auto-generated CTA names: `PrimaryCTA`/`SecondaryCTA` derive
an event name from `trackId`, then `aria-label`, then the raw button text. Raw
text can produce inconsistent names with spaces and capitals, so the derived id
will be lowercased with non-alphanumerics collapsed to underscores, giving
stable names like `cta_primary_start_game`.

## Fix #2 — GTM: fix the trigger and add the missing tags

In container `GTM-N8WKMK2M`:

1. **Stop the double conversion.** Open the Google Ads Conversion Tracking tag
   for `AW-18392006298` / label `Xo0pCKn31-IcEJr9_sFE`. Remove the trigger that
   fires it on `game_start` (and any All Pages / Page View trigger). Leave
   exactly one trigger: Custom Event, "Equals to", `game_complete`.
2. **Add a GA4 event tag for the click events.** GA4 will not report
   `click_skip_question` or any other custom event unless a tag sends it. The
   efficient approach is one GA4 Event tag with Event Name set to the built-in
   `{{Event}}` variable, fired by a Custom Event trigger using **regex match**
   on something like `^(click_|cta_|settings_|profile_|submit_)` — this covers
   every current and future click event with a single tag.
3. Verify in GTM Preview, then publish.

## Verification

- Start a game: `game_start` pushes and **zero** conversion pixels fire.
- Complete a game: `game_complete` pushes and the conversion pixel fires
  **exactly once**.
- Click Pause, Skip, Settings, and a CTA: each appears in the dataLayer (after
  fix #1) and in GTM Preview (after fix #2).
- `tsgo` typecheck passes.
