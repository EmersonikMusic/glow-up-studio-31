DROP POLICY IF EXISTS "Anyone can insert guest plays" ON public.anonymous_plays;

CREATE POLICY "Anyone can insert guest plays"
    ON public.anonymous_plays
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (length(device_id) > 0);
