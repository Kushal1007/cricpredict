
CREATE TABLE public.player_season_stats (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name text NOT NULL,
  team_id text NOT NULL,
  role text NOT NULL DEFAULT 'bat',
  matches integer NOT NULL DEFAULT 0,
  runs integer NOT NULL DEFAULT 0,
  innings integer NOT NULL DEFAULT 0,
  high_score integer NOT NULL DEFAULT 0,
  average numeric NOT NULL DEFAULT 0,
  strike_rate numeric NOT NULL DEFAULT 0,
  fifties integer NOT NULL DEFAULT 0,
  hundreds integer NOT NULL DEFAULT 0,
  fours integer NOT NULL DEFAULT 0,
  sixes integer NOT NULL DEFAULT 0,
  wickets integer NOT NULL DEFAULT 0,
  bowling_innings integer NOT NULL DEFAULT 0,
  economy numeric NOT NULL DEFAULT 0,
  best_figures text NOT NULL DEFAULT '-',
  five_wickets integer NOT NULL DEFAULT 0,
  season integer NOT NULL DEFAULT 2026,
  last_updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (player_name, team_id, season)
);

ALTER TABLE public.player_season_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view player stats"
  ON public.player_season_stats
  FOR SELECT
  USING (true);
