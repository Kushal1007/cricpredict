
-- Matches table for live IPL data
CREATE TABLE public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id TEXT NOT NULL UNIQUE,
  team1 TEXT NOT NULL,
  team1_short TEXT NOT NULL DEFAULT '',
  team1_img TEXT DEFAULT '',
  team2 TEXT NOT NULL,
  team2_short TEXT NOT NULL DEFAULT '',
  team2_img TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'upcoming',
  score1 TEXT DEFAULT '',
  score2 TEXT DEFAULT '',
  overs TEXT DEFAULT '',
  run_rate NUMERIC DEFAULT 0,
  toss_winner TEXT DEFAULT '',
  toss_decision TEXT DEFAULT '',
  venue TEXT DEFAULT '',
  match_type TEXT DEFAULT 'T20',
  start_time TIMESTAMPTZ,
  batting_team TEXT DEFAULT '',
  result TEXT DEFAULT '',
  last_synced_at TIMESTAMPTZ DEFAULT now(),
  raw_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Everyone can read matches
CREATE POLICY "Anyone can view matches"
  ON public.matches FOR SELECT
  USING (true);

-- Service role (edge functions) can insert/update via service_role key (bypasses RLS)
-- No user-facing insert/update/delete policies needed

-- Ball-by-ball events
CREATE TABLE public.ball_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id TEXT NOT NULL REFERENCES public.matches(match_id) ON DELETE CASCADE,
  over_number INTEGER NOT NULL,
  ball_number INTEGER NOT NULL,
  runs INTEGER NOT NULL DEFAULT 0,
  event_type TEXT NOT NULL DEFAULT 'run',
  batsman TEXT DEFAULT '',
  bowler TEXT DEFAULT '',
  commentary TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ball_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ball events"
  ON public.ball_events FOR SELECT
  USING (true);

CREATE INDEX idx_ball_events_match ON public.ball_events(match_id);

-- Triggers
CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON public.matches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ball_events;
