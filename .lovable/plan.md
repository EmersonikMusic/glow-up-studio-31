## Goal
Make the browser TTS speak in a female voice by default when "Read aloud" is enabled.

## Change
Edit only `src/lib/speech.ts`:

1. Add a module-level cached `selectedVoice: SpeechSynthesisVoice | null`.
2. Add `pickFemaleVoice()`:
   - Call `window.speechSynthesis.getVoices()`.
   - Filter to English voices (`lang` starts with `en`).
   - Prefer voices whose name matches (case-insensitive) common female voice names: `samantha`, `victoria`, `karen`, `tessa`, `moira`, `fiona`, `zira`, `hazel`, `catherine`, `linda`, `heather`, `susan`, `allison`, `ava`, `serena`, or contains `female` / `woman`.
   - Fallback order: any `en-US` voice → any `en` voice → null (browser default).
3. Voices load asynchronously in some browsers — add a one-time `voiceschanged` listener that refreshes the cached pick.
4. In `speak()`, assign `u.voice = selectedVoice` (and `u.lang = selectedVoice.lang || 'en-US'`) before calling `speechSynthesis.speak`.

## Out of scope
- No UI changes (no voice picker in Settings).
- No new files, no non-English voices, no ElevenLabs.

## Validation
Toggle read-aloud ON, start a game: question + revealed answer are spoken by a female voice on macOS/iOS (Samantha), Windows (Zira), Android Chrome (Google UK English Female). On a device with no female English voice, falls back silently to the default voice — no errors.
