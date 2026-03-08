import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Zap, Target, ArrowLeft, RefreshCw } from 'lucide-react';

interface LeaderboardRow {
  id: string;
  username: string;
  points: number;
  coins: number;
  streak: number;
  best_streak: number;
  level_name: string;
  accuracy: number;
  rank: number;
}

const LeaderboardPage: React.FC = () => {
  const { user, setCurrentPage, isLoggedIn } = useApp();
  const [tab, setTab] = useState<'global' | 'weekly' | 'match'>('global');
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('rank', { ascending: true })
      .limit(50);
    if (!error && data) setRows(data as LeaderboardRow[]);
    setLoading(false);
  };

  useEffect(() => { fetchLeaderboard(); }, []);

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

  const top3 = rows.slice(0, 3);
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;

  return (
    <div className="min-h-screen bg-background pt-14 md:pt-16 pb-8">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-5 md:py-8 max-w-3xl">
        {isLoggedIn && (
          <button onClick={() => setCurrentPage('dashboard')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-5 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🏆</div>
          <h1 className="font-rajdhani text-4xl md:text-5xl font-black mb-1">
            <span className="neon-text-green">Leaderboard</span>
          </h1>
          <p className="text-muted-foreground text-sm">Compete with cricket fans worldwide</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-muted/50 border border-border/40 rounded-2xl p-1 gap-1 mb-5">
          {(['global', 'weekly', 'match'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all capitalize ${
                tab === t ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t === 'global' ? '🌍 Global' : t === 'weekly' ? '📅 Weekly' : '⚡ Match'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <RefreshCw className="w-6 h-6 text-primary animate-spin" />
            <p className="text-muted-foreground text-sm">Loading rankings…</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🏏</div>
            <p className="font-rajdhani font-bold text-xl mb-1">No players yet!</p>
            <p className="text-muted-foreground text-sm">Be the first to sign up and top the leaderboard.</p>
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            {podiumOrder.length === 3 && (
              <div className="grid grid-cols-3 gap-2 md:gap-3 mb-6">
                {podiumOrder.map((entry, i) => {
                  const heights = ['h-24 md:h-28', 'h-32 md:h-36', 'h-20 md:h-24'];
                  const labels = ['2nd', '1st', '3rd'];
                  const podiumColors = [
                    'bg-muted/60 border-muted',
                    'bg-yellow-400/10 border-yellow-400/30',
                    'bg-amber-700/10 border-amber-700/30',
                  ];
                  const textColors = ['text-muted-foreground', 'text-yellow-400', 'text-amber-600'];
                  return (
                    <div key={entry.id} className="flex flex-col items-center">
                      <div className="mb-2 text-center">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-muted border-2 border-border flex items-center justify-center font-rajdhani font-black text-base md:text-lg mx-auto mb-1">
                          {entry.username[0].toUpperCase()}
                        </div>
                        <div className="text-xs font-semibold truncate max-w-[72px] md:max-w-20">{entry.username}</div>
                        <div className="text-[10px] text-muted-foreground">{entry.points.toLocaleString()} pts</div>
                      </div>
                      <div className={`w-full ${heights[i]} rounded-t-xl flex items-center justify-center border ${podiumColors[i]}`}>
                        <span className={`text-lg md:text-2xl font-rajdhani font-black ${textColors[i]}`}>{labels[i]}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Full list */}
            <div className="space-y-2">
              {rows.map(entry => {
                const isCurrentUser = user?.id === entry.id;
                return (
                  <div
                    key={entry.id}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
                      isCurrentUser
                        ? 'bg-primary/8 border-primary/40 shadow-[0_0_12px_hsl(150_100%_50%/0.1)]'
                        : 'bg-card/60 border-border/60 hover:border-border'
                    }`}
                  >
                    <div className="w-8 text-center font-rajdhani font-black text-base shrink-0">
                      {getRankIcon(entry.rank)}
                    </div>
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-rajdhani font-black text-sm shrink-0 ${isCurrentUser ? 'bg-primary/20 border-primary/40 text-primary' : 'bg-muted border-border'}`}>
                      {entry.username[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`font-semibold text-sm ${isCurrentUser ? 'text-primary' : ''}`}>
                          {entry.username}{isCurrentUser && ' 👈'}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-lg border ${getLevelColor(entry.level_name)}`}>
                          {entry.level_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Target className="w-3 h-3" /> {entry.accuracy}%
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Zap className="w-3 h-3" /> {entry.streak}🔥
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-rajdhani font-black text-secondary text-base">{entry.points.toLocaleString()}</div>
                      <div className="text-[10px] text-muted-foreground">{entry.coins.toLocaleString()} 🪙</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {!isLoggedIn && (
          <div className="mt-8 relative overflow-hidden rounded-3xl p-6 text-center border border-primary/20">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-card to-secondary/5" />
            <div className="relative z-10">
              <h3 className="font-rajdhani text-2xl font-black mb-2">Join the Competition!</h3>
              <p className="text-muted-foreground text-sm mb-5">Sign up to appear on the leaderboard</p>
              <button
                onClick={() => setCurrentPage('signup')}
                className="px-8 py-3 font-rajdhani font-black text-background rounded-2xl shadow-neon-green hover:scale-105 transition-all"
                style={{ background: 'linear-gradient(135deg, hsl(150 100% 40%), hsl(150 100% 60%))' }}
              >
                Sign Up Free 🏏
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
