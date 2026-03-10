import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Trophy, Zap, Target, ChevronRight, Check, X, Lock, PlayCircle, Info } from 'lucide-react';

// ─── IPL 2024 Final: KKR vs SRH — actual result data ─────────────────────────
const MATCH = {
  team1: 'Kolkata Knight Riders', t1Short: 'KKR', t1Emoji: '💜',
  team2: 'Sunrisers Hyderabad',   t2Short: 'SRH', t2Emoji: '🧡',
  venue: 'MA Chidambaram Stadium, Chennai',
  date: '26 May 2024',
  result: 'KKR won by 8 wickets',
  // Actual scorecard data
  srh_score: '113',
  kkr_score: '114/2',
  srh_overs: '18.3',
  kkr_overs: '10.3',
};

type Phase = 'pre' | 'powerplay' | 'timeout' | 'innings' | 'done';

interface Poll {
  id: string;
  phase: Phase;
  question: string;
  options: { id: string; label: string; odds: number; correct: boolean }[];
  phaseLabel: string;
  phaseEmoji: string;
  tip: string;
}

const POLLS: Poll[] = [
  {
    id: 'p1', phase: 'pre',
    phaseLabel: 'Pre-Match', phaseEmoji: '🎯',
    question: 'Who will win the IPL 2024 Final?',
    tip: 'KKR were on a dominant run — 9 wins in last 11 games.',
    options: [
      { id: 'kkr', label: '💜 KKR (Knight Riders)', odds: 1.8, correct: true },
      { id: 'srh', label: '🧡 SRH (Sunrisers)',     odds: 2.2, correct: false },
    ],
  },
  {
    id: 'p2', phase: 'pre',
    phaseLabel: 'Pre-Match', phaseEmoji: '🎯',
    question: 'Who wins the toss?',
    tip: 'Toss is 50-50 — but Chennai pitch tends to favour batting first.',
    options: [
      { id: 'kkr_toss', label: '💜 KKR', odds: 2.0, correct: true  },
      { id: 'srh_toss', label: '🧡 SRH', odds: 2.0, correct: false },
    ],
  },
  {
    id: 'p3', phase: 'powerplay',
    phaseLabel: 'Powerplay (Overs 1–6)', phaseEmoji: '⚡',
    question: 'SRH Powerplay score — above or below 50?',
    tip: 'SRH\'s top order of Gill & Head are explosive but Chennai is a slow track.',
    options: [
      { id: 'over50',  label: '📈 Above 50 runs', odds: 1.9, correct: false },
      { id: 'under50', label: '📉 Below 50 runs', odds: 1.9, correct: true  },
    ],
  },
  {
    id: 'p4', phase: 'powerplay',
    phaseLabel: 'Powerplay (Overs 1–6)', phaseEmoji: '⚡',
    question: 'First wicket falls in overs 1–3 or 4–6?',
    tip: 'Mitchell Starc is aggressive upfront — early wickets are likely.',
    options: [
      { id: 'early', label: '🎳 Overs 1–3 (early)', odds: 2.1, correct: true  },
      { id: 'late',  label: '🏏 Overs 4–6 (late)',  odds: 1.8, correct: false },
    ],
  },
  {
    id: 'p5', phase: 'timeout',
    phaseLabel: 'Strategic Timeout', phaseEmoji: '⏱️',
    question: 'SRH Final score — above or below 150?',
    tip: 'SRH were 73/6 at timeout — a low total seemed inevitable.',
    options: [
      { id: 'above150', label: '💥 Above 150', odds: 3.5, correct: false },
      { id: 'below150', label: '🔒 Below 150', odds: 1.3, correct: true  },
    ],
  },
  {
    id: 'p6', phase: 'innings',
    phaseLabel: 'Innings Break', phaseEmoji: '🏏',
    question: 'KKR chase — finished inside 15 overs or more?',
    tip: 'Chasing 114 with Venkatesh Iyer and Angkrish Raghuvanshi firing.',
    options: [
      { id: 'inside15', label: '⚡ Inside 15 overs', odds: 2.5, correct: true  },
      { id: 'beyond15', label: '🐢 Beyond 15 overs', odds: 1.6, correct: false },
    ],
  },
];

interface UserPick { pollId: string; optionId: string; cost: number }

const PHASE_ORDER: Phase[] = ['pre', 'powerplay', 'timeout', 'innings', 'done'];
const PHASE_NAMES: Record<Phase, string> = {
  pre: 'Pre-Match', powerplay: 'Powerplay', timeout: 'Strategic Timeout', innings: 'Innings Break', done: 'Final Result',
};
const PHASE_DESC: Record<Phase, string> = {
  pre: 'Before the match starts — 4 questions unlocked',
  powerplay: 'During overs 1–6 — pick as action unfolds',
  timeout: 'Mid-innings strategic break',
  innings: 'After 1st innings ends — last chance to predict',
  done: 'The final whistle — see how you did!',
};

const BET_AMOUNT = 100;

const DemoGamePage: React.FC = () => {
  const { setCurrentPage } = useApp();
  const [currentPhase, setCurrentPhase] = useState<Phase>('pre');
  const [picks, setPicks] = useState<UserPick[]>([]);
  const [resolved, setResolved] = useState(false);
  const [simCoins, setSimCoins] = useState(1000);
  const [phaseStep, setPhaseStep] = useState(0); // which poll in current phase is active

  const phasePolls = POLLS.filter(p => p.phase === currentPhase);
  const answeredInPhase = picks.filter(pk => phasePolls.some(p => p.id === pk.pollId));
  const allAnsweredInPhase = answeredInPhase.length === phasePolls.length;

  const pick = (poll: Poll, optionId: string) => {
    if (picks.some(p => p.pollId === poll.id)) return;
    if (simCoins < BET_AMOUNT) return;
    setPicks(prev => [...prev, { pollId: poll.id, optionId, cost: BET_AMOUNT }]);
    setSimCoins(c => c - BET_AMOUNT);
    if (phaseStep < phasePolls.length - 1) setPhaseStep(s => s + 1);
  };

  const advancePhase = () => {
    const idx = PHASE_ORDER.indexOf(currentPhase);
    if (idx < PHASE_ORDER.length - 1) {
      setCurrentPhase(PHASE_ORDER[idx + 1]);
      setPhaseStep(0);
    }
  };

  const resolve = () => {
    let won = 0;
    picks.forEach(pk => {
      const poll = POLLS.find(p => p.id === pk.pollId)!;
      const opt = poll.options.find(o => o.id === pk.optionId)!;
      if (opt.correct) won += Math.round(BET_AMOUNT * opt.odds);
    });
    setSimCoins(c => c + won);
    setResolved(true);
    setCurrentPhase('done');
  };

  const reset = () => {
    setPicks([]); setResolved(false); setSimCoins(1000);
    setCurrentPhase('pre'); setPhaseStep(0);
  };

  // Summary
  const correctPicks = resolved ? picks.filter(pk => {
    const poll = POLLS.find(p => p.id === pk.pollId)!;
    return poll.options.find(o => o.id === pk.optionId)?.correct;
  }) : [];
  const coinsWon = resolved ? correctPicks.reduce((acc, pk) => {
    const poll = POLLS.find(p => p.id === pk.pollId)!;
    const opt = poll.options.find(o => o.id === pk.optionId)!;
    return acc + Math.round(BET_AMOUNT * opt.odds);
  }, 0) : 0;
  const coinsSpent = picks.length * BET_AMOUNT;

  const phaseIdx = PHASE_ORDER.indexOf(currentPhase);

  return (
    <div className="min-h-screen bg-background pt-14 md:pt-16 pb-10">
      <div className="container mx-auto px-3 sm:px-4 max-w-2xl py-5">

        {/* Back */}
        <button onClick={() => setCurrentPage('dashboard')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl p-5 mb-5 border border-primary/20 bg-card/70">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 to-transparent" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs bg-yellow-400/15 border border-yellow-400/30 text-yellow-400 px-2.5 py-1 rounded-full font-bold">🎮 Demo Mode</span>
              <span className="text-xs text-muted-foreground">No real coins used</span>
            </div>
            <h1 className="font-rajdhani text-2xl sm:text-3xl font-black mb-1">
              IPL 2024 Final <span className="neon-text-green">Replay</span>
            </h1>
            <p className="text-muted-foreground text-sm mb-3">{MATCH.team1} vs {MATCH.team2} · {MATCH.venue}</p>

            {/* Match strip */}
            <div className="flex items-center justify-between bg-muted/40 rounded-2xl px-4 py-3 border border-border/50">
              <div className="text-center">
                <div className="text-2xl mb-1">💜</div>
                <div className="font-rajdhani font-black text-sm">{MATCH.t1Short}</div>
                {resolved && <div className="text-primary font-bold text-xs mt-0.5">{MATCH.kkr_score}</div>}
              </div>
              <div className="text-center px-3">
                <div className="text-xs text-muted-foreground mb-1">{MATCH.date}</div>
                <div className="font-rajdhani font-black text-base">VS</div>
                {resolved && <div className="text-[10px] text-primary font-bold mt-1 text-center leading-tight">{MATCH.result}</div>}
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">🧡</div>
                <div className="font-rajdhani font-black text-sm">{MATCH.t2Short}</div>
                {resolved && <div className="text-destructive font-bold text-xs mt-0.5">{MATCH.srh_score}/{MATCH.srh_overs}</div>}
              </div>
            </div>
          </div>
        </div>

        {/* Sim Coins bar */}
        <div className="flex items-center justify-between bg-card/60 border border-yellow-400/20 rounded-2xl px-4 py-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="text-lg">🪙</span>
            <div>
              <div className="font-rajdhani font-black text-lg text-yellow-400">{simCoins.toLocaleString()}</div>
              <div className="text-[10px] text-muted-foreground">Demo Coins</div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="text-center">
              <div className="font-bold text-foreground">{picks.length}</div>
              <div>Predicted</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-destructive">{coinsSpent}</div>
              <div>Spent</div>
            </div>
            {resolved && (
              <div className="text-center">
                <div className="font-bold text-primary">{coinsWon}</div>
                <div>Won</div>
              </div>
            )}
          </div>
        </div>

        {/* Phase timeline */}
        <div className="flex items-center gap-1 mb-5 overflow-x-auto no-scrollbar pb-1">
          {PHASE_ORDER.filter(p => p !== 'done').map((ph, i) => {
            const isActive = currentPhase === ph;
            const isDone = PHASE_ORDER.indexOf(currentPhase) > i || resolved;
            return (
              <div key={ph} className="flex items-center gap-1 shrink-0">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                  isActive ? 'bg-primary/15 border-primary/40 text-primary' :
                  isDone   ? 'bg-card/60 border-border/40 text-muted-foreground' :
                             'bg-muted/30 border-border/30 text-muted-foreground/50'
                }`}>
                  {isDone && !isActive ? <Check className="w-3 h-3 text-primary" /> : null}
                  {!isDone && !isActive ? <Lock className="w-3 h-3" /> : null}
                  {PHASE_NAMES[ph]}
                </div>
                {i < 3 && <ChevronRight className="w-3 h-3 text-muted-foreground/40 shrink-0" />}
              </div>
            );
          })}
        </div>

        {/* Phase description */}
        {currentPhase !== 'done' && (
          <div className="flex items-start gap-2 bg-muted/30 border border-border/40 rounded-xl px-3 py-2.5 mb-4">
            <Info className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">{PHASE_DESC[currentPhase]}</p>
          </div>
        )}

        {/* Polls for current phase */}
        {currentPhase !== 'done' && phasePolls.map((poll, idx) => {
          const userPick = picks.find(p => p.pollId === poll.id);
          const isLocked = idx > phaseStep && !userPick;
          const pickedOpt = poll.options.find(o => o.id === userPick?.optionId);

          return (
            <div
              key={poll.id}
              className={`rounded-2xl border mb-3 transition-all ${isLocked ? 'opacity-40 pointer-events-none' : 'opacity-100'} ${
                userPick ? 'border-primary/30 bg-primary/5' : 'border-border/60 bg-card/60'
              }`}
            >
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">{poll.phaseEmoji}</span>
                  <span className="text-xs font-bold text-muted-foreground">{poll.phaseLabel}</span>
                  {userPick && <span className="ml-auto text-[10px] bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded-lg font-bold">Locked In</span>}
                </div>

                <p className="font-rajdhani font-black text-base mb-1">{poll.question}</p>

                {/* Tip */}
                <div className="flex items-start gap-1.5 bg-yellow-400/5 border border-yellow-400/15 rounded-lg px-2.5 py-2 mb-3">
                  <span className="text-xs">💡</span>
                  <p className="text-[11px] text-muted-foreground">{poll.tip}</p>
                </div>

                <div className="space-y-2">
                  {poll.options.map(opt => {
                    const isPicked = userPick?.optionId === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => pick(poll, opt.id)}
                        disabled={!!userPick || simCoins < BET_AMOUNT}
                        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl border text-sm font-semibold transition-all ${
                          isPicked
                            ? 'bg-primary/15 border-primary/50 text-primary'
                            : userPick
                            ? 'bg-muted/30 border-border/30 text-muted-foreground/50 cursor-not-allowed'
                            : 'bg-muted/40 border-border/50 hover:border-primary/40 hover:bg-primary/8 hover:text-primary cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {isPicked && <Check className="w-3.5 h-3.5 shrink-0" />}
                          <span>{opt.label}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs shrink-0">
                          <span className="text-muted-foreground">{opt.odds}×</span>
                          <span className="font-rajdhani font-black text-yellow-400">+{Math.round(BET_AMOUNT * opt.odds)}🪙</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {!userPick && (
                  <p className="text-[10px] text-muted-foreground mt-2 text-center">
                    Costs {BET_AMOUNT} coins · Pick to lock in
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {/* Phase advance / resolve buttons */}
        {currentPhase !== 'done' && (
          <div className="space-y-2 mt-2">
            {allAnsweredInPhase && currentPhase !== 'innings' && (
              <button
                onClick={advancePhase}
                className="w-full py-3 font-rajdhani font-black text-base rounded-2xl border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-all flex items-center justify-center gap-2"
              >
                <PlayCircle className="w-4 h-4" />
                Fast-forward to {PHASE_NAMES[PHASE_ORDER[phaseIdx + 1]]} →
              </button>
            )}
            {currentPhase === 'innings' && allAnsweredInPhase && (
              <button
                onClick={resolve}
                className="w-full py-3 font-rajdhani font-black text-base rounded-2xl text-background transition-all hover:scale-[1.01] active:scale-[0.99]"
                style={{ background: 'linear-gradient(135deg, hsl(150 100% 40%), hsl(150 100% 60%))' }}
              >
                🏆 Reveal Results!
              </button>
            )}
            {!allAnsweredInPhase && (
              <p className="text-[11px] text-muted-foreground text-center">
                Answer all {phasePolls.length} question{phasePolls.length > 1 ? 's' : ''} to advance ↑
              </p>
            )}
          </div>
        )}

        {/* Results screen */}
        {resolved && currentPhase === 'done' && (
          <div className="rounded-3xl border border-primary/30 bg-card/70 overflow-hidden">
            <div className="relative p-6 text-center border-b border-border/50">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/8 to-transparent" />
              <div className="relative">
                <div className="text-5xl mb-2">{correctPicks.length >= 4 ? '🏆' : correctPicks.length >= 2 ? '🎯' : '📈'}</div>
                <h2 className="font-rajdhani text-3xl font-black mb-1">
                  {correctPicks.length} / {picks.length} Correct!
                </h2>
                <p className="text-muted-foreground text-sm mb-3">{MATCH.result}</p>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-rajdhani font-black text-lg ${
                  simCoins >= 1000 ? 'bg-primary/15 border border-primary/30 text-primary' : 'bg-destructive/10 border border-destructive/30 text-destructive'
                }`}>
                  {simCoins >= 1000 ? '+' : ''}{simCoins - 1000} coins net
                </div>
              </div>
            </div>

            <div className="p-4 space-y-2">
              <h3 className="font-rajdhani font-bold text-sm text-muted-foreground uppercase tracking-wide mb-3">Your Predictions</h3>
              {POLLS.map(poll => {
                const pk = picks.find(p => p.pollId === poll.id);
                if (!pk) return (
                  <div key={poll.id} className="flex items-center gap-2 text-xs text-muted-foreground/50 px-1">
                    <span className="text-muted-foreground/30">—</span>
                    <span className="truncate">{poll.question}</span>
                    <span className="ml-auto shrink-0">Skipped</span>
                  </div>
                );
                const opt = poll.options.find(o => o.id === pk.optionId)!;
                const correct = opt.correct;
                const payout = correct ? Math.round(BET_AMOUNT * opt.odds) : 0;
                return (
                  <div key={poll.id} className={`flex items-start gap-3 rounded-xl px-3 py-2.5 border ${
                    correct ? 'bg-primary/8 border-primary/25' : 'bg-destructive/5 border-destructive/20'
                  }`}>
                    <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${correct ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'}`}>
                      {correct ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-foreground leading-snug">{poll.question}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">You picked: {opt.label}</div>
                    </div>
                    <div className={`shrink-0 font-rajdhani font-black text-sm ${correct ? 'text-primary' : 'text-destructive'}`}>
                      {correct ? `+${payout}🪙` : `-${BET_AMOUNT}🪙`}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t border-border/50 space-y-2">
              <div className="grid grid-cols-3 gap-2 text-center mb-3">
                <div className="bg-muted/30 rounded-xl p-3">
                  <div className="font-rajdhani font-black text-xl text-primary">{correctPicks.length}</div>
                  <div className="text-[10px] text-muted-foreground">Correct</div>
                </div>
                <div className="bg-muted/30 rounded-xl p-3">
                  <div className="font-rajdhani font-black text-xl text-yellow-400">{coinsWon}</div>
                  <div className="text-[10px] text-muted-foreground">Coins Won</div>
                </div>
                <div className="bg-muted/30 rounded-xl p-3">
                  <div className={`font-rajdhani font-black text-xl ${simCoins >= 1000 ? 'text-primary' : 'text-destructive'}`}>{simCoins}</div>
                  <div className="text-[10px] text-muted-foreground">Final Balance</div>
                </div>
              </div>
              <button
                onClick={reset}
                className="w-full py-3 font-rajdhani font-black text-base rounded-2xl border border-border/60 bg-muted/30 hover:bg-muted/50 transition-all"
              >
                🔄 Play Again
              </button>
              <button
                onClick={() => setCurrentPage('dashboard')}
                className="w-full py-3 font-rajdhani font-black text-base rounded-2xl text-background transition-all hover:scale-[1.01]"
                style={{ background: 'linear-gradient(135deg, hsl(150 100% 40%), hsl(150 100% 60%))' }}
              >
                🏏 Go Predict IPL 2026 Live!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoGamePage;
