
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS total_games_played integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS unlocked_badges text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS category_counts jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS era_counts jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS difficulty_counts jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS play_history timestamptz[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS min_timer_games integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS quickplay_games integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS custom_games integer NOT NULL DEFAULT 0;

-- Copy existing games_completed into total_games_played, then drop the old column.
UPDATE public.profiles
   SET total_games_played = COALESCE(games_completed, 0)
 WHERE games_completed IS NOT NULL
   AND games_completed > total_games_played;

ALTER TABLE public.profiles DROP COLUMN IF EXISTS games_completed;
