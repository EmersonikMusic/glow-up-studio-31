-- Allow public read access to aggregate vote counts.
GRANT SELECT ON public.question_ratings TO anon, authenticated;

CREATE POLICY "Public can read aggregate question ratings"
    ON public.question_ratings
    FOR SELECT
    TO anon, authenticated
    USING (true);
