CREATE TABLE public.game_starts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  device_id text NOT NULL,
  settings_code text NOT NULL,
  is_kids_mode boolean NOT NULL DEFAULT false,
  is_quickplay boolean NOT NULL DEFAULT false,
  is_custom boolean NOT NULL DEFAULT false,
  is_minimum_timer boolean NOT NULL DEFAULT false,
  started_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.game_starts TO anon, authenticated;
GRANT ALL ON public.game_starts TO service_role;

ALTER TABLE public.game_starts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can record a game start"
  ON public.game_starts
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (length(device_id) > 0);