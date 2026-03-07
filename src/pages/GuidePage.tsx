import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Coins, Trophy, Zap, Clock, BarChart2, HelpCircle, ChevronDown, ChevronUp, Gift } from 'lucide-react';

const phases = [
  {
    icon: '🕐',
    color: 'text-neon-orange',
    border: 'border-neon-orange/30',
    bg: 'bg-neon-orange/5',
    badge: 'bg-neon-orange/10 text-neon-orange border-neon-orange/30',
    title: 'Pre-Match Predictions',
    subtitle: '4 hours before the first ball',
    description:
      "Before the toss is even done, you get 3-4 big-picture questions about how the entire match will unfold. These carry the best odds because they are the hardest to get right.",
    examples: [
      { q: 'Who will top-score for MI?', opts: ['Rohit Sharma (2.5×)', 'Suryakumar Yadav (3×)', 'Hardik Pandya (4×)'] },
      { q: 'Total wickets in the match?', opts: ['Under 12 (2×)', '12–16 (2.5×)', 'Over 16 (3.5×)'] },
      { q: 'Will there be a century?', opts: ['Yes (3×)', 'No (1.5×)'] },
      { q: 'Winning team?', opts: ['MI (1.8×)', 'CSK (2.2×)'] },
    ],
    tip: 'Lock in your picks early — these close at toss time!',
  },
  {
    icon: '⚡',
    color: 'text-neon-green',
    border: 'border-neon-green/30',
    bg: 'bg-neon-green/5',
    badge: 'bg-neon-green/10 text-neon-green border-neon-green/30',
    title: 'Powerplay Poll',
    subtitle: 'After overs 1–6',
    description:
      'Once the powerplay ends you know the early momentum. 2 quick polls open for just 5 minutes — predict how the middle overs will shape up.',
    examples: [
      { q: 'Runs in overs 7–10?', opts: ['Under 28 (2×)', '28–36 (2.5×)', 'Over 36 (3×)'] },
      { q: 'Next wicket in how many overs?', opts: ['1 over (3×)', '2–3 overs (2×)', '4+ overs (2.5×)'] },
    ],
    tip: 'Only 5 minutes to answer — don\'t miss the window!',
  },
  {
    icon: '⏸️',
    color: 'text-neon-blue',
    border: 'border-neon-blue/30',
    bg: 'bg-neon-blue/5',
    badge: 'bg-neon-blue/10 text-neon-blue border-neon-blue/30',
    title: 'Strategic Timeout',
    subtitle: 'Around overs 12–16',
    description:
      "The Strategic Timeout is a natural break. 2-3 targeted questions drop, giving you a chance to predict the final assault based on who is batting.",
    examples: [
      { q: 'Will the team hit 3+ sixes in the last 5?', opts: ['Yes (2.5×)', 'No (1.8×)'] },
      { q: 'Final over runs?', opts: ['Under 10 (2×)', '10–13 (2×)', '14+ (4×)'] },
    ],
    tip: 'Short window — lock in before timeout ends (≈2 min).',
  },
  {
    icon: '🔄',
    color: 'text-purple-400',
    border: 'border-purple-400/30',
    bg: 'bg-purple-400/5',
    badge: 'bg-purple-400/10 text-purple-400 border-purple-400/30',
    title: 'Innings Break',
    subtitle: 'Between the two innings',
    description:
      "The most exciting window. You know exactly what the target is. Predict how the chase will unfold, who will anchor it, and whether there will be a last-over thriller.",
    examples: [
      { q: 'Chase result?', opts: ['Win with 10+ balls left (2×)', 'Win last over (4×)', 'Lose (2×)'] },
      { q: 'Player of the Match?', opts: ['Kohli (3×)', 'Bumrah (3.5×)', 'Jadeja (4×)', 'Other (5×)'] },
      { q: 'Will there be a super over?', opts: ['Yes (8×)', 'No (1.2×)'] },
    ],
    tip: 'Target is set — this is where the big odds live!',
  },
];

const faqs = [
  {
    q: 'How do I earn coins?',
    a: 'You start with 1,000 coins on sign-up. Correct predictions multiply your stake. You also earn 50 free coins daily just by logging in.',
  },
  {
    q: 'What happens if I run out of coins?',
    a: "You get 100 free coins every 24 hours as a refresh. You can never go permanently broke - there is always a way back!",
  },
  {
    q: 'How are predictions scored?',
    a: 'Each prediction has fixed odds (multipliers). If you bet 100 coins on a 2.5× option and win, you get 250 coins back. If you lose, you lose just the stake.',
  },
  {
    q: 'When do predictions close?',
    a: 'Pre-match predictions close at the toss. Powerplay predictions close 5 minutes after over 6. Strategic Timeout and Innings Break windows are about 2–3 minutes each.',
  },
  {
    q: 'What are streaks?',
    a: 'Get 3 correct predictions in a row and earn a 100-coin streak bonus. Hit 5 in a row and unlock a badge. Streaks reset on a wrong answer.',
  },
  {
    q: 'Is this real money?',
    a: "No - this is a completely free-to-play platform. All coins are virtual and have no monetary value. It is purely for fun and bragging rights on the leaderboard!",
  },
];

const coinTiers = [
  { action: 'Daily login', reward: '+50 coins', icon: '📅' },
  { action: 'Correct pre-match pick', reward: '1.5× – 5×', icon: '🎯' },
  { action: 'Correct powerplay poll', reward: '2× – 3×', icon: '⚡' },
  { action: 'Correct timeout pick', reward: '2× – 4×', icon: '⏸️' },
  { action: 'Correct innings break pick', reward: '2× – 8×', icon: '🔄' },
  { action: '3-win streak bonus', reward: '+100 coins', icon: '🔥' },
  { action: '5-win streak badge unlock', reward: 'Badge + 250 coins', icon: '🏆' },
];

const GuidePage: React.FC = () => {
  const { setCurrentPage } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activePhase, setActivePhase] = useState(0);

  return (
    <div className="min-h-screen bg-background pt-14 md:pt-16 pb-12">
      {/* Header */}
      <div className="border-b border-border bg-surface/40 backdrop-blur-sm sticky top-14 md:top-16 z-10">
        <div className="container mx-auto px-4 max-w-3xl py-3 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-neon-blue" />
            <span className="font-rajdhani font-bold text-neon-blue tracking-wider text-sm uppercase">How to Play</span>
          </div>
          <div className="w-16" />
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-3xl py-6 space-y-10">

        {/* Hero */}
        <div className="text-center space-y-3">
          <div className="text-5xl mb-2">🏏</div>
          <h1 className="font-rajdhani text-3xl md:text-4xl font-bold">
            Predict. Win. <span className="neon-text-green">Repeat.</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            CricPredict lets you make smart, strategic predictions at key moments in every IPL 2026 match — just like a pro analyst, but way more fun.
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: <Zap className="w-5 h-5" />, label: '4 Prediction Windows', color: 'text-neon-green' },
            { icon: <Coins className="w-5 h-5" />, label: 'Up to 8× your coins', color: 'text-yellow-400' },
            { icon: <Trophy className="w-5 h-5" />, label: 'Season leaderboard', color: 'text-neon-blue' },
          ].map((s, i) => (
            <div key={i} className="card-surface rounded-xl p-3 md:p-4 flex flex-col items-center gap-2 text-center">
              <div className={s.color}>{s.icon}</div>
              <span className="text-xs md:text-sm font-semibold text-foreground leading-tight">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Prediction Windows */}
        <section>
          <h2 className="font-rajdhani text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-neon-orange" />
            Prediction Windows
          </h2>

          {/* Phase selector tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar mb-5">
            {phases.map((p, i) => (
              <button
                key={i}
                onClick={() => setActivePhase(i)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                  activePhase === i
                    ? `${p.badge} border-current`
                    : 'bg-surface border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>{p.icon}</span>
                <span className="hidden sm:inline">{p.title.split(' ')[0]}</span>
                <span className="sm:hidden">#{i + 1}</span>
              </button>
            ))}
          </div>

          {/* Active phase detail */}
          {phases.map((phase, i) => (
            <div
              key={i}
              className={`${activePhase === i ? 'block' : 'hidden'} rounded-2xl border ${phase.border} ${phase.bg} p-5 space-y-4`}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{phase.icon}</span>
                <div>
                  <h3 className={`font-rajdhani text-xl font-bold ${phase.color}`}>{phase.title}</h3>
                  <div className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border mt-1 ${phase.badge}`}>
                    <Clock className="w-3 h-3" /> {phase.subtitle}
                  </div>
                </div>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">{phase.description}</p>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Example Questions</div>
                {phase.examples.map((ex, j) => (
                  <div key={j} className="bg-background/60 rounded-xl p-3 border border-border/50">
                    <div className="text-sm font-medium mb-2">❓ {ex.q}</div>
                    <div className="flex flex-wrap gap-2">
                      {ex.opts.map((o, k) => (
                        <span key={k} className="text-xs bg-surface border border-border px-2.5 py-1 rounded-full text-muted-foreground">
                          {o}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className={`flex items-start gap-2 p-3 rounded-xl border ${phase.badge}`}>
                <span className="text-base mt-0.5">💡</span>
                <span className="text-xs leading-relaxed">{phase.tip}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Coin rewards */}
        <section>
          <h2 className="font-rajdhani text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-yellow-400" />
            How You Earn Coins
          </h2>
          <div className="card-surface rounded-2xl overflow-hidden">
            {coinTiers.map((t, i) => (
              <div
                key={i}
                className={`flex items-center justify-between px-4 py-3 text-sm ${
                  i !== coinTiers.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg w-7 text-center">{t.icon}</span>
                  <span className="text-foreground/80">{t.action}</span>
                </div>
                <span className="font-rajdhani font-bold text-yellow-400 text-sm">{t.reward}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="font-rajdhani text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-neon-blue" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="card-surface rounded-xl border border-border overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-4 py-3.5 text-left text-sm font-medium hover:bg-surface-elevated transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" />
                    : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="card-surface rounded-2xl p-6 text-center border border-neon-green/20 glow-border-green space-y-3">
          <div className="text-3xl">🚀</div>
          <h3 className="font-rajdhani text-xl font-bold">Ready to predict?</h3>
          <p className="text-sm text-muted-foreground">Head to the dashboard, pick a match, and start winning coins!</p>
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="mt-2 px-6 py-2.5 bg-primary text-primary-foreground font-rajdhani font-bold rounded-full hover:shadow-neon-green transition-all text-sm"
          >
            Go to Dashboard →
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuidePage;
