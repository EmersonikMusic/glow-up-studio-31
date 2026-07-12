-- Convert existing game_settings_history string entries from
--   CCCCCCCCCCCCCCCCCCCCCCCCC-DDDDD-EEEEEEEEEEEE-NNN-QQ-AA
-- to legible pipe-delimited format:
--   CCCCC-CCCCC-CCCCC-CCCCC-CCCCC|DDDDD|EEEEEE-EEEEEE|NNN|QQ|AA
-- Object entries (older format) are dropped.

CREATE OR REPLACE FUNCTION public._convert_settings_entry(elem jsonb)
RETURNS jsonb
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
  s text;
  parts text[];
  cats text;
  diffs text;
  eras text;
  nq text;
  tq text;
  ta text;
BEGIN
  IF jsonb_typeof(elem) <> 'string' THEN
    RETURN NULL;
  END IF;
  s := elem #>> '{}';

  -- Already new format?
  IF position('|' in s) > 0 THEN
    RETURN to_jsonb(s);
  END IF;

  parts := string_to_array(s, '-');
  IF array_length(parts, 1) <> 6 THEN
    RETURN NULL;
  END IF;

  cats := parts[1]; diffs := parts[2]; eras := parts[3];
  nq := parts[4]; tq := parts[5]; ta := parts[6];

  IF length(cats) <> 25 OR length(diffs) <> 5 OR length(eras) <> 12
     OR length(nq) <> 3 OR length(tq) <> 2 OR length(ta) <> 2 THEN
    RETURN NULL;
  END IF;

  RETURN to_jsonb(
    substr(cats,1,5)||'-'||substr(cats,6,5)||'-'||substr(cats,11,5)||'-'||substr(cats,16,5)||'-'||substr(cats,21,5)
    ||'|'|| diffs
    ||'|'|| substr(eras,1,6)||'-'||substr(eras,7,6)
    ||'|'|| nq ||'|'|| tq ||'|'|| ta
  );
END;
$$;

UPDATE public.profiles
SET game_settings_history = COALESCE((
  SELECT jsonb_agg(converted)
  FROM (
    SELECT public._convert_settings_entry(e) AS converted
    FROM jsonb_array_elements(game_settings_history) AS e
  ) t
  WHERE t.converted IS NOT NULL
), '[]'::jsonb)
WHERE game_settings_history IS NOT NULL
  AND jsonb_typeof(game_settings_history) = 'array';

DROP FUNCTION public._convert_settings_entry(jsonb);