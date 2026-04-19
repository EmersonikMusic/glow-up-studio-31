
## Plan: Replace local questions with Triviolivia API

### Pending info from you (needed before implementation)
1. **ID mappings** — integer IDs for each of: 25 categories, 5 difficulties, 12 eras. Drop them in chat as 3 lists (e.g. `History=6, Science=19, …`).
2. **API response sample** — one real JSON payload from `https://www.triviolivia.com/api/questions?questions=2` so I can write an accurate transformer to our `Question` type (fields: `id, text, answers[{id,text}], correctId, category, difficulty, era, author`).

I'll start coding once those land. The plan below is wired to drop them straight in.

---

### 1. New file: `src/lib/triviaApi.ts`
Single source of truth for the API + ID maps + transformer.

- `CATEGORY_IDS`, `DIFFICULTY_IDS`, `ERA_IDS` — `Record<string, number>` populated from your mappings.
- `fetchAndStartGame(settings)` — builds URL with `URLSearchParams`:
  - Always `questions=<numQuestions>`.
  - Appends `category=`, `difficulty=`, `era=` only when the corresponding selection is **non-empty AND not "all selected"** (so "all selected" sends nothing → backend returns from full pool, matching default behavior).
  - Maps selected name strings → integer IDs via the dictionaries.
  - 20s timeout via `Promise.race` against `AbortController`.
  - Throws on `!response.ok` or timeout.
  - Fisher-Yates shuffle on the returned array.
  - Runs each item through `adaptQuestion(raw)` → returns `Question[]`.
- `adaptQuestion(raw)` — written once you share the sample shape. Defensive about missing `author`, alternative answer formats, etc.

### 2. Update `src/components/TriviaGame.tsx`
- Remove `import { questions } from "@/data/questions"` and the initial `pickRandomQuestions(questions, …)` seed for `activeQuestions`. Initialize as `[]`.
- Remove the local `pickRandomQuestions` helper (filtering now happens server-side; shuffle happens in the API util).
- Add state: `loading: boolean`, drop start until questions arrive.
- Rewrite `handleStart`:
  ```ts
  setLoading(true);
  try {
    const data = await fetchAndStartGame(settings);
    if (!data.length) { toast.error("No questions matched your filters."); return; }
    setActiveQuestions(data);
    setQuestionIndex(0); setScore(0); setAnimKey(k=>k+1);
    setGameState("playing"); setPanelOpen(false); setPaused(false);
    startCountdown(settings.timePerQuestion);
  } catch (e) {
    toast.error("Couldn't load questions. Check your connection or try different settings.");
  } finally { setLoading(false); }
  ```
- Pass `loading` down to `StartScreen` so the Start button can show inline spinner state.

### 3. Update `src/components/StartScreen.tsx`
- Add `loading?: boolean` prop.
- When `loading`, the `.btn-gameshow` "Start Game" button:
  - `disabled` (already styled via `:disabled` opacity rule),
  - swaps label for a small `<Loader2 className="animate-spin" />` + "Loading…" so the chunky game-show shape is preserved.

### 4. Toast wiring
Use **sonner** (`import { toast } from "sonner"`) since `<Toaster />` is already mounted in `App.tsx` (verify during impl). One `toast.error(...)` on failure, one on empty result set.

### 5. Delete (or leave dormant)
- `src/data/questions.ts` — keep the file for type exports (`Question`, `Category`, `Difficulty`, `Era`, `Answer`) but drop the `questions` array export, OR move types to `src/types/question.ts` and delete the data file. **Decision: keep the file and remove only the array** — minimizes churn since `categoryColors`, `categoryMascots`, and components import the types from here.

### 6. CORS note
`https://www.triviolivia.com/api/questions` must allow the Lovable preview origin. If browser blocks the call, the toast will fire and we'll need a backend CORS update on your side (no code workaround in a static client app).

### Out of scope
- Caching / retry / fallback to local data (you chose "fully replace").
- Auth headers (none implied by the brief).
- Settings UI changes — names→IDs translation is hidden inside the API util; `GameSettings` type stays string-based.

### Files touched
- **New:** `src/lib/triviaApi.ts`
- **Edit:** `src/components/TriviaGame.tsx`, `src/components/StartScreen.tsx`
- **Edit (trim):** `src/data/questions.ts` (remove array, keep types)
