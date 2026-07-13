CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  base_username text;
  candidate_username text;
  attempt int := 0;
BEGIN
  base_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  );

  candidate_username := base_username;

  -- Try up to 8 times, appending an increasingly-random suffix on collision.
  WHILE attempt < 8 AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE lower(username) = lower(candidate_username)
  ) LOOP
    attempt := attempt + 1;
    candidate_username := base_username || substr(replace(gen_random_uuid()::text, '-', ''), 1, 4 + attempt);
  END LOOP;

  INSERT INTO public.profiles (id, display_name, avatar_url, email, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.email,
    candidate_username
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$function$;