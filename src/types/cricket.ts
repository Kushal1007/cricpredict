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

// ---- New structured prediction types ----

export type PredictionPhase =
  | 'pre-match'      // 4h before match — full match predictions
  | 'powerplay'      // After PP (overs 1–6)
  | 'strategic-timeout' // Mid-innings strategic timeout
  | 'innings-break'; // Between innings

export type PredictionStatus = 'open' | 'locked' | 'won' | 'lost' | 'pending';

export interface PredictionOption {
  id: string;
  label: string;
  emoji: string;
  odds: number; // multiplier
}

export interface PredictionQuestion {
  id: string;
  phase: PredictionPhase;
  category: 'batting' | 'bowling' | 'match' | 'team';
  question: string;
  description: string;
  options: PredictionOption[];
  cost: number;
  opensAt: string;   // ISO timestamp
  closesAt: string;
  status: PredictionStatus;
  correctOptionId?: string;
}

export interface UserPrediction {
  questionId: string;
  optionId: string;
  costPaid: number;
  potentialWin: number;
  result: PredictionStatus;
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
