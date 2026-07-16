## Achievement badge tweaks

**1. Bolder description text** — In `src/components/BadgeItem.tsx`, on the flipped-back requirement `<span>`, change `font-semibold` → `font-bold` for better legibility.

**2. Badge size +5%** — In `BadgeItem.tsx`, bump the front/back circle from `w-20 h-20` (80px) to `w-[84px] h-[84px]` (~5% larger). Adjust the inner `Trophy` icon and `Lock` icon proportionally (`w-8 h-8` → `w-[34px] h-[34px]`, `w-7 h-7` → `w-[30px] h-[30px]`) so they stay visually centered.

**3. Single-row preview in ProfilePanel** — In `src/components/AchievementsSection.tsx`, drop `COLLAPSED_LIMIT` from `6` to `3` so the collapsed grid renders exactly one row of three badges. "View all N" / "Show less" toggle behavior is unchanged.

## Wipe collected trophies (poptartpopart)

Reset badge-related columns for `morgan.begg@gmail.com` (id `a557d878-a096-4f71-9bea-41730ff562b2`) so re-earning under the new criteria starts clean:

```sql
UPDATE public.profiles
SET unlocked_badges = '{}',
    category_counts = '{}'::jsonb,
    era_counts = '{}'::jsonb,
    difficulty_counts = '{}'::jsonb,
    play_history = '{}',
    game_settings_history = '[]'::jsonb,
    total_games_played = 0,
    min_timer_games = 0,
    quickplay_games = 0,
    custom_games = 0,
    first_game_completed_at = NULL,
    last_played_at = NULL
WHERE id = 'a557d878-a096-4f71-9bea-41730ff562b2';
```

Note: this also zeros the counters/history that feed badge evaluation — required so previously earned tier badges don't immediately re-trigger on the next game. If you'd rather keep the play counters and only clear the trophy list itself, say the word and I'll narrow the update to just `unlocked_badges`.

## Files changed
- `src/components/BadgeItem.tsx` — bolder text, +5% size
- `src/components/AchievementsSection.tsx` — `COLLAPSED_LIMIT = 3`
- One data update on `public.profiles` (single row)
