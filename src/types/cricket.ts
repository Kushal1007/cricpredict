// Cricket app state management
export interface User {
  id: string;
  username: string;
  email: string;
  coins: number;
  points: number;
  level: number;
  levelName: string;
  streak: number;
  bestStreak: number;
  totalPredictions: number;
  correctPredictions: number;
  matchesPlayed: number;
  badges: Badge[];
  loginStreak: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
  earnedDate?: string;
}

export interface Match {
  id: string;
  team1: string;
  team1Short: string;
  team1Flag: string;
  team2: string;
  team2Short: string;
  team2Flag: string;
  status: 'live' | 'upcoming' | 'completed';
  score1?: string;
  score2?: string;
  overs?: string;
  runRate?: number;
  venue: string;
  matchType: string;
  startTime: string;
  battingTeam?: string;
}

export interface BallEvent {
  over: number;
  ball: number;
  runs: number;
  type: 'dot' | 'run' | 'boundary' | 'six' | 'wicket' | 'wide' | 'noball';
  batsman?: string;
  bowler?: string;
  commentary?: string;
}

export interface Prediction {
  id: string;
  type: 'next-ball' | 'next-over' | 'special';
  label: string;
  cost: number;
  multiplier: number;
  selected?: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  points: number;
  coins: number;
  streak: number;
  accuracy: number;
  level: string;
}
