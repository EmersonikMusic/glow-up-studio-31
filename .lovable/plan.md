# Remove voice-over functionality

Strip out all read-aloud / speech-synthesis code and its UI control. No other behavior, design, or copy changes.

## Files to delete
- `src/lib/speech.ts`
- `src/hooks/useReadAloud.ts`
- `src/components/ReadAloudToggle.tsx`

## Files to edit

**`src/components/GameHeader.tsx`**
- Remove `import ReadAloudToggle from "./ReadAloudToggle";`
- Remove the `<ReadAloudToggle />` element (and its surrounding comment) from the header controls.

**`src/components/TriviaGame.tsx`**
- Remove `import { useReadAloud } from "@/hooks/useReadAloud";`
- Remove the `const { speak: speakAloud, cancel: cancelSpeech } = useReadAloud();` line.
- Remove the three speech-related `useEffect`s:
  - "Read question aloud when a new question card appears"
  - "Read correct answer aloud when it's revealed"
  - "Cancel any in-flight speech when leaving active gameplay"
  - "Cancel speech on unmount"

## Out of scope
No design, layout, copy, analytics, or other functional changes. Sound effects (`useSound`) are untouched — only voice-over / TTS is removed.
