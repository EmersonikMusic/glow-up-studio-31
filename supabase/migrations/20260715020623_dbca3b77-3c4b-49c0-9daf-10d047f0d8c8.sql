CREATE TABLE public.question_rating_votes (
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id bigint NOT NULL,
    direction text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, question_id),
    CONSTRAINT direction_check CHECK (direction IN ('up', 'down'))
);

GRANT SELECT, INSERT ON public.question_rating_votes TO authenticated;
GRANT ALL ON public.question_rating_votes TO service_role;

ALTER TABLE public.question_rating_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own votes"
    ON public.question_rating_votes
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own votes"
    ON public.question_rating_votes
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.increment_question_rating(qid bigint, direction text)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path TO 'public'
AS $function$
BEGIN
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Only signed-in users can rate questions';
    END IF;

    IF direction NOT IN ('up', 'down') THEN
        RAISE EXCEPTION 'invalid direction: %', direction;
    END IF;

    INSERT INTO public.question_rating_votes (user_id, question_id, direction)
    VALUES (auth.uid(), qid, direction)
    ON CONFLICT (user_id, question_id) DO NOTHING;

    IF FOUND THEN
        IF direction = 'up' THEN
            INSERT INTO public.question_ratings (question_id, thumbs_up)
            VALUES (qid, 1)
            ON CONFLICT (question_id)
            DO UPDATE SET thumbs_up = public.question_ratings.thumbs_up + 1,
                          updated_at = now();
        ELSE
            INSERT INTO public.question_ratings (question_id, thumbs_down)
            VALUES (qid, 1)
            ON CONFLICT (question_id)
            DO UPDATE SET thumbs_down = public.question_ratings.thumbs_down + 1,
                          updated_at = now();
        END IF;
    END IF;
END;
$function$;

-- Only signed-in users can invoke the RPC.
REVOKE EXECUTE ON FUNCTION public.increment_question_rating(bigint, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.increment_question_rating(bigint, text) TO authenticated;
