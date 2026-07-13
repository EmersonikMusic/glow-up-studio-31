REVOKE EXECUTE ON FUNCTION public.increment_question_rating(bigint, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.increment_question_rating(bigint, text) TO authenticated;