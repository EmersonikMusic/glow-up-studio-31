# Three small adjustments

## 1. Equal-width Quick Play + Customize Game buttons
Both buttons currently size to their text content (Quick Play is narrower than Customize Game).

**Change:** in `src/components/StartScreen.tsx`, add `min-w-[260px]` to both the `PrimaryCTA` and `SecondaryCTA` className. This matches the wider button (Customize Game) without changing font size or vertical padding.

## 2. Settings menu closed on initial load
In `src/components/TriviaGame.tsx` line 100:

```ts
const [panelOpen, setPanelOpen] = useState(() => !matchesMedia("(max-width: 767px)", false));
```

Currently desktop opens the panel by default. Change to:

```ts
const [panelOpen, setPanelOpen] = useState(false);
```

So both mobile and desktop start with settings closed; "Customize Game" button toggles it open.

## 3. Fix question-text pop-in animation
Right now `animate-question-pop` is applied to the outer card container in `QuestionCard.tsx`, so the entire card pops. The card mounts once and stays, so subsequent questions don't visibly pop (the card never re-mounts despite `key={animKey}` — actually it does re-mount, but the pop covers the full card not the text). The user wants the question text itself to pop in (mirroring the answer's `animate-spring-rise`).

**Change in `src/components/QuestionCard.tsx`:**
- Remove `${entranceClass}` from the outer card `<div>` className.
- Add `animate-question-pop` className to both the mobile `<p>` (question text, line ~131) and the desktop `<p>` (line ~178) that render `{question.text}`.
- Use `key={animKey}` on each question `<p>` so the animation re-fires every new question.

This makes the question text pop in on every reveal, matching the answer reveal feel.

## Verification
After build:
- Visually confirm both CTAs match width on the start screen.
- Confirm settings drawer is closed on load and opens via Customize Game.
- Confirm question text pops in on game start and on each new question.
