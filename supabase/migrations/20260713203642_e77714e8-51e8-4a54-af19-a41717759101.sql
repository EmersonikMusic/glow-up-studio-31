CREATE TABLE public.anonymous_plays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  settings_code text NOT NULL,
  is_kids_mode boolean NOT NULL DEFAULT false,
  is_quickplay boolean NOT NULL DEFAULT false,
  is_custom boolean NOT NULL DEFAULT false,
  is_minimum_timer boolean NOT NULL DEFAULT false,
  completed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.anonymous_plays TO anon, authenticated;
GRANT ALL ON public.anonymous_plays TO service_role;

ALTER TABLE public.anonymous_plays ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert guest plays"
  ON public.anonymous_plays
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE INDEX idx_anonymous_plays_device_id ON public.anonymous_plays (device_id);
CREATE INDEX idx_anonymous_plays_completed_at ON public.anonymous_plays (completed_at DESC);