import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/context/AppContext';
import { Eye, EyeOff, Mail, Lock, AlertCircle, ShieldCheck } from 'lucide-react';

const AdminLoginPage: React.FC = () => {
  const { setCurrentPage } = useApp();
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

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError || !data.user) {
      setError('Invalid credentials');
      setLoading(false);
      return;
    }

    // Verify admin role server-side
    const { data: roleData } = await (supabase.from('user_roles' as any) as any)
      .select('role')
      .eq('user_id', data.user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!roleData) {
      await supabase.auth.signOut();
      setError('Access denied. Admin privileges required.');
      setLoading(false);
      return;
    }

    setCurrentPage('admin');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 border border-border bg-card">
          <div className="absolute inset-0 bg-gradient-to-br from-card via-card to-primary/5" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-2xl rounded-full" />

          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl gradient-green flex items-center justify-center mx-auto mb-3 shadow-neon-green">
                <ShieldCheck className="w-7 h-7 text-background" />
              </div>
              <h1 className="font-rajdhani text-2xl font-black mb-1">Admin Panel</h1>
              <p className="text-muted-foreground text-sm">CricPredict Administration</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive text-sm px-4 py-3 rounded-xl mb-5">
                <AlertCircle className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full bg-muted/60 border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary/60 transition-all text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-muted/60 border border-border rounded-xl pl-10 pr-12 py-3 text-sm focus:outline-none focus:border-primary/60 transition-all text-foreground placeholder:text-muted-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 font-rajdhani font-black text-lg rounded-2xl text-background shadow-neon-green hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, hsl(150 100% 40%), hsl(150 100% 60%))' }}
              >
                {loading ? 'Verifying…' : 'Access Admin Panel →'}
              </button>
            </form>

            <div className="mt-5 text-center">
              <button
                onClick={() => setCurrentPage('landing')}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to site
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
