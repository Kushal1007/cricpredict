import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Coins, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, isLoggedIn, logout, setCurrentPage, currentPage } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = isLoggedIn
    ? [
        { label: 'Home', page: 'dashboard' },
        { label: 'Live Matches', page: 'matches' },
        { label: 'Leaderboard', page: 'leaderboard' },
        { label: 'Profile', page: 'profile' },
        { label: 'How to Play', page: 'guide' },
      ]
    : [
        { label: 'Features', page: 'landing' },
        { label: 'Leaderboard', page: 'leaderboard' },
        { label: 'How to Play', page: 'guide' },
      ];

  const close = () => setMobileOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-md">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8 h-14 md:h-16 flex items-center justify-between max-w-5xl">

        {/* Logo */}
        <button
          onClick={() => { setCurrentPage(isLoggedIn ? 'dashboard' : 'landing'); close(); }}
          className="flex items-center gap-2 shrink-0"
        >
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg gradient-green flex items-center justify-center text-base md:text-lg font-bold text-black shadow-neon-green">
            🏏
          </div>
          <span className="font-rajdhani text-lg md:text-xl font-bold neon-text-green tracking-wider">
            CricPredict
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-5 lg:gap-6">
          {navItems.map(item => (
            <button
              key={item.page}
              onClick={() => setCurrentPage(item.page)}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                currentPage === item.page ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 md:gap-3">
          {isLoggedIn && user ? (
            <>
              {/* Coins pill — visible on sm+ */}
              <div className="hidden sm:flex items-center gap-1.5 bg-surface rounded-full px-2.5 md:px-3 py-1 md:py-1.5 border border-border">
                <Coins className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-400" />
                <span className="text-xs md:text-sm font-semibold text-yellow-400">{user.coins.toLocaleString()}</span>
              </div>
              {/* Avatar */}
              <button
                onClick={() => { setCurrentPage('profile'); close(); }}
                className="w-8 h-8 md:w-9 md:h-9 rounded-full gradient-green flex items-center justify-center text-background font-bold text-sm shadow-neon-green"
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
            <div className="hidden md:flex items-center gap-2">
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

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1.5 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/98 backdrop-blur-md px-3 py-3 space-y-1 shadow-lg">
          {navItems.map(item => (
            <button
              key={item.page}
              onClick={() => { setCurrentPage(item.page); close(); }}
              className={`block w-full text-left py-2.5 px-3 rounded-xl text-sm font-medium transition-colors ${
                currentPage === item.page ? 'bg-primary/10 text-primary' : 'hover:bg-surface text-foreground'
              }`}
            >
              {item.label}
            </button>
          ))}

          {isLoggedIn ? (
            <>
              {user && (
                <div className="flex items-center gap-2 py-2.5 px-3 border-t border-border mt-1 pt-2">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-yellow-400 font-semibold">{user.coins.toLocaleString()} coins</span>
                </div>
              )}
              <button
                onClick={() => { logout(); close(); }}
                className="block w-full text-left py-2.5 px-3 text-sm text-destructive rounded-xl hover:bg-destructive/10 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2 border-t border-border mt-1">
              <button
                onClick={() => { setCurrentPage('login'); close(); }}
                className="flex-1 py-2.5 text-sm text-center border border-border rounded-xl hover:bg-surface transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => { setCurrentPage('signup'); close(); }}
                className="flex-1 py-2.5 text-sm font-semibold text-center bg-primary text-primary-foreground rounded-xl"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
