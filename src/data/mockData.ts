import { User, Match, BallEvent, LeaderboardEntry } from '@/types/cricket';

export const MOCK_USER: User = {
  id: '1',
  username: 'CricketFan99',
  email: 'fan@cricket.com',
  coins: 2450,
  points: 8720,
  level: 4,
  levelName: 'Expert',
  streak: 7,
  bestStreak: 12,
  totalPredictions: 145,
  correctPredictions: 89,
  matchesPlayed: 23,
  loginStreak: 5,
  badges: [
    { id: '1', name: 'Prediction Master', icon: '🎯', description: '100+ correct predictions', earned: true, earnedDate: '2024-01-15' },
    { id: '2', name: 'Boundary Hunter', icon: '🏏', description: 'Predict 20 boundaries correctly', earned: true, earnedDate: '2024-01-20' },
    { id: '3', name: 'Streak King', icon: '🔥', description: '10 correct predictions in a row', earned: true, earnedDate: '2024-01-25' },
    { id: '4', name: 'Six Master', icon: '6️⃣', description: 'Predict 10 sixes correctly', earned: false },
    { id: '5', name: 'Wicket Wizard', icon: '❌', description: 'Predict 15 wickets correctly', earned: false },
    { id: '6', name: 'Legend', icon: '👑', description: 'Reach 10,000 points', earned: false },
  ],
};

// IPL 2026 live match for the prediction page
export const MOCK_MATCHES: Match[] = [
  {
    id: '1',
    team1: 'Mumbai Indians', team1Short: 'MI', team1Flag: '💙',
    team2: 'Chennai Super Kings', team2Short: 'CSK', team2Flag: '🦁',
    status: 'live',
    score1: '187/4', score2: '—',
    overs: '18.3',
    runRate: 10.1,
    venue: 'Wankhede Stadium, Mumbai',
    matchType: 'IPL 2026',
    startTime: 'LIVE',
    battingTeam: 'MI',
  },
];

export const MOCK_BALL_EVENTS: BallEvent[] = [
  { over: 18, ball: 1, runs: 1, type: 'run', batsman: 'Rohit Sharma', bowler: 'Deepak Chahar', commentary: 'Clipped to fine leg for a single' },
  { over: 18, ball: 2, runs: 4, type: 'boundary', batsman: 'Rohit Sharma', bowler: 'Deepak Chahar', commentary: 'Driven through the covers! Beautiful!' },
  { over: 18, ball: 3, runs: 0, type: 'dot', batsman: 'Rohit Sharma', bowler: 'Deepak Chahar', commentary: 'Dot ball, good length delivery defended' },
  { over: 18, ball: 4, runs: 6, type: 'six', batsman: 'Suryakumar', bowler: 'Deepak Chahar', commentary: 'MASSIVE SIX over long on!' },
  { over: 18, ball: 5, runs: 1, type: 'run', batsman: 'Suryakumar', bowler: 'Deepak Chahar', commentary: 'Quick single to mid-wicket' },
  { over: 18, ball: 6, runs: 0, type: 'wicket', batsman: 'Suryakumar', bowler: 'Deepak Chahar', commentary: 'WICKET! Caught at third man!' },
  { over: 17, ball: 1, runs: 4, type: 'boundary', batsman: 'Rohit Sharma', bowler: 'Jadeja', commentary: 'Flicked off the pads for four!' },
  { over: 17, ball: 2, runs: 2, type: 'run', batsman: 'Rohit Sharma', bowler: 'Jadeja', commentary: 'Two runs to deep mid-wicket' },
  { over: 17, ball: 3, runs: 0, type: 'dot', batsman: 'Rohit Sharma', bowler: 'Jadeja', commentary: 'Defended on the off side' },
  { over: 17, ball: 4, runs: 6, type: 'six', batsman: 'Rohit Sharma', bowler: 'Jadeja', commentary: 'ROHIT GOES AERIAL! Six over long off!' },
  { over: 17, ball: 5, runs: 1, type: 'run', batsman: 'Rohit Sharma', bowler: 'Jadeja', commentary: 'Nudged for a single' },
  { over: 17, ball: 6, runs: 4, type: 'boundary', batsman: 'Rohit Sharma', bowler: 'Jadeja', commentary: 'Punched through covers for FOUR!' },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, username: 'PredictionGod', points: 24500, coins: 15200, streak: 18, accuracy: 91, level: 'Legend' },
  { rank: 2, username: 'CricketOracle', points: 21300, coins: 12800, streak: 15, accuracy: 88, level: 'Legend' },
  { rank: 3, username: 'BallByBall', points: 18900, coins: 11500, streak: 12, accuracy: 85, level: 'Expert' },
  { rank: 4, username: 'CricketFan99', points: 8720, coins: 2450, streak: 7, accuracy: 61, level: 'Expert' },
  { rank: 5, username: 'SixHunter', points: 7800, coins: 4200, streak: 9, accuracy: 72, level: 'Expert' },
  { rank: 6, username: 'WicketWatcher', points: 6500, coins: 3800, streak: 5, accuracy: 68, level: 'Fan' },
  { rank: 7, username: 'BoundaryKing', points: 5200, coins: 2900, streak: 4, accuracy: 65, level: 'Fan' },
  { rank: 8, username: 'T20Maestro', points: 4100, coins: 2100, streak: 3, accuracy: 62, level: 'Fan' },
  { rank: 9, username: 'StadiumRoar', points: 3200, coins: 1800, streak: 2, accuracy: 58, level: 'Rookie' },
  { rank: 10, username: 'CricketBuzz', points: 2500, coins: 1500, streak: 1, accuracy: 55, level: 'Rookie' },
];

export const LEVELS = [
  { level: 1, name: 'Rookie', minPoints: 0, color: 'text-muted-foreground' },
  { level: 2, name: 'Fan', minPoints: 1000, color: 'text-secondary' },
  { level: 3, name: 'Expert', minPoints: 5000, color: 'text-primary' },
  { level: 4, name: 'Master', minPoints: 15000, color: 'text-neon-orange' },
  { level: 5, name: 'Legend', minPoints: 30000, color: 'text-yellow-400' },
];
