import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Coins, Clock, Zap, ChevronRight, Trophy, Info, Calendar, MapPin, Swords } from 'lucide-react';
import { PredictionPhase, PredictionQuestion, PredictionOption } from '@/types/cricket';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLiveMatches } from '@/hooks/useLiveMatches';
import { mapLiveMatchesForDisplay } from '@/lib/liveMatchUtils';

const TEAM_COLORS: Record<string, { from: string; to: string }> = {
  mi:   { from: 'from-blue-600',   to: 'to-blue-400'   },
  csk:  { from: 'from-yellow-500', to: 'to-amber-400'  },
  rcb:  { from: 'from-red-600',    to: 'to-rose-400'   },
  kkr:  { from: 'from-purple-600', to: 'to-violet-400' },
  dc:   { from: 'from-blue-500',   to: 'to-sky-400'    },
  srh:  { from: 'from-orange-600', to: 'to-amber-500'  },
  rr:   { from: 'from-pink-600',   to: 'to-rose-400'   },
  pbks: { from: 'from-red-500',    to: 'to-orange-400' },
  lsg:  { from: 'from-cyan-500',   to: 'to-teal-400'   },
  gt:   { from: 'from-sky-600',    to: 'to-cyan-400'   },
};

// ─── Match Picker ────────────────────────────────────────────────────────────
const MatchPicker: React.FC<{
  loading: boolean;
  matches: ReturnType<typeof mapLiveMatchesForDisplay>;
  onPick: (matchId: string) => void;
  onBack: () => void;
}> = ({ loading, matches, onPick, onBack }) => {
  const announcedMatches = matches;

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-14 md:pt-16 pb-12">
        <div className="container mx-auto px-3 sm:px-4 max-w-3xl py-5">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors mb-5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Dashboard</span>
          </button>
          <div className="rounded-2xl border border-border/60 bg-card/70 p-8 text-center text-muted-foreground text-sm">
            Loading live matches…
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-14 md:pt-16 pb-12">
      <div className="container mx-auto px-3 sm:px-4 max-w-3xl py-5">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors mb-5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Dashboard</span>
        </button>

        <div className="mb-6">
          <h1 className="font-rajdhani text-3xl font-black mb-1">
            🏏 <span className="neon-text-green">Live Matches</span>
          </h1>
          <p className="text-muted-foreground text-sm">Select a match to make your predictions</p>
        </div>

        <div className="space-y-3">
          {announcedMatches.length === 0 && (
            <div className="rounded-2xl border border-border/60 bg-card/70 p-8 text-center text-muted-foreground text-sm">
              No synced matches available yet.
            </div>
          )}
          {announcedMatches.map(m => {
            const tc1 = TEAM_COLORS[m.team1Id] ?? TEAM_COLORS.mi;
            const tc2 = TEAM_COLORS[m.team2Id] ?? TEAM_COLORS.mi;
            const isLive = m.status === 'live';
            const isCompleted = m.status === 'completed';

            return (
              <button
                key={m.id}
                onClick={() => !isCompleted && onPick(m.id)}
                disabled={isCompleted}
                className={`w-full text-left relative overflow-hidden rounded-2xl border transition-all group ${
                  isLive
                    ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.15)] hover:border-red-500/70'
                    : isCompleted
                    ? 'border-border/30 opacity-50 cursor-not-allowed'
                    : 'border-border/60 hover:border-primary/40 hover:shadow-lg'
                }`}
              >
                {isLive && <div className="h-0.5 w-full bg-gradient-to-r from-red-600/60 via-red-500 to-red-600/60 animate-pulse" />}
                <div className="p-4 bg-card/70 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${
                      isLive ? 'bg-red-500/15 border-red-500/30 text-red-400' :
                      isCompleted ? 'bg-muted/60 border-border/50 text-muted-foreground' :
                      'bg-muted/60 border-border/50 text-muted-foreground'
                    }`}>
                      {isLive ? (
                        <span className="flex items-center gap-1.5">
                          <span className="live-pulse w-1.5 h-1.5 bg-red-400 rounded-full inline-block" />
                          LIVE
                        </span>
                      ) : isCompleted ? '✅ Completed' : `Match ${m.matchNumber}`}
                    </span>
                    <div className="text-right">
                      <div className="text-[11px] font-semibold">
                        {new Date(m.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', weekday: 'short' })}
                      </div>
                      <div className="text-[11px] text-muted-foreground">{m.time}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 flex items-center gap-2.5">
                      <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br ${tc1.from} ${tc1.to} shadow-md`}>
                        {m.team1Emoji}
                      </div>
                      <div>
                        <div className="font-rajdhani font-black text-base">{m.team1Short}</div>
                        {m.score1 && <div className="text-[11px] font-semibold text-primary">{m.score1}</div>}
                      </div>
                    </div>
                    <div className="shrink-0 w-8 h-8 rounded-full bg-muted/60 border border-border/50 flex items-center justify-center">
                      <Swords className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 flex items-center gap-2.5 justify-end">
                      <div className="text-right">
                        <div className="font-rajdhani font-black text-base">{m.team2Short}</div>
                        {m.score2 && <div className="text-[11px] font-semibold text-primary">{m.score2}</div>}
                      </div>
                      <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br ${tc2.from} ${tc2.to} shadow-md`}>
                        {m.team2Emoji}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{m.venue}, {m.city}</span>
                    </div>
                    {!isCompleted && (
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                        isLive
                          ? 'bg-red-500/20 border border-red-500/40 text-red-400'
                          : 'bg-primary/15 border border-primary/30 text-primary group-hover:bg-primary/25'
                      }`}>
                        {isLive ? '🔴 Predict Live' : '🎯 Predict'}
                      </span>
                    )}
                  </div>

                  {isCompleted && m.result && (
                    <div className="mt-3 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary">
                      {m.result}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── Static prediction data for a MI vs CSK match ───────────────────────────

const PRE_MATCH_QS: PredictionQuestion[] = [
  {
    id: 'pm1',
    phase: 'pre-match',
    category: 'batting',
    question: 'Who will be MI\'s top scorer?',
    description: 'Pick the MI batter who scores the most runs in their innings.',
    cost: 100,
    opensAt: '',
    closesAt: '',
    status: 'open',
    options: [
      { id: 'rohit', label: 'Rohit Sharma', emoji: '🧢', odds: 2.5 },
      { id: 'sky', label: 'Suryakumar Yadav', emoji: '🌟', odds: 2.8 },
      { id: 'hardik', label: 'Hardik Pandya', emoji: '💪', odds: 3.5 },
      { id: 'ishan', label: 'Ishan Kishan', emoji: '🧤', odds: 4.0 },
    ],
  },
  {
    id: 'pm2',
    phase: 'pre-match',
    category: 'match',
    question: 'Total match sixes?',
    description: 'Combined sixes hit by both teams across both innings.',
    cost: 100,
    opensAt: '',
    closesAt: '',
    status: 'open',
    options: [
      { id: 'u10', label: 'Under 10', emoji: '📉', odds: 2.2 },
      { id: '10-14', label: '10 – 14', emoji: '📊', odds: 2.0 },
      { id: '15+', label: '15 or more', emoji: '🚀', odds: 3.5 },
    ],
  },
  {
    id: 'pm3',
    phase: 'pre-match',
    category: 'bowling',
    question: 'Who takes the most wickets for CSK?',
    description: 'Highest wicket-taker from Chennai Super Kings today.',
    cost: 100,
    opensAt: '',
    closesAt: '',
    status: 'open',
    options: [
      { id: 'bumrah', label: 'Deepak Chahar', emoji: '🔴', odds: 2.5 },
      { id: 'jadeja', label: 'Jadeja', emoji: '🌀', odds: 2.8 },
      { id: 'mustafizur', label: 'Mustafizur Rahman', emoji: '⚡', odds: 3.2 },
      { id: 'other', label: 'Someone else', emoji: '🎲', odds: 5.0 },
    ],
  },
  {
    id: 'pm4',
    phase: 'pre-match',
    category: 'team',
    question: 'Match winner?',
    description: 'Who wins the match outright?',
    cost: 80,
    opensAt: '',
    closesAt: '',
    status: 'open',
    options: [
      { id: 'mi', label: 'Mumbai Indians', emoji: '🔵', odds: 1.9 },
      { id: 'csk', label: 'Chennai Super Kings', emoji: '🟡', odds: 2.1 },
    ],
  },
];

const POWERPLAY_QS: PredictionQuestion[] = [
  {
    id: 'pp1',
    phase: 'powerplay',
    category: 'batting',
    question: 'Runs in overs 7–10?',
    description: 'How many runs will be scored in the middle overs phase immediately after powerplay?',
    cost: 80,
    opensAt: '',
    closesAt: '',
    status: 'open',
    options: [
      { id: 'u28', label: 'Under 28', emoji: '🛡️', odds: 2.2 },
      { id: '28-36', label: '28 – 36', emoji: '⚡', odds: 2.0 },
      { id: '37+', label: '37 or more', emoji: '🔥', odds: 3.0 },
    ],
  },
  {
    id: 'pp2',
    phase: 'powerplay',
    category: 'bowling',
    question: 'Next wicket comes in how many overs?',
    description: 'From the end of powerplay, when does the next wicket fall?',
    cost: 80,
    opensAt: '',
    closesAt: '',
    status: 'open',
    options: [
      { id: '1ov', label: 'Next over', emoji: '💥', odds: 3.0 },
      { id: '2-3ov', label: '2 – 3 overs', emoji: '⏳', odds: 2.0 },
      { id: '4+ov', label: '4 or more overs', emoji: '🧱', odds: 2.5 },
    ],
  },
];

const TIMEOUT_QS: PredictionQuestion[] = [
  {
    id: 'st1',
    phase: 'strategic-timeout',
    category: 'batting',
    question: 'Will the batting team hit 3+ sixes in the final 5 overs?',
    description: 'Sixes in overs 16–20 of this innings.',
    cost: 100,
    opensAt: '',
    closesAt: '',
    status: 'open',
    options: [
      { id: 'yes3six', label: 'Yes – 3 or more', emoji: '💣', odds: 2.5 },
      { id: 'no3six', label: 'No – fewer than 3', emoji: '🛡️', odds: 1.8 },
    ],
  },
  {
    id: 'st2',
    phase: 'strategic-timeout',
    category: 'match',
    question: 'Final over (over 20) total?',
    description: 'How many runs in the very last over of this innings?',
    cost: 120,
    opensAt: '',
    closesAt: '',
    status: 'open',
    options: [
      { id: 'u10', label: 'Under 10', emoji: '😰', odds: 2.0 },
      { id: '10-13', label: '10 – 13', emoji: '💥', odds: 2.2 },
      { id: '14+', label: '14 or more', emoji: '🚀', odds: 4.0 },
    ],
  },
];

const INNINGS_QS: PredictionQuestion[] = [
  {
    id: 'ib1',
    phase: 'innings-break',
    category: 'match',
    question: 'How does the chase end?',
    description: 'Choose how the second innings concludes.',
    cost: 100,
    opensAt: '',
    closesAt: '',
    status: 'open',
    options: [
      { id: 'big-win', label: 'Win with 10+ balls left', emoji: '🏆', odds: 2.0 },
      { id: 'close-win', label: 'Win in last over', emoji: '😅', odds: 4.0 },
      { id: 'lose', label: 'Defending team wins', emoji: '🏰', odds: 2.2 },
    ],
  },
  {
    id: 'ib2',
    phase: 'innings-break',
    category: 'batting',
    question: 'Player of the Match?',
    description: 'Who picks up the POTM award at the end?',
    cost: 150,
    opensAt: '',
    closesAt: '',
    status: 'open',
    options: [
      { id: 'kohli', label: 'Virat Kohli', emoji: '👑', odds: 3.0 },
      { id: 'rohit', label: 'Rohit Sharma', emoji: '🧢', odds: 3.5 },
      { id: 'dhoni', label: 'MS Dhoni', emoji: '⚡', odds: 4.0 },
      { id: 'other', label: 'Someone else', emoji: '🎲', odds: 6.0 },
    ],
  },
  {
    id: 'ib3',
    phase: 'innings-break',
    category: 'match',
    question: 'Will it go to a Super Over?',
    description: 'Tied match going to Super Over.',
    cost: 80,
    opensAt: '',
    closesAt: '',
    status: 'open',
    options: [
      { id: 'yes-so', label: 'Yes!', emoji: '🌪️', odds: 8.0 },
      { id: 'no-so', label: 'No', emoji: '✅', odds: 1.2 },
    ],
  },
];

const PHASE_META: Record<PredictionPhase, {
  label: string; icon: string; color: string; border: string; bg: string; badge: string; window: string;
}> = {
  'pre-match': {
    label: 'Pre-Match',
    icon: '🕐',
    color: 'text-neon-orange',
    border: 'border-neon-orange/30',
    bg: 'bg-neon-orange/5',
    badge: 'bg-neon-orange/10 text-neon-orange border-neon-orange/30',
    window: 'Opens 4 hours before match',
  },
  'powerplay': {
    label: 'Powerplay',
    icon: '⚡',
    color: 'text-neon-green',
    border: 'border-neon-green/30',
    bg: 'bg-neon-green/5',
    badge: 'bg-neon-green/10 text-neon-green border-neon-green/30',
    window: '5 min window · After over 6',
  },
  'strategic-timeout': {
    label: 'Timeout',
    icon: '⏸️',
    color: 'text-neon-blue',
    border: 'border-neon-blue/30',
    bg: 'bg-neon-blue/5',
    badge: 'bg-neon-blue/10 text-neon-blue border-neon-blue/30',
    window: '2 min window · Overs 12–16',
  },
  'innings-break': {
    label: 'Innings Break',
    icon: '🔄',
    color: 'text-purple-400',
    border: 'border-purple-400/30',
    bg: 'bg-purple-400/5',
    badge: 'bg-purple-400/10 text-purple-400 border-purple-400/30',
    window: '10 min window · Between innings',
  },
};

// ─── Sub-components ──────────────────────────────────────────────────────────

interface QuestionCardProps {
  q: PredictionQuestion;
  userAnswer: string | null;
  onAnswer: (qId: string, optId: string, cost: number) => Promise<void>;
  disabled: boolean;
  isSubmitting?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ q, userAnswer, onAnswer, disabled, isSubmitting }) => {
  const [pending, setPending] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const meta = PHASE_META[q.phase];

  const handleSelect = (opt: PredictionOption) => {
    if (userAnswer || disabled) return;
    setPending(opt.id);
  };

  const handleConfirm = async () => {
    if (!pending) return;
    setConfirming(true);
    await onAnswer(q.id, pending, q.cost);
    setPending(null);
    setConfirming(false);
  };

  const answered = !!userAnswer;
  const pendingOpt = q.options.find(o => o.id === pending);

  return (
    <div className={`rounded-2xl border ${meta.border} ${meta.bg} p-4 space-y-3`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${meta.badge} mb-2`}>
            {meta.icon} {meta.label}
          </span>
          <p className="font-semibold text-sm leading-snug">{q.question}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{q.description}</p>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <div className="flex items-center gap-1 text-yellow-400 text-xs font-semibold">
            <Coins className="w-3.5 h-3.5" />
            {q.cost}
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-2">
        {q.options.map(opt => {
          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt)}
              disabled={answered || disabled || confirming}
              className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm transition-all ${
                answered && userAnswer === opt.id
                  ? `${meta.badge} border-current font-semibold`
                  : pending === opt.id
                  ? `${meta.badge} border-current`
                  : answered
                  ? 'bg-muted border-transparent text-muted-foreground opacity-50'
                  : 'bg-background/60 border-border hover:bg-surface-elevated'
              } disabled:cursor-not-allowed`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{opt.emoji}</span>
                <span>{opt.label}</span>
              </div>
              <span className={`text-xs font-bold ${meta.color}`}>{opt.odds}×</span>
            </button>
          );
        })}
      </div>

      {/* Confirm / answered state */}
      {pending && !answered && (
        <div className={`rounded-xl border p-3 space-y-2 ${meta.badge}`}>
          <p className="text-xs text-center">
            Confirm: <strong>{pendingOpt?.emoji} {pendingOpt?.label}</strong>
            <span className="text-muted-foreground"> · Potential win: </span>
            <strong className="text-neon-green">{Math.floor(q.cost * (pendingOpt?.odds ?? 1))} coins</strong>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPending(null)}
              className="flex-1 py-1.5 text-xs bg-background/60 border border-border rounded-lg hover:bg-surface-elevated transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={confirming || isSubmitting}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all border ${meta.badge} border-current hover:opacity-80 disabled:opacity-50`}
            >
              {confirming || isSubmitting ? '⏳ Saving…' : '✓ Confirm'}
            </button>
          </div>
        </div>
      )}

      {answered && (
        <p className="text-center text-xs text-muted-foreground italic">
          ✓ Prediction locked in · Result after match phase ends
        </p>
      )}
    </div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────

const PHASES: { key: PredictionPhase; questions: PredictionQuestion[] }[] = [
  { key: 'pre-match', questions: PRE_MATCH_QS },
  { key: 'powerplay', questions: POWERPLAY_QS },
  { key: 'strategic-timeout', questions: TIMEOUT_QS },
  { key: 'innings-break', questions: INNINGS_QS },
];

const LiveMatchPage: React.FC = () => {
  const { selectedMatchId, setCurrentPage, setSelectedMatchId, user, updateCoins, updatePoints, updateStreak, triggerCoinAnimation } = useApp();
  const { toast } = useToast();
  const { matches: liveMatches, loading } = useLiveMatches();

  // All hooks must be at top level — before any early returns
  const [pickedMatchId, setPickedMatchId] = useState<string | null>(selectedMatchId);
  const [activePhase, setActivePhase] = useState<PredictionPhase>('pre-match');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [streak, setStreak] = useState(user?.streak || 0);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const displayMatches = mapLiveMatchesForDisplay(liveMatches);

  const handlePickMatch = (id: string) => {
    setPickedMatchId(id);
    setSelectedMatchId(id);
  };

  const handleBackToPicker = () => {
    setPickedMatchId(null);
    setSelectedMatchId(null);
  };

  useEffect(() => {
    if (pickedMatchId && !displayMatches.some((match) => match.id === pickedMatchId)) {
      setPickedMatchId(null);
      setSelectedMatchId(null);
    }
  }, [displayMatches, pickedMatchId, setSelectedMatchId]);

  // Show picker if no match chosen
  if (!pickedMatchId) {
    return <MatchPicker loading={loading} matches={displayMatches} onPick={handlePickMatch} onBack={() => setCurrentPage('dashboard')} />;
  }

  const match = displayMatches.find((item) => item.id === pickedMatchId);

  if (!match) {
    return <MatchPicker loading={loading} matches={displayMatches} onPick={handlePickMatch} onBack={() => setCurrentPage('dashboard')} />;
  }

  const isLive = match.status === 'live';
  const isCompleted = match.status === 'completed';

  const handleAnswer = async (qId: string, optId: string, cost: number) => {
    if (!user || user.coins < cost) {
      toast({ title: "Not enough coins", description: "You don't have enough coins for this prediction.", variant: "destructive" });
      return;
    }

    setSubmitting(qId);

    const question = PHASES.flatMap(p => p.questions).find(q => q.id === qId);
    const opt = question?.options.find(o => o.id === optId);
    if (!question || !opt) { setSubmitting(null); return; }

    const potentialWin = Math.floor(cost * opt.odds);

    // 1. Deduct coins immediately
    await updateCoins(-cost);
    setAnswers(prev => ({ ...prev, [qId]: optId }));
    setSubmitting(null);

    // 2. Save prediction to DB
    const { error: insertError } = await supabase.from('predictions').insert({
      user_id: user.id,
      match_id: match.id,
      question_id: qId,
      question_text: question.question,
      phase: question.phase,
      option_id: optId,
      option_label: opt.label,
      cost_paid: cost,
      potential_win: potentialWin,
      result: 'pending',
    });

    if (insertError) {
      console.error('Failed to save prediction:', insertError);
      toast({ title: "Prediction saved locally", description: "Could not sync to server — will retry.", variant: "destructive" });
    } else {
      toast({ title: "Prediction locked! 🎯", description: `${opt.emoji} ${opt.label} · Potential win: ${potentialWin} coins` });
    }

    // 3. Simulate result after a delay (virtual time resolution)
    setTimeout(async () => {
      const won = Math.random() > 0.4;
      const earned = won ? potentialWin : 0;

      // Update prediction result in DB
      await supabase
        .from('predictions')
        .update({
          result: won ? 'won' : 'lost',
          coins_won: won ? earned : 0,
          resolved_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .eq('question_id', qId)
        .eq('match_id', match.id);

      if (won && earned > 0) {
        await updateCoins(earned);
        await updatePoints(earned);
        triggerCoinAnimation(earned - cost);
        setStreak(s => s + 1);
        await updateStreak(true);
        toast({ title: `✅ Prediction won! +${earned} coins`, description: `${opt.emoji} ${opt.label} was correct!` });
      } else {
        setStreak(0);
        await updateStreak(false);
        toast({ title: "❌ Prediction lost", description: `Better luck next time!`, variant: "destructive" });
      }
    }, 3000 + Math.random() * 2000);
  };

  const activePhaseData = PHASES.find(p => p.key === activePhase)!;
  const activeMeta = PHASE_META[activePhase];
  const answeredCount = activePhaseData.questions.filter(q => answers[q.id]).length;

  return (
    <div className="min-h-screen bg-background pt-14 md:pt-16 pb-12">

      {/* Top bar */}
      <div className="border-b border-border bg-surface/50 backdrop-blur-sm sticky top-14 md:top-16 z-10">
        <div className="container mx-auto px-3 sm:px-4 max-w-3xl py-3 flex items-center justify-between">
          <button
            onClick={handleBackToPicker}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">All Matches</span>
          </button>

          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isLive ? 'live-pulse bg-red-400' : isCompleted ? 'bg-primary' : 'bg-secondary'}`} />
            <span className={`font-rajdhani font-bold text-sm ${isLive ? 'text-red-400' : isCompleted ? 'text-primary' : 'text-secondary'}`}>
              {isLive ? 'LIVE' : isCompleted ? 'COMPLETED' : 'UPCOMING'}
            </span>
            <span className="text-muted-foreground text-xs hidden sm:inline">{match.matchType}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-surface rounded-full px-3 py-1 border border-border">
              <Coins className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-sm font-semibold text-yellow-400">{user?.coins.toLocaleString()}</span>
            </div>
            <button
              onClick={() => setCurrentPage('guide')}
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
              title="How to play"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 max-w-3xl py-5 space-y-5">

        {/* Match header card */}
        <div className="card-surface rounded-2xl p-4 glow-border-green">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <div className="text-2xl sm:text-3xl">{match.team1Emoji}</div>
              <div className="font-rajdhani font-bold text-lg sm:text-xl mt-1">{match.team1Short}</div>
              {match.score1 && (
                <div className="font-rajdhani text-neon-green font-bold text-sm">{match.score1}</div>
              )}
            </div>

            <div className="flex flex-col items-center px-4 gap-1">
              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">vs</div>
              <div className={`text-xs font-bold px-3 py-1 rounded-full border ${
                isLive
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : isCompleted
                  ? 'bg-primary/10 border-primary/20 text-primary'
                  : 'bg-secondary/10 border-secondary/20 text-secondary'
              }`}>
                {isLive ? 'LIVE' : isCompleted ? 'COMPLETED' : 'UPCOMING'}
              </div>
              {match.overs && (
                <div className="text-xs text-muted-foreground">{match.overs} ov</div>
              )}
            </div>

            <div className="text-center flex-1">
              <div className="text-2xl sm:text-3xl">{match.team2Emoji}</div>
              <div className="font-rajdhani font-bold text-lg sm:text-xl mt-1">{match.team2Short}</div>
              {match.score2 && (
                <div className="font-rajdhani text-neon-green font-bold text-sm">{match.score2}</div>
              )}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span>📍 {match.venue}</span>
            {match.runRate && <span>RR: <span className="text-neon-orange font-semibold">{match.runRate}</span></span>}
          </div>
          {match.result && (
            <div className="mt-3 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-center text-xs font-semibold text-primary">
              {match.result}
            </div>
          )}
        </div>

        {/* Streak banner */}
        {streak > 0 && (
          <div className="flex items-center gap-3 bg-neon-orange/5 border border-neon-orange/20 rounded-xl px-4 py-3 streak-glow">
            <span className="text-2xl">🔥</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-rajdhani font-bold text-neon-orange">{streak} Streak!</span>
                {streak >= 3 && <span className="text-xs bg-neon-orange/10 border border-neon-orange/30 text-neon-orange px-2 py-0.5 rounded-full">+100 bonus</span>}
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

        {/* Phase tabs */}
        <div>
          <h2 className="font-rajdhani font-bold text-base text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-neon-blue" /> Prediction Windows
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {PHASES.map(({ key }) => {
              const meta = PHASE_META[key];
              const phaseAnswers = PHASES.find(p => p.key === key)!.questions.filter(q => answers[q.id]).length;
              const total = PHASES.find(p => p.key === key)!.questions.length;
              return (
                <button
                  key={key}
                  onClick={() => setActivePhase(key)}
                  className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all min-w-[72px] ${
                    activePhase === key
                      ? `${meta.badge} border-current`
                      : 'bg-surface border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="text-lg">{meta.icon}</span>
                  <span className="leading-tight text-center">{meta.label}</span>
                  <span className={`text-xs ${phaseAnswers === total ? 'text-neon-green' : 'opacity-60'}`}>
                    {phaseAnswers}/{total}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Phase header */}
        <div className={`rounded-xl border ${activeMeta.border} ${activeMeta.bg} px-4 py-3 flex items-center justify-between`}>
          <div>
            <span className={`font-rajdhani font-bold text-base ${activeMeta.color}`}>
              {activeMeta.icon} {activeMeta.label} Predictions
            </span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <Clock className="w-3 h-3" /> {activeMeta.window}
            </div>
          </div>
          <div className="text-right">
            <div className={`font-bold text-sm ${activeMeta.color}`}>{answeredCount}/{activePhaseData.questions.length}</div>
            <div className="text-xs text-muted-foreground">answered</div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {activePhaseData.questions.map(q => (
            <QuestionCard
              key={q.id}
              q={q}
              userAnswer={answers[q.id] ?? null}
              onAnswer={handleAnswer}
              disabled={!user || user.coins < q.cost}
              isSubmitting={submitting === q.id}
            />
          ))}
        </div>

        {/* Bottom mini-leaderboard */}
        <div className="card-surface rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="font-rajdhani font-bold text-sm">Match Leaders</span>
            </div>
            <button
              onClick={() => setCurrentPage('leaderboard')}
              className="text-xs text-neon-green hover:underline flex items-center gap-1"
            >
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          {[
            { rank: 1, name: 'PredictionGod', pts: 2840 },
            { rank: 2, name: 'CricketOracle', pts: 2650 },
            { rank: 3, name: user?.username || 'You', pts: 1240 },
          ].map(entry => (
            <div
              key={entry.rank}
              className={`flex items-center gap-3 py-2 border-b border-border last:border-0 ${
                entry.name === user?.username ? 'text-neon-green' : ''
              }`}
            >
              <span className={`text-xs w-5 font-bold ${
                entry.rank === 1 ? 'text-yellow-400' : entry.rank === 2 ? 'text-gray-300' : 'text-amber-600'
              }`}>#{entry.rank}</span>
              <span className="flex-1 text-sm truncate">{entry.name}</span>
              <span className="text-xs text-neon-blue font-semibold">{entry.pts} pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveMatchPage;
