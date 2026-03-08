
-- ── PROFILES ──────────────────────────────────────────────────────────────────
CREATE TABLE public.profiles (
  id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username     TEXT NOT NULL,
  email        TEXT NOT NULL,
  coins        INTEGER NOT NULL DEFAULT 1000,
  points       INTEGER NOT NULL DEFAULT 0,
  level        INTEGER NOT NULL DEFAULT 1,
  level_name   TEXT NOT NULL DEFAULT 'Rookie',
  streak       INTEGER NOT NULL DEFAULT 0,
  best_streak  INTEGER NOT NULL DEFAULT 0,
  total_predictions    INTEGER NOT NULL DEFAULT 0,
  correct_predictions  INTEGER NOT NULL DEFAULT 0,
  matches_played       INTEGER NOT NULL DEFAULT 0,
  login_streak         INTEGER NOT NULL DEFAULT 1,
  fav_team_id          TEXT,
  created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are publicly viewable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile"  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile"  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ── PREDICTIONS ───────────────────────────────────────────────────────────────
CREATE TABLE public.predictions (
  id              UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  match_id        TEXT NOT NULL,
  question_id     TEXT NOT NULL,
  question_text   TEXT NOT NULL,
  phase           TEXT NOT NULL,
  option_id       TEXT NOT NULL,
  option_label    TEXT NOT NULL,
  cost_paid       INTEGER NOT NULL,
  potential_win   INTEGER NOT NULL,
  result          TEXT NOT NULL DEFAULT 'pending',
  coins_won       INTEGER,
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at     TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own predictions"    ON public.predictions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own predictions"  ON public.predictions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own predictions"  ON public.predictions FOR UPDATE USING (auth.uid() = user_id);

-- ── LEADERBOARD VIEW ──────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW public.leaderboard
WITH (security_invoker = on) AS
  SELECT
    id,
    username,
    points,
    coins,
    streak,
    best_streak,
    level_name,
    CASE WHEN total_predictions > 0
         THEN ROUND((correct_predictions::NUMERIC / total_predictions) * 100)
         ELSE 0
    END AS accuracy,
    ROW_NUMBER() OVER (ORDER BY points DESC) AS rank
  FROM public.profiles
  ORDER BY points DESC;

-- ── AUTO UPDATED_AT ───────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ── LEVEL COMPUTATION FUNCTION ────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.compute_level(p_points INTEGER, OUT p_level INTEGER, OUT p_level_name TEXT)
LANGUAGE plpgsql AS $$
BEGIN
  IF p_points >= 30000 THEN p_level := 5; p_level_name := 'Legend';
  ELSIF p_points >= 15000 THEN p_level := 4; p_level_name := 'Master';
  ELSIF p_points >= 5000 THEN p_level := 3; p_level_name := 'Expert';
  ELSIF p_points >= 1000 THEN p_level := 2; p_level_name := 'Fan';
  ELSE p_level := 1; p_level_name := 'Rookie';
  END IF;
END;
$$;
