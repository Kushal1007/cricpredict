import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/cricket';
import { MOCK_USER } from '@/data/mockData';

interface AppContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateCoins: (amount: number) => void;
  updatePoints: (amount: number) => void;
  updateStreak: (correct: boolean) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  selectedMatchId: string | null;
  setSelectedMatchId: (id: string | null) => void;
  showCoinAnimation: boolean;
  coinAnimationAmount: number;
  triggerCoinAnimation: (amount: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);
  const [coinAnimationAmount, setCoinAnimationAmount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('cricketUser');
    if (stored) {
      setUser(JSON.parse(stored));
      setIsLoggedIn(true);
      setCurrentPage('dashboard');
    }
  }, []);

  const login = async (email: string, _password: string): Promise<boolean> => {
    const mockUser = { ...MOCK_USER, email };
    setUser(mockUser);
    setIsLoggedIn(true);
    localStorage.setItem('cricketUser', JSON.stringify(mockUser));
    setCurrentPage('dashboard');
    return true;
  };

  const signup = async (username: string, email: string, _password: string): Promise<boolean> => {
    const newUser: User = {
      ...MOCK_USER,
      id: Date.now().toString(),
      username,
      email,
      coins: 1000,
      points: 0,
      level: 1,
      levelName: 'Rookie',
      streak: 0,
      bestStreak: 0,
      totalPredictions: 0,
      correctPredictions: 0,
      matchesPlayed: 0,
      loginStreak: 1,
      badges: MOCK_USER.badges.map(b => ({ ...b, earned: false })),
    };
    setUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem('cricketUser', JSON.stringify(newUser));
    setCurrentPage('dashboard');
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('cricketUser');
    setCurrentPage('landing');
  };

  const updateCoins = (amount: number) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, coins: Math.max(0, prev.coins + amount) };
      localStorage.setItem('cricketUser', JSON.stringify(updated));
      return updated;
    });
  };

  const updatePoints = (amount: number) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, points: prev.points + amount };
      localStorage.setItem('cricketUser', JSON.stringify(updated));
      return updated;
    });
  };

  const updateStreak = (correct: boolean) => {
    setUser(prev => {
      if (!prev) return prev;
      const newStreak = correct ? prev.streak + 1 : 0;
      const updated = {
        ...prev,
        streak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak),
        totalPredictions: prev.totalPredictions + 1,
        correctPredictions: correct ? prev.correctPredictions + 1 : prev.correctPredictions,
      };
      localStorage.setItem('cricketUser', JSON.stringify(updated));
      return updated;
    });
  };

  const triggerCoinAnimation = (amount: number) => {
    setCoinAnimationAmount(amount);
    setShowCoinAnimation(true);
    setTimeout(() => setShowCoinAnimation(false), 2000);
  };

  return (
    <AppContext.Provider value={{
      user, isLoggedIn, login, signup, logout,
      updateCoins, updatePoints, updateStreak,
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
