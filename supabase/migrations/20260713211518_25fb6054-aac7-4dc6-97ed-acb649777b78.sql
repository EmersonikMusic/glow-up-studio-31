
CREATE TABLE public.question_ratings (
  question_id bigint PRIMARY KEY,
  thumbs_up integer NOT NULL DEFAULT 0,
  thumbs_down integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.question_ratings TO service_role;

ALTER TABLE public.question_ratings ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.increment_question_rating(qid bigint, direction text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF direction NOT IN ('up', 'down') THEN
    RAISE EXCEPTION 'invalid direction: %', direction;
  END IF;

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
END;
$$;

REVOKE ALL ON FUNCTION public.increment_question_rating(bigint, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_question_rating(bigint, text) TO anon, authenticated;
