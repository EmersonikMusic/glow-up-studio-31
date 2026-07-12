# Badge Tracking & Unlock System

## 1. Database — extend `profiles` (single migration)

| Column | Type | Default | Notes |
| --- | --- | --- | --- |
| `total_games_played` | int4 | 0 | Global counter (replaces `games_completed`) |
| `unlocked_badges` | text[] | `'{}'` | Earned badge names |
| `category_counts` | jsonb | `'{}'` | e.g. `{"Sports": 12}` |
| `era_counts` | jsonb | `'{}'` | e.g. `{"1980s": 3}` |
| `difficulty_counts` | jsonb | `'{}'` | Engine names: Casual/Easy/Average/Hard/Genius |
| `play_history` | timestamptz[] | `'{}'` | Rolling last-50 completion timestamps (Marathoner) |
| `min_timer_games` | int4 | 0 | Speed Demon |
| `quickplay_games` | int4 | 0 | Spontaneous (Quick Play CTA) |
| `custom_games` | int4 | 0 | The Architect |

Migration:
- Add `total_games_played`, copy from `games_completed`, then `DROP COLUMN games_completed`.
- Add remaining columns above.
- Existing RLS + GRANTs cover new columns.

No retroactive unlocks — existing users start with empty counters and earn from their next completed game.

## 2. Rename duplicate badge

`src/data/badgeData.ts`: rename Sports tier 1 `"The Warm-Up"` → `"The Whistle"` so `badgeName` is globally unique.

## 3. Session data shape

```ts
type GameSessionData = {
  categories: string[];
  eras: string[];
  difficulties: string[];   // engine names; evaluator maps Medium↔Average
  isMinimumTimer: boolean;  // both timers at slider min
  isQuickplay: boolean;     // Quick Play CTA
  isCustom: boolean;        // Customize Game
  completedAt: Date;
};
```

Flags are captured in `TriviaGame` state at game-start (Quick Play vs Customize path from `StartScreen`/`SettingsPanel`).

## 4. New: `src/lib/gameCompletion.ts`

`handleGameCompletion(userId, session): Promise<Badge[]>`:
1. Fetch profile row.
2. Increment `total_games_played`, set `last_played_at = completedAt`, set `first_game_completed_at` if null.
3. Bump `category_counts` / `era_counts` / `difficulty_counts`.
4. Append `completedAt` to `play_history`, keep last 50.
5. `min_timer_games`, `quickplay_games`, `custom_games` += 1 as applicable.
6. Evaluate badges (§5), merge names into `unlocked_badges` (dedup).
7. Single `.update(...)`.
8. Return newly unlocked `Badge[]`.

## 5. New: `src/lib/badgeEvaluator.ts`

Pure `evaluateBadges(stats, session): Badge[]` over `BADGES`:

- **Progression tiers 1–5:** `total_games_played` ≥ 1/10/25/50/100.
- **Mode & Difficulty tiers 1–3:** `difficulty_counts[engineName]` ≥ 10/50/100, where `Medium → Average`.
- **Time Travelers tiers 1–3:** sum `era_counts` over setting's eras (`"1960s/1970s"` → 1960s+1970s; `"1990s/2000s"` → 1990s+2000s; others exact) ≥ 10/50/100.
- **Category Specialists tiers 1–3:** sum `category_counts` for setting group ≥ 10/50/100:
  - STEM → Math, Science, Technology
  - Culture → Art, Literature, Performing Arts
  - Globe → Geography, History, Politics
  - Gourmet → Food & Drink
  - Pop Culture → Pop Culture, Movies, Television, Music, Video Games
  - Sports → Sports
- **Custom Combo (requires `session.isCustom`, checks `session.categories`):**
  - Couch Potato: Movies + Television + Video Games
  - Renaissance Soul: Art + Science + History
  - The World Stage: Sports + Geography
  - Culinary Tour: Food & Drink + Geography
  - Existential Crisis: Philosophy + Theology + Human Body
  - The Hustle: Economy + Law + Politics
- **Special one-offs:**
  - Spontaneous → `quickplay_games` ≥ 10
  - The Architect → `custom_games` ≥ 1
  - The Spectrum → all 5 difficulty keys ≥ 1
  - Century Hopper → ≥ 5 distinct era keys ≥ 1
  - The Polymath → all 25 categories ≥ 1
  - Weekender → `completedAt.getDay()` in {0,6}
  - Night Owl → hour ∈ [0,4)
  - Early Riser → hour ∈ [4,8)
  - Speed Demon → `session.isMinimumTimer`
  - Marathoner → ≥ 10 entries in updated `play_history` within 24h of `completedAt`

## 6. Wire into game flow

`TriviaGame.tsx`:
- Track `isQuickplay` / `isCustom` alongside game settings at game-start.
- On completion, build `GameSessionData` and call `handleGameCompletion(userId, session)`.
- Fire `toast({ title: "Badge Unlocked!", description: b.badgeName })` per newly unlocked badge.

`StartScreen`: Quick Play CTA sets Quickplay=true. Customize → Start Game sets Custom=true.

Delete `src/lib/profileProgress.ts` (subsumed).

**Google Analytics is unaffected** — `analytics.ts` is a separate GA4 event stream with no dependency on `games_completed` or badge names.

## 7. UI

**`ProfilePanel.tsx`:** fetch `unlocked_badges` for `auth.uid()`, map name → id via `BADGES`, pass `unlockedIds` to `AchievementsSection`. Update any `games_completed` reference to `total_games_played`.

**`AchievementsSection.tsx`:** hide locked badges. Empty state: "Play a game to earn your first badge." Show up to 6 unlocked, "View all N" to expand. Flip animation preserved.

**`BadgeItem.tsx`:** unchanged.

## Files touched

Created: `src/lib/gameCompletion.ts`, `src/lib/badgeEvaluator.ts`, migration.
Edited: `src/data/badgeData.ts`, `src/components/TriviaGame.tsx`, `src/components/StartScreen.tsx`, `src/components/ProfilePanel.tsx`, `src/components/AchievementsSection.tsx`.
Deleted: `src/lib/profileProgress.ts`.
Auto-regenerated after migration: `src/integrations/supabase/types.ts`.

## Out of scope
- Retroactive badge backfill.
- GA event for badge unlock (can add later if desired).
- Persistent achievements page / share sheet.