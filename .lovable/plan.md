## Goal
Add a toggleable "Read aloud" button (next to the existing sound toggle in the header) that uses the browser's built-in Web Speech API to speak each question when it appears and each answer when it's revealed. Zero network cost, zero new dependencies, no impact on app performance.

## What the user gets
- A new circular icon button in the header, immediately to the right of the sound toggle, styled identically (same size, glass background, gold icon).
- Icon swaps between a "speaker-with-waves" (on) and "speaker-muted" (off) — I'll use lucide-react's `MessageCircle` / `MessageCircleOff` or `Megaphone` / `MegaphoneOff` for clear differentiation from the existing sound toggle (which uses `Volume2` / `VolumeX`).
- Preference persists across sessions in `localStorage` (default: OFF, same pattern as sound).
- When ON:
  - Question text is spoken the moment the card animates in.
  - Correct answer is spoken the moment it's revealed.
  - If the user advances early, the previous utterance is cancelled cleanly.
  - If they toggle OFF mid-speech, current speech stops immediately.
- When OFF: silent, no API calls, no penalty.
- Gracefully no-ops on browsers without `speechSynthesis` (very rare — old in-app webviews); button hides itself in that case.

## Files

**New: `src/lib/speech.ts`**
Thin wrapper around `window.speechSynthesis`:
- `isSpeechSupported()` — feature detect.
- `isReadAloudEnabled()` / `setReadAloudEnabled(b)` — persisted to `localStorage` key `to.readaloud.enabled` using existing `safeStorageGet`/`safeStorageSet`.
- `READ_ALOUD_EVENT` — custom event so React subscribers stay in sync (mirrors `MUTE_EVENT` pattern in `sound.ts`).
- `speak(text)` — cancels any in-flight utterance, then queues a new `SpeechSynthesisUtterance` with sensible defaults (rate 1.0, pitch 1.0, volume 1.0, language `en-US`).
- `cancelSpeech()` — calls `speechSynthesis.cancel()`.
- All calls are no-ops when disabled or unsupported.

**New: `src/hooks/useReadAloud.ts`**
React wrapper mirroring `useSound.ts`:
- Returns `{ enabled, toggle, setEnabled, speak, cancel, supported }`.
- Subscribes to `READ_ALOUD_EVENT` + cross-tab `storage` events so state stays in sync if toggled from anywhere.

**New: `src/components/ReadAloudToggle.tsx`**
Header button matching `SoundToggle.tsx` exactly (same classNames, same glass styling, same gold icon color, same active-scale). Hidden via `if (!supported) return null`. `aria-label` flips between "Enable read aloud" / "Disable read aloud".

**Edited: `src/components/GameHeader.tsx`**
Render `<ReadAloudToggle />` immediately after `<SoundToggle />` (one line added).

**Edited: `src/components/TriviaGame.tsx`**
- Import `useReadAloud`.
- Add an effect: when `gameState === "playing"` and `currentQuestion` changes (keyed off `animKey`), call `speak(currentQuestion.text)`.
- Add an effect: when `gameState === "answered"` and a correct answer exists, call `speak(currentQuestion.answer)`.
- On unmount and on `gameState` leaving playing/answered (restart, finish, settings panel open), call `cancel()` so nothing carries over.
- The existing "Tick" sound for the last 3s is unaffected — it's a separate audio layer.

## Technical notes (for reference)
- Web Speech API is shipped in all modern browsers (Chrome, Edge, Safari, Firefox, iOS Safari, Android Chrome). Voice quality varies but it's free and instant.
- `speechSynthesis.speak()` does NOT require a user gesture on desktop. On iOS it requires one user gesture to "unlock" — the toggle button click itself satisfies that, so the very first question after enabling will speak correctly.
- We deliberately cancel before each new `speak()` to avoid the OS queue piling up if the user races through questions.
- No new packages. No edge functions. No backend.

## Out of scope (deliberately)
- Voice/rate/language picker — can be added later in Settings if you want.
- ElevenLabs premium voice — keeping the door open but not building it now.
- Reading anything else (start screen, result screen, footer) — only the question and the revealed answer, per your request.

## Validation
1. Click new toggle in header → icon flips, no console errors.
2. Start a game with toggle ON → first question is spoken as it appears.
3. Wait for reveal → correct answer is spoken.
4. Toggle OFF mid-game → current speech stops, subsequent questions silent.
5. Toggle ON again → next question speaks normally.
6. Restart / finish a game → no residual speech.
7. Verify on mobile Safari (iOS) that the first toggle-click unlock works.
