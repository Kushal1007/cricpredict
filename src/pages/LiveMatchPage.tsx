import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { MOCK_MATCHES, MOCK_BALL_EVENTS } from '@/data/mockData';
import { BallEvent } from '@/types/cricket';
import { ArrowLeft, Coins, Zap, ChevronRight } from 'lucide-react';

const getBallIcon = (type: BallEvent['type']) => {
  switch (type) {
    case 'dot': return <span className="text-muted-foreground">●</span>;
    case 'boundary': return <span className="text-neon-green font-bold">4</span>;
    case 'six': return <span className="text-neon-blue font-bold">6</span>;
    case 'wicket': return <span className="text-red-400 font-bold">W</span>;
    case 'wide': return <span className="text-yellow-400 text-xs">WD</span>;
    default: return <span className="text-foreground">{type}</span>;
  }
};

const getBallBg = (type: BallEvent['type']) => {
  switch (type) {
    case 'boundary': return 'bg-neon-green/10 border-neon-green/40 text-neon-green';
    case 'six': return 'bg-neon-blue/10 border-neon-blue/40 text-neon-blue';
    case 'wicket': return 'bg-red-500/10 border-red-500/40 text-red-400';
    case 'dot': return 'bg-muted border-border text-muted-foreground';
    default: return 'bg-surface-elevated border-border text-foreground';
  }
};

interface PredictionOption {
  id: string;
  label: string;
  emoji: string;
  cost: number;
  multiplier: number;
}

const nextBallOptions: PredictionOption[] = [
  { id: 'dot', label: 'Dot Ball', emoji: '⚫', cost: 50, multiplier: 2.5 },
  { id: '1run', label: '1 Run', emoji: '1️⃣', cost: 50, multiplier: 3 },
  { id: '2run', label: '2 Runs', emoji: '2️⃣', cost: 50, multiplier: 4 },
  { id: 'boundary', label: 'Boundary', emoji: '4️⃣', cost: 50, multiplier: 2.5 },
  { id: 'six', label: 'Six!', emoji: '6️⃣', cost: 100, multiplier: 5 },
  { id: 'wicket', label: 'Wicket!', emoji: '❌', cost: 100, multiplier: 8 },
];

const nextOverOptions: PredictionOption[] = [
  { id: '0-5', label: '0–5 Runs', emoji: '🛡️', cost: 100, multiplier: 2 },
  { id: '6-10', label: '6–10 Runs', emoji: '⚡', cost: 100, multiplier: 2.5 },
  { id: '11+', label: '11+ Runs', emoji: '🔥', cost: 100, multiplier: 4 },
  { id: 'wicket-over', label: 'Wicket in Over', emoji: '❌', cost: 150, multiplier: 3 },
];

const REACTIONS = [
  { emoji: '🔥', label: 'What a shot!', count: 1234 },
  { emoji: '😱', label: 'What a wicket!', count: 892 },
  { emoji: '👏', label: 'Great play!', count: 2145 },
  { emoji: '😂', label: 'Funny moment', count: 456 },
];

const LiveMatchPage: React.FC = () => {
  const { selectedMatchId, setCurrentPage, user, updateCoins, updatePoints, updateStreak, triggerCoinAnimation } = useApp();
  const match = MOCK_MATCHES.find(m => m.id === selectedMatchId) || MOCK_MATCHES[0];
  const [ballEvents, setBallEvents] = useState<BallEvent[]>(MOCK_BALL_EVENTS);
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);
  const [predictionTab, setPredictionTab] = useState<'ball' | 'over' | 'special'>('ball');
  const [predictionResult, setPredictionResult] = useState<{ won: boolean; amount: number } | null>(null);
  const [reactionCounts, setReactionCounts] = useState(REACTIONS.map(r => r.count));
  const [currentScore, setCurrentScore] = useState({ score: match.score1 || '187/4', overs: match.overs || '18.3' });
  const [streak, setStreak] = useState(user?.streak || 0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [pendingPrediction, setPendingPrediction] = useState<{ option: PredictionOption } | null>(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.scrollTop = 0;
    }
  }, [ballEvents]);

  const handlePredict = (option: PredictionOption) => {
    if (!user || user.coins < option.cost) return;
    setSelectedPrediction(option.id);
    setPendingPrediction({ option });
  };

  const confirmPrediction = () => {
    if (!pendingPrediction || !user) return;
    setConfirming(true);
    updateCoins(-pendingPrediction.option.cost);

    setTimeout(() => {
      const won = Math.random() > 0.45;
      const earned = won ? Math.floor(pendingPrediction.option.cost * pendingPrediction.option.multiplier) : 0;

      if (won) {
        updateCoins(earned);
        updatePoints(earned * 2);
        triggerCoinAnimation(earned - pendingPrediction.option.cost);
        setStreak(s => s + 1);
        updateStreak(true);
      } else {
        updateStreak(false);
        setStreak(0);
      }

      setPredictionResult({ won, amount: won ? earned - pendingPrediction.option.cost : -pendingPrediction.option.cost });
      setPendingPrediction(null);
      setSelectedPrediction(null);
      setConfirming(false);

      setTimeout(() => setPredictionResult(null), 3000);
    }, 1500);
  };

  const handleReaction = (idx: number) => {
    setReactionCounts(prev => prev.map((c, i) => i === idx ? c + 1 : c));
  };

  const predictionOptions = predictionTab === 'ball' ? nextBallOptions : nextOverOptions;

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Header */}
      <div className="border-b border-border bg-surface/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => setCurrentPage('dashboard')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="live-pulse w-2 h-2 bg-red-400 rounded-full" />
            <span className="font-rajdhani font-bold text-sm text-red-400">LIVE</span>
            <span className="text-muted-foreground text-sm">{match.matchType}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-surface rounded-full px-3 py-1 border border-border">
            <Coins className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-sm font-semibold text-yellow-400">{user?.coins.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Prediction Result Toast */}
        {predictionResult && (
          <div className={`fixed top-20 right-4 z-50 animate-slide-in-right rounded-xl px-5 py-3 border font-rajdhani font-bold text-lg shadow-lg ${
            predictionResult.won ? 'bg-neon-green/10 border-neon-green/50 text-neon-green' : 'bg-red-500/10 border-red-500/50 text-red-400'
          }`}>
            {predictionResult.won ? `🎉 +${predictionResult.amount} coins!` : `❌ -${Math.abs(predictionResult.amount)} coins`}
          </div>
        )}

        {/* Streak meter */}
        {streak > 0 && (
          <div className="mb-4 flex items-center gap-3 bg-neon-orange/5 border border-neon-orange/20 rounded-xl px-4 py-3 streak-glow">
            <span className="text-2xl">🔥</span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-rajdhani font-bold text-neon-orange text-lg">{streak} Streak!</span>
                {streak >= 3 && <span className="text-xs bg-neon-orange/10 border border-neon-orange/30 text-neon-orange px-2 py-0.5 rounded-full">+100 bonus</span>}
                {streak >= 5 && <span className="text-xs bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 px-2 py-0.5 rounded-full">🏆 Badge!</span>}
              </div>
              <div className="flex gap-1 mt-1">
                {Array.from({ length: Math.min(streak, 10) }).map((_, i) => (
                  <div key={i} className="w-5 h-2 bg-neon-orange rounded-full" />
                ))}
                {Array.from({ length: Math.max(0, 10 - streak) }).map((_, i) => (
                  <div key={i} className="w-5 h-2 bg-border rounded-full" />
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Scorecard */}
          <div className="lg:col-span-1 space-y-4">
            {/* Live Scorecard */}
            <div className="card-surface rounded-xl p-5 glow-border-green">
              <div className="flex items-center gap-2 mb-4">
                <span className="live-pulse w-2 h-2 bg-red-400 rounded-full" />
                <span className="font-rajdhani font-bold text-sm text-red-400">LIVE SCORECARD</span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-rajdhani text-xl font-bold">{match.team1Flag} {match.team1Short}</div>
                  <div className="font-rajdhani text-3xl font-bold text-neon-green">{currentScore.score}</div>
                  <div className="text-sm text-muted-foreground">{currentScore.overs} overs</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Run Rate</div>
                  <div className="font-rajdhani text-xl font-bold text-neon-orange">{match.runRate}</div>
                  <div className="text-xs text-muted-foreground mt-2">Need: 48 (9 balls)</div>
                </div>
              </div>

              <div className="border-t border-border pt-3 space-y-2">
                <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-2">Batting</div>
                {[
                  { name: 'V. Kohli', runs: 72, balls: 45, sr: 160 },
                  { name: 'S. Iyer*', runs: 28, balls: 18, sr: 155 },
                ].map(bat => (
                  <div key={bat.name} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{bat.name}</span>
                    <div className="flex gap-3 text-right">
                      <span className="text-neon-green font-bold">{bat.runs}</span>
                      <span className="text-muted-foreground">({bat.balls})</span>
                      <span className="text-xs text-muted-foreground">{bat.sr}</span>
                    </div>
                  </div>
                ))}
                <div className="border-t border-border pt-2 mt-2">
                  <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-2">Bowling</div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">M. Starc</span>
                    <div className="flex gap-3">
                      <span className="text-muted-foreground">4-0-38-1</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Reactions */}
            <div className="card-surface rounded-xl p-4">
              <div className="text-sm font-rajdhani font-bold mb-3 text-muted-foreground uppercase tracking-wide">Live Reactions</div>
              <div className="grid grid-cols-2 gap-2">
                {REACTIONS.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => handleReaction(i)}
                    className="flex items-center gap-2 bg-muted hover:bg-surface-elevated rounded-lg px-3 py-2 transition-colors text-left"
                  >
                    <span className="text-lg">{r.emoji}</span>
                    <div>
                      <div className="text-xs font-medium truncate">{r.label}</div>
                      <div className="text-xs text-muted-foreground">{reactionCounts[i].toLocaleString()}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center: Ball-by-Ball Timeline */}
          <div className="lg:col-span-1">
            <div className="card-surface rounded-xl p-5 h-full">
              <div className="font-rajdhani font-bold text-sm text-muted-foreground uppercase tracking-wide mb-4">
                Ball-by-Ball Timeline
              </div>
              <div ref={timelineRef} className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {ballEvents.map((event, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                      i === 0 ? 'bg-neon-green/5 border-neon-green/20' : 'bg-muted border-transparent'
                    }`}
                  >
                    <div className="flex-shrink-0 text-xs text-muted-foreground w-10 pt-0.5">
                      {event.over}.{event.ball}
                    </div>
                    <div className={`flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold ${getBallBg(event.type)}`}>
                      {getBallIcon(event.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-muted-foreground truncate">{event.commentary}</div>
                      {event.batsman && (
                        <div className="text-xs text-foreground/60 mt-0.5">{event.batsman} • {event.bowler}</div>
                      )}
                    </div>
                    {event.runs > 0 && (
                      <div className={`flex-shrink-0 text-sm font-rajdhani font-bold ${event.type === 'boundary' ? 'text-neon-green' : event.type === 'six' ? 'text-neon-blue' : 'text-foreground'}`}>
                        +{event.runs}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Prediction Panel */}
          <div className="lg:col-span-1">
            <div className="card-surface rounded-xl p-5 glow-border-blue sticky top-20">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-neon-blue" />
                <span className="font-rajdhani font-bold text-neon-blue uppercase tracking-wide">Predict Now</span>
              </div>

              {/* Tabs */}
              <div className="flex bg-muted rounded-lg p-1 mb-5 gap-1">
                {(['ball', 'over', 'special'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => { setPredictionTab(tab); setSelectedPrediction(null); }}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                      predictionTab === tab ? 'bg-surface text-foreground shadow' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab === 'ball' ? 'Next Ball' : tab === 'over' ? 'Next Over' : 'Special'}
                  </button>
                ))}
              </div>

              {predictionTab === 'special' ? (
                <div className="space-y-2">
                  {[
                    { label: 'Boundary this over', emoji: '4️⃣', cost: 80, mult: 2 },
                    { label: 'Wicket this over', emoji: '❌', cost: 120, mult: 4 },
                    { label: 'Next batsman: boundary', emoji: '🏏', cost: 150, mult: 3.5 },
                  ].map((s, i) => (
                    <button
                      key={i}
                      className="w-full flex items-center justify-between bg-muted hover:bg-surface-elevated border border-border hover:border-neon-blue/30 rounded-lg px-4 py-3 transition-all"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <span>{s.emoji}</span>
                        <span>{s.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neon-blue">{s.mult}x</span>
                        <div className="flex items-center gap-1 text-yellow-400 text-xs">
                          <Coins className="w-3 h-3" />
                          {s.cost}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {predictionOptions.map(option => (
                    <button
                      key={option.id}
                      onClick={() => handlePredict(option)}
                      disabled={!user || user.coins < option.cost}
                      className={`w-full flex items-center justify-between rounded-lg px-4 py-3 border transition-all ${
                        selectedPrediction === option.id
                          ? 'bg-neon-blue/10 border-neon-blue shadow-neon-blue'
                          : 'bg-muted border-border hover:border-neon-blue/40 hover:bg-surface-elevated'
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{option.emoji}</span>
                        <span className="text-sm font-medium">{option.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-neon-green font-semibold">{option.multiplier}x</span>
                        <div className="flex items-center gap-1 text-yellow-400 text-xs font-semibold">
                          <Coins className="w-3 h-3" />
                          {option.cost}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {pendingPrediction && (
                <div className="mt-4 bg-neon-blue/5 border border-neon-blue/30 rounded-xl p-4">
                  <div className="text-sm text-center mb-3">
                    Confirm prediction: <span className="font-bold text-neon-blue">{pendingPrediction.option.emoji} {pendingPrediction.option.label}</span>
                  </div>
                  <div className="text-xs text-center text-muted-foreground mb-3">
                    Cost: <span className="text-yellow-400">{pendingPrediction.option.cost} coins</span> • Win: <span className="text-neon-green">{Math.floor(pendingPrediction.option.cost * pendingPrediction.option.multiplier)} coins</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setPendingPrediction(null); setSelectedPrediction(null); }}
                      className="flex-1 py-2 bg-muted border border-border rounded-lg text-sm hover:bg-surface-elevated transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmPrediction}
                      disabled={confirming}
                      className="flex-1 py-2 bg-neon-blue/10 border border-neon-blue text-neon-blue rounded-lg text-sm font-bold hover:bg-neon-blue/20 transition-all disabled:opacity-50"
                    >
                      {confirming ? '⏳ Processing...' : '✓ Confirm'}
                    </button>
                  </div>
                </div>
              )}

              {/* Leaderboard mini */}
              <div className="mt-5 pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Match Leaders</span>
                  <button onClick={() => setCurrentPage('leaderboard')} className="text-xs text-neon-green hover:underline flex items-center gap-1">
                    View All <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                {[
                  { rank: 1, name: 'PredictionGod', pts: 2840 },
                  { rank: 2, name: 'CricketOracle', pts: 2650 },
                  { rank: 3, name: user?.username || 'You', pts: 1240 },
                ].map(entry => (
                  <div key={entry.rank} className={`flex items-center gap-3 py-2 ${entry.name === user?.username ? 'text-neon-green' : ''}`}>
                    <span className={`text-xs w-5 font-bold ${entry.rank === 1 ? 'text-yellow-400' : entry.rank === 2 ? 'text-gray-300' : entry.rank === 3 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                      #{entry.rank}
                    </span>
                    <span className="flex-1 text-sm truncate">{entry.name}</span>
                    <span className="text-xs text-neon-blue font-semibold">{entry.pts} pts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMatchPage;
