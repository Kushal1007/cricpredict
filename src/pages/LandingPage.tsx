import React from 'react';
import { useApp } from '@/context/AppContext';
import heroCricket from '@/assets/hero-cricket.jpg';
import { IPL_TEAMS, IPL_INFO } from '@/data/iplData';
import { Zap, Trophy, Target, Star, Heart } from 'lucide-react';

const LandingPage: React.FC = () => {
  const { setCurrentPage } = useApp();

  const features = [
    { icon: <Zap className="w-5 h-5" />, title: 'Ball-by-Ball Predictions', desc: 'Predict every delivery as it happens live — dot, boundary, wicket or six!', color: 'primary' },
    { icon: <Trophy className="w-5 h-5" />, title: 'Win Virtual Coins', desc: 'Correct predictions earn you coins and points. Wrong ones cost you.', color: 'secondary' },
    { icon: <Star className="w-5 h-5" />, title: 'Leaderboards', desc: 'Compete globally during IPL 2026. Climb from Rookie to Legend.', color: 'neon-orange' },
    { icon: <Heart className="w-5 h-5" />, title: 'Favourite Your Team', desc: 'Follow your IPL team — see only their fixtures and predict their matches.', color: 'destructive' },
    { icon: <Target className="w-5 h-5" />, title: 'Streak Bonuses', desc: 'Chain correct predictions for massive bonus coin rewards and badges.', color: 'primary' },
    { icon: <span className="text-lg">🏏</span>, title: 'IPL 2026 Focus', desc: `${IPL_INFO.totalMatches} matches across ${IPL_INFO.totalTeams} teams. Every ball is a chance to win.`, color: 'secondary' },
  ];

  const colorMap: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    'neon-orange': 'bg-neon-orange/10 text-neon-orange',
    destructive: 'bg-destructive/10 text-destructive',
  };

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroCricket})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        <div className="absolute top-20 left-6 w-48 h-48 rounded-full bg-primary/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-32 right-6 w-64 h-64 rounded-full bg-secondary/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 text-center px-5 max-w-3xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 text-primary text-xs font-semibold mb-5">
            <span className="live-pulse w-2 h-2 bg-primary rounded-full inline-block" />
            IPL 2026 — Season {IPL_INFO.season} · Starts {IPL_INFO.startDate}
          </div>

          <h1 className="font-rajdhani text-4xl sm:text-6xl font-bold leading-tight mb-5">
            Predict Every Ball.{' '}
            <span className="neon-text-green">Compete</span> With Fans.{' '}
            <span className="neon-text-blue">Climb</span> the Leaderboard.
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-xl mx-auto">
            The ultimate IPL 2026 prediction platform. Make live ball-by-ball predictions, earn virtual coins, and prove you know cricket better than anyone.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <button
              onClick={() => setCurrentPage('signup')}
              className="px-8 py-3.5 bg-primary text-background font-rajdhani font-bold text-lg rounded-xl shadow-neon-green hover:scale-105 transition-all duration-200"
            >
              🏏 Start Predicting Free
            </button>
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="px-8 py-3.5 bg-surface border border-secondary/50 text-secondary font-rajdhani font-bold text-lg rounded-xl hover:border-secondary transition-all duration-200"
            >
              View IPL 2026
            </button>
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[['10', 'IPL Teams'], [IPL_INFO.totalMatches.toString(), 'Matches'], ['₹20 Cr', 'Prize Pool'], ['🚫', 'Real Money']].map(([val, label]) => (
              <div key={label} className="card-surface rounded-xl p-3 text-center">
                <div className="font-rajdhani text-2xl font-bold text-primary">{val}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-5 h-9 border-2 border-muted-foreground/40 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2.5 bg-primary/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* ── Teams Showcase ────────────────────────────────────── */}
      <section className="py-16 px-5 bg-surface/30">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="font-rajdhani text-3xl sm:text-4xl font-bold mb-2">
              Meet the <span className="neon-text-green">{IPL_INFO.totalTeams} Teams</span>
            </h2>
            <p className="text-muted-foreground text-sm">Each team brings legends, star players and fierce rivalries.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {IPL_TEAMS.map(team => (
              <div key={team.id} className="card-surface rounded-xl p-3 text-center hover:border-primary/30 transition-all cursor-pointer" onClick={() => setCurrentPage('signup')}>
                <div className="text-3xl mb-1">{team.emoji}</div>
                <div className="font-rajdhani font-bold text-sm">{team.shortName}</div>
                <div className="text-xs text-muted-foreground">{team.titles > 0 ? `${team.titles}🏆` : '—'}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="py-16 px-5">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="font-rajdhani text-3xl sm:text-4xl font-bold mb-2">
              Why <span className="neon-text-green">CricPredict</span>?
            </h2>
            <p className="text-muted-foreground text-sm">Everything you need to make IPL 2026 unforgettable.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div key={i} className="card-surface rounded-xl p-5 hover:border-primary/30 transition-all">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colorMap[f.color] ?? 'bg-primary/10 text-primary'}`}>
                  {f.icon}
                </div>
                <h3 className="font-rajdhani text-base font-bold mb-1">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-16 px-5">
        <div className="container mx-auto max-w-md">
          <div className="card-surface rounded-2xl p-8 text-center border border-primary/20">
            <div className="text-5xl mb-4">🏆</div>
            <h2 className="font-rajdhani text-3xl font-bold mb-2">
              Ready to <span className="neon-text-green">Predict?</span>
            </h2>
            <p className="text-muted-foreground text-sm mb-1">Join free. Get 1,000 starting coins.</p>
            <p className="text-xs text-muted-foreground/60 mb-6">100% virtual coins · No gambling · No real money</p>
            <button
              onClick={() => setCurrentPage('signup')}
              className="w-full py-3.5 bg-primary text-background font-rajdhani font-bold text-lg rounded-xl hover:scale-105 transition-all shadow-neon-green"
            >
              Join CricPredict Free 🏏
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-border py-8 px-5">
        <div className="container mx-auto max-w-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏏</span>
            <span className="font-rajdhani font-bold neon-text-green">CricPredict</span>
          </div>
          <div className="flex gap-5 text-sm text-muted-foreground">
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
