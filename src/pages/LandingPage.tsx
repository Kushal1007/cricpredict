import React from 'react';
import { useApp } from '@/context/AppContext';
import heroCricket from '@/assets/hero-cricket.jpg';
import { IPL_TEAMS, IPL_INFO } from '@/data/iplData';
import { Zap, Trophy, Target, Star, Heart, TrendingUp, Shield, ChevronRight } from 'lucide-react';

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

const LandingPage: React.FC = () => {
  const { setCurrentPage } = useApp();

  const features = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Phase-Based Predictions',
      desc: 'Pre-match bets, Powerplay polls, Strategic Timeout challenges & Innings-Break specials — all with real odds.',
      accent: 'from-primary/20 to-primary/5',
      iconBg: 'bg-primary/15 text-primary',
      border: 'border-primary/20',
    },
    {
      icon: <Trophy className="w-5 h-5" />,
      title: 'Win Virtual Coins',
      desc: 'Correct predictions earn multiplied coins. Wrong ones cost you. Chain a streak for massive bonuses.',
      accent: 'from-yellow-400/20 to-yellow-400/5',
      iconBg: 'bg-yellow-400/15 text-yellow-400',
      border: 'border-yellow-400/20',
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'Live Points Table',
      desc: 'Track all 10 IPL 2026 standings, NRR, form guides and playoff qualification live.',
      accent: 'from-secondary/20 to-secondary/5',
      iconBg: 'bg-secondary/15 text-secondary',
      border: 'border-secondary/20',
    },
    {
      icon: <Heart className="w-5 h-5" />,
      title: 'Your Favourite Team',
      desc: 'Follow one team and filter the entire schedule to only their fixtures — highlighted throughout the app.',
      accent: 'from-rose-500/20 to-rose-500/5',
      iconBg: 'bg-rose-500/15 text-rose-400',
      border: 'border-rose-500/20',
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: 'Leaderboards & Badges',
      desc: 'Compete globally. Climb from Rookie to Legend. Unlock badges for streaks, accuracy, and milestones.',
      accent: 'from-neon-orange/20 to-neon-orange/5',
      iconBg: 'bg-neon-orange/15 text-neon-orange',
      border: 'border-neon-orange/20',
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: 'Daily Challenges',
      desc: 'Fresh prediction challenges every match day. Login streaks. Bonus coins. Streak multipliers.',
      accent: 'from-primary/20 to-secondary/5',
      iconBg: 'bg-primary/15 text-primary',
      border: 'border-primary/20',
    },
  ];

  const stats = [
    { val: '10', label: 'IPL Teams', color: 'text-secondary' },
    { val: '84', label: 'Matches', color: 'text-primary' },
    { val: '₹20 Cr', label: 'Prize Pool', color: 'text-yellow-400' },
    { val: '🚫', label: 'Real Money', color: 'text-destructive' },
  ];

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-14">
        {/* Background */}
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroCricket})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />

        {/* Glowing orbs */}
        <div className="absolute top-24 left-8 w-64 h-64 rounded-full bg-primary/8 blur-3xl animate-pulse" />
        <div className="absolute bottom-28 right-8 w-80 h-80 rounded-full bg-secondary/8 blur-3xl animate-pulse" style={{ animationDelay: '1.2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/3 blur-3xl" />

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-3xl mx-auto animate-fade-in-up w-full">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 text-primary text-xs font-bold mb-5 backdrop-blur-sm">
            <span className="live-pulse w-2 h-2 bg-primary rounded-full inline-block" />
            IPL 2026 Season {IPL_INFO.season} · Starts {IPL_INFO.startDate}
          </div>

          <h1 className="font-rajdhani text-4xl sm:text-5xl md:text-7xl font-black leading-none mb-2">
            <span className="neon-text-green">Predict</span>. Compete.
          </h1>
          <h1 className="font-rajdhani text-4xl sm:text-5xl md:text-7xl font-black leading-none mb-5">
            <span className="neon-text-blue">Dominate</span> IPL.
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base md:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Phase-based predictions across all 74 IPL 2026 matches. Pre-match odds, Powerplay polls & Innings-Break specials — like sports betting, but 100% free.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mb-10">
            <button
              onClick={() => setCurrentPage('signup')}
              className="relative overflow-hidden px-8 py-4 font-rajdhani font-black text-lg rounded-2xl text-background transition-all duration-200 hover:scale-105 shadow-neon-green"
              style={{ background: 'linear-gradient(135deg, hsl(150 100% 40%), hsl(150 100% 60%))' }}
            >
              🏏 Start Predicting — It's Free
            </button>
            <button
              onClick={() => setCurrentPage('guide')}
              className="px-8 py-4 bg-card/60 backdrop-blur-sm border border-secondary/40 text-secondary font-rajdhani font-bold text-lg rounded-2xl hover:border-secondary hover:bg-secondary/10 transition-all duration-200 flex items-center justify-center gap-2"
            >
              How It Works <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
            {stats.map(({ val, label, color }) => (
              <div key={label} className="bg-card/50 backdrop-blur-sm border border-border/40 rounded-2xl p-3 text-center">
                <div className={`font-rajdhani text-2xl md:text-3xl font-black ${color}`}>{val}</div>
                <div className="text-[11px] md:text-xs text-muted-foreground mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-5 h-9 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2.5 bg-primary/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* ── Teams Showcase ────────────────────────────────────── */}
      <section className="py-12 md:py-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/20 to-background" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-8 md:mb-10">
            <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/20 rounded-full px-3 py-1 text-secondary text-xs font-bold mb-3">
              <Shield className="w-3.5 h-3.5" /> All Franchises
            </div>
            <h2 className="font-rajdhani text-3xl sm:text-4xl md:text-5xl font-black mb-2">
              Meet the <span className="neon-text-blue">{IPL_INFO.totalTeams} Teams</span>
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">Pick your favourite — follow their season journey</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 md:gap-3">
            {IPL_TEAMS.map(team => {
              const tc = TEAM_COLORS[team.id];
              return (
                <button
                  key={team.id}
                  className="group relative overflow-hidden bg-card/60 border border-border/60 rounded-2xl p-4 text-center hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  onClick={() => setCurrentPage('signup')}
                >
                  <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${tc.from} ${tc.to}`} />
                  <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center text-2xl mb-2 bg-gradient-to-br ${tc.from} ${tc.to} shadow-md group-hover:scale-110 transition-transform`}>
                    {team.emoji}
                  </div>
                  <div className="font-rajdhani font-black text-sm">{team.shortName}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {team.titles > 0 ? `${'🏆'.repeat(Math.min(team.titles, 3))} ${team.titles}×` : team.city}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Prediction Phases ─────────────────────────────────── */}
      <section className="py-12 md:py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 text-primary text-xs font-bold mb-3">
              <Zap className="w-3.5 h-3.5" /> Prediction System
            </div>
            <h2 className="font-rajdhani text-3xl sm:text-4xl md:text-5xl font-black mb-2">
              <span className="neon-text-green">4 Phases,</span> Endless Action
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">Like sports betting — but strategic, skill-based, and free</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6">
            {[
              { phase: '4h Before Match', title: 'Pre-Match Predictions', desc: 'Who scores 50+? Who takes 2+ wickets? Who hits the most sixes? Lock in your bets before toss.', icon: '🎯', color: 'border-primary/30 bg-primary/5' },
              { phase: 'After Over 6', title: 'Powerplay Polls', desc: 'Will the team defend 180+? Who dominates the middle overs? Quick 5-minute window.', icon: '⚡', color: 'border-secondary/30 bg-secondary/5' },
              { phase: 'Overs 12–16', title: 'Strategic Timeout', desc: '2-minute window: will the team reach 200? Who takes the key wicket in death overs?', icon: '⏱️', color: 'border-yellow-400/30 bg-yellow-400/5' },
              { phase: 'Innings Break', title: 'Chase Predictions', desc: 'Will the chase succeed? Top scorer in 2nd innings? Player of the Match specials.', icon: '🏏', color: 'border-neon-orange/30 bg-neon-orange/5' },
            ].map((item, i) => (
              <div key={i} className={`rounded-2xl p-5 border ${item.color} backdrop-blur-sm`}>
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{item.icon}</div>
                  <div>
                    <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{item.phase}</div>
                    <h3 className="font-rajdhani font-black text-base mb-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ─────────────────────────────────────── */}
      <section className="py-12 md:py-20 px-4 sm:px-6 bg-surface/20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="font-rajdhani text-3xl sm:text-4xl font-black mb-2">
              Why <span className="neon-text-green">CricPredict</span>?
            </h2>
            <p className="text-muted-foreground text-sm">Everything you need for IPL 2026</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {features.map((f, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-2xl p-5 border ${f.border} bg-gradient-to-br ${f.accent} backdrop-blur-sm hover:scale-[1.01] transition-transform`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${f.iconBg}`}>
                  {f.icon}
                </div>
                <h3 className="font-rajdhani font-black text-base mb-1.5">{f.title}</h3>
                <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-12 md:py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-lg">
          <div className="relative overflow-hidden rounded-3xl p-7 md:p-10 text-center border border-primary/25">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-card to-secondary/5" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/8 blur-2xl rounded-full" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/8 blur-2xl rounded-full" />

            <div className="relative z-10">
              <div className="text-5xl mb-4">🏆</div>
              <h2 className="font-rajdhani text-3xl md:text-4xl font-black mb-2">
                Ready to <span className="neon-text-green">Predict?</span>
              </h2>
              <p className="text-muted-foreground text-sm mb-1">Join free. Get 1,000 starting coins.</p>
              <p className="text-xs text-muted-foreground/60 mb-6">100% virtual coins · No gambling · No real money involved</p>

              <button
                onClick={() => setCurrentPage('signup')}
                className="w-full py-4 font-rajdhani font-black text-lg rounded-2xl text-background transition-all hover:scale-105 shadow-neon-green"
                style={{ background: 'linear-gradient(135deg, hsl(150 100% 40%), hsl(150 100% 60%))' }}
              >
                Join CricPredict Free 🏏
              </button>

              <button
                onClick={() => setCurrentPage('guide')}
                className="mt-3 w-full py-3 font-rajdhani font-bold text-sm rounded-2xl text-muted-foreground border border-border/50 hover:border-border hover:text-foreground transition-all"
              >
                Read the Guide first →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-border/50 py-8 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-green flex items-center justify-center text-sm font-bold text-background">🏏</div>
            <span className="font-rajdhani font-black neon-text-green text-lg">CricPredict</span>
          </div>
          <div className="flex flex-wrap justify-center gap-5 text-sm text-muted-foreground">
            {['About', 'Contact', 'Privacy', 'Terms'].map(l => (
              <button key={l} className="hover:text-foreground transition-colors">{l}</button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">© 2026 CricPredict · Virtual coins only</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
