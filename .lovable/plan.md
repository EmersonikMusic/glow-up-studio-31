# Add console.log to each analytics event

Edit only `src/lib/analytics.ts`. Add one `console.log('<event_name>')` line inside each tracking helper. No payloads logged — just the event name string, per request.

## Changes

**`trackEvent`** — no log added (keeps it a pure passthrough).

**`trackClick(controlId)`** — add:
```ts
console.log(slug(controlId));
```
→ logs e.g. `header_about`, `header_settings_open`, `header_settings_close`, `header_home_logo`, `header_fullscreen_enter`, `header_fullscreen_exit`, `header_kbd_help_open`, `header_kbd_help_close`, `cta_primary__start_game`, `start_how_to_play`, `footer_pause`, `footer_resume`, `result_change_settings`, `cta_primary__play_again`.

**`trackToggle(controlId, value)`** — add:
```ts
console.log(slug(controlId));
```
→ logs `read_aloud`, `sound`.

**`trackSelect(group, option)`** — add:
```ts
console.log(`${slug(group)}__${slug(option)}`);
```
→ logs e.g. `categories__history`, `difficulties__hard`, `eras__1980s`.

**`trackGameStart`** — add:
```ts
console.log('game_start');
console.log('game_start_categories');
```

**`trackSettingsApplied`** — add:
```ts
console.log('settings_applied');
console.log('settings_applied_categories');
```

**`trackQuestionRevealed`** — add:
```ts
console.log('question_revealed');
```

**`trackGameComplete`** — add:
```ts
console.log('game_complete');
```

## Notes
- Logs fire regardless of whether GA4/gtag is loaded, so testing works locally.
- No other files modified.
