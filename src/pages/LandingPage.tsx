import React from 'react';
import { useApp } from '@/context/AppContext';
import heroCricket from '@/assets/hero-cricket.jpg';
import { MOCK_MATCHES } from '@/data/mockData';
import { Zap, Trophy, Coins, Users, TrendingUp, Star } from 'lucide-react';

const LandingPage: React.FC = () => {
  const { setCurrentPage } = useApp();

  const features = [
    { icon: <Zap className="w-6 h-6" />, title: 'Real-Time Predictions', desc: 'Predict ball-by-ball events as they happen live during the match', color: 'neon-green' },
    { icon: <Coins className="w-6 h-6" />, title: 'Earn Virtual Coins', desc: 'Win coins for every correct prediction. Level up your account', color: 'neon-blue' },
    { icon: <Trophy className="w-6 h-6" />, title: 'Leaderboards', desc: 'Compete globally. Climb ranks and show off your prediction skills', color: 'neon-orange' },
    { icon: <Users className="w-6 h-6" />, title: 'Community Reactions', desc: 'React to live moments with thousands of fans worldwide', color: 'neon-green' },
    { icon: <TrendingUp className="w-6 h-6" />, title: 'Streak Bonuses', desc: 'Chain correct predictions for massive bonus rewards and badges', color: 'neon-blue' },
    { icon: <Star className="w-6 h-6" />, title: 'Badges & Levels', desc: 'Unlock exclusive badges. Rise from Rookie to Legend status', color: 'neon-orange' },
  ];

  const upcomingMatches = MOCK_MATCHES.filter(m => m.status === 'upcoming');

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroCricket})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        {/* Animated orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-neon-green/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-10 w-80 h-80 rounded-full bg-neon-blue/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-neon-green/10 border border-neon-green/30 rounded-full px-4 py-1.5 text-neon-green text-sm font-medium mb-6">
            <span className="live-pulse w-2 h-2 bg-neon-green rounded-full inline-block" />
            3 Matches Live Now
          </div>
          <h1 className="font-rajdhani text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-6">
            Predict Every Ball.{' '}
            <span className="neon-text-green">Compete</span> With Fans.{' '}
            <span className="neon-text-blue">Climb</span> the Leaderboard.
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Join the ultimate cricket prediction platform. Make live predictions, earn virtual coins, and prove you know the game better than anyone.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setCurrentPage('signup')}
              className="w-full sm:w-auto px-8 py-4 bg-neon-green text-background font-rajdhani font-bold text-lg rounded-xl shadow-neon-green hover:shadow-[0_0_40px_hsl(150_100%_50%/0.7)] transition-all duration-300 hover:scale-105"
            >
              Start Predicting Free
            </button>
            <button
              onClick={() => setCurrentPage('matches')}
              className="w-full sm:w-auto px-8 py-4 bg-surface border border-neon-blue/50 text-neon-blue font-rajdhani font-bold text-lg rounded-xl hover:border-neon-blue hover:shadow-neon-blue transition-all duration-300"
            >
              Watch Live Matches
            </button>
          </div>
          {/* Stats bar */}
          <div className="mt-16 flex flex-wrap justify-center gap-8">
            {[['50K+', 'Active Players'], ['2M+', 'Predictions Made'], ['100+', 'Live Matches'], ['🏆', 'No Real Money']].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="font-rajdhani text-3xl font-bold text-neon-green">{val}</div>
                <div className="text-xs text-muted-foreground mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-muted-foreground/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-neon-green/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-rajdhani text-4xl md:text-5xl font-bold mb-4">
              Why <span className="neon-text-green">CricPredict</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The most engaging way to watch cricket. Every ball becomes a chance to win.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="card-surface rounded-xl p-6 hover:border-neon-green/30 transition-all duration-300 group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  f.color === 'neon-green' ? 'bg-neon-green/10 text-neon-green' :
                  f.color === 'neon-blue' ? 'bg-neon-blue/10 text-neon-blue' :
                  'bg-neon-orange/10 text-neon-orange'
                } group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="font-rajdhani text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Matches */}
      <section className="py-16 px-4 bg-surface/30">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-rajdhani text-4xl font-bold">
              Upcoming <span className="neon-text-blue">Matches</span>
            </h2>
            <button onClick={() => setCurrentPage('signup')} className="text-neon-green text-sm hover:underline">
              View All →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingMatches.map(match => (
              <div key={match.id} className="card-surface rounded-xl p-5 hover:glow-border-blue transition-all cursor-pointer" onClick={() => setCurrentPage('signup')}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs bg-neon-blue/10 text-neon-blue px-2 py-0.5 rounded-full border border-neon-blue/30">
                    {match.matchType}
                  </span>
                  <span className="text-xs text-muted-foreground">{match.startTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="text-2xl mb-1">{match.team1Flag}</div>
                    <div className="font-rajdhani font-bold">{match.team1Short}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">VS</div>
                    <div className="text-xs text-muted-foreground">{match.venue.split(',')[0]}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">{match.team2Flag}</div>
                    <div className="font-rajdhani font-bold">{match.team2Short}</div>
                  </div>
                </div>
                <button className="w-full mt-4 py-2 border border-neon-green/40 text-neon-green text-sm rounded-lg hover:bg-neon-green/5 transition-colors">
                  Set Reminder
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="card-surface rounded-2xl p-10 glow-border-green">
            <h2 className="font-rajdhani text-4xl md:text-5xl font-bold mb-4">
              Ready to <span className="neon-text-green">Predict?</span>
            </h2>
            <p className="text-muted-foreground mb-2">Join free. Get 1,000 starting coins. No real money ever.</p>
            <p className="text-xs text-muted-foreground/60 mb-8">100% free platform. Virtual coins only. No gambling.</p>
            <button
              onClick={() => setCurrentPage('signup')}
              className="px-10 py-4 bg-neon-green text-background font-rajdhani font-bold text-xl rounded-xl shadow-neon-green hover:scale-105 transition-all"
            >
              Join CricPredict Free 🏏
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏏</span>
              <span className="font-rajdhani font-bold text-lg neon-text-green">CricPredict</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <button className="hover:text-foreground transition-colors">About</button>
              <button className="hover:text-foreground transition-colors">Contact</button>
              <button className="hover:text-foreground transition-colors">Privacy</button>
              <button className="hover:text-foreground transition-colors">Terms</button>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2024 CricPredict. Virtual coins only. No real money.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
