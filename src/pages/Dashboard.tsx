import React, { useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { MOCK_MATCHES } from '@/data/mockData';
import { Match } from '@/types/cricket';
import { Zap, Clock, Coins, TrendingUp, Trophy, Target } from 'lucide-react';

const MatchCard: React.FC<{ match: Match; onJoin: () => void }> = ({ match, onJoin }) => {
  const isLive = match.status === 'live';
  return (
    <div className="card-surface rounded-xl p-5 hover:border-neon-green/30 transition-all cursor-pointer group" onClick={onJoin}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs bg-surface-elevated px-2 py-0.5 rounded border border-border text-muted-foreground">{match.matchType}</span>
          {isLive && (
            <span className="flex items-center gap-1 text-xs bg-red-500/10 border border-red-500/30 text-red-400 px-2 py-0.5 rounded-full">
              <span className="live-pulse w-1.5 h-1.5 bg-red-400 rounded-full" />
              LIVE
            </span>
          )}
        </div>
        <span className="text-xs text-muted-foreground">{isLive ? match.overs + ' ov' : match.startTime}</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 text-center">
          <div className="text-3xl mb-1">{match.team1Flag}</div>
          <div className="font-rajdhani text-lg font-bold">{match.team1Short}</div>
          {isLive && match.battingTeam === match.team1Short && (
            <div className="font-rajdhani text-xl font-bold text-neon-green">{match.score1}</div>
          )}
          {isLive && match.battingTeam !== match.team1Short && match.score1 && match.score1 !== '—' && (
            <div className="text-sm text-muted-foreground">{match.score1}</div>
          )}
        </div>
        <div className="text-center px-4">
          <div className="font-rajdhani text-sm text-muted-foreground font-bold">VS</div>
          {isLive && match.runRate && (
            <div className="text-xs text-neon-orange mt-1">RR: {match.runRate}</div>
          )}
        </div>
        <div className="flex-1 text-center">
          <div className="text-3xl mb-1">{match.team2Flag}</div>
          <div className="font-rajdhani text-lg font-bold">{match.team2Short}</div>
          {isLive && match.battingTeam === match.team2Short && (
            <div className="font-rajdhani text-xl font-bold text-neon-green">{match.score2}</div>
          )}
          {isLive && match.battingTeam !== match.team2Short && match.score2 && match.score2 !== '—' && (
            <div className="text-sm text-muted-foreground">{match.score2}</div>
          )}
        </div>
      </div>

      <div className="text-xs text-muted-foreground text-center mb-4 truncate">{match.venue}</div>

      <button className={`w-full py-2.5 rounded-lg font-rajdhani font-semibold text-sm transition-all ${
        isLive
          ? 'bg-neon-green/10 border border-neon-green/40 text-neon-green hover:bg-neon-green/20 group-hover:shadow-neon-green'
          : 'bg-neon-blue/10 border border-neon-blue/40 text-neon-blue hover:bg-neon-blue/20'
      }`}>
        {isLive ? '⚡ Join Live Match' : '🔔 View Details'}
      </button>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { user, setCurrentPage, setSelectedMatchId } = useApp();
  const tickerRef = useRef<HTMLDivElement>(null);

  const liveMatches = MOCK_MATCHES.filter(m => m.status === 'live');
  const upcomingMatches = MOCK_MATCHES.filter(m => m.status === 'upcoming');

  const accuracy = user ? Math.round((user.correctPredictions / Math.max(user.totalPredictions, 1)) * 100) : 0;

  const handleJoinMatch = (matchId: string) => {
    setSelectedMatchId(matchId);
    setCurrentPage('live-match');
  };

  const levelProgress = user ? ((user.points % 3000) / 3000) * 100 : 0;

  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      {/* Live ticker */}
      <div className="bg-surface border-b border-border overflow-hidden">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-red-500 text-white text-xs font-bold px-3 py-2 flex items-center gap-1">
            <span className="live-pulse w-2 h-2 bg-white rounded-full" />
            LIVE
          </div>
          <div className="overflow-hidden flex-1">
            <div className="ticker-animation whitespace-nowrap text-xs text-muted-foreground py-2 px-4">
              🏏 IND vs AUS — 187/4 (18.3 ov) — Kohli 72*(45) 🏏 ENG vs SA — 142/6 (16.2 ov) — Markram 38*(24) 🔥 Next ball prediction open! 🏆 PredictionGod leads the global leaderboard with 24,500 pts
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="font-rajdhani text-3xl md:text-4xl font-bold">
            Welcome back, <span className="neon-text-green">{user?.username}</span>! 👋
          </h1>
          <p className="text-muted-foreground mt-1">There are {liveMatches.length} live matches happening right now.</p>
        </div>

        {/* User Stats */}
        {user && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card-surface rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-muted-foreground">Coins</span>
              </div>
              <div className="font-rajdhani text-2xl font-bold text-yellow-400">{user.coins.toLocaleString()}</div>
            </div>
            <div className="card-surface rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-neon-blue" />
                <span className="text-xs text-muted-foreground">Points</span>
              </div>
              <div className="font-rajdhani text-2xl font-bold text-neon-blue">{user.points.toLocaleString()}</div>
            </div>
            <div className="card-surface rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-neon-orange" />
                <span className="text-xs text-muted-foreground">Streak</span>
              </div>
              <div className="font-rajdhani text-2xl font-bold text-neon-orange">{user.streak} 🔥</div>
            </div>
            <div className="card-surface rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-neon-green" />
                <span className="text-xs text-muted-foreground">Accuracy</span>
              </div>
              <div className="font-rajdhani text-2xl font-bold text-neon-green">{accuracy}%</div>
            </div>
          </div>
        )}

        {/* Level Progress */}
        {user && (
          <div className="card-surface rounded-xl p-5 mb-8">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="font-rajdhani font-bold text-lg">{user.levelName}</span>
                <span className="text-muted-foreground text-sm ml-2">Level {user.level}</span>
              </div>
              <span className="text-sm text-muted-foreground">{user.points} pts</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-neon-green rounded-full transition-all duration-1000 shadow-neon-green"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
              <span>Current</span>
              <span>{3000 - (user.points % 3000)} pts to next level</span>
            </div>
          </div>
        )}

        {/* Live Matches */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-rajdhani text-2xl font-bold">
              🔴 Live Matches
            </h2>
            <span className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-2 py-0.5 rounded-full">
              {liveMatches.length} Live
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveMatches.map(match => (
              <MatchCard key={match.id} match={match} onJoin={() => handleJoinMatch(match.id)} />
            ))}
          </div>
        </div>

        {/* Upcoming Matches */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-rajdhani text-2xl font-bold">
              <Clock className="w-5 h-5 inline mr-1 text-neon-blue" />
              Upcoming Matches
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingMatches.map(match => (
              <MatchCard key={match.id} match={match} onJoin={() => {}} />
            ))}
          </div>
        </div>

        {/* Daily Bonus */}
        <div className="mt-8 card-surface rounded-xl p-5 border border-yellow-400/20">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-yellow-400/10 flex items-center justify-center text-2xl">
                🎁
              </div>
              <div>
                <div className="font-rajdhani font-bold text-lg">Daily Login Bonus</div>
                <div className="text-sm text-muted-foreground">Day {user?.loginStreak || 1} streak — Claim your reward!</div>
              </div>
            </div>
            <button className="px-6 py-2.5 bg-yellow-400/10 border border-yellow-400/40 text-yellow-400 font-rajdhani font-bold rounded-lg hover:bg-yellow-400/20 transition-colors">
              Claim +{((user?.loginStreak || 1) * 50 + 50)} Coins
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
