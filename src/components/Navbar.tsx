import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Coins } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, isLoggedIn, logout, setCurrentPage, currentPage } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = isLoggedIn
    ? [
        { label: 'Home', page: 'dashboard' },
        { label: 'Live Matches', page: 'matches' },
        { label: 'Leaderboard', page: 'leaderboard' },
        { label: 'Profile', page: 'profile' },
      ]
    : [
        { label: 'Features', page: 'landing' },
        { label: 'Leaderboard', page: 'leaderboard' },
      ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => setCurrentPage(isLoggedIn ? 'dashboard' : 'landing')} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-green flex items-center justify-center text-lg font-bold text-black shadow-neon-green">
            🏏
          </div>
          <span className="font-rajdhani text-xl font-bold neon-text-green tracking-wider">
            CricPredict
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map(item => (
            <button
              key={item.page}
              onClick={() => setCurrentPage(item.page)}
              className={`text-sm font-medium transition-colors hover:text-neon-green ${
                currentPage === item.page ? 'text-neon-green' : 'text-muted-foreground'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isLoggedIn && user ? (
            <>
              {/* Coins */}
              <div className="hidden sm:flex items-center gap-1.5 bg-surface rounded-full px-3 py-1.5 border border-border">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-semibold text-yellow-400">{user.coins.toLocaleString()}</span>
              </div>
              {/* Avatar */}
              <button
                onClick={() => setCurrentPage('profile')}
                className="w-9 h-9 rounded-full gradient-green flex items-center justify-center text-background font-bold text-sm shadow-neon-green"
              >
                {user.username[0].toUpperCase()}
              </button>
              <button
                onClick={logout}
                className="hidden md:block text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage('login')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5"
              >
                Login
              </button>
              <button
                onClick={() => setCurrentPage('signup')}
                className="text-sm font-semibold bg-primary text-primary-foreground px-4 py-1.5 rounded-full hover:shadow-neon-green transition-all"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-muted-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <div className="space-y-1">
              <div className={`w-5 h-0.5 bg-current transition-all ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <div className={`w-5 h-0.5 bg-current transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
              <div className={`w-5 h-0.5 bg-current transition-all ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md px-4 py-3 space-y-1">
          {navItems.map(item => (
            <button
              key={item.page}
              onClick={() => { setCurrentPage(item.page); setMobileOpen(false); }}
              className="block w-full text-left py-2 px-3 rounded-lg text-sm hover:bg-surface transition-colors"
            >
              {item.label}
            </button>
          ))}
          {isLoggedIn && (
            <>
              {user && (
                <div className="flex items-center gap-2 py-2 px-3">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-yellow-400">{user.coins.toLocaleString()} coins</span>
                </div>
              )}
              <button onClick={logout} className="block w-full text-left py-2 px-3 text-sm text-destructive">
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
