import React from 'react';
import { useApp } from '@/context/AppContext';
import { Coins, Trophy, Target, Zap, Star, ArrowLeft, TrendingUp, Calendar } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, setCurrentPage, logout } = useApp();
  if (!user) return null;

  const accuracy = Math.round((user.correctPredictions / Math.max(user.totalPredictions, 1)) * 100);
  const levelProgress = ((user.points % 3000) / 3000) * 100;

  const stats = [
    { label: 'Total Predictions', value: user.totalPredictions, icon: <Target className="w-4 h-4" />, color: 'text-secondary' },
    { label: 'Correct', value: user.correctPredictions, icon: <Star className="w-4 h-4" />, color: 'text-primary' },
    { label: 'Best Streak', value: `${user.bestStreak}🔥`, icon: <Zap className="w-4 h-4" />, color: 'text-neon-orange' },
    { label: 'Matches Played', value: user.matchesPlayed, icon: <Trophy className="w-4 h-4" />, color: 'text-secondary' },
  ];

  return (
    <div className="min-h-screen bg-background pt-14 md:pt-16 pb-8">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-5 md:py-8 max-w-3xl">

        <button onClick={() => setCurrentPage('dashboard')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 md:mb-6 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Profile Header */}
        <div className="card-surface rounded-2xl p-4 md:p-6 mb-4 md:mb-6 glow-border-green">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-5">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary flex items-center justify-center font-rajdhani font-bold text-2xl md:text-3xl text-primary-foreground shadow-neon-green flex-shrink-0">
              {user.username[0].toUpperCase()}
            </div>
            <div className="flex-1 text-center sm:text-left w-full">
              <div className="flex items-center justify-center sm:justify-start gap-2 md:gap-3 mb-1 flex-wrap">
                <h1 className="font-rajdhani text-2xl md:text-3xl font-bold">{user.username}</h1>
                <span className="text-xs bg-primary/10 border border-primary/30 text-primary px-2 py-0.5 rounded-full">
                  {user.levelName}
                </span>
              </div>
              <p className="text-muted-foreground text-xs md:text-sm mb-3">{user.email}</p>

              {/* Level Progress */}
              <div className="max-w-sm mx-auto sm:mx-0">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Level {user.level}</span>
                  <span>{3000 - (user.points % 3000)} pts to Lv.{user.level + 1}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full shadow-neon-green" style={{ width: `${levelProgress}%` }} />
                </div>
              </div>
            </div>

            {/* Coins + Points */}
            <div className="flex sm:flex-col gap-2 md:gap-3 w-full sm:w-auto">
              <div className="flex-1 sm:flex-none text-center bg-muted rounded-xl px-3 md:px-4 py-2.5 md:py-3 border border-border">
                <Coins className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                <div className="font-rajdhani text-lg md:text-xl font-bold text-yellow-400">{user.coins.toLocaleString()}</div>
                <div className="text-[10px] md:text-xs text-muted-foreground">Coins</div>
              </div>
              <div className="flex-1 sm:flex-none text-center bg-muted rounded-xl px-3 md:px-4 py-2.5 md:py-3 border border-border">
                <TrendingUp className="w-4 h-4 text-secondary mx-auto mb-1" />
                <div className="font-rajdhani text-lg md:text-xl font-bold text-secondary">{user.points.toLocaleString()}</div>
                <div className="text-[10px] md:text-xs text-muted-foreground">Points</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
          {stats.map((stat, i) => (
            <div key={i} className="card-surface rounded-xl p-3 md:p-4 text-center">
              <div className={`flex justify-center mb-1.5 md:mb-2 ${stat.color}`}>{stat.icon}</div>
              <div className={`font-rajdhani text-xl md:text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-[10px] md:text-xs text-muted-foreground mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Accuracy Bar */}
        <div className="card-surface rounded-xl p-4 md:p-5 mb-4 md:mb-6">
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <span className="font-rajdhani font-bold text-sm md:text-base">Prediction Accuracy</span>
            <span className="font-rajdhani text-xl md:text-2xl font-bold text-primary">{accuracy}%</span>
          </div>
          <div className="h-2.5 md:h-3 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all" style={{ width: `${accuracy}%` }} />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{user.correctPredictions} correct</span>
            <span>{user.totalPredictions - user.correctPredictions} wrong</span>
          </div>
        </div>

        {/* Login Streak */}
        <div className="card-surface rounded-xl p-4 md:p-5 mb-4 md:mb-6 border border-yellow-400/20">
          <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
            <Calendar className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
            <span className="font-rajdhani font-bold text-sm md:text-base">Login Streak</span>
            <span className="text-yellow-400 font-rajdhani font-bold">{user.loginStreak} days</span>
          </div>
          <div className="grid grid-cols-7 gap-1.5 md:gap-2">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div key={i} className="text-center">
                <div className="text-[10px] md:text-xs text-muted-foreground mb-1">{day}</div>
                <div className={`w-full aspect-square rounded-lg flex items-center justify-center text-[10px] md:text-xs ${
                  i < user.loginStreak ? 'bg-yellow-400/10 border border-yellow-400/50 text-yellow-400' : 'bg-muted border border-border text-muted-foreground'
                }`}>
                  {i < user.loginStreak ? '✓' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div className="card-surface rounded-xl p-4 md:p-5 mb-4 md:mb-6">
          <h2 className="font-rajdhani text-lg md:text-xl font-bold mb-3 md:mb-4">Badges & Achievements</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
            {user.badges.map(badge => (
              <div
                key={badge.id}
                className={`rounded-xl p-3 md:p-4 border text-center transition-all ${
                  badge.earned
                    ? 'bg-primary/5 border-primary/30 hover:border-primary/50'
                    : 'bg-muted/50 border-border opacity-50 grayscale'
                }`}
              >
                <div className="text-2xl md:text-3xl mb-1.5 md:mb-2">{badge.icon}</div>
                <div className="font-rajdhani font-bold text-xs md:text-sm">{badge.name}</div>
                <div className="text-[10px] md:text-xs text-muted-foreground mt-0.5 md:mt-1">{badge.description}</div>
                {badge.earned && <div className="text-[10px] md:text-xs text-primary mt-1">✓ Earned</div>}
                {!badge.earned && <div className="text-[10px] md:text-xs text-muted-foreground mt-1">Locked</div>}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full py-2.5 md:py-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl font-rajdhani font-semibold text-sm md:text-base hover:bg-destructive/20 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
