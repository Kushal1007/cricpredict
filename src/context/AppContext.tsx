import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { MOCK_USER } from '@/data/mockData';

// ─── Admin check ─────────────────────────────────────────────────────────────
const checkIsAdmin = async (uid: string): Promise<boolean> => {
  const { data } = await (supabase.from('user_roles' as any) as any)
    .select('role')
    .eq('user_id', uid)
    .eq('role', 'admin')
    .maybeSingle();
  return !!data;
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface Profile {
  id: string;
  username: string;
  email: string;
  coins: number;
  points: number;
  level: number;
  level_name: string;
  streak: number;
  best_streak: number;
  total_predictions: number;
  correct_predictions: number;
  matches_played: number;
  login_streak: number;
  fav_team_id: string | null;
}

// Map DB profile → app User shape
const profileToUser = (p: Profile) => ({
  id: p.id,
  username: p.username,
  email: p.email,
  coins: p.coins,
  points: p.points,
  level: p.level,
  levelName: p.level_name,
  streak: p.streak,
  bestStreak: p.best_streak,
  totalPredictions: p.total_predictions,
  correctPredictions: p.correct_predictions,
  matchesPlayed: p.matches_played,
  loginStreak: p.login_streak,
  badges: MOCK_USER.badges,
});

function computeLevel(points: number): { level: number; levelName: string } {
  if (points >= 30000) return { level: 5, levelName: 'Legend' };
  if (points >= 15000) return { level: 4, levelName: 'Master' };
  if (points >= 5000)  return { level: 3, levelName: 'Expert' };
  if (points >= 1000)  return { level: 2, levelName: 'Fan' };
  return { level: 1, levelName: 'Rookie' };
}

// ─── Context shape ────────────────────────────────────────────────────────────

interface AppContextType {
  user: ReturnType<typeof profileToUser> | null;
  isLoggedIn: boolean;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  updateCoins: (amount: number) => Promise<void>;
  updatePoints: (amount: number) => Promise<void>;
  updateStreak: (correct: boolean) => Promise<void>;
  updateFavTeam: (teamId: string | null) => Promise<void>;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  selectedMatchId: string | null;
  setSelectedMatchId: (id: string | null) => void;
  showCoinAnimation: boolean;
  coinAnimationAmount: number;
  triggerCoinAnimation: (amount: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);
  const [coinAnimationAmount, setCoinAnimationAmount] = useState(0);

  const isLoggedIn = !!supabaseUser && !!profile;
  const user = profile ? profileToUser(profile) : null;

  // ── Fetch profile ─────────────────────────────────────────────────────────
  const fetchProfile = async (uid: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .single();
    if (!error && data) setProfile(data as Profile);
  };

  // ── Auth state listener ───────────────────────────────────────────────────
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session: Session | null) => {
        if (session?.user) {
          setSupabaseUser(session.user);
          await fetchProfile(session.user.id);
          setCurrentPage('dashboard');
        } else {
          setSupabaseUser(null);
          setProfile(null);
          setCurrentPage('landing');
        }
        setAuthLoading(false);
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Auth: login ───────────────────────────────────────────────────────────
  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return !error;
  };

  // ── Auth: signup ──────────────────────────────────────────────────────────
  const signup = async (username: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error || !data.user) return { ok: false, error: error?.message };

    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      username,
      email,
      coins: 1000,
      points: 0,
      level: 1,
      level_name: 'Rookie',
    });

    if (profileError) return { ok: false, error: profileError.message };
    return { ok: true };
  };

  // ── Auth: logout ──────────────────────────────────────────────────────────
  const logout = async () => {
    await supabase.auth.signOut();
  };

  // ── Update coins ──────────────────────────────────────────────────────────
  const updateCoins = async (amount: number) => {
    if (!supabaseUser || !profile) return;
    const newCoins = Math.max(0, profile.coins + amount);
    const { data } = await supabase
      .from('profiles')
      .update({ coins: newCoins })
      .eq('id', supabaseUser.id)
      .select()
      .single();
    if (data) setProfile(data as Profile);
  };

  // ── Update points ─────────────────────────────────────────────────────────
  const updatePoints = async (amount: number) => {
    if (!supabaseUser || !profile) return;
    const newPoints = profile.points + amount;
    const { level, levelName } = computeLevel(newPoints);
    const { data } = await supabase
      .from('profiles')
      .update({ points: newPoints, level, level_name: levelName })
      .eq('id', supabaseUser.id)
      .select()
      .single();
    if (data) setProfile(data as Profile);
  };

  // ── Update streak ─────────────────────────────────────────────────────────
  const updateStreak = async (correct: boolean) => {
    if (!supabaseUser || !profile) return;
    const newStreak = correct ? profile.streak + 1 : 0;
    const newBest = Math.max(profile.best_streak, newStreak);
    const updates = {
      streak: newStreak,
      best_streak: newBest,
      total_predictions: profile.total_predictions + 1,
      correct_predictions: correct ? profile.correct_predictions + 1 : profile.correct_predictions,
    };
    const { data } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', supabaseUser.id)
      .select()
      .single();
    if (data) setProfile(data as Profile);
  };

  // ── Update favourite team ─────────────────────────────────────────────────
  const updateFavTeam = async (teamId: string | null) => {
    if (!supabaseUser) return;
    const { data } = await supabase
      .from('profiles')
      .update({ fav_team_id: teamId })
      .eq('id', supabaseUser.id)
      .select()
      .single();
    if (data) setProfile(data as Profile);
  };

  // ── Coin animation ────────────────────────────────────────────────────────
  const triggerCoinAnimation = (amount: number) => {
    setCoinAnimationAmount(amount);
    setShowCoinAnimation(true);
    setTimeout(() => setShowCoinAnimation(false), 2000);
  };

  return (
    <AppContext.Provider value={{
      user, isLoggedIn, authLoading,
      login, signup, logout,
      updateCoins, updatePoints, updateStreak, updateFavTeam,
      currentPage, setCurrentPage,
      selectedMatchId, setSelectedMatchId,
      showCoinAnimation, coinAnimationAmount, triggerCoinAnimation,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
};
