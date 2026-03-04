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
      case 'Expert': return 'text-neon-green bg-neon-green/10 border-neon-green/30';
      case 'Fan': return 'text-neon-blue bg-neon-blue/10 border-neon-blue/30';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {isLoggedIn && (
          <button onClick={() => setCurrentPage('dashboard')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}

        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏆</div>
          <h1 className="font-rajdhani text-4xl md:text-5xl font-bold mb-2">
            <span className="neon-text-green">Leaderboard</span>
          </h1>
          <p className="text-muted-foreground">Compete with cricket fans worldwide</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-surface rounded-xl p-1 gap-1 mb-6 border border-border">
          {(['global', 'weekly', 'match'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all capitalize ${
                tab === t ? 'bg-neon-green text-background shadow-neon-green' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t === 'global' ? '🌍 Global' : t === 'weekly' ? '📅 Weekly' : '⚡ Match'}
            </button>
          ))}
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[MOCK_LEADERBOARD[1], MOCK_LEADERBOARD[0], MOCK_LEADERBOARD[2]].map((entry, i) => {
            const heights = ['h-28', 'h-36', 'h-24'];
            const labels = ['2nd', '1st', '3rd'];
            const colors = ['text-gray-300', 'text-yellow-400', 'text-amber-600'];
            return (
              <div key={entry.rank} className="flex flex-col items-center">
                <div className="mb-2 text-center">
                  <div className="w-12 h-12 rounded-full bg-surface-elevated border-2 border-border flex items-center justify-center font-rajdhani font-bold text-lg mx-auto mb-1">
                    {entry.username[0]}
                  </div>
                  <div className="text-xs font-medium truncate max-w-20">{entry.username}</div>
                  <div className="text-xs text-muted-foreground">{entry.points.toLocaleString()} pts</div>
                </div>
                <div className={`w-full ${heights[i]} rounded-t-lg flex items-center justify-center border border-border ${
                  i === 1 ? 'bg-yellow-400/10 border-yellow-400/30' : i === 0 ? 'bg-gray-400/10 border-gray-400/30' : 'bg-amber-700/10 border-amber-700/30'
                }`}>
                  <span className={`text-2xl font-rajdhani font-bold ${colors[i]}`}>{labels[i]}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Leaderboard list */}
        <div className="space-y-2">
          {MOCK_LEADERBOARD.map(entry => {
            const isCurrentUser = user?.username === entry.username;
            return (
              <div
                key={entry.rank}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                  isCurrentUser ? 'bg-neon-green/5 border-neon-green/30 glow-border-green' : 'card-surface hover:border-border/80'
                }`}
              >
                <div className="w-8 text-center font-rajdhani font-bold text-lg">
                  {getRankIcon(entry.rank)}
                </div>
                <div className="w-10 h-10 rounded-full bg-surface-elevated border border-border flex items-center justify-center font-rajdhani font-bold flex-shrink-0">
                  {entry.username[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium text-sm ${isCurrentUser ? 'text-neon-green' : ''}`}>
                      {entry.username}
                      {isCurrentUser && ' (You)'}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded border ${getLevelColor(entry.level)}`}>
                      {entry.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Target className="w-3 h-3" /> {entry.accuracy}%
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Zap className="w-3 h-3" /> {entry.streak}🔥
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-rajdhani font-bold text-neon-blue">{entry.points.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">{entry.coins.toLocaleString()} 🪙</div>
                </div>
              </div>
            );
          })}
        </div>

        {!isLoggedIn && (
          <div className="mt-8 text-center card-surface rounded-xl p-6 glow-border-green">
            <h3 className="font-rajdhani text-2xl font-bold mb-2">Join the Competition!</h3>
            <p className="text-muted-foreground text-sm mb-4">Sign up to appear on the leaderboard and compete with fans</p>
            <button onClick={() => setCurrentPage('signup')} className="px-8 py-3 bg-neon-green text-background font-rajdhani font-bold rounded-xl shadow-neon-green hover:scale-105 transition-all">
              Sign Up Free
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
