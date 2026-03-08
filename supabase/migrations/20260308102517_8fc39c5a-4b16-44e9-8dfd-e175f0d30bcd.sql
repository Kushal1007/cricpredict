
CREATE OR REPLACE FUNCTION public.compute_level(p_points INTEGER, OUT p_level INTEGER, OUT p_level_name TEXT)
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF p_points >= 30000 THEN p_level := 5; p_level_name := 'Legend';
  ELSIF p_points >= 15000 THEN p_level := 4; p_level_name := 'Master';
  ELSIF p_points >= 5000 THEN p_level := 3; p_level_name := 'Expert';
  ELSIF p_points >= 1000 THEN p_level := 2; p_level_name := 'Fan';
  ELSE p_level := 1; p_level_name := 'Rookie';
  END IF;
END;
$$;
