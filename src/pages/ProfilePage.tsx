import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { Coins, Trophy, Target, Zap, Star, ArrowLeft, TrendingUp, Calendar, RefreshCw, Clock, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { MOCK_USER } from '@/data/mockData';

interface PredictionRow {
  id: string;
  match_id: string;
  question_text: string;
  phase: string;
  option_label: string;
  cost_paid: number;
  potential_win: number;
  result: string;
  coins_won: number | null;
  created_at: string;
}

const ProfilePage: React.FC = () => {
  const { user, setCurrentPage, logout } = useApp();
  const [predictions, setPredictions] = useState<PredictionRow[]>([]);
  const [predLoading, setPredLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setPredLoading(true);
      const { data } = await supabase
        .from('predictions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      if (data) setPredictions(data as PredictionRow[]);
      setPredLoading(false);
    };
    load();
  }, [user]);

  if (!user) return null;

  const accuracy = Math.round((user.correctPredictions / Math.max(user.totalPredictions, 1)) * 100);
  const levelProgress = ((user.points % 3000) / 3000) * 100;

  const badges = MOCK_USER.badges;

  const phaseLabel = (p: string) => {
    switch (p) {
      case 'pre-match': return '🎯 Pre-Match';
      case 'powerplay': return '⚡ Powerplay';
      case 'strategic-timeout': return '⏱️ Timeout';
      case 'innings-break': return '🏏 Innings Break';
      default: return p;
    }
  };

  const resultStyle = (r: string) => {
    if (r === 'won') return 'text-primary bg-primary/10 border-primary/30';
    if (r === 'lost') return 'text-destructive bg-destructive/10 border-destructive/30';
    return 'text-muted-foreground bg-muted border-border';
  };

  return (
    <div className="min-h-screen bg-background pt-14 md:pt-16 pb-8">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-5 md:py-8 max-w-3xl">
        <button onClick={() => setCurrentPage('dashboard')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-5 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Profile Header */}
        <div className="relative overflow-hidden rounded-3xl p-5 md:p-7 mb-5 border border-primary/20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-card to-secondary/5" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/8 blur-3xl rounded-full" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-5">
            {/* Avatar */}
            <div className="w-18 h-18 md:w-20 md:h-20 rounded-2xl flex items-center justify-center font-rajdhani font-black text-3xl text-background shadow-neon-green shrink-0"
              style={{ background: 'linear-gradient(135deg, hsl(150 100% 40%), hsl(150 100% 60%))' }}>
              {user.username[0].toUpperCase()}
            </div>
            <div className="flex-1 text-center sm:text-left w-full">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1 flex-wrap">
                <h1 className="font-rajdhani text-2xl md:text-3xl font-black">{user.username}</h1>
                <span className="text-xs bg-primary/15 border border-primary/30 text-primary px-2.5 py-0.5 rounded-full font-bold">
                  {user.levelName}
                </span>
              </div>
              <p className="text-muted-foreground text-xs md:text-sm mb-3">{user.email}</p>

              {/* Level progress */}
              <div className="max-w-sm mx-auto sm:mx-0">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Level {user.level}</span>
                  <span>{(3000 - (user.points % 3000)).toLocaleString()} pts to Lv.{user.level + 1}</span>
                </div>
                <div className="h-2.5 bg-muted/60 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${levelProgress}%`, background: 'linear-gradient(90deg, hsl(150 100% 40%), hsl(150 100% 60%))' }} />
                </div>
              </div>
            </div>

            {/* Coins + Points */}
            <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
              <div className="flex-1 sm:flex-none text-center bg-yellow-400/10 border border-yellow-400/20 rounded-2xl px-4 py-3">
                <Coins className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                <div className="font-rajdhani text-xl font-black text-yellow-400">{user.coins.toLocaleString()}</div>
                <div className="text-[10px] text-muted-foreground">Coins</div>
              </div>
              <div className="flex-1 sm:flex-none text-center bg-secondary/10 border border-secondary/20 rounded-2xl px-4 py-3">
                <TrendingUp className="w-4 h-4 text-secondary mx-auto mb-1" />
                <div className="font-rajdhani text-xl font-black text-secondary">{user.points.toLocaleString()}</div>
                <div className="text-[10px] text-muted-foreground">Points</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-5">
          {[
            { label: 'Predictions', value: user.totalPredictions, icon: <Target className="w-4 h-4" />, color: 'text-secondary' },
            { label: 'Correct', value: user.correctPredictions, icon: <Star className="w-4 h-4" />, color: 'text-primary' },
            { label: 'Best Streak', value: `${user.bestStreak}🔥`, icon: <Zap className="w-4 h-4" />, color: 'text-neon-orange' },
            { label: 'Matches', value: user.matchesPlayed, icon: <Trophy className="w-4 h-4" />, color: 'text-yellow-400' },
          ].map((s, i) => (
            <div key={i} className="bg-card/60 border border-border/60 rounded-2xl p-4 text-center">
              <div className={`flex justify-center mb-1.5 ${s.color}`}>{s.icon}</div>
              <div className={`font-rajdhani text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Accuracy */}
        <div className="bg-card/60 border border-border/60 rounded-2xl p-4 mb-5">
          <div className="flex items-center justify-between mb-2.5">
            <span className="font-rajdhani font-bold text-base">Prediction Accuracy</span>
            <span className="font-rajdhani text-2xl font-black text-primary">{accuracy}%</span>
          </div>
          <div className="h-3 bg-muted/60 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${accuracy}%`, background: 'linear-gradient(90deg, hsl(213 100% 60%), hsl(150 100% 50%))' }} />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{user.correctPredictions} correct</span>
            <span>{user.totalPredictions - user.correctPredictions} wrong</span>
          </div>
        </div>

        {/* Login Streak */}
        <div className="bg-card/60 border border-yellow-400/20 rounded-2xl p-4 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-yellow-400" />
            <span className="font-rajdhani font-bold text-base">Login Streak</span>
            <span className="text-yellow-400 font-rajdhani font-black text-lg ml-1">{user.loginStreak} days</span>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div key={i} className="text-center">
                <div className="text-[10px] text-muted-foreground mb-1">{day}</div>
                <div className={`w-full aspect-square rounded-lg flex items-center justify-center text-[10px] ${
                  i < user.loginStreak ? 'bg-yellow-400/15 border border-yellow-400/40 text-yellow-400' : 'bg-muted/60 border border-border/50 text-muted-foreground'
                }`}>
                  {i < user.loginStreak ? '✓' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prediction History */}
        <div className="bg-card/60 border border-border/60 rounded-2xl p-4 mb-5">
          <h2 className="font-rajdhani font-black text-lg mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-secondary" /> Prediction History
          </h2>
          {predLoading ? (
            <div className="flex items-center justify-center py-6 gap-2 text-muted-foreground">
              <RefreshCw className="w-4 h-4 animate-spin" /> Loading...
            </div>
          ) : predictions.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-6">
              No predictions yet. Start predicting to build your history! 🎯
            </p>
          ) : (
            <div className="space-y-2">
              {predictions.map(p => (
                <div key={p.id} className="flex items-start justify-between gap-3 bg-muted/30 border border-border/40 rounded-xl px-3 py-2.5">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate">{p.question_text}</div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-[10px] bg-muted/60 border border-border/50 px-2 py-0.5 rounded-lg text-muted-foreground">{phaseLabel(p.phase)}</span>
                      <span className="text-[10px] text-muted-foreground">→ {p.option_label}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-lg border font-bold capitalize ${resultStyle(p.result)}`}>
                      {p.result === 'won' ? `+${p.coins_won}🪙` : p.result === 'lost' ? `-${p.cost_paid}🪙` : '⏳ Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="bg-card/60 border border-border/60 rounded-2xl p-4 mb-5">
          <h2 className="font-rajdhani font-black text-lg mb-3">Badges & Achievements</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {badges.map(badge => (
              <div
                key={badge.id}
                className={`rounded-2xl p-3.5 border text-center transition-all ${
                  badge.earned
                    ? 'bg-primary/5 border-primary/25'
                    : 'bg-muted/30 border-border/40 opacity-50 grayscale'
                }`}
              >
                <div className="text-3xl mb-1.5">{badge.icon}</div>
                <div className="font-rajdhani font-bold text-xs">{badge.name}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{badge.description}</div>
                {badge.earned
                  ? <div className="text-[10px] text-primary mt-1 font-semibold">✓ Earned</div>
                  : <div className="text-[10px] text-muted-foreground mt-1">Locked</div>
                }
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full py-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-2xl font-rajdhani font-bold text-base hover:bg-destructive/20 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
