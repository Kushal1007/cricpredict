import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Coins } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, setCurrentPage } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    setError('');
    await login(email, password);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 pt-14 md:pt-16 pb-8">
      <div className="w-full max-w-md">
        <button onClick={() => setCurrentPage('landing')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 md:mb-8 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="card-surface rounded-2xl p-5 md:p-8 glow-border-green">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🏏</div>
            <h1 className="font-rajdhani text-3xl font-bold mb-1">Welcome Back</h1>
            <p className="text-muted-foreground text-sm">Login to continue predicting</p>
          </div>

          {error && <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm px-4 py-3 rounded-lg mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-neon-green/50 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-muted border border-border rounded-lg pl-10 pr-12 py-3 text-sm focus:outline-none focus:border-neon-green/50 transition-colors"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-neon-green text-background font-rajdhani font-bold text-lg rounded-xl shadow-neon-green hover:shadow-[0_0_30px_hsl(150_100%_50%/0.6)] transition-all disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <button onClick={() => setCurrentPage('signup')} className="text-neon-green hover:underline font-medium">
              Sign up free
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SignupPage: React.FC = () => {
  const { signup, setCurrentPage } = useApp();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) { setError('Please fill in all fields'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    setError('');
    await signup(username, email, password);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md">
        <button onClick={() => setCurrentPage('landing')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="card-surface rounded-2xl p-8 glow-border-green">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🏆</div>
            <h1 className="font-rajdhani text-3xl font-bold mb-1">Create Account</h1>
            <p className="text-muted-foreground text-sm">Get 1,000 free coins on signup</p>
            <div className="flex items-center justify-center gap-2 mt-2 bg-yellow-400/10 border border-yellow-400/30 rounded-lg px-4 py-2">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 text-sm font-semibold">+1,000 starter coins</span>
            </div>
          </div>

          {error && <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm px-4 py-3 rounded-lg mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="CricketFan123"
                  className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-neon-green/50 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-neon-green/50 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full bg-muted border border-border rounded-lg pl-10 pr-12 py-3 text-sm focus:outline-none focus:border-neon-green/50 transition-colors"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-neon-green text-background font-rajdhani font-bold text-lg rounded-xl shadow-neon-green hover:shadow-[0_0_30px_hsl(150_100%_50%/0.6)] transition-all disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Join CricPredict Free'}
            </button>
          </form>

          <p className="mt-4 text-xs text-muted-foreground text-center">
            No real money. Virtual coins only. 100% free to play.
          </p>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <button onClick={() => setCurrentPage('login')} className="text-neon-green hover:underline font-medium">
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
