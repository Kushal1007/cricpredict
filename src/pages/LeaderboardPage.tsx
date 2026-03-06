import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { MOCK_LEADERBOARD } from '@/data/mockData';
import { Trophy, Zap, Target, ArrowLeft } from 'lucide-react';

const LeaderboardPage: React.FC = () => {
  const { user, setCurrentPage, isLoggedIn } = useApp();
  const [tab, setTab] = useState<'global' | 'weekly' | 'match'>('global');

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Legend': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'Master': return 'text-neon-orange bg-neon-orange/10 border-neon-orange/30';
      case 'Expert': return 'text-primary bg-primary/10 border-primary/30';
      case 'Fan': return 'text-secondary bg-secondary/10 border-secondary/30';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  return (
    <div className="min-h-screen bg-background pt-14 md:pt-16 pb-8">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-5 md:py-8 max-w-3xl">
        {isLoggedIn && (
          <button onClick={() => setCurrentPage('dashboard')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 md:mb-6 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}

        <div className="text-center mb-6 md:mb-8">
          <div className="text-4xl md:text-5xl mb-2 md:mb-3">🏆</div>
          <h1 className="font-rajdhani text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
            <span className="neon-text-green">Leaderboard</span>
          </h1>
          <p className="text-muted-foreground text-sm">Compete with cricket fans worldwide</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-surface rounded-xl p-1 gap-1 mb-5 md:mb-6 border border-border">
          {(['global', 'weekly', 'match'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 md:py-2.5 text-xs md:text-sm font-semibold rounded-lg transition-all capitalize ${
                tab === t ? 'bg-primary text-primary-foreground shadow-neon-green' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t === 'global' ? '🌍 Global' : t === 'weekly' ? '📅 Weekly' : '⚡ Match'}
            </button>
          ))}
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-2 md:gap-3 mb-6 md:mb-8">
          {[MOCK_LEADERBOARD[1], MOCK_LEADERBOARD[0], MOCK_LEADERBOARD[2]].map((entry, i) => {
            const heights = ['h-24 md:h-28', 'h-32 md:h-36', 'h-20 md:h-24'];
            const labels = ['2nd', '1st', '3rd'];
            const podiumColors = [
              'bg-gray-400/10 border-gray-400/30',
              'bg-yellow-400/10 border-yellow-400/30',
              'bg-amber-700/10 border-amber-700/30',
            ];
            const textColors = ['text-gray-300', 'text-yellow-400', 'text-amber-600'];
            return (
              <div key={entry.rank} className="flex flex-col items-center">
                <div className="mb-1.5 md:mb-2 text-center">
                  <div className="w-9 h-9 md:w-12 md:h-12 rounded-full bg-surface-elevated border-2 border-border flex items-center justify-center font-rajdhani font-bold text-base md:text-lg mx-auto mb-1">
                    {entry.username[0]}
                  </div>
                  <div className="text-xs font-medium truncate max-w-[72px] md:max-w-20">{entry.username}</div>
                  <div className="text-[10px] md:text-xs text-muted-foreground">{entry.points.toLocaleString()} pts</div>
                </div>
                <div className={`w-full ${heights[i]} rounded-t-lg flex items-center justify-center border ${podiumColors[i]}`}>
                  <span className={`text-lg md:text-2xl font-rajdhani font-bold ${textColors[i]}`}>{labels[i]}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* List */}
        <div className="space-y-2">
          {MOCK_LEADERBOARD.map(entry => {
            const isCurrentUser = user?.username === entry.username;
            return (
              <div
                key={entry.rank}
                className={`flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-xl border transition-all ${
                  isCurrentUser ? 'bg-primary/5 border-primary/30 glow-border-green' : 'card-surface hover:border-border/80'
                }`}
              >
                <div className="w-7 md:w-8 text-center font-rajdhani font-bold text-base md:text-lg shrink-0">
                  {getRankIcon(entry.rank)}
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-surface-elevated border border-border flex items-center justify-center font-rajdhani font-bold text-sm flex-shrink-0">
                  {entry.username[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
                    <span className={`font-medium text-xs md:text-sm ${isCurrentUser ? 'text-primary' : ''}`}>
                      {entry.username}{isCurrentUser && ' (You)'}
                    </span>
                    <span className={`text-[10px] md:text-xs px-1.5 py-0.5 rounded border ${getLevelColor(entry.level)}`}>
                      {entry.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-[10px] md:text-xs text-muted-foreground">
                      <Target className="w-3 h-3" /> {entry.accuracy}%
                    </span>
                    <span className="flex items-center gap-1 text-[10px] md:text-xs text-muted-foreground">
                      <Zap className="w-3 h-3" /> {entry.streak}🔥
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-rajdhani font-bold text-secondary text-sm md:text-base">{entry.points.toLocaleString()}</div>
                  <div className="text-[10px] md:text-xs text-muted-foreground">{entry.coins.toLocaleString()} 🪙</div>
                </div>
              </div>
            );
          })}
        </div>

        {!isLoggedIn && (
          <div className="mt-6 md:mt-8 text-center card-surface rounded-xl p-5 md:p-6 glow-border-green">
            <h3 className="font-rajdhani text-xl md:text-2xl font-bold mb-2">Join the Competition!</h3>
            <p className="text-muted-foreground text-sm mb-4">Sign up to appear on the leaderboard and compete with fans</p>
            <button
              onClick={() => setCurrentPage('signup')}
              className="px-6 md:px-8 py-2.5 md:py-3 bg-primary text-primary-foreground font-rajdhani font-bold rounded-xl shadow-neon-green hover:scale-105 transition-all"
            >
              Sign Up Free
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
