

## Plan: Wire up final 5 mascots and ship dynamic mapping

### Uploads received (this batch)
`sports.svg`, `technology.svg`, `television.svg`, `theology.svg`, `video-games.svg`.

Combined with the prior two batches, **all 25 of 25** category SVGs are now in hand. No category is missing.

### Coverage check (Category → file)

| Category | File | Category | File |
|---|---|---|---|
| Art | art.svg ✓ | Movies | movies.svg ✓ |
| Economy | economy.svg ✓ | Music | music.svg ✓ |
| Food & Drink | food-and-drink.svg ✓ | Nature | nature.svg ✓ |
| Games | games.svg ✓ | Performing Arts | performing-arts.svg ✓ |
| Geography | geography.svg ✓ | Philosophy | philosophy.svg ✓ |
| History | history.svg ✓ | Politics | politics.svg ✓ |
| Human Body | human-body.svg ✓ | Pop Culture | pop-culture.svg ✓ |
| Language | language.svg ✓ | Science | science.svg ✓ |
| Law | law.svg ✓ | Sports | sports.svg ✓ |
| Literature | literature.svg ✓ | Technology | technology.svg ✓ |
| Math | math.svg ✓ | Television | television.svg ✓ |
| Miscellaneous | miscellaneous.svg ✓ | Theology | theology.svg ✓ |
| Video Games | video-games.svg ✓ | | |

All 25 covered.

### What I'll do

**1. Copy all 25 uploaded SVGs into `src/assets/mascots/`**
Filenames preserved exactly as listed above.

**2. Rewrite `src/data/categoryMascots.ts`**
- Use `import.meta.glob('../assets/mascots/*.svg', { eager: true, import: 'default' })` to bundle every SVG synchronously.
- `categoryToFilename()` helper: lowercase the category, replace ` & ` with `-and-`, then remaining spaces with `-` (e.g. `"Pop Culture"` → `"pop-culture"`, `"Food & Drink"` → `"food-and-drink"`, `"Video Games"` → `"video-games"`).
- `getMascotForCategory(category)` returns the matched glob entry, or falls back to the existing default `Mascot.svg` (defensive guard for any future category).

**3. Update `src/components/TriviaGame.tsx` mobile mascot**
- Swap the hardcoded `mascotImg` for `getMascotForCategory(currentQuestion.category)`.
- Add `transition-opacity duration-300` to the mobile `<img>` so it fades like the desktop one when the gradient swaps.

Desktop mascot already calls `getMascotForCategory` — picks up new mappings automatically.

### Default-mascot guarantee (unchanged)
- Start / Settings / About / How-to-Play / Result screens render outside the gameplay branch and continue to show the default `Mascot.svg`.
- During gameplay the mascot only changes when `currentQuestion.category` changes — same key as the background gradient, so they swap in sync.

### Files touched
- `src/assets/mascots/*.svg` — 25 new files (full set).
- `src/data/categoryMascots.ts` — real glob-based map + filename helper.
- `src/components/TriviaGame.tsx` — mobile mascot uses `getMascotForCategory` + fade transition.

### Out of scope
No changes to gradients, layout, sizes, animations, timers, header/footer, or game logic.

### Verification
1. Start screen: default `Mascot.svg` visible (mobile + desktop).
2. Begin a game: each question's mascot matches its category on both mobile and desktop, fading in alongside the gradient.
3. Cycle through every category at least once — confirm all 25 mascots render with no broken images and no console warnings.
4. Existing `npm run test` and `npm run test:e2e` still pass (no selectors, heights, or timers affected).

### Missing images
None. All 25 categories are covered.

